import React from "react";

const AboutUs = () => {
  const developers = [
    {
      name: "กฤษฎากรณ์ ปุนนพานิช",
      role: "Fullstack Developer",
      image:
        "https://scontent.fcnx4-1.fna.fbcdn.net/v/t39.30808-6/365203602_6117542865039292_8290961317508704418_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=liMpEGtT8Y8Q7kNvgG_Mls4&_nc_oc=AdhGQ4re7IojAojJ2Y8I_0doFjQOnzj2Rm23BXhza_W6paYejb14qk9P4eL7q2atqSc&_nc_zt=23&_nc_ht=scontent.fcnx4-1.fna&_nc_gid=AcmLICjbF3O8h8d2ZtKgBlV&oh=00_AYDETJSgqbWErBYzMMPxi0yBjnnpFdG6twge4Ef4dFvTIg&oe=67B8BC79",
    },
    {
      name: "ธีรภัทร กันทอง",
      role: "Backend Developer",
      image:
        "https://scontent.fcnx4-1.fna.fbcdn.net/v/t39.30808-6/453739155_122116306940377256_5009704031974300276_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=SoPzBVop6AcQ7kNvgGd9BQf&_nc_oc=Adjfmh_5plx3ExP2g-G_0OsGi3ukR1X06NhVin0K_5rwqETkTaGp90Wwb4rPLwZ1Fh4&_nc_zt=23&_nc_ht=scontent.fcnx4-1.fna&_nc_gid=AS-YRTn9eE8IX6O22nPdLAq&oh=00_AYCAsl-7PEKyZI19u7cIBfnKeImGjwLUYrHmJ8GrNRRNow&oe=67B89006",
    },
    {
      name: "รชตะ รุ่งราตรี",
      role: "Database Admin",
      image:
        "https://scontent.fcnx4-1.fna.fbcdn.net/v/t39.30808-6/320748227_714295786624034_674374759426875360_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=B5PJebkOkrAQ7kNvgEkE3gb&_nc_oc=Adh8Ig5l5A4jU4QCRfUJ-SW_mh9bawHEuuUZ5JkhgByWtqUvEQCL0f5_xKs7adUzLaI&_nc_zt=23&_nc_ht=scontent.fcnx4-1.fna&_nc_gid=A4JZlKuTcdL_NBwvbZjIm2W&oh=00_AYDkiy2ZcQl-t8HZldBvkloCb7xX3R7ofqqTdO2sfyt99A&oe=67B895C5",
    },
    {
      name: "บุญประพัฒน์ ตานัน",
      role: "UI/UX Designer",
      image:
        "https://scontent.fcnx4-1.fna.fbcdn.net/v/t39.30808-6/309701978_1945241255675088_6160863753271694712_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=uz61vUf4vksQ7kNvgFDRcTP&_nc_oc=AdjdZNGVcFemzIa6jX51QCMgOO7oGK0o8077B5FlclaBxc3yNAYyHIreM8caee4v6kE&_nc_zt=23&_nc_ht=scontent.fcnx4-1.fna&_nc_gid=AkWZVnUYTd_NoRUAsS6hz17&oh=00_AYDjj6tZpKqpteMWDh-OfT7VWW8WYmeGx5xtsNd7m6-hIQ&oe=67B8AD8A",
    },
    {
      name: "วุฒิภัทร ศรีคำ",
      role: "Project Manager",
      image:
        "https://scontent.fcnx4-1.fna.fbcdn.net/v/t39.30808-1/369941466_6610273249055642_3834850599472434404_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=104&ccb=1-7&_nc_sid=e99d92&_nc_ohc=eNoLjb3CCK8Q7kNvgEECNBF&_nc_oc=AdgxXfrU4adEymVRIt-swmz8mC7klIBlF-G_rM_Cvq-GTDelOePmzmAwmnXtGmXMIP8&_nc_zt=24&_nc_ht=scontent.fcnx4-1.fna&_nc_gid=A8dcCFfqonOE21l4VjBEXs6&oh=00_AYBCPEF8KwRicTOTC8onXK1sgWZWWjSHI6iU4mA5enqpiw&oe=67B8B28E",
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
