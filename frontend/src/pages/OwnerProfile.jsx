import React, { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function OwnerProfile() {
  const [form, setForm] = useState({
    ownerName: '',
    ownerMobile: '',
    ownerAddress: '',
    thresholdValue: '',
    securityContact: '',
    higherAuthority: '',
    ambulanceNumber: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`${API}/api/owner/me`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          }
        });

        if (res.ok) {
          const data = await res.json();
          setForm({
            ownerName: data.ownerName || '',
            ownerMobile: data.ownerMobile || '',
            ownerAddress: data.ownerAddress || '',
            thresholdValue: data.thresholdValue ?? '',
            securityContact: data.securityContact || '',
            higherAuthority: data.higherAuthority || '',
            ambulanceNumber: data.ambulanceNumber || '',
          });
        }
      } catch (err) {
        console.log("Profile load error:", err);
      }
    }
    fetchProfile();
  }, []);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/owner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        alert('Failed to save');
      } else {
        // ⭐ Redirect after saving owner details
        window.location.href = "http://127.0.0.1:5500/smart-cctv2/index.html";
        return;
      }
    } catch {
      alert('Network error');
    }

    setLoading(false);
  }

  return (
    <div className="owner-root">

      <style>{`
        :root{
          --bg: #071025;
          --panel: rgba(255,255,255,0.03);
          --glass-border: rgba(255,255,255,0.06);
          --accent: #00d1ff;
          --accent-2: #2dd4bf;
          --muted: #9aa4b2;
          --text: #eaf6ff;
        }

        .owner-root{
          width: 100%;
          box-sizing: border-box;
          min-height: 100vh;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 40px 24px;
          background:
            radial-gradient(600px 300px at 10% 10%, rgba(0,209,255,0.04), transparent),
            radial-gradient(700px 320px at 90% 90%, rgba(45,212,191,0.02), transparent),
            linear-gradient(180deg, #041021 0%, var(--bg) 100%);
          font-family: Inter, system-ui;
          color: var(--text);
        }

        .owner-card {
          width: 100%;
          max-width: 920px;
          margin: 40px auto;
          border-radius: 16px;
          padding: 28px;
          background: var(--panel);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(14px) saturate(1.15);
          box-shadow: 0 10px 30px rgba(3,12,25,0.6);
        }

        .owner-header {
          display:flex;
          align-items:center;
          gap:14px;
          margin-bottom: 14px;
        }

        .owner-badge {
          width:48px;
          height:48px;
          border-radius:12px;
          display:flex;
          align-items:center;
          justify-content:center;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          font-weight:700;
        }

        form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-top: 18px;
        }

        @media (max-width:720px){
          form { grid-template-columns: 1fr; }
        }

        .field {
          display:flex;
          flex-direction: column;
          gap:8px;
        }

        .label {
          font-size:13px;
          color: var(--muted);
        }

        .input {
          width:100%;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.03);
          color: var(--text);
          font-size: 15px;
        }

        .btn {
          padding: 12px 18px;
          border-radius: 999px;
          border: none;
          background: linear-gradient(90deg, var(--accent), var(--accent-2));
          color: #02212a;
          font-weight: 700;
          cursor: pointer;
          margin-top: 10px;
        }
      `}</style>

      <div className="owner-card">
        <div className="owner-header">
          <div className="owner-badge">OP</div>
          <div>
            <h2>Owner Profile</h2>
            <div className="owner-sub">Fill contact & threshold details for alerts</div>
          </div>
        </div>

        <form onSubmit={onSubmit}>
          <div className="field">
            <div className="label">Owner Name</div>
            <input className="input" name="ownerName" value={form.ownerName} onChange={onChange} required />
          </div>

          <div className="field">
            <div className="label">Owner Mobile</div>
            <input className="input" name="ownerMobile" value={form.ownerMobile} onChange={onChange} required />
          </div>

          <div className="field">
            <div className="label">Owner Address</div>
            <input className="input" name="ownerAddress" value={form.ownerAddress} onChange={onChange} required />
          </div>

          <div className="field">
            <div className="label">Threshold Value</div>
            <input className="input" type="number" name="thresholdValue" value={form.thresholdValue} onChange={onChange} required />
          </div>

          <div className="field">
            <div className="label">Security Contact</div>
            <input className="input" name="securityContact" value={form.securityContact} onChange={onChange} required />
          </div>

          <div className="field">
            <div className="label">Higher Authority Number</div>
            <input className="input" name="higherAuthority" value={form.higherAuthority} onChange={onChange} required />
          </div>

          <div className="field">
            <div className="label">Ambulance / Hospital Number</div>
            <input className="input" name="ambulanceNumber" value={form.ambulanceNumber} onChange={onChange} required />
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '20px' }}>
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Information'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
