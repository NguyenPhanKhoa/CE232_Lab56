import paho.mqtt.client as mqtt
import pymongo
from datetime import datetime

def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    client.subscribe("sensor/data")

def save_to_mongodb(data):
    client = pymongo.MongoClient("mongodb+srv://louissunny86:6d@test0.krrssgc.mongodb.net/")
    db = client["Sensor_Data"]
    
    collection = db["datas"]
    collection.insert_one(data)

def on_message(client, userdata, msg):
    payload = msg.payload.decode('utf-8')
    temp, hum = payload.split('/')
    currentTime = datetime.now()
    data = {
        'time': currentTime.isoformat(),
        'temperature': float(temp),
        'humidity': float(hum)
    }
    print(data)
    save_to_mongodb(data)

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.username_pw_set("MQ4VlC4E0kBT8hAXHScbj0BbFjkKMM6uVqaoBVImEkZjxpIo1iImaq2zvJXsrhAo")
client.connect("mqtt.flespi.io", 1883, 60)

client.loop_forever()