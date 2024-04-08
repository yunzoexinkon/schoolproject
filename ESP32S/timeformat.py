import utime
def print_current_time(nt):
    time_tuple = utime.localtime(nt)
    year, month, day, hour, minute, second = map(str, time_tuple[0:6])
    formatted_time = "{:0>4}-{:0>2}-{:0>2} {:0>2}:{:0>2}:{:0>2}".format(year, month, day, hour, minute, second)
    #print(formatted_time)
    return formatted_time

#print_current_time(764178602)
