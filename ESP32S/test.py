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
import random



connect.connect()
#now = time.time()
posttime = 0

while (True ):
    nt = time.time()
    if(nt%10==0) :
        #now = time.time()
        #if(nt-now+posttime==10) :
        #test = time.time()
        #print(nt,test)
        Airpressure = airpressure.airpressure()
        #Airpressure = 100930 + random.randint(-100,100)/10
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
        try :
            requests.post( 'https://i7y13sy13i.execute-api.us-east-1.amazonaws.com/default/value', data=json_data,headers=headers,timeout=5)
            print(json_data)
            #print(requests.json)
            #requests.post( 'http://192.168.0.111:5000/value', data=json_data,headers=headers)
            time.sleep(1)
        except Exception as e:
            nowtime = time.time()
            print(timeformat.print_current_time(nowtime),e)
                
            #requests.post( 'http://192.168.0.116:5000/value', data=json_data,headers=headers)
            #print(nt,now)
            #now = time.time()
            #print(now)
            #posttime = now - test
            #print(now-test)
            gc.collect()
        #else :
            #gc.collect()
    else :
        nt = time.time()
        gc.collect()
              