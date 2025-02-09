import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // ฟังก์ชันสำหรับ Logout
  const handleLogout = () => {
    localStorage.removeItem('user'); // ลบข้อมูลผู้ใช้จาก localStorage
    navigate('/login'); // ไปที่หน้า Login
  };

  return (
    <nav className="bg-[#976928] p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">เว็บไซต์จองที่จอดรถ RMUTL</Link>
        <div className="flex space-x-4 items-center">
          <Link to="/" className="hover:underline">หน้าแรก</Link>
          <Link to="/reserve" className="hover:underline">จองคิว</Link>
          <Link to="/about" className="hover:underline">เกี่ยวกับเรา</Link>
          {user ? (
            <div className="flex items-center space-x-4">
              <span>Welcome, {user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                ออกจากระบบ
              </button>
            </div>
          ) : (
            <Link to="/login" className="hover:underline">เข้าสู่ระบบ</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;