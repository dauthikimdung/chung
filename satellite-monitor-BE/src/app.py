import math
from urllib import parse
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
from geopy.geocoders import Nominatim
from geopy.point import Point
import geopy.geocoders
from deep_translator import GoogleTranslator
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

@app.route('/satellites/search-list-names', methods=['POST'])
def search_list_names():
    temp = request.json['key']
    satellites = mongo[collName]
    try:
        id = int(temp)
        query = {
            "$expr": {
                "$gt": [
                    { 
                        "$size": { 
                            "$regexFindAll": { 
                                "input": {"$toString": "$NORAD Number"}, 
                                "regex": ".*"+temp+".*"
                            }
                        }
                    }, 
                    0
                ]
            }
        }
    except:
        key = temp.replace("(","\(").replace(")","\)").replace("[","\[").replace("]","\]")
        query = { "Official Name": { "$regex": key+'.*', "$options" :'i' } }
    listSatellites = list(satellites.find(query))
    listName = [{
        'name': " ".join(i['Official Name'].split()),
        'id': i['NORAD Number']
    } for i in listSatellites ]
    # listName8 = listName[:8]
    tempResp = {
        'listName': listName,
        # 'totalLength' : listSatellites.count,
        # 'totalName': listName
    }
    response = json_util.dumps(tempResp)
    return Response(response, mimetype='application/json')

@app.route('/satellites/find-satellite', methods=['POST'])
def find_satellite():
    temp = request.json['key']
    satellites = mongo[collName]
    tempResp = None
    try:
        id = int(temp)
        tempResp = satellites.find_one({'NORAD Number': int(id)})
    except:
        key = temp.replace("(","\(").replace(")","\)").replace("[","\[").replace("]","\]")
        query = { "Official Name": { "$regex": key, "$options" :'i' } }
        tempResp = satellites.find_one(query)
    if tempResp != None:
        response = json_util.dumps(tempResp)
    else:
        response = {'message': 'Error'}
    
    return Response(response, mimetype='application/json')

@app.route('/satellites/list-satellites-nation', methods=['GET'])
def get_satellites_nation():
    ids = request.json['listID']
    satellites = mongo[collName]
    temp = []
    for id in ids:
        x = satellites.find_one({'NORAD Number': int(id)})
        temp.append({
            'norad_number': id,
            'nation': x['Nation']
        })
    response = json_util.dumps(temp)
    return Response(response, mimetype='application/json')

@app.route('/satellites/track-all', methods=['POST'])
def satellite_track_all():
    try:
        url = 'http://celestrak.com/NORAD/elements/active.txt'
        satellites = mongo[collName]
        # file = urllib.request.urlopen(url).read().splitlines()
        local_filename ="..\\data.txt"
        f = open(local_filename, encoding="utf-8")
        file = f.readlines()
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
            stl = ephem.readtle(file[id], # .decode('utf-8')
                                file[id + 1],
                                file[id + 2])
            obs.date = datetime.datetime.utcnow()
            id_str = file[id+2][2:7] # lay ra id dang chuoi
            id_int = int(id_str) # doi id sang dang integer
            try:
                while obs.date < t2:
                    tr, azr, tt, altt, ts, azs = obs.next_pass(stl)
                    if ts == obs.date:
                        break
                    if tr <= t2 and ts >= t1 and altt > a:
                        name_sate = file[id]
                        k = k+1
                        coordinates = []
                        sorted_list = sorted([t1, t2, tr, tt, ts])
                        satellite = satellites.find_one({'NORAD Number': id_int})
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
                                "location": '',
                            })
                        result.append({
                            "id": id_int,
                            "name": name_sate,
                            "coordinate": coordinates,
                            "nation": satellite['Nation']
                        })
                    else:
                        obs.date = ts
            except  Exception as e:
                # print(str(e))
                continue
        f.close()
        response = json_util.dumps(result)
        return Response(response, mimetype='application/json')

    except Exception as e:
        print(str(e))
        f.close()
        return json_util.dumps({
            'message': 'error'
        })

