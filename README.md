# Manotus Project

# FIRST STEP

Make mysql database
Using all of this

# Step 1 Install MySQL in WSL
```
- Install MySQL
sudo apt update && sudo apt upgrade -y
sudo apt install mysql-server -y
- Start MySQL
sudo service mysql start
- CHECK Status : ต้องเป็น ACTIVE สีเขว
sudo service mysql status
- Auto start when open WSL
sudo systemctl enable mysql
```
Create DB & TABLE in MYSQL
```
sudo mysql
```
After can use mysql
```
CREATE DATABASE parking_db;
```
Copy all of this for table
```
USE parking_db;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('student','teacher') NOT NULL,
  PRIMARY KEY (`id`)
) ;

CREATE TABLE `parking_lots` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `max_capacity` int NOT NULL,
  `allowed_roles` enum('student','teacher','both') NOT NULL,
  `vehicle_type` enum('Bike','Car','All') NOT NULL DEFAULT 'All',
  `slot` int NOT NULL DEFAULT '0',
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `reservations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `parking_lot_id` int DEFAULT NULL,
  `slot` int DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `vehicle_type` enum('Bike','Car','All') NOT NULL,
  `status` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `parking_lot_id` (`parking_lot_id`),
  CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`parking_lot_id`) REFERENCES `parking_lots` (`id`)
) ;

SHOW TABLE;
```

```
IF u want to see Structure

DESC table_name;

Change 'table_name' instead of ur table name
```

Create ADMIN USER !! IMPORTANT
```
USE parking_db;
INSERT INTO users (username, password, role) VALUES ('admin','admin','teacher');
```

To run Client type
/client folder
```
cd client
npm install
npm run dev
```

To run Server type
/server folder
```
cd server
npm install
nodemon index.js
```

LOGIN using
```
USERNAME : admin
PASSWORD : admin
```

ADD NEW USER & NEW PARKING LOT IN "Admin Panel"

IN Admin Panel showing 
1. Reservations สถานะการจองปัจจุบัน
2. ADD NEW USER บัญชี
```
Username : ใส่รหัสนักศึกษาก็ได้
Password : อะไรก็ได้ใส่ไปเถอะ
Role : student/admin
```
3. ADD PARKING LOT ที่จอดรถ
```
Name : ชื่อที่จอดรถ
Size(Default 0) : ปริมาณที่สามารถจอดได้ในที่จอดรถนั้น
Type Vehicle : ชนิดของรถที่สามารถจอดได้ Bike, Car, All
Image URL : รูปสถานที่จอดรถ
```
4. รายการ PARKING LOT(ที่จอดรถ) ทั้งหมด ลบได้ ถ้าเขียนอะไรผิดต้องลบสร้างใหม่

# หน้าจองคิว
- เลือกที่จอดรถที่แสดง
- เลือกตำแหน่งที่จะจอง
- เลือกเวลาเข้า-ออก (ไม่สามารถเลือกตรงกับเวลาปัจจุบันได้ ต้องเพิ่มไปอย่างน้อย 1 นาที)
- ไม่สามารถเลือกเวลาเข้ากับออกเดียวกันได้
- เลือกประเภทของรถ (ต้องเลือกให้ตรงตามประเภทของที่จอดรถ ถ้าเลือกไม่ตรงจะจองไม่ได้ ยกเว้นที่จอดรถนั้นเป็น ALL)
- กดจองคิว จะแสดงในรายการที่จอดรถ
** ห้ามใช้ ADMIN จอง ต้องเพิ่ม Student ใหม่มาเอง

# หน้าหลัก 
- แสดงสถานะของที่จองในแต่ละที่จอดรถปัจจุบัน
- แสดงจำนวนที่จอดทั้งหมด / ที่จอดที่ว่าง / จำนวนที่จองแล้ว

# เกี่ยวกับเรา
- แสดงรายชื่อคนทำ เปลี่ยนได้แล้วแต่พี่ๆ

# ความสามารถของ API แต่ละเส้น
 ```
- /api/login → ตรวจสอบข้อมูลล็อกอิน  
- /api/parking-lots → ดึงข้อมูลที่จอดรถทั้งหมด  
- /api/reserve → ทำการจองที่จอดรถ  
- /api/reservations → ดึงข้อมูลการจองของลานจอดที่ระบุ  
- /api/reservations_slot → ดึงข้อมูลการจองทั้งหมด  
- /api/admin/reservations → ดึงข้อมูลการจองทั้งหมด (แอดมิน)  
- /api/admin/delete-reservation/:id → ลบการจองที่ระบุ (แอดมิน)  
- /api/admin/parking-lots → ดึงข้อมูลลานจอดทั้งหมด (แอดมิน)  
- /api/admin/add-parking-lot → เพิ่มลานจอดใหม่ (แอดมิน)  
- /api/admin/update-parking-lot/:id → แก้ไขข้อมูลลานจอดที่ระบุ (แอดมิน)  
- /api/admin/delete-parking-lot/:id → ลบลานจอดที่ระบุ (แอดมิน) 
```
