import csv
from pymongo import MongoClient
url = 'http://celestrak.com/NORAD/elements/active.txt' # Satellite Database online
dbUrl = "mongodb+srv://satelliteV10:7FgUH3CrGH21@satellite0.fvo32.mongodb.net/satellite?retryWrites=true&w=majority"
dbName = "satellite"
collName = "full"
client = MongoClient(dbUrl, ssl=True, ssl_cert_reqs='CERT_NONE')
db = client[dbName]
coll = db[collName]
query = { "Official Name": { "$regex": 'Starlink.*', "$options" :'i' } }
list = list(coll.find(query))
print(list)