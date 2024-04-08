from microdot_asyncio import Microdot, redirect, send_file
import time
import urequests as requests
import airpressure
import temperature
import orpvalue
import connect
import timeformat
import json
import gc



connect.connect()
now = time.time()
posttime = 0

while (True ):
    nt = time.time()
    
    if(nt-now+posttime==10) :
        test = time.time()
        print(nt,test)
        Airpressure = airpressure.airpressure()
        #print(Airpressure)
        
        Temperature = temperature.temperature()
        #print(Temperature)
        
        Orpvalue = orpvalue.orpvalue()
        #print(Orpvalue)
        Nowtime = timeformat.print_current_time(nt)
        #print(Nowtime)
        data = {"Airpressure": Airpressure,"Temperature": Temperature,"Orpvalue": Orpvalue,"Nowtime":Nowtime}
        json_data = json.dumps(data)
        headers = {"Content-Type": "application/json"}
        print(json_data)
        requests.post( 'https://i7y13sy13i.execute-api.us-east-1.amazonaws.com/default/value', data=json_data,headers=headers)
        #requests.post( 'http://192.168.0.116:5000/value', data=json_data,headers=headers)
        #print(nt,now)
        now = time.time()
        print(now)
        posttime = now - test
        print(now-test)
    else :
        gc.collect()        
        
        

