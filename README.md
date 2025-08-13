# 🚗 รายวิชา มโนทัศน์ - ระบบจองที่จอดรถออนไลน์

ระบบจองที่จอดรถสำหรับสถาบันการศึกษา ที่ช่วยให้นักเรียน นักศึกษา และอาจารย์สามารถจองที่จอดรถล่วงหน้าได้อย่างสะดวก

## 🌟 คุณสมบัติหลัก

- 🔐 ระบบล็อกอินแยกตาม Role (นักเรียน/อาจารย์)
- 📅 จองที่จอดรถล่วงหน้า
- 🚙 รองรับรถยนต์และรถจักรยานยนต์
- 👨‍💼 หน้าแอดมินสำหรับจัดการระบบ
- 📊 แสดงสถิติการใช้งานแบบเรียลไทม์

## 🛠️ เทคโนโลยีที่ใช้

### Frontend
- React.js + Vite
- Tailwind CSS
- React Router DOM
- Axios

### Backend
- Node.js + Express.js
- MySQL
- CORS
- Moment.js (Timezone)

### Deployment
- Frontend: Vercel
- Backend: Railway
- Database: Railway MySQL

## 🚀 การติดตั้งและรันโปรเจกต์

### ข้อกำหนดเบื้องต้น
- Node.js (v16 หรือสูงกว่า)
- MySQL
- Git

### 1. Clone โปรเจกต์
```bash
git clone <repository-url>
cd Manotus
```

### 2. ติดตั้ง Dependencies

#### Frontend
```bash
cd client
npm install
```

#### Backend
```bash
cd server
npm install
```

### 3. ตั้งค่าฐานข้อมูล MySQL

#### สำหรับ WSL (Ubuntu)
```bash
# ติดตั้ง MySQL
sudo apt update && sudo apt upgrade -y
sudo apt install mysql-server -y

# เริ่มต้น MySQL
sudo service mysql start

# ตรวจสอบสถานะ (ต้องเป็น ACTIVE สีเขียว)
sudo service mysql status

# ตั้งค่าให้เริ่มอัตโนมัติ
sudo systemctl enable mysql
```

#### สร้างฐานข้อมูล
```bash
sudo mysql
```

```sql
CREATE DATABASE parking_system;
USE parking_system;
```

### 4. Import Schema และ Sample Data

```bash
# Import schema
mysql -u root -p parking_system < database/schema.sql

# Import sample data
mysql -u root -p parking_system < database/sample_data.sql
```

### 5. ตั้งค่า Environment Variables

#### Backend (.env)
```bash
cd server
cp .env.example .env
```

แก้ไขไฟล์ `.env`:
```env
MYSQLHOST=localhost
MYSQLUSER=root
MYSQLPASSWORD=your_mysql_password
MYSQLDATABASE=parking_system
MYSQLPORT=3306
PORT=5000
```

#### Frontend (.env)
```bash
cd client
cp .env.example .env
```

แก้ไขไฟล์ `.env`:
```env
VITE_API_URL=http://localhost:5000
```

### 6. รันโปรเจกต์

#### รัน Backend
```bash
cd server
npm run dev
# หรือ
nodemon index.js
```

#### รัน Frontend
```bash
cd client
npm run dev
```

## 🔑 ข้อมูลการล็อกอิน

### 👨‍💼 Admin Account
```
Username: admin
Password: admin
Role: teacher (admin)
```


### 👨‍🎓 ผู้ใช้ทดสอบ (Test Users)

#### นักเรียน/นักศึกษา
```
- 1.
Username: john_student
Password: password123
Email: john@student.edu Role: student
- 2.
Username: bob_student
Password: password123
Email: bob@student.edu Role: student
- 3.
Username: demo_user
Password: demo123
Email: demo@example.com Role: student
```


#### อาจารย์/ครู
```
- 1.
Username: mary_teacher
Password: password123
Email: mary@school.edu Role: teacher
- 2.
Username: alice_teacher
Password: password123
Email: alice@school.edu Role: teacher
```


## 📱 การใช้งานระบบ

### หน้าหลัก (Home)
- แสดงสถิติที่จอดรถทั้งหมด
- แสดงจำนวนที่ว่าง/ที่จองแล้ว
- ภาพรวมการใช้งานแบบเรียลไทม์

### หน้าจองที่จอดรถ (Reserve)
1. เลือกที่จอดรถที่ต้องการ
2. เลือกช่องจอดรถ (Slot)
3. กำหนดเวลาเข้า-ออก
4. เลือกประเภทรถยนต์
5. ยืนยันการจอง

**หมายเหตุ:**
- ไม่สามารถจองเวลาปัจจุบันได้ (ต้องเพิ่มอย่างน้อย 1 นาที)
- เวลาเข้าและออกต้องไม่เหมือนกัน
- ประเภทรถต้องตรงกับที่จอดรถ (ยกเว้น "All")
- **ห้ามใช้ ADMIN จอง ต้องเพิ่ม Student ใหม่มาเอง**

