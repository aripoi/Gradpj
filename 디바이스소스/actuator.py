import RPi.GPIO as g
from time import sleep

pump1 = 25
pump1_A = 9

pump2 = 8
pump2_A = 11

pump3 = 7
pump3_A = 0

pump4 = 1
pump4_A = 5

pumps = [pump1, pump2, pump3, pump4]
pumps_A = [pump1_A, pump2_A, pump3_A, pump4_A]

def setup():
    g.setwarnings(False)
    g.setmode(g.BCM)
    
    for pump in pumps:
        g.setup(pump, g.OUT)
        g.output(pump, False)
        
    for pump in pumps_A:
        g.setup(pump , g.OUT)
        g.output(pump, False)
