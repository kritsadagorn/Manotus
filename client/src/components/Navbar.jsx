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
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        `}
      </style>
      <nav className="bg-[#4e4943] p-4 text-white" style={{ fontFamily: 'Kanit, sans-serif' }}>
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
                  className="bg-[#f56565] text-white px-4 py-2 rounded hover:bg-[#e53e3e]"
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
    </>
  );
};

export default Navbar;