@app.route('/satellites/update-database', methods=['POST'])
def update_database():
    global pid
    count = 0
    # If no update process
    if pid == 0:
        try: # Try start new process
            process = subprocess.Popen('python update_db.py', shell=True) #, stdout=subprocess.PIPE, stderr=subprocess.PIPE
            pid = process.pid
            print(pid)
            stdout, stderr = process.communicate()
            pid = 0
            # print(stdout, stderr)
            if (stdout == b''): # N???u stdout == b'' ch???ng t??? ti???n tr??nh crawl b??? d???ng b???i y??u c???u t??? client
                raise Exception
            # count = int(stdout.decode())
            # print(count)
        except Exception as ex:
            if stderr != b'':
                errMess = str(stderr)
            else:
                errMess = str(ex)
            print(errMess)
            response = json_util.dumps({'status': False, 'count': count, 'message':errMess})
            return Response(response, mimetype='application/json')
        response = json_util.dumps({'status': True, 'count': count, 'message':'C???p nh???t th??nh c??ng!'})
        return Response(response, mimetype='application/json')
    else: # N???u c?? ti???n tr??nh kh??c 
        try: # Th??? t???t n??
            current_process = psutil.Process(pid)
            children = current_process.children(recursive=True)            
            os.kill(pid, 9)
            for child in children:
                print('Child pid is {}'.format(child.pid))
                os.kill(child.pid, 9)
            pid = 0
            print('??ang c?? ti???n tr??nh c???p nh???t kh??c! ???? d???ng ')
            try: # Khi t???t th??nh c??ng - Th??? t???o ti??? tr??nh m???i
                process = subprocess.Popen('python update_db.py')
                pid = process.pid            
                print(pid)
                stdout, stderr = process.communicate()
                if (stdout == None): # N???u stdout == None ch???ng t??? ti???n tr??nh crawl b??? d???ng b???i y??u c???u t??? client
                    raise Exception 
                pid = 0
            except Exception as ex:
                if (stderr != None): # N???u stderr != None ch???ng t??? ti???n tr??nh crawl b??? l???i
                    print(stderr)
                    errMess = base64.b64encode(stderr)
                else:
                    errMess = str(ex)
                print(errMess)
                response = json_util.dumps({'status': False, 'count': count, 'message':errMess})
                return Response(response, mimetype='application/json')
            response = json_util.dumps({'status': True, 'count': count, 'message':'C???p nh???t th??nh c??ng!'})
            return Response(response, mimetype='application/json')
        except Exception as ex:
            print(str(ex))
            response = json_util.dumps({'status': False, 'message':'L???i d???ng c???p nh???t: ' + str(ex)})
            return Response(response, mimetype='application/json')
    # response = json_util.dumps({'status': True, 'count': count, 'message':'???? l?? b???n c???p nh???t m???i nh???t!'})
    # return Response(response, mimetype='application/json')

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
            response = json_util.dumps({'status': False, 'message':'L???i d???ng c???p nh???t: ' + str(ex)})
            return Response(response, mimetype='application/json')
        response = json_util.dumps({'status': True, 'message':'???? d???ng qu?? tr??nh c???p nh???t!'})
        return Response(response, mimetype='application/json')
    response = json_util.dumps({'status': False, 'message':'Kh??ng c?? qu?? tr??nh c???p nh???t n??o!'})
    return Response(response, mimetype='application/json')

