import csv
from dns.rdatatype import NULL
from pymongo import MongoClient
url = 'http://celestrak.com/NORAD/elements/active.txt' # Satellite Database online
dbUrl = "mongodb+srv://satelliteV10:7FgUH3CrGH21@satellite0.fvo32.mongodb.net/satellite?retryWrites=true&w=majority"
dbName = "satellite"
collName = "full"
client = MongoClient(dbUrl, ssl=True, ssl_cert_reqs='CERT_NONE')
db = client[dbName]
coll = db[collName]
query = { "NORAD Number": NULL}
# query = { "Official Name": { "$regex": 'Starlink-24', "$options" :'i' } }
# query = {
#     "$expr": {
#         "$gt": [
#             { 
#                 "$size": { 
#                     "$regexFindAll": { 
#                         "input": {"$toString": "$NORAD Number"}, 
#                         "regex": "nan"
#                     }
#                 }
#             }, 
#             0
#         ]
#     }
# }
listSatellites = coll.find(query)
listName = [i['Official Name'] for i in listSatellites ]
print(listName)

# Group by
# from bson.son import SON
# pipeline = [
#      {"$unwind": "$Nation"},
#      {"$group": {"_id": "$Nation", "count": {"$sum": 1}}},
#      {"$sort": SON([("count", -1), ("_id", -1)])}
#  ]
# x = list(coll.aggregate(pipeline))
# print(x)