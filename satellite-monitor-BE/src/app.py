import math
import ephem
import datetime
import urllib.request
from flask import Flask, request, Response
from flask_pymongo import PyMongo
from bson import json_util
from bson.objectid import ObjectId
from flask_cors import CORS
from pymongo import MongoClient
app = Flask(__name__)
# app.config["MONGO_URI"] = 'mongodb://localhost:27017/flaskDB'
CORS(app)
client = MongoClient("mongodb+srv://satelliteV10:7FgUH3CrGH21@satellite0.fvo32.mongodb.net/satellite?retryWrites=true&w=majority",ssl=True,ssl_cert_reqs='CERT_NONE')
mongo = client.get_database("satellite")
# mongo = PyMongo(app)

# @app.route('/users', methods=['POST'])
# def create_user():
#     name = request.json['name']

#     if name:
#         id = mongo.db.users.insert({
#             'name': name
#         })
#         response = {
#             '_id': str(id),
#             'name': name
#         }
#         return response
#     else:
#         return {'message': 'error'}
#     return {'message': 'received'}

# @app.route('/users', methods=['GET'])
# def findAll():
#     entities = mongo.db.users.find()
#     res = json_util.dumps(entities)
#     return Response(res, mimetype='application/json')

# @app.route('/users/<id>', methods = ['GET'])
# def getOne(id):
#     entity = mongo.db.users.find_one({'_id': ObjectId(id)})
#     res = json_util.dumps(entity)
#    return Response(res, mimetype='application/json')


@app.route('/satellites', methods=['GET'])
def get_all_satellites():
    satellites = mongo.full
    # print(satellites.find())
    response = json_util.dumps(satellites.find())
    return Response(response, mimetype='application/json')


@app.route('/satellites/<id>', methods=['GET'])
def get_one_satellite(id):
    satellite = mongo.full.find_one({'NORAD Number': id})
    response = json_util.dumps(satellite)
    return Response(response, mimetype='application/json')


@app.route('/satellites/track-all', methods=['POST'])
def satellite_track_all():
    
    try:
        url = 'http://celestrak.com/NORAD/elements/active.txt'
        file = urllib.request.urlopen(url).read().splitlines()
        print("running")
        obs = ephem.Observer()
        print(request.json)
        obs.lat = request.json['lat']
        obs.long = request.json['long']

        time1_input = request.json['time_start']
        time2_input = request.json['time_end']
        print(time1_input)

        time1 = datetime.datetime.strptime(time1_input, '%Y-%m-%d %H:%M:%S')
        time2 = datetime.datetime.strptime(time2_input, '%Y-%m-%d %H:%M:%S')
        timeutc1 = ephem.Date(time1)
        timeutc2 = ephem.Date(time2)

        t1 = ephem.Date(timeutc1-7*ephem.hour)
        t2 = ephem.Date(timeutc2-7*ephem.hour)
        a = ephem.degrees('10:00:00')

        print("running")
        
        result = []
        k = 0
        print("running")
        for id in range(0, len(file), 3):
            stl = ephem.readtle(file[id].decode('utf-8'),
                                file[id + 1].decode('utf-8'),
                                file[id + 2].decode('utf-8'))
            obs.date = datetime.datetime.utcnow()
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

                            coordinates.append({
                                "trvn": trvn,
                                "alt": math.degrees(stl.alt),
                                "az": math.degrees(stl.az),
                                "lat": math.degrees(stl.sublat),
                                "long": math.degrees(stl.sublong),
                                "elevation": stl.elevation / 1000,
                                "range": stl.range / 1000
                            })

                        result.append({
                            "name": name_sate,
                            "coordinate": coordinates
                        })
                    else:
                        obs.date = ts
            except  Exception as e:
                print(e)
                continue
        response = json_util.dumps(result)
        return Response(response, mimetype='application/json')

    except Exception as e:
        print(e)
        return json_util.dumps({
            'message': 'error'
        })

if __name__ == "__main__":
    app.run(debug=True)
