import React from 'react';
import { Link } from 'react-router-dom';

export default function Header(){
  return (
    <header style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 20px', borderBottom: '1px solid #eee'
    }}>
      <div style={{ fontWeight: 700 }}>Smart CCTV</div>
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link to="/login" style={{ textDecoration: 'none' }}>Login</Link>
        <Link to="/signup" style={{ textDecoration: 'none' }}>Signup</Link>
      </nav>
    </header>
  );
}
