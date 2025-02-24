import React from "react";

const AboutUs = () => {
  const developers = [
    {
      name: "กฤษฎากรณ์ ปุนนพานิช",
      role: "Fullstack Developer",
      image:
        "https://img5.pic.in.th/file/secure-sv1/365203602_6117542865039292_8290961317508704418_n.jpg",
    },
    {
      name: "ธีรภัทร กันทอง",
      role: "Backend Developer",
      image:
        "https://img5.pic.in.th/file/secure-sv1/453739155_122116306940377256_5009704031974300276_n.jpg",
    },
    {
      name: "รชตะ รุ่งราตรี",
      role: "Database Admin",
      image:
        "https://img2.pic.in.th/pic/320748227_714295786624034_674374759426875360_n.jpg",
    },
    {
      name: "บุญประพัฒน์ ตานัน",
      role: "UI/UX Designer",
      image:
        "https://img2.pic.in.th/pic/309701978_1945241255675088_6160863753271694712_n.jpg  ",
    },
    {
      name: "วุฒิภัทร ศรีคำ",
      role: "Project Manager",
      image:
        "https://img5.pic.in.th/file/secure-sv1/369941466_6610273249055642_3834850599472434404_n.jpg",
    },
  ];

  return (
    <>
    <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        `}
      </style>
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#333333] text-white p-8" style={{ fontFamily: 'Kanit, sans-serif' }}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">เกี่ยวกับเรา</h1>
          <p className="text-lg text-gray-300 text-center max-w-2xl mx-auto mb-12">
            ยินดีต้อนรับสู่เว็บไซต์ระบบจองที่จอดรถของมหาวิทยาลัย
            ที่ออกแบบมาเพื่ออำนวยความสะดวกให้กับนักศึกษา คณาจารย์
            และบุคลากรของมหาวิทยาลัย เทคโนโลยีราชมงคลล้านนาเชียงใหม่
            เราพร้อมช่วยให้การหาที่จอดรถเป็นเรื่องง่ายและรวดเร็ว
          </p>

          {/* แสดงข้อมูลผู้พัฒนาในรูปแบบ Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {developers.map((dev, index) => (
              <div
                key={index}
                className="p-6 rounded-lg shadow-lg bg-[#2c2c2c] hover:bg-[#3a3a3a] transition-all duration-300 transform hover:scale-105"
              >
                <img
                  src={dev.image}
                  alt={dev.name}
                  className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-[#9b6437]"
                />
                <h2 className="text-2xl font-semibold text-center mb-2">
                  {dev.name}
                </h2>
                <p className="text-gray-400 text-center">{dev.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