def orbit_stl(line, obs_center, stl, obs1, obs2, obs3, obs4, tr, tt, ts, t1, t2, id):  # h??m t??nh qu??? ?????o v??? tinh
    # t??nh b??n k??nh v??ng ph??? t???i th???i ??i???m tt    
    satellites = mongo[collName]
    obs_center.date = tt
    stl.compute(obs_center)
    b = R + stl.elevation / 1000  # do cao ve tinh tu tam Trai Dat
    a = R * math.cos((math.pi / 2) + alpha) + math.sqrt(
        b ** 2 - (R ** 2) * (math.sin((math.pi / 2) + alpha)) ** 2)
    radius = (math.acos((R ** 2 + b ** 2 - a ** 2) / (2 * R * b))) * R

    #  t??nh kho???ng c??ch t??? subpoint_stl ?????n v??? tr?? c??c ?????nh
    sublat = math.degrees(stl.sublat)
    sublong = math.degrees(stl.sublong)
    lat_radian = sublat * const
    long_radian = sublong * const
    distance = []
    for n in [[obs1['lat'], obs1['lng']], [obs2['lat'], obs2['lng']], 
    [obs3['lat'], obs3['lng']], [obs4['lat'], obs4['lng']]]:
    # for n in [[obs1_lat, obs1_long], [obs2_lat, obs2_long], [obs3_lat, obs3_long], [obs4_lat, obs4_long]]:
        dlat = n[0] * const - lat_radian
        dlong = n[1] * const - long_radian
        a1 = math.sin(dlat / 2) ** 2 + math.cos(lat_radian) * math.cos(
            float(n[0]) * const) * math.sin(dlong / 2) ** 2
        a2 = 2 * math.asin(math.sqrt(a1))
        distance_km = 6371 * a2
        distance.append(distance_km)

    #  ki???m tra ??i???u ki???n ??i qua c??c ?????nh c???a v??ng v?? t??nh to??n
    if max(distance) <= radius:
        name_sate = " ".join(line[id - 2].split())
        id_str = line[id][2:7]  # lay ra id dang chuoi
        id_int = int(id_str)  # doi id sang dang integer
        print(name_sate, id_int)
        coordinates = []
        sorted_list = sorted([tr, tt, ts, t1, t2])
        satellite = satellites.find_one({'NORAD Number': id_int})
        for x in sorted_list:
            obs_center.date = x  # th???i gian t???i v??? tr?? quan s??t
            stl.compute(obs_center)  # t??nh to??n ??? v??? tr?? quan s??t t???i th???i gian tr??n
            trvn = ephem.Date(x + 7 * ephem.hour)
            str_trvn = "%s" % (trvn)

            # tinh ban kinh vung phu hieu qua cua ve tinh
            h = R + stl.elevation / 1000  # do cao ve tinh tu tam Trai Dat
            a = R * math.cos((math.pi / 2) + alpha) + math.sqrt(
                h ** 2 - (R ** 2) * (math.sin((math.pi / 2) + alpha)) ** 2)
            radius = (math.acos((R ** 2 + h ** 2 - a ** 2) / (2 * R * h))) * R

            coordinates.append({
                "id": id_int,
                "trvn": str_trvn,
                "alt": math.degrees(stl.alt),
                "az": math.degrees(stl.az),
                "lat": math.degrees(stl.sublat),
                "long": math.degrees(stl.sublong),
                "elevation": stl.elevation / 1000,
                "range": stl.range / 1000,
                "radius": radius,
                "location": ''
            })
    aStatellite = {
        "id": id_int,
        "name": name_sate,
        "coordinate": coordinates,
        "nation": satellite['Nation']
    }
    return aStatellite
#  nh???p c??c h???ng s???
alpha = ephem.degrees('45:00:00')  # minimum elevation
R = 6371  # ban kinh Trai Dat
const = 0.01746031        
@app.route('/satellites/track-all-multipoint', methods=['POST'])
def satellite_track_all_multipoint():
    try:
        url = 'http://celestrak.com/NORAD/elements/active.txt'
        local_filename ="..\\data.txt"
        f = open(local_filename, encoding="utf-8")
        line = f.readlines()
        # line = [l.decode("utf-8") for l in file]
        #  t???a ????? trung t??m ch??? huy
        obs_center = ephem.Observer()
        obs_center.lat = str(request.json['lat'])
        obs_center.long = str(request.json['long'])
        # obs_center.lat = '21.1'
        # obs_center.long = '105.48'
        #  4 t???a ????? ??? 4 ?????nh c???a v??ng b???o v???
        obs1 = request.json['obs1']
        obs2 = request.json['obs2']
        obs3 = request.json['obs3']
        obs4 = request.json['obs4']
        #  nh???p th???i gian
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
        for id in range(2, len(line), 3):
            temp = {}
            stl = ephem.readtle(line[id - 2], line[id - 1], line[id])
            obs_center.date = datetime.datetime.utcnow()  # chinh gio ve hien tai ve gio utc
            try:
                while obs_center.date < t2:  # s??? l???n ??i qua
                    tr, azr, tt, altt, ts, azs = obs_center.next_pass(stl)
                    if ts == obs_center.date:
                        break
                    if tr <= t2 and ts >= t1 and altt > alpha:   # ??i???u ki???n th???i gian v?? g??c ng???ng ph?? h???p
                        if t1 < tt < t2:
                            temp = orbit_stl(line, obs_center, stl, obs1, obs2, obs3, obs4, tr, tt, ts, t1, t2, id)
                            result.append(temp)
                        elif tt < t1:
                            #  chia nh??? kho???ng th???i gian kh???o s??t
                            delta_t = (ts - tr) / 10
                            t_detail = t1
                            m = 0
                            while t_detail <= ts:
                                obs_center.date = t_detail
                                stl.compute(obs_center)
                                if stl.alt >= alpha:
                                    temp = orbit_stl(line, obs_center, stl, obs1, obs2, obs3, obs4, tr, tt, ts, t1, t2, id)
                                    result.append(temp)
                                    break
                                else:
                                    m += 1
                                    t_detail = t1 + m * delta_t
                                    continue
                        elif tt > t2:
                            #  chia nh??? kho???ng th???i gian kh???o s??t
                            delta_t = (ts - tr) / 10
                            t_detail = tr
                            m = 0
                            while t_detail <= t2:
                                obs_center.date = t_detail
                                stl.compute(obs_center)
                                if stl.alt >= alpha:
                                    temp = orbit_stl(line, obs_center, stl, obs1, obs2, obs3, obs4, tr, tt, ts, t1, t2, id)
                                    result.append(temp)
                                    break
                                else:
                                    m += 1
                                    t_detail = tr + m * delta_t
                                    continue
                    obs_center.date = ts
            except  Exception as e:
                continue        
        f.close()
        response = json_util.dumps(result)
        return Response(response, mimetype='application/json')

    except Exception as e:
        print(str(e))
        f.close()
        return json_util.dumps({
            'message': 'error'
        })





