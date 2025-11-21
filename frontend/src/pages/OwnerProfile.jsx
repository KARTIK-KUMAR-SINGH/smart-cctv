// frontend/src/pages/OwnerProfile.jsx
// frontend/src/pages/OwnerProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function OwnerProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    ownerName: '',
    ownerMobile: '',
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
            thresholdValue: data.thresholdValue ?? '',
            securityContact: data.securityContact || '',
            higherAuthority: data.higherAuthority || '',
            ambulanceNumber: data.ambulanceNumber || '',
          });
        }
      } catch {
        // ignore
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
        navigate('/'); // or /dashboard
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
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 18px;
          background:
            radial-gradient(600px 300px at 10% 10%, rgba(0,209,255,0.04), transparent),
            radial-gradient(700px 320px at 90% 90%, rgba(45,212,191,0.02), transparent),
            linear-gradient(180deg, #041021 0%, var(--bg) 100%);
          font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          color: var(--text);
        }

        .owner-card {
          width: 100%;
          max-width: 720px;
          border-radius: 16px;
          padding: 28px;
          background: var(--panel);
          border: 1px solid var(--glass-border);
          backdrop-filter: blur(14px) saturate(1.15);
          box-shadow: 0 10px 30px rgba(3,12,25,0.6), inset 0 1px 0 rgba(255,255,255,0.02);
          position: relative;
          overflow: hidden;
        }

        .owner-card::after{
          content: "";
          position: absolute;
          right: -10%;
          top: -40%;
          width: 260px;
          height: 260px;
          background: radial-gradient(circle at 30% 30%, rgba(0,209,255,0.12), transparent 40%),
                      radial-gradient(circle at 70% 70%, rgba(45,212,191,0.06), transparent 40%);
          transform: rotate(20deg);
          filter: blur(36px);
          pointer-events: none;
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
          background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
          border: 1px solid rgba(255,255,255,0.03);
          box-shadow: 0 6px 18px rgba(0,0,0,0.5);
          font-weight:700;
          color: var(--text);
        }

        h2 {
          margin:0;
          font-size:20px;
          color: var(--text);
        }

        .owner-sub {
          margin-top:4px;
          color: var(--muted);
          font-size:13px;
        }

        form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-top: 18px;
        }

        /* Make single-column on small screens */
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
          background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
          color: var(--text);
          outline: none;
          font-size: 15px;
          transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease;
        }

        .input:focus{
          border-color: var(--accent);
          box-shadow: 0 6px 20px rgba(0,209,255,0.06);
          transform: translateY(-2px);
        }

        /* Full width row for threshold and action */
        .full {
          grid-column: 1 / -1;
          display:flex;
          gap:12px;
          align-items:center;
        }

        .note {
          font-size: 13px;
          color: var(--muted);
        }

        .btn {
          padding: 12px 18px;
          border-radius: 999px;
          border: none;
          background: linear-gradient(90deg, var(--accent), var(--accent-2));
          color: #02212a;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(0,209,255,0.14);
          transition: transform .12s ease, box-shadow .12s ease;
        }
        .btn:active { transform: scale(0.98); }
        .btn:disabled {
          opacity: .6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        /* tiny helper for input types */
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .helper-row {
          display:flex;
          gap:10px;
          align-items:center;
          justify-content:space-between;
          width:100%;
        }

        .small {
          font-size:13px;
          color: var(--muted);
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
            <div className="label">Owner Mobile Number</div>
            <input className="input" name="ownerMobile" value={form.ownerMobile} onChange={onChange} required />
          </div>

          <div className="field">
            <div className="label">Threshold Value</div>
            <input className="input" name="thresholdValue" type="number" value={form.thresholdValue} onChange={onChange} required />
          </div>

          <div className="field">
            <div className="label">Security Contact Number</div>
            <input className="input" name="securityContact" value={form.securityContact} onChange={onChange} required />
          </div>

          <div className="field">
            <div className="label">Higher Authority Number</div>
            <input className="input" name="higherAuthority" value={form.higherAuthority} onChange={onChange} required />
          </div>

          <div className="field">
            <div className="label">Ambulance / Local Hospital Number</div>
            <input className="input" name="ambulanceNumber" value={form.ambulanceNumber} onChange={onChange} required />
          </div>

          <div className="full">
            <div style={{ flex: 1 }}>
              <div className="small">Make sure phone numbers include country code if needed.</div>
            </div>
            <div>
              <button className="btn" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Information'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
