import time
import machine
import onewire, ds18x20

def temperature():
    # the device is on GPIO14
    dat = machine.Pin(14)
    # create the onewire object
    ds = ds18x20.DS18X20(onewire.OneWire(dat))
    # scan for devices on the bus
    roms = ds.scan()
    #print('found devices:', roms)
    tmp=0.0
    #print('temperatures:', end=' ')
    ds.convert_temp()
    #ime.sleep_ms(750)
    for rom in roms:
        #print(ds.read_temp(rom), end=' ')
        tmp=ds.read_temp(rom)
    #print(tmp)
    return tmp
#temperature()