def orbit_stl_one(line, obs_center, stl, obs1, obs2, obs3, obs4, tr, tt, ts, t1, t2, i, id):  # h??m t??nh qu??? ?????o v??? tinh
    # t??nh b??n k??nh v??ng ph??? t???i th???i ??i???m tt
    
    satellites = mongo[collName]
    obs_center.date = tt
    stl.compute(obs_center)
    b = R + stl.elevation / 1000  # do cao ve tinh tu tam Trai Dat
    a = R * math.cos((math.pi / 2) + alpha) + math.sqrt(
        b ** 2 - (R ** 2) * (math.sin((math.pi / 2) + alpha)) ** 2)
    radius = (math.acos((R ** 2 + b ** 2 - a ** 2) / (2 * R * b))) * R

    #  t??nh kho???ng c??ch t??? subpoint_stl ?????n v??? tr?? c??c ?????nh
    sublat = math.degrees(stl.sublat)
    sublong = math.degrees(stl.sublong)
    lat_radian = sublat * const
    long_radian = sublong * const
    distance = []
    for n in [[obs1['lat'], obs1['lng']], [obs2['lat'], obs2['lng']], 
    [obs3['lat'], obs3['lng']], [obs4['lat'], obs4['lng']]]:
    # for n in [[obs1_lat, obs1_long], [obs2_lat, obs2_long], [obs3_lat, obs3_long], [obs4_lat, obs4_long]]:
        dlat = n[0] * const - lat_radian
        dlong = n[1] * const - long_radian
        a1 = math.sin(dlat / 2) ** 2 + math.cos(lat_radian) * math.cos(
            float(n[0]) * const) * math.sin(dlong / 2) ** 2
        a2 = 2 * math.asin(math.sqrt(a1))
        distance_km = 6371 * a2
        distance.append(distance_km)
    
    satellite = satellites.find_one({'NORAD Number': id})
    #  ki???m tra ??i???u ki???n ??i qua c??c ?????nh c???a v??ng v?? t??nh to??n
    if max(distance) <= radius:
        name_sate = " ".join(line[i - 2].split())
        print(name_sate, i)
        coordinates = []

        #  chia kho???ng th???i gian
        list_detail = [t1, t2, tr, tt, ts]
        delta_t = (ts - tr) / 10
        for j in range(2, 9):
            t_detail = tr + j * delta_t
            list_detail.append(t_detail)

        sorted_list = sorted(list_detail)
        for x in sorted_list:
            obs_center.date = x  # th???i gian t???i v??? tr?? quan s??t
            stl.compute(obs_center)  # t??nh to??n ??? v??? tr?? quan s??t t???i th???i gian tr??n
            trvn = ephem.Date(x + 7 * ephem.hour)
            str_trvn = "%s" % (trvn)
            # L???y ?????a ??i???m
            locator = Nominatim(user_agent='myGeocoder')
            coordinate = '%s, %s' % (str(sublat), str(sublong))
            location = locator.reverse(coordinate)
            locate = ""
            try:
                locate = GoogleTranslator(source='auto', target='vi').translate(location.address)
            except Exception as e:
                print(str(e),'b')
            # tinh ban kinh vung phu hieu qua cua ve tinh
            h = R + stl.elevation / 1000  # do cao ve tinh tu tam Trai Dat
            a = R * math.cos((math.pi / 2) + alpha) + math.sqrt(
                h ** 2 - (R ** 2) * (math.sin((math.pi / 2) + alpha)) ** 2)
            radius = (math.acos((R ** 2 + h ** 2 - a ** 2) / (2 * R * h))) * R
            
            coordinates.append({
                "id": id,
                "trvn": str_trvn,
                "alt": math.degrees(stl.alt),
                "az": math.degrees(stl.az),
                "lat": math.degrees(stl.sublat),
                "long": math.degrees(stl.sublong),
                "elevation": stl.elevation / 1000,
                "range": stl.range / 1000,
                "radius": radius,
                "location": locate
            })
    aStatellite = {
        "id": id,
        "coordinate": coordinates,
        "nation": satellite['Nation']
    }
    return aStatellite
