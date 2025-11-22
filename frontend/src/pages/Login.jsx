import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  // Default redirect URL set to the requested local page
  const [redirectUrl, setRedirectUrl] = useState('http://127.0.0.1:5500/smart-cctv2/index.html');   // ⭐ DEFAULT UPDATED
  const [error, setError] = useState(''); 
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  function isValidEmail(v){
    if (!v || typeof v !== 'string') return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  async function submit(e){
    e.preventDefault();
    setError('');

    const normalizedEmail = email.trim().toLowerCase();
    if (!isValidEmail(normalizedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email: normalizedEmail, password, pin })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Login failed');
        return;
      }

      // save token
      localStorage.setItem('token', data.token);

      // ⭐ NEW: redirect to custom HTML page if user entered a URL (default is the local page)
      if (redirectUrl && redirectUrl.trim() !== "") {
        // ensure a well-formed URL string -- basic check
        const to = redirectUrl.trim();
        try {
          // attempt to construct URL (this will throw for malformed strings)
          // allow relative URLs as well by catching failures and falling back to direct assignment
          new URL(to);
          window.location.href = to;
          return;
        } catch {
          // if it's not an absolute URL, still attempt to navigate (keeps existing behavior)
          window.location.href = to;
          return;
        }
      }

      // old confirm logic removed since user now controls redirect
      // continue with profile navigation
      try {
        const profileRes = await fetch(`${API}/api/owner/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + data.token
          }
        });

        if (profileRes.ok) {
          navigate('/');
        } else {
          if (profileRes.status === 404) navigate('/owner-profile');
          else navigate('/');
        }
      } catch (err) {
        console.error('Profile check failed:', err);
        navigate('/');
      }

    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed: ' + (err.message || 'unknown error'));
    }
  }

  return (
    <div className="login-root">
      <style>{`
        :root {
          --bg:#0f1724;
          --card:#0b1220;
          --accent:#00d1ff;
          --muted:#9aa4b2;
        }
        .login-root {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background:
            radial-gradient(600px 300px at 15% 20%, rgba(0,209,255,0.06), transparent),
            radial-gradient(600px 300px at 85% 80%, rgba(0,200,255,0.05), transparent),
            var(--bg);
          color: #e6eef6;
          font-family: Inter, sans-serif;
          padding: 20px;
        }
        .login-card {
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px;
          padding: 28px;
          backdrop-filter: blur(8px) saturate(1.1);
          box-shadow: 0 8px 24px rgba(0,0,0,0.5);
          position: relative;
          overflow: hidden;
        }
        .login-card::before {
          content: "";
          position: absolute;
          top: -20%;
          left: -10%;
          width: 160%;
          height: 60%;
          background: linear-gradient(90deg, rgba(255,255,255,0.06), rgba(0,209,255,0.05));
          filter: blur(40px);
          transform: rotate(-12deg);
          pointer-events: none;
        }
        h2 {
          margin: 0 0 16px 0;
          font-size: 26px;
          color: #f8fbff;
          text-align: center;
          letter-spacing: -0.5px;
        }
        form {
          display: grid;
          gap: 18px;
        }
        label {
          font-size: 14px;
          color: var(--muted);
        }
        input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: #e6eef6;
          font-size: 15px;
          outline: none;
          transition: border .2s ease, background .2s ease;
        }
        input:focus {
          border-color: var(--accent);
          background: rgba(255,255,255,0.08);
        }
        .error {
          color: #ffb4b4;
          background: rgba(255, 0, 0, 0.04);
          padding: 8px 10px;
          border-radius: 8px;
          font-size: 13px;
        }
        button {
          width: 100%;
          padding: 12px;
          border-radius: 999px;
          border: none;
          background: linear-gradient(90deg, var(--accent), #2dd4bf);
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          color: #02212a;
          box-shadow: 0 6px 20px rgba(0,209,255,0.18);
          transition: transform 0.15s ease;
        }
        button:active {
          transform: scale(0.98);
        }
      `}</style>

      <div className="login-card">
        <h2>Login</h2>

        <form onSubmit={submit}>
          <div>
            <label>Email</label><br/>
            <input
              value={email}
              onChange={e => { setEmail(e.target.value); if (error) setError(''); }}
              required
              inputMode="email"
              autoComplete="email"
            />
          </div>

          <div>
            <label>Password</label><br/>
            <input
              type="password"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <div>
            <label>Camera Secret Key</label><br/>
            <input value={pin} onChange={e=>setPin(e.target.value)} required/>
          </div>

          {/* ⭐ NEW FIELD (prefilled) */}
          <div>
            <label>Redirect URL (will open after successful login)</label><br/>
            <input
              value={redirectUrl}
              onChange={e => setRedirectUrl(e.target.value)}
              placeholder="http://127.0.0.1:5500/smart-cctv2/index.html"
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
