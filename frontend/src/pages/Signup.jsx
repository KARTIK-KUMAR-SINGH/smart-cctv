import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  async function submit(e){
    e.preventDefault();
    const res = await fetch(`${API}/api/auth/signup`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (res.ok) {
      alert('Signup successful');
      navigate('/login');
    } else {
      alert(data.message || 'Signup failed');
    }
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <h2>Signup</h2>
      <form onSubmit={submit}>
        <div>
          <label>Email</label><br/>
          <input value={email} onChange={e=>setEmail(e.target.value)} required/>
        </div>
        <div>
          <label>Password</label><br/>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
        </div>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}
