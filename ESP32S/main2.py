from microdot_asyncio import Microdot, redirect, send_file
import time
#from machine import reset,Pin,I2C
#from bmp280 import *
#import network
#import machine
#import onewire, ds18x20
import urequests as requests
import airpressure
import temperature
import orpvalue
import connect
import timeformat
import json



connect.connect()
app = Microdot()

while (True ):
    Airpressure = airpressure.airpressure()
    print(Airpressure)
    
    Temperature = temperature.temperature()
    print(Temperature)
    
    Orpvalue = orpvalue.orpvalue()
    print(Orpvalue)
    data = {"Airpressure": Airpressure,"Temperature": Temperature,"Orpvalue": Orpvalue}
    json_data = json.dumps(data)
    #print(json_data)
    headers = {"Content-Type": "application/json"}
    #requests.post( 'http://192.168.135.58:5000/value', data=json_data,headers=headers)
    requests.post( 'http://192.168.0.111:5000/value', data=json_data,headers=headers)
    time.sleep(0.5)

