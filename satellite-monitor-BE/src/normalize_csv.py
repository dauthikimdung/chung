from os import error
import csv
# import urllib.request
from pymongo import MongoClient
url = 'http://celestrak.com/NORAD/elements/active.txt' # Satellite Database online
dbUrl = "mongodb+srv://satelliteV10:7FgUH3CrGH21@satellite0.fvo32.mongodb.net/satellite?retryWrites=true&w=majority"
dbName = "satellite"
collName = "full"
client = MongoClient(dbUrl, ssl=True, ssl_cert_reqs='CERT_NONE')
db = client[dbName]
coll = db[collName]
timeout = 10

# Chuẩn hóa chuỗi ký tự (bỏ các ký tự thừa: \n, \t, "  ")
def nomalizeString(str):
    return " ".join(str.split())
def mongoImport(csvPath):
    """ Imports a csv file at path csvPath to a mongo collection
    returns: count of the documents in the new collection
    """
    global coll # collection
    csvFile = open(csvPath, encoding='utf-8')
    reader = csv.DictReader(csvFile)
    count = 0
    csvNew = open('new_DB.csv', 'w', newline='', encoding='utf-8')
    writer = csv.writer(csvNew) # công cụ ghi file csv
    writer.writerow(header)
    # print(list(reader).__len__())
    for each in reader:
        row=[""] * 17
        for ind, field in enumerate(header):
            row[ind]= nomalizeString(each[field])
        writer.writerow(row)
    return count
# # Dòng tên trường
header= ["Official Name","NORAD Number","Nation","Operator","Users","Application",
"Detailed Purpose","Orbit","Class of Orbit","Type of Orbit","Period (minutes)","Mass (kg)",
"COSPAR Number","Date of Launch","Expected Lifetime (yrs)","Equipment","Describe"]

print(mongoImport(csvPath='../DB_of_STL.csv'), end='')