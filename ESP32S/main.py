from microdot_asyncio import Microdot, redirect, send_file
import time, machine, utime
import urequests as requests
import airpressure
import temperature
import orpvalue
import connect
import timeformat
import json
import gc
import random
import ntptime


connect.connect()
def get_network_time(max_retries=3):
    retries = 0
    while retries < max_retries:
        try:
            ntptime.settime()
            return True
        except OSError as e:
            print("Failed to set time. Retrying... ({}/{} attempts)".format(retries + 1, max_retries))
            retries += 1
            utime.sleep(1)  # 等待1秒钟再重试
    print("Max retries reached. Failed to set time.")
    return False
get_network_time()
#now = time.time()
utc_offset = 8 * 3600 


while (True ):
    nt = utime.time() + utc_offset
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
            gc.collect()
        #else :
            #gc.collect()
    else :
        nt = time.time()
        gc.collect()
              

