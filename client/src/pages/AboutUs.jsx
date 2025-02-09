import React from 'react';

const AboutUs = () => {
  const developers = [
    { name: 'กฤษฎากรณ์ ปุนนพานิช', role: 'Fullstack Developer', image: 'https://scontent.fcnx4-1.fna.fbcdn.net/v/t39.30808-6/365203602_6117542865039292_8290961317508704418_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=8aOtAn9IKPQQ7kNvgGvGLwv&_nc_oc=AdjmVR7MUZfgWAoM9DBwPub9ye7mme3NabTC4HY9WX-hCmOiAvyb4fipoNtnxa90b48&_nc_zt=23&_nc_ht=scontent.fcnx4-1.fna&_nc_gid=AJ3mhIGnmppbSEtIbBJKHv8&oh=00_AYC97EJ4zDSuDD4RKHeyR-KR-f9IdGITd32AI0rwmZ2gTQ&oe=67AC6E79' },
    { name: 'ธีรภัทร กันทอง', role: 'Backend Developer', image: 'https://scontent.fcnx4-1.fna.fbcdn.net/v/t39.30808-6/453739155_122116306940377256_5009704031974300276_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=_7qQX76YzHkQ7kNvgETXC2a&_nc_oc=AdgBiapUX-9A94hPQS5STabgkbJ2kVZScdlX36qyyh1w5K_k_wtFuoc0rrLGMCJpilc&_nc_zt=23&_nc_ht=scontent.fcnx4-1.fna&_nc_gid=A70CXmJjPOEOKCCr64dhOwF&oh=00_AYDRQyF-9HBIN4PerrEcs5WtrDLKWWaCX_lRfoiYEbq5qQ&oe=67AC7A46' },
    { name: 'รชตะ รุ่งราตรี', role: 'Database Admin', image: 'https://scontent.fcnx4-1.fna.fbcdn.net/v/t39.30808-6/320748227_714295786624034_674374759426875360_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=jTrkpZP379gQ7kNvgE_IVKj&_nc_oc=Adicqk-SaPnIq-iaYdiHcdwxPRu0Jk4DG36ZrXq9e4F8_yT8aMeM8uFhzIZ1NpCGomo&_nc_zt=23&_nc_ht=scontent.fcnx4-1.fna&_nc_gid=AnDwe5nji19hTMcWA9wFk5V&oh=00_AYCLWHofBPVnkdroCz-LHZkhfzZVo0xunUpWFd7uAitYrA&oe=67AC8005' },
    { name: 'บุญประพัฒน์ ตานัน', role: 'UI/UX Designer', image: 'https://scontent.fcnx4-1.fna.fbcdn.net/v/t39.30808-6/309701978_1945241255675088_6160863753271694712_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=VlkDTYZwtVAQ7kNvgEhk_bW&_nc_oc=AdiWjDbgr6jOZExX6FYqSAi5VujyysOXfWntLorE2RS4y5JZLeSykVrIx6AjM-Eqcao&_nc_zt=23&_nc_ht=scontent.fcnx4-1.fna&_nc_gid=A8wI99wvA2CLI4ULdeVcFqk&oh=00_AYB17mtXrtKVM-83voi36Ox7oKUrrsiJveZHy9n4H8mq4A&oe=67AC97CA' },
    { name: 'วุฒิภัทร ศรีคำ', role: 'Project Manager', image: 'https://scontent.fcnx4-1.fna.fbcdn.net/v/t39.30808-1/369941466_6610273249055642_3834850599472434404_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=104&ccb=1-7&_nc_sid=e99d92&_nc_ohc=X1P-ahUMC9gQ7kNvgEzLLy3&_nc_oc=AdiHiuL39ZnnBQC0wcxRDbUMMsynPh5_tGLHriNRY7D_ww8h1WzGaDKlz49GkNvOh7U&_nc_zt=24&_nc_ht=scontent.fcnx4-1.fna&_nc_gid=AdcuOIUEUAqAiTwxTC5ws8H&oh=00_AYAdm4g3wsRqYeBXA_uAkVXOKCgiRIKcr732uyURN50_Hw&oe=67AC9CCE' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#333333] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">เกี่ยวกับเรา</h1>
        <p className="text-lg text-gray-300 text-center max-w-2xl mx-auto mb-12">
          ยินดีต้อนรับสู่เว็บไซต์ระบบจองที่จอดรถของมหาวิทยาลัย ที่ออกแบบมาเพื่ออำนวยความสะดวกให้กับนักศึกษา
          คณาจารย์ และบุคลากรของมหาวิทยาลัย เทคโนโลยีราชมงคลล้านนาเชียงใหม่
          เราพร้อมช่วยให้การหาที่จอดรถเป็นเรื่องง่ายและรวดเร็ว
        </p>

        {/* แสดงข้อมูลผู้พัฒนาในรูปแบบ Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {developers.map((dev, index) => (
            <div key={index} className="p-6 rounded-lg shadow-lg bg-[#2c2c2c] hover:bg-[#3a3a3a] transition-all duration-300 transform hover:scale-105">
              <img
                src={dev.image}
                alt={dev.name}
                className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-[#9b6437]"
              />
              <h2 className="text-2xl font-semibold text-center mb-2">{dev.name}</h2>
              <p className="text-gray-400 text-center">{dev.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;