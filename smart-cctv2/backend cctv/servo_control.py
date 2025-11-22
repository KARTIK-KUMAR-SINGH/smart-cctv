# servo_control.py
# Simple servo helper using pigpio. Safe defaults for hobby servos.
# Save as: /home/pi/smart-cctv/backend/servo_control.py

import time
try:
    import pigpio
except Exception:
    pigpio = None

# Use BCM pin numbering
SERVO_GPIO = 18  # BCM18 (physical pin 12)
# pulse widths in microseconds for angle mapping (adjust to your servo)
MIN_PW = 500    # 0 degrees (us)
MAX_PW = 2500   # 180 degrees (us)
CENTER_PW = 1500  # stop / center

# internal state
_state = {"mode": "stopped", "angle": None, "speed": 0}

_pi = None

def init():
    global _pi
    if pigpio is None:
        print("pigpio module not installed — servo control not available")
        return
    _pi = pigpio.pi()
    if not _pi.connected:
        print("pigpio daemon not running or cannot connect")
        _pi = None
        return
    # optionally set servo to center
    _pi.set_mode(SERVO_GPIO, pigpio.OUTPUT)
    _pi.set_servo_pulsewidth(SERVO_GPIO, 0)  # 0 = off

def set_angle(angle):
    """Set servo to angle 0..180. Returns pulsewidth used or None on error."""
    global _state, _pi
    if _pi is None:
        print("pigpio not available")
        return None
    # clamp angle
    if angle is None:
        return None
    angle = max(0, min(180, int(angle)))
    # map angle to pulsewidth
    pw = int(MIN_PW + (angle / 180.0) * (MAX_PW - MIN_PW))
    _pi.set_servo_pulsewidth(SERVO_GPIO, pw)
    _state.update({"mode": "angle", "angle": angle, "speed": 0})
    return pw

def set_speed(speed):
    """For continuous-rotation servo: speed -100..100.
       Maps to pulsewidth around CENTER_PW.
    """
    global _state, _pi
    if _pi is None:
        print("pigpio not available")
        return None
    if speed is None:
        return None
    speed = max(-100, min(100, int(speed)))
    # map speed to pw: center=1500 stop; extremes approx 1000..2000
    if speed == 0:
        pw = CENTER_PW
    elif speed > 0:
        pw = int(CENTER_PW + (speed / 100.0) * (MAX_PW - CENTER_PW))
    else:
        pw = int(CENTER_PW + (speed / 100.0) * (CENTER_PW - MIN_PW))
    _pi.set_servo_pulsewidth(SERVO_GPIO, pw)
    _state.update({"mode": "speed", "angle": None, "speed": speed})
    return pw

def stop():
    global _state, _pi
    if _pi:
        _pi.set_servo_pulsewidth(SERVO_GPIO, 0)  # stop pulses
    _state.update({"mode": "stopped", "angle": None, "speed": 0})

def get_state():
    return _state.copy()

# init on import
init()
