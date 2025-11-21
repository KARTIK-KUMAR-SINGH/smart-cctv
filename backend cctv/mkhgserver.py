# mjpeg_stream.py
# Simple MJPEG HTTP streamer using Flask + OpenCV
# Save as: /home/pi/smart-cctv/mjpeg/mjpeg_stream.py

from flask import Flask, Response
import cv2
import threading
import time

app = Flask(__name__)

# Camera source: 0 for default USB/CSI camera
VIDEO_SRC = 0

# Shared JPEG frame
_last_jpeg = None
_last_lock = threading.Lock()

def camera_loop():
    global _last_jpeg
    cap = cv2.VideoCapture(VIDEO_SRC)
    if not cap.isOpened():
        print("ERROR: cannot open camera", VIDEO_SRC)
        return
    print("Camera opened. Starting capture loop...")
    while True:
        ret, frame = cap.read()
        if not ret:
            time.sleep(0.1)
            continue
        # Optionally resize to reduce bandwidth:
        # frame = cv2.resize(frame, (640, int(frame.shape[0]*640/frame.shape[1])))

        # encode jpeg
        ret2, jpg = cv2.imencode('.jpg', frame, [int(cv2.IMWRITE_JPEG_QUALITY), 60])
        if not ret2:
            continue
        with _last_lock:
            _last_jpeg = jpg.tobytes()
        # small sleep to limit CPU (adjust as needed)
        time.sleep(0.03)  # ~30 FPS cap

@app.route('/stream')
def stream():
    def generator():
        global _last_jpeg
        while True:
            with _last_lock:
                jpeg = _last_jpeg
            if jpeg:
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + jpeg + b'\r\n')
            else:
                # no frame yet
                time.sleep(0.05)
    return Response(generator(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    # start camera in background thread
    t = threading.Thread(target=camera_loop, daemon=True)
    t.start()
    # run Flask on all interfaces so you can open from laptop: http://<PI_IP>:5000/stream
    app.run(host='0.0.0.0', port=5000, threaded=True)