@app.route('/satellites/track-one-multipoint', methods=['POST'])
def satellite_track_one_multipoint():
    try:
        local_filename ="..\\data.txt"
        f = open(local_filename, encoding="utf-8")
        line = f.readlines()
        #  t???a ????? trung t??m ch??? huy
        obs_center = ephem.Observer()
        obs_center.lat = str(request.json['lat'])
        obs_center.long = str(request.json['long'])
        #  4 t???a ????? ??? 4 ?????nh c???a v??ng b???o v???
        obs1 = request.json['obs1']
        obs2 = request.json['obs2']
        obs3 = request.json['obs3']
        obs4 = request.json['obs4']
        #  nh???p th???i gian
        time1_input = request.json['time_start']
        time2_input = request.json['time_end']
        # Norad Number c???a Satellite ??ang x??t
        id = request.json['Norad_Number']
        # print(obs_center, obs1, obs2, obs3, obs4, id)

        time1 = datetime.datetime.strptime(time1_input, '%Y-%m-%d %H:%M:%S')
        time2 = datetime.datetime.strptime(time2_input, '%Y-%m-%d %H:%M:%S')
        timeutc1 = ephem.Date(time1)
        timeutc2 = ephem.Date(time2)

        t1 = ephem.Date(timeutc1-7*ephem.hour)
        t2 = ephem.Date(timeutc2-7*ephem.hour)
        a = ephem.degrees('10:00:00')
        result = {}
        for i in range(2, len(line), 3):
            id_str = line[i][2:7]
            id_int = int(id_str)
            if id_int == id:
                temp = {} # chinh gio ve hien tai ve gio utc
                print(id_int)
                stl = ephem.readtle(line[i - 2], line[i - 1], line[i])
                obs_center.date = datetime.datetime.utcnow()  # chinh gio ve hien tai ve gio utc
                try:
                    while obs_center.date < t2:  # s??? l???n ??i qua
                        tr, azr, tt, altt, ts, azs = obs_center.next_pass(stl)
                        if ts == obs_center.date:
                            break
                        if tr <= t2 and ts >= t1 and altt > alpha:
                            if t1 <= tt <= t2:
                                print('t1<tt<t2')
                                result = orbit_stl_one(line, obs_center, stl, obs1, obs2, obs3, obs4, tr, tt, ts, t1, t2, i, id)
                            elif tt < t1:
                                #  chia kho???ng th???i gian
                                delta_t = (ts - tr) / 10
                                t_detail = t1
                                m = 0
                                while t_detail <= ts:
                                    obs_center.date = t_detail
                                    stl.compute(obs_center)
                                    if stl.alt >= alpha:
                                        print('tt<t1')
                                        result = orbit_stl_one(line, obs_center, stl, obs1, obs2, obs3, obs4, tr, tt, ts, t1, t2, i, id)
                                        break
                                    else:
                                        m += 1
                                        t_detail = t1 + m * delta_t
                                        continue
                            elif tt > t2:
                                #  chia kho???ng th???i gian
                                delta_t = (ts - tr) / 10
                                t_detail = tr
                                m = 0
                                while t_detail <= t2:
                                    obs_center.date = t_detail
                                    stl.compute(obs_center)
                                    if stl.alt >= alpha:
                                        print('tt>t2')
                                        result = orbit_stl_one(line, obs_center, stl, obs1, obs2, obs3, obs4, tr, tt, ts, t1, t2, i, id)
                                        break
                                    else:
                                        m += 1
                                        t_detail = tr + m * delta_t
                                        continue
                        obs_center.date = ts
                except (ValueError, TypeError, KeyError) as e:
                    print(str(e), 'a')
                    pass
        f.close()
        response = json_util.dumps(result)
        print(response)
        return Response(response, mimetype='application/json')

    except Exception as e:
        print(str(e), 'c')
        return json_util.dumps({
            'message': 'error'
        })
if __name__ == "__main__":
    app.run(debug=True)


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