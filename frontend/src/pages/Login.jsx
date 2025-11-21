import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  async function submit(e){
    e.preventDefault();
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email, password, pin })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      alert('Login successful');
      navigate('/');
    } else {
      alert(data.message || 'Login failed');
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
            <input value={email} onChange={e=>setEmail(e.target.value)} required/>
          </div>

          <div>
            <label>Password</label><br/>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
          </div>

          <div>
            <label>Camera Secret Key</label><br/>
            <input value={pin} onChange={e=>setPin(e.target.value)} required/>
          </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
