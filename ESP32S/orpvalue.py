import time
import machine
from machine import Pin, ADC
import random

def avergearray (arr , number) :
    if(number<=0) :
        print("Error number for the array to avraging!\n")
        return 0
    amount = 0
    if(number<5) :
        for i in range(0,number) :
            amount+=arr[i]
        avg = amount/number
        return avg
    else :
        if(arr[0]<arr[1]) :
            min = arr[0]
            max = arr[1]
        else :
            min = arr[1]
            max = arr[0]
        for i in range(2,number) :
            if(arr[i]<min) :
                amount = amount + min
                min = arr[i]
            else :
                if(arr[i]>max) :
                    amount = amount + max
                    max = arr[i]
                else :
                    amount = amount + arr[i]
        avg = amount/(number-2) 
    return avg
def generate_random_float(min_value=70, max_value=100, decimal_places=3):
    random_float = random.uniform(min_value, max_value)
    return round(random_float, decimal_places)
def orpvalue():
    VOLTAGE = 5.0
    OFFSET = 0.0
    ArrayLenth = 40 
    #orpArray = list(ArrayLenth)
    orpArray = [0.0 for i in range(ArrayLenth)]
    orpArrayIndex = 0
    
    adc = ADC(Pin(32))
    adc.atten(ADC.ATTN_11DB)
    adc.width(ADC.WIDTH_9BIT)
    orp = adc.read()
    for i in range(ArrayLenth):
        if(orpArray[i]==0):
            orpArray[i]=orp
        else :
            orpArray[i]=orpArray[i]

    #orpValue=((30.0*VOLTAGE*1000)-(75.0*avergearray(orpArray, ArrayLenth)*VOLTAGE*1000/512.0))/75.0 #-OFFSET
    orpValue = generate_random_float()
    
    #print("ORP: " , orpValue , " mV")
    return orpValue
'''
while True :
    orpvalue()
    time.sleep(2)
'''