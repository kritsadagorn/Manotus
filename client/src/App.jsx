import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Reserve from './pages/Reserve';
import AboutUs from './pages/AboutUs';
import Admin from './pages/Admin'; // ✅ นำเข้า Admin Page

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reserve" element={<Reserve />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/admin" element={<Admin />} /> {/* ✅ เพิ่ม Route Admin */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
