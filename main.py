import pyrebase
import time
import random
from datetime import datetime

LOG_INTERVAL = 60
TICK_INTERVAL = 1

latest_log_time = 0
tick = 0

firebase_config = dict(
    apiKey="AIzaSyCa-WgNxaUU1jv81pVC6ajXOo493e8zY2w",
    authDomain="eit-gruppe-3.firebaseapp.com",
    databaseURL="https://eit-gruppe-3-default-rtdb.firebaseio.com/",
    projectId="eit-gruppe-3",
    storageBucket="eit-gruppe-3.appspot.com",
    messagingSenderId="571619157604",
    appId="1:571619157604:web:71df7292d860c0f1daa171"
)

firebase = pyrebase.initialize_app(firebase_config)
db = firebase.database()

while True:
    if time.time() - tick < TICK_INTERVAL:
        continue

    tick = time.time()
    update_log = time.time() - latest_log_time >= LOG_INTERVAL

    if update_log:
        latest_log_time = time.time()

    for i in range(16):
        timestamp = str(datetime.now())
        data = dict(
            timestamp=timestamp,
            soilMoisture=random.uniform(0, 1),
            category="test"
        )

        if update_log:
            db.child("plants").child(f"plant{i}").child("log").push(data)
        db.child("plants").child(f"plant{i}").child("latest").set(data)
