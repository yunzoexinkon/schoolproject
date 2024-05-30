import network
def connect():
  wlan = network.WLAN(network.STA_IF)
  wlan.active(False)
  wlan.active(True)
  if not wlan.isconnected():
      print('connecting to network...')
      #wlan.connect('B510_Wifi', 'mjchen0821')
      wlan.connect('墜神   漆夜','00000000')
      #wlan.connect('B510_Notebook','k1779>M6')
      #wlan.connect('永晝星空','00000000')
      #wlan.ifconfig(('192.168.0.125', '255.255.255.0', '192.168.0.1', '192.168.0.1'))
      while not wlan.isconnected():
          pass
  print('network config: ', wlan.ifconfig())
#connect()