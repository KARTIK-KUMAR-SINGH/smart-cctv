import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OwnerForm from "./components/OwnerForm";


export default function App(){
  return (
    <div className="app">
      <Header />
      <main style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
           <Route path="/owner-form" element={<OwnerForm />} />
        </Routes>
      </main>
    </div>
  );
}
