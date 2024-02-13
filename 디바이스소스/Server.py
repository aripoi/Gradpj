from flask import Flask, request, jsonify
import logging
from datetime import datetime
import actuator
import neo_act as n
import threading
import socket
import requests
import neo_thread

from multiprocessing import Process
global neopixel_thread, ip_address, status
               
app = Flask(__name__)
my_serial_num = 202311080001
url = 'http://ceprj.gachon.ac.kr:60005/'
status = "waiting"
prev_ip_address = 'address'



logging.basicConfig(filename='app.log', level=logging.DEBUG)

file_handler = logging.FileHandler('app.log')
file_handler.setLevel(logging.DEBUG)

app.logger.addHandler(file_handler)

def parse(just_string):
    just_string = str(just_string)
    just_string.replace('ml', '')
    
    return int(just_string)

def send_ip():
    global prev_ip_address, ip_address, server
    url = 'http://ceprj.gachon.ac.kr:60005/device/send_ip'
    
    while True:
        try:
            ip_address = get_ip_address()
            
            if get_ip_address() == '192.168.0.104':
                json_data = {
            "serial_number": my_serial_num,
            "ip_address": 'ceprjmaker.iptime.org'
            }
            else:    
                json_data = {
                "serial_number": my_serial_num,
                "ip_address": ip_address
                }
                
            if prev_ip_address != ip_address:
                response = requests.post(url, json=json_data)
                print(response.text)
                prev_ip_address = ip_address
                server.terminate()
                server.join()
                server = Process(target = lambda: app.run(host = ip_address, port = 10000))
                server.start()
                send_status()
                
        except:
            print("sth wnet wrong :(")
        actuator.sleep(1)

def send_status():
    url = 'http://ceprj.gachon.ac.kr:60005/device/send_status' 
    json_data = {
    "serial_number": my_serial_num,
    "status": status 
    }
    response = requests.post(url, json=json_data)
    print(response.text)

def get_ip_address():
    
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # doesn't even have to be reachable
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP
    
    
@app.route('/', methods=['GET', 'POST'])
def hello():
    global neopixel_t1
    #print(neopixel_t1.pattern)
    #print(neopixel_t1.timing)
    #print(neopixel_t1.bright)
    neopixel_t1.write_profile('rainbow\n0.003\n0.7')
    return "hello"

@app.route('/fast', methods=['GET', 'POST'])
def fast():
    global neopixel_t1
    neopixel_t1.write_profile('breathe\n0.01\n0.3')
    return "hello"

@app.route('/set_brightness', methods=['POST', 'GET'])
def set_brightness():
    global bright
    print(neopixel_t1.bright)
    data = request.json
    if data:
        bright = data.get("brightness")
        if 0<=float(bright)<=1:    
            neopixel_t1.write_profile(f'{str(neopixel_t1.pattern)}\n{str(neopixel_t1.timing)}\n{str(bright)}')
            
    return jsonify({
                "brightness": bright
            })

@app.route('/breathing', methods=['POST', 'GET'])
def breathing():
    
    neopixel_t1.write_profile(f'breathe\n0.03\n{str(neopixel_t1.bright)}')
    return jsonify({
                "pattern": neopixel_t1.pattern
            })

@app.route('/rainbow', methods=['POST', 'GET'])
def rainbow():
    neopixel_t1.read_profile()
    neopixel_t1.write_profile(f'rainbow\n0.005\n{str(neopixel_t1.bright)}')            
    return jsonify({
                "pattern":neopixel_t1.pattern
            })
@app.route('/Chasing', methods = ['POST', 'GET'])
def chasing():
    neopixel_t1.write_profile(f'chasing\n0.05\n{str(neopixel_t1.bright)}')
    return jsonify({
                "pattern": neopixel_t1.pattern
            })
@app.route('/Sparkle', methods = ['POST', 'GET'])
def sparkle():
    neopixel_t1.write_profile(f'sparkle\n0.05\n{str(neopixel_t1.bright)}')
    return jsonify({
                "pattern": neopixel_t1.pattern
            })

@app.route('/make_cocktail', methods=['POST', 'GET'])
def make_cocktail():
    global status
    data = request.json
    
    if data:
        UserID = data.get('UserID')
        recipeTitle = data.get('recipeTitle')
        first = parse(data.get('first'))
        second = parse(data.get('second'))
        third = parse(data.get('third'))
        fourth = parse(data.get('fourth'))
        Serial_Number = data.get('Serial_Number')
    
        if all([UserID, recipeTitle, first, second, third, fourth]):
            current_date = datetime.now().strftime("%Y%m%d")
            
            status = "inprogress"
            pattern = neopixel_t1.pattern
            #print(pattern)
            send_status()
            neopixel_t1.write_profile(f'rainbow\n0.001\n{neopixel_t1.bright}')
            pumps = actuator.pumps
            timings = [first, second, third, fourth]
            # actuator.make_sound()
            actuator.indicator_off()
            actuator.g.output(actuator.Y, True)
            
            pump1 = threading.Thread(target = lambda: pump_run(pumps[0], timings[0], 1))
            pump2 = threading.Thread(target = lambda: pump_run(pumps[1], timings[1], 1))
            pump3 = threading.Thread(target = lambda: pump_run(pumps[2], timings[2], 0.6))
            pump4 = threading.Thread(target = lambda: pump_run(pumps[3], timings[3], 1))
            
            pump1.start()
            pump2.start()
            pump3.start()
            pump4.start()
            pump1.join()
            pump2.join()
            pump3.join()
            pump4.join()
            
            neopixel_t1.write_profile(f'rainbow\n0.01\n{neopixel_t1.bright}')
            status = "done"
            send_status()
            status = "waiting"
            send_status()
            actuator.indicator_off()
            actuator.g.output(actuator.G, True)
            
            return jsonify({
                'UserID':UserID,
                'recipeTitle': recipeTitle,
                'date' : current_date,
                'success' : True
            })
        else:
            actuator.g.output(actuator.R, True)
            return jsonify({
                'success' : False
            })
    else:
        actuator.g.output(actuator.R, True)
        return jsonify({
            'success' : False
        })
def pump_run(pump, amount, sec):
    actuator.g.output(pump, True)
    actuator.sleep(int(amount)//15*7.5*sec)
    actuator.g.output(pump, False)

if __name__ == '__main__':
    
    actuator.setup()
    ip_address = get_ip_address()
    print("My IP Address is:", ip_address)

    threading.Thread(target=send_ip).start()
    neopixel_t1 = neo_thread.led_thread('Neopixel_t1')
    neopixel_t1.start()
    
    server = Process(target = lambda: app.run(host = ip_address, port = 10000))
    server.start()
    send_status()
    hello()
