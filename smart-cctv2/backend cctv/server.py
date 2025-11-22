# server.py
# YOLO detection + MJPEG stream + optional socket.io emits
# Save as: /home/pi/smart-cctv/backend/server.py

import time
import threading
import base64
from flask import Flask, Response, render_template_string, jsonify, make_response, request
from flask_socketio import SocketIO
from flask_cors import CORS
import cv2
from ultralytics import YOLO

# ------ CONFIG ------
VIDEO_SRC = 0                  # camera index (0) or video file
MODEL_PATH = "yolov8n.pt"      # yolov8n.pt (use yolov8s.pt for higher accuracy if Pi can handle it)
INFER_WIDTH = 640              # resize width for inference (keeps speed reasonable)
JPEG_QUALITY = 60              # MJPEG quality 1-100
CONF_THRESHOLD = 0.35          # detection confidence threshold
CLASS_TO_DETECT = [0]          # list of class IDs to detect (0 == person)
EMIT_SOCKETIO = True           # set False to disable socket emits if not needed
# --------------------

app = Flask(__name__)
# enable CORS for local testing so frontend on other origin can fetch /count and servo endpoints
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# Simple viewer page at /
VIEWER_HTML = """<!doctype html>
<html><head><meta charset="utf-8"><title>Smart CCTV - Stream</title></head>
<body style="font-family:Arial,Helvetica,sans-serif; display:flex;flex-direction:column;align-items:center;padding:16px">
  <h2>Smart CCTV — Live (Annotated)</h2>
  <div>Status: <span id="s">running</span></div>
  <div style="margin-top:12px; max-width:95vw;"><img src="/stream" style="width:100%; border-radius:8px;"/></div>
  <div style="margin-top:8px; color:gray">Stream: /stream — MJPEG</div>
</body></html>"""

@app.route("/")
def index():
    return render_template_string(VIEWER_HTML)

# Shared last JPEG for MJPEG stream
_last_jpeg = None
_last_lock = threading.Lock()

# Shared count + timestamp for fallback/polling and quick access
_last_count = 0
_last_count_lock = threading.Lock()
_last_timestamp = None

# ----- Servo control helper import (safe fallback) -----
# Expects a file servo_control.py in the same folder providing:
#   set_angle(angle), set_speed(speed), stop(), get_state()
# If not present or failed, we provide stubs so server keeps running.
try:
    from servo_control import set_angle as _set_angle, set_speed as _set_speed, stop as _servo_stop, get_state as _servo_get_state
    _SERVO_AVAILABLE = True
except Exception as _e:
    # fallback stubs
    _SERVO_AVAILABLE = False
    def _set_angle(a): 
        print("servo_control not available (set_angle)", a)
        return None
    def _set_speed(s):
        print("servo_control not available (set_speed)", s)
        return None
    def _servo_stop():
        print("servo_control not available (stop)")
        return None
    def _servo_get_state():
        return {"mode":"none", "info":"servo_control module missing"}

# Load model (this may auto-download weights if not present)
print("Loading model:", MODEL_PATH)
model = YOLO(MODEL_PATH)
print("Model loaded.")

def encode_jpeg_bytes(frame, quality=JPEG_QUALITY):
    ret, jpg = cv2.imencode('.jpg', frame, [int(cv2.IMWRITE_JPEG_QUALITY), quality])
    if not ret:
        return None
    return jpg.tobytes()

