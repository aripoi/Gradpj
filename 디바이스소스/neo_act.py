import threading
import neo_act as n
import actuator
import random as rnd

message = ''

class led_thread(threading.Thread):
    def __init__(self, name):
        threading.Thread.__init__(self)
        self.name = name
        self.pattern = 0
        self.timing = 0
        self.bright = 0
        self.read_profile()
        
    def read_profile(self):
        try:
            file = open("/home/cocktaillove/maker_python_server/profile.txt", 'r')
            pattern_name = file.readlines()
            file.close()
            if not pattern_name:
                pass
            else:
                self.pattern = pattern_name[0].replace('\n', '')
                self.timing = float(pattern_name[1].replace('\n', ''))
                self.bright = float(pattern_name[2].replace('\n', ''))
        except:
            self.read_profile(self)
    
    def write_profile(self, msg):
        global message
        message = msg
        try:
            file = open("/home/cocktaillove/maker_python_server/profile.txt", "w")
            file.write(msg)
            file.close()
        except:
            self.write_profile(self, message)
        
    def run (self):
        while True:
            self.read_profile()
            if self.pattern == 'rainbow':
                n.rainbow_cycle(self.timing, self.bright)
            elif self.pattern == 'breathe':
                n.breathe(self.timing, self.bright)
            elif self.pattern == 'chasing':
                n.chase((255, 255, 255), self.timing, self.bright)
            elif self.pattern == 'sparkle':
                n.sparkle((rnd.randint(0, 255),rnd.randint(0, 255),rnd.randint(0, 255)), self.timing, self.bright)
            else:
                n.off()
            # actuator.sleep(0.01)