### หน้าแอดมิน (Admin Panel)
**เฉพาะ Admin เท่านั้น**

1. **จัดการการจอง**
   - ดูรายการจองทั้งหมด
   - ลบการจองที่ไม่เหมาะสม

2. **เพิ่มผู้ใช้ใหม่**
   - Username: รหัสนักศึกษาหรือรหัสพนักงาน
   - Password: รหัสผ่านที่ต้องการ
   - Role: student/teacher

3. **จัดการที่จอดรถ**
   - เพิ่มที่จอดรถใหม่
   - แก้ไขข้อมูลที่จอดรถ
   - ลบที่จอดรถ

   **ข้อมูลที่จอดรถ:**
   - Name: ชื่อที่จอดรถ
   - Max Capacity: จำนวนที่จอดสูงสุด
   - Vehicle Type: Car/Motorcycle/All
   - Allowed Roles: student/teacher/both
   - Image URL: รูปภาพที่จอดรถ

### หน้าเกี่ยวกับเรา (About Us)
- แสดงรายชื่อทีมพัฒนา
- สามารถแก้ไขได้ตามต้องการ

## 🌐 API Endpoints

### Authentication
- `POST /api/login` - ตรวจสอบข้อมูลล็อกอิน

### Parking Lots
- `GET /api/parking-lots` - ดึงข้อมูลที่จอดรถทั้งหมด

### Reservations
- `POST /api/reserve` - ทำการจองที่จอดรถ
- `GET /api/reservations` - ดึงข้อมูลการจองตาม parking_lot_id
- `GET /api/reservations_slot` - ดึงข้อมูลการจองทั้งหมด
- `GET /api/user-reservations/:userId` - ดึงการจองของผู้ใช้
- `POST /api/check-reservations` - ตรวจสอบการจองที่ซ้ำ

### Admin Only
- `GET /api/admin/reservations` - ดึงข้อมูลการจองทั้งหมด
- `DELETE /api/admin/delete-reservation/:id` - ลบการจอง
- `GET /api/admin/parking-lots` - ดึงข้อมูลที่จอดรถ (แอดมิน)
- `POST /api/admin/add-parking-lot` - เพิ่มที่จอดรถใหม่
- `PUT /api/admin/update-parking-lot/:id` - แก้ไขที่จอดรถ
- `DELETE /api/admin/delete-parking-lot/:id` - ลบที่จอดรถ
- `POST /api/admin/add-user` - เพิ่มผู้ใช้ใหม่

## 🚀 Deployment

### Frontend (Vercel)
1. Push โค้ดไปยัง GitHub
2. เชื่อมต่อ Vercel กับ Repository
3. ตั้งค่า Environment Variables:
   - `VITE_API_URL=https://your-railway-backend.railway.app`
4. Deploy

### Backend (Railway)
1. เชื่อมต่อ Railway กับ Repository
2. เลือก server directory
3. ตั้งค่า Environment Variables สำหรับ MySQL
4. Deploy

## 🔧 การแก้ไขปัญหาเบื้องต้น

### ปัญหาการเชื่อมต่อฐานข้อมูล
- ตรวจสอบ MySQL service ว่าทำงานหรือไม่
- ตรวจสอบ credentials ในไฟล์ .env
- ตรวจสอบว่าฐานข้อมูลถูกสร้างแล้ว

### ปัญหา CORS
- ตรวจสอบ URL ใน VITE_API_URL
- ตรวจสอบการตั้งค่า CORS ใน server

### ปัญหาการ Login
- ตรวจสอบว่าใช้ข้อมูลล็อกอินที่ถูกต้อง
- ตรวจสอบ Network tab ใน Developer Tools

### การตรวจสอบโครงสร้างตาราง
```sql
-- ดูโครงสร้างตาราง
DESC table_name;

-- แทนที่ table_name ด้วยชื่อตารางที่ต้องการ เช่น
DESC users;
DESC parking_lots;
DESC reservations;
```

## 📁 โครงสร้างโปรเจกต์
```
Manotus/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/         # หน้าต่างๆ ของแอป
│   │   ├── components/    # คอมโพเนนต์ที่ใช้ซ้ำ
│   │   └── assets/        # รูปภาพและไฟล์สื่อ
│   ├── package.json
│   └── vite.config.js
├── server/                # Backend (Node.js + Express)
│   ├── index.js          # ไฟล์หลักของ server
│   ├── package.json
│   └── .env.example
├── database/              # ไฟล์ฐานข้อมูล
│   ├── schema.sql        # โครงสร้างตาราง
│   └── sample_data.sql   # ข้อมูลตัวอย่าง
└── README.md
```