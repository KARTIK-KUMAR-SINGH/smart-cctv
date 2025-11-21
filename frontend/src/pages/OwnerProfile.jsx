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
    <div style={{ maxWidth: 720, margin: '2rem auto', padding: '1rem' }}>
      <h2>Owner Profile</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10 }}>

        <label>
          Owner Name
          <input name="ownerName" value={form.ownerName} onChange={onChange} required />
        </label>

        <label>
          Owner Mobile Number
          <input name="ownerMobile" value={form.ownerMobile} onChange={onChange} required />
        </label>

        <label>
          Threshold Value
          <input name="thresholdValue" type="number" value={form.thresholdValue} onChange={onChange} required />
        </label>

        <label>
          Security Contact Number
          <input name="securityContact" value={form.securityContact} onChange={onChange} required />
        </label>

        <label>
          Higher Authority Number
          <input name="higherAuthority" value={form.higherAuthority} onChange={onChange} required />
        </label>

        <label>
          Ambulance / Local Hospital Number
          <input name="ambulanceNumber" value={form.ambulanceNumber} onChange={onChange} required />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>

      </form>
    </div>
  );
}
