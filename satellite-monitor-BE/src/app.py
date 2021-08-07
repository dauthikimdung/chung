import math
from dns.rdatatype import NULL
# from threading import ThreadError
import ephem
import datetime
import urllib.request
from flask import Flask, request, Response
# from flask_pymongo import PyMongo
from bson import json_util
# from bson.objectid import ObjectId
from flask_cors import CORS
from pymongo import MongoClient
# from geopy.geocoders import Nominatim
# from geopy.point import Point
# import geopy.geocoders
# from deep_translator import GoogleTranslator
# Import for subprocess
import csv
import os
import subprocess
import base64
import psutil

pid = 0
url = 'http://celestrak.com/NORAD/elements/active.txt' # Satellite Database online
dbUrl = "mongodb+srv://satelliteV10:7FgUH3CrGH21@satellite0.fvo32.mongodb.net/satellite?retryWrites=true&w=majority"
dbName = "satellite"
collName = "full"
header= ["Official Name","NORAD Number","Nation","Operator","Users","Application","Detailed Purpose","Orbit","Class of Orbit","Type of Orbit","Period (minutes)","Mass (kg)","COSPAR Number","Date of Launch","Expected Lifetime (yrs)","Equipment","Describe"]
app = Flask(__name__)
# app.config["MONGO_URI"] = 'mongodb://localhost:27017/flaskDB'
CORS(app)
client = MongoClient(dbUrl, ssl=True, ssl_cert_reqs='CERT_NONE')
mongo = client.get_database(dbName)
# geopy.geocoders.options.default_timeout = 7

@app.route('/satellites', methods=['GET'])
def get_all_satellites():
    satellites = mongo[collName]
    # print(satellites.find())
    response = json_util.dumps(satellites.find())
    return Response(response, mimetype='application/json')


@app.route('/satellites/<id>', methods=['GET'])
def get_one_satellite(id):
    satellites = mongo[collName]
    response = json_util.dumps(satellites.find_one({'NORAD Number': int(id)}))
    return Response(response, mimetype='application/json')
# @app.route('/satellites/<name>', methods=['GET'])
# def get_one_satellite(name):
#     satellites = mongo.full
#     response = json_util.dumps(satellites.find_one({'Official Name': name}))
#     return Response(response, mimetype='application/json')
# def reverseLocator(r):
#     locator = Nominatim(user_agent='myGeocoder')
#     coor = (Point( r["coordinate"]['lat'],r["coordinate"]['long']))
#     print(coor)
#     try:
#         location = locator.reverse(coor)
#         print(location.address)
#         location_vi = GoogleTranslator(source='auto', target='vi').translate(location.address)
#         if location_vi != None:
#             r["coordinate"]["location"] = location_vi
#         else:
#             r["coordinate"]["location"] = location.address
#     except Exception as e:
#         print(str(e))
#         return r
#     print(r["coordinate"]["location"])
#     return r
@app.route('/satellites/track-all', methods=['POST'])
def satellite_track_all():
    
    try:
        url = 'http://celestrak.com/NORAD/elements/active.txt'
        file = urllib.request.urlopen(url).read().splitlines()
        obs = ephem.Observer()
        obs.lat = request.json['lat']
        obs.long = request.json['long']

        time1_input = request.json['time_start']
        time2_input = request.json['time_end']

        time1 = datetime.datetime.strptime(time1_input, '%Y-%m-%d %H:%M:%S')
        time2 = datetime.datetime.strptime(time2_input, '%Y-%m-%d %H:%M:%S')
        timeutc1 = ephem.Date(time1)
        timeutc2 = ephem.Date(time2)

        t1 = ephem.Date(timeutc1-7*ephem.hour)
        t2 = ephem.Date(timeutc2-7*ephem.hour)
        a = ephem.degrees('10:00:00')
        
        result = []
        k = 0
        for id in range(0, len(file), 3):
            stl = ephem.readtle(file[id].decode('utf-8'),
                                file[id + 1].decode('utf-8'),
                                file[id + 2].decode('utf-8'))
            obs.date = datetime.datetime.utcnow()
            id_str = file[id+2].decode('utf-8')[2:7] # lay ra id dang chuoi
            id_int = int(id_str) # doi id sang dang integer
            try:
                while obs.date < t2:
                    tr, azr, tt, altt, ts, azs = obs.next_pass(stl)
                    if ts == obs.date:
                        break
                    if tr <= t2 and ts >= t1 and altt > a:
                        name_sate = file[id].decode('utf-8')
                        k = k+1
                        coordinates = []
                        sorted_list = sorted([t1, t2, tr, tt, ts])
                        for x in (sorted_list):
                            obs.date = x
                            stl.compute(obs)
                            trvn = ephem.Date(x + 7 * ephem.hour)
                                                
                            str_trvn = "%s" % (trvn)
                            coordinates.append({
                                "id": id_int,
                                "trvn": str_trvn,
                                "alt": math.degrees(stl.alt),
                                "az": math.degrees(stl.az),
                                "lat": math.degrees(stl.sublat),
                                "long": math.degrees(stl.sublong),
                                "elevation": stl.elevation / 1000,
                                "range": stl.range / 1000,
                                "location": ''
                            })
                        result.append({
                            "name": name_sate,
                            "coordinate": coordinates
                        })
                    else:
                        obs.date = ts
            except  Exception as e:
                print(str(e))
                continue
        response = json_util.dumps(result)
        return Response(response, mimetype='application/json')

    except Exception as e:
        print(str(e))
        return json_util.dumps({
            'message': 'error'
        })

@app.route('/satellites/update-database', methods=['POST'])
def update_database():
    global pid
    count = 0
    if pid == 0:
        try:
            process = subprocess.Popen('python update_db.py')
            pid = process.pid            
            print(pid)
            stdout, stderr = process.communicate()
            if (stdout == None): # Nếu stdout == None chứng tỏ tiến trình crawl bị dừng bỏi yêu cầu từ client
                raise Exception 
            pid = 0
            # count = int(stdout)
        except Exception as ex:
            if (stderr != None): # Nếu stderr != None chứng tỏ tiến trình crawl bị lỗi
                print(stderr)
                errMess = base64.b64encode(stderr).decode('utf-8')
            else:
                errMess = str(ex)
            print(errMess)
            response = json_util.dumps({'status': False, 'count': count, 'message':errMess})
            return Response(response, mimetype='application/json')
        response = json_util.dumps({'status': True, 'count': count, 'message':'Cập nhật thành công!'})
        return Response(response, mimetype='application/json')
    response = json_util.dumps({'status': True, 'count': count, 'message':'Đã là bản cập nhật mới nhất!'})
    return Response(response, mimetype='application/json')

@app.route('/satellites/stop-update-database', methods=['POST'])
def stop_update_database():
    global pid    
    print(pid)  
    if pid != 0:
        try:
            current_process = psutil.Process(pid)
            children = current_process.children(recursive=True)            
            os.kill(pid, 9)
            for child in children:
                print('Child pid is {}'.format(child.pid))
                os.kill(child.pid, 9)
            pid = 0
        except Exception as ex:
            print(str(ex))
            response = json_util.dumps({'status': False, 'message':'Lỗi dừng cập nhật: ' + str(ex)})
            return Response(response, mimetype='application/json')
        response = json_util.dumps({'status': True, 'message':'Đã dừng quá trình cập nhật!'})
        return Response(response, mimetype='application/json')
    response = json_util.dumps({'status': False, 'message':'Không có quá trình cập nhật nào!'})
    return Response(response, mimetype='application/json')
if __name__ == "__main__":
    app.run(debug=True)
