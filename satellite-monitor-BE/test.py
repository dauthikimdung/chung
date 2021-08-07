from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.keys import Keys
from selenium.common import exceptions
from selenium.common.exceptions import NoSuchElementException, TimeoutException
import openpyxl
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
import csv
import urllib.request
from pymongo import MongoClient
url = 'http://celestrak.com/NORAD/elements/active.txt' # Satellite Database online
dbUrl = "mongodb+srv://satelliteV10:7FgUH3CrGH21@satellite0.fvo32.mongodb.net/satellite?retryWrites=true&w=majority"
dbName = "satellite"
collName = "full"
client = MongoClient(dbUrl, ssl=True, ssl_cert_reqs='CERT_NONE')
db = client[dbName]
coll = db[collName]
if coll.find_one({'NORAD Number': int(44213)}) == None:
    print("New")