def camera_and_detection_loop():
    global _last_jpeg, _last_count, _last_timestamp
    cap = cv2.VideoCapture(VIDEO_SRC)
    if not cap.isOpened():
        print("ERROR: cannot open camera", VIDEO_SRC)
        return
    print("Camera opened. Starting capture + detection loop...")

    while True:
        start_time = time.time()
        ret, frame = cap.read()
        if not ret:
            time.sleep(0.05)
            continue

        original_h, original_w = frame.shape[:2]

        # Resize for inference (maintain aspect ratio)
        if original_w > INFER_WIDTH:
            scale = INFER_WIDTH / original_w
            frame_proc = cv2.resize(frame, (INFER_WIDTH, int(original_h * scale)))
        else:
            frame_proc = frame.copy()

        proc_h, proc_w = frame_proc.shape[:2]

        # Run inference (only detect specified classes)
        results = model(frame_proc, imgsz=640, conf=CONF_THRESHOLD, classes=CLASS_TO_DETECT)

        detections = []  # will hold dicts: x,y,w,h,confidence,class
        for r in results:
            for box in r.boxes:
                xyxy = box.xyxy[0].tolist()
                conf = float(box.conf[0])
                cls = int(box.cls[0])
                x1, y1, x2, y2 = xyxy
                w = x2 - x1
                h = y2 - y1
                detections.append({
                    'x': float(x1),
                    'y': float(y1),
                    'w': float(w),
                    'h': float(h),
                    'confidence': conf,
                    'class': int(cls)
                })

        # Draw annotations on frame_proc (the resized frame)
        annotated = frame_proc.copy()
        for d in detections:
            cx = int(d['x'] + d['w'] / 2)
            cy = int(d['y'] + d['h'] / 2)
            radius = max(int((d['w'] + d['h']) / 4), 10)
            cv2.circle(annotated, (cx, cy), radius, (0, 255, 0), 2)
            label = f"person {d['confidence']:.2f}"
            cv2.putText(annotated, label, (max(cx - radius, 0), max(cy - radius - 6, 0)),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)

        # create JPEG bytes for streaming
        jpg_bytes = encode_jpeg_bytes(annotated, quality=JPEG_QUALITY)
        if jpg_bytes:
            with _last_lock:
                _last_jpeg = jpg_bytes

        # update the shared count and timestamp (ISO-like string)
        now_str = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        with _last_count_lock:
            _last_count = len(detections)
            _last_timestamp = now_str

        # Also emit via socket.io so a web client can receive base64 frames + count + timestamp (if enabled)
        if EMIT_SOCKETIO:
            try:
                jpg_b64 = base64.b64encode(jpg_bytes).decode('utf-8') if jpg_bytes else None
                if jpg_b64:
                    payload = {'jpg_b64': jpg_b64, 'count': _last_count, 'timestamp': _last_timestamp}
                    socketio.emit('frame', payload)
                    socketio.emit('detection', {'jpg_b64': jpg_b64, 'detections': detections, 'width': proc_w, 'height': proc_h, 'timestamp': _last_timestamp})
            except Exception:
                pass

        # throttle loop to keep reasonable usage (tune sleep as needed)
        elapsed = time.time() - start_time
        target_frame_time = 1.0 / 12.0
        if elapsed < target_frame_time:
            time.sleep(target_frame_time - elapsed)

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
                time.sleep(0.05)
    return Response(generator(), mimetype='multipart/x-mixed-replace; boundary=frame')

# JSON endpoint fallback so clients can poll count + timestamp
@app.route('/count')
def get_count():
    with _last_count_lock:
        payload = {'count': _last_count, 'timestamp': _last_timestamp}
    resp = make_response(jsonify(payload), 200)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return resp

# ---- Servo control REST API (safe, non-destructive additions) ----
@app.route('/servo/angle', methods=['POST'])
def api_set_angle():
    """
    POST JSON: {"angle": 0..180}
    """
    try:
        data = request.get_json(force=True, silent=True) or {}
        angle = data.get('angle')
        if angle is None:
            return jsonify({"error": "missing angle"}), 400
        pw = _set_angle(angle)
        if pw is None:
            return jsonify({"error": "servo not available"}), 500
        return jsonify({"ok": True, "angle": angle, "pulse": pw})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/servo/speed', methods=['POST'])
def api_set_speed():
    """
    POST JSON: {"speed": -100..100}
    """
    try:
        data = request.get_json(force=True, silent=True) or {}
        speed = data.get('speed')
        if speed is None:
            return jsonify({"error": "missing speed"}), 400
        pw = _set_speed(speed)
        if pw is None:
            return jsonify({"error": "servo not available"}), 500
        return jsonify({"ok": True, "speed": speed, "pulse": pw})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/servo/stop', methods=['POST'])
def api_servo_stop():
    try:
        _servo_stop()
        return jsonify({"ok": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/servo/state', methods=['GET'])
def api_servo_state():
    try:
        st = _servo_get_state()
        return jsonify(st)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@socketio.on('connect')
def on_connect():
    print("Socket.IO client connected")

@socketio.on('disconnect')
def on_disconnect():
    print("Socket.IO client disconnected")

if __name__ == "__main__":
    # Start detection thread
    t = threading.Thread(target=camera_and_detection_loop, daemon=True)
    t.start()

    # Run Flask + SocketIO on all interfaces
    print("Starting Flask server on 0.0.0.0:5000")
    socketio.run(app, host='0.0.0.0', port=5000)
