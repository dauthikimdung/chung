from os import error
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
# from selenium.webdriver.common.keys import Keys
from selenium.common import exceptions
from selenium.common.exceptions import NoSuchElementException, TimeoutException
# import openpyxl
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
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
def findByXpath(driver, xpath):
    return WebDriverWait(driver, timeout).until(EC.presence_of_element_located((By.XPATH, xpath))).text
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
    num = 0
    l_same = []
    l_errors = []
    # print(list(reader).__len__())
    for each in reader:
        num += 1
        row={}
        try:
            for field in header:
                if field == 'NORAD Number':
                    row[field] = int(" ".join(each[field].split()))
                else:
                    row[field]= " ".join(each[field].split())
            if coll.find_one({'NORAD Number': row['NORAD Number']}) == None:
                coll.insert_one(row)
                count+=1
            else:
                l_same.append(row['NORAD Number'])
        except Exception as e:
            l_errors.append(row["Official Name"])
            continue
    print(l_same.__len__(), l_same)
    print(l_errors.__len__(), l_errors)
    return count
# # Dòng tên trường
header= ["Official Name","NORAD Number","Nation","Operator","Users","Application",
"Detailed Purpose","Orbit","Class of Orbit","Type of Orbit","Period (minutes)","Mass (kg)",
"COSPAR Number","Date of Launch","Expected Lifetime (yrs)","Equipment","Describe"]

print(mongoImport(csvPath='new_DB.csv'), end='')