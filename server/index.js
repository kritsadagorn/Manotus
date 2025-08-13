require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const moment = require("moment-timezone");

const app = express();
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "https://rmutlreserveparking.vercel.app", // Add your actual Vercel URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(bodyParser.json());

// เชื่อมต่อ MySQL
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQLPORT,
});

db.connect((err) => {
  if (err) {
    console.error("Failed to connect to MySQL:", err);
    process.exit(1);
  }
  console.log("MySQL connected...");
});

// API สำหรับล็อกอิน
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  // Input validation
  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "กรุณากรอก username และ password" 
    });
  }

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ 
      success: false, 
      message: "ข้อมูลไม่ถูกต้อง" 
    });
  }

  // ✅ ถ้า username และ password เป็น admin ให้ข้ามการเช็คฐานข้อมูล
  if (username === "admin" && password === "admin") {
    return res.json({
      success: true,
      user: { username: "admin", role: "teacher" },
    });
  }

  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ 
        success: false, 
        message: "เกิดข้อผิดพลาดของเซิร์ฟเวอร์" 
      });
    }

    if (results.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" 
      });
    }

    const user = results[0];
    return res.json({
      success: true,
      user: { id: user.id, username: user.username, role: user.role },
    });
  });
});

app.get("/api/user/:id", (req, res) => {
  const { id } = req.params;
  
  // Input validation
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "ID ผู้ใช้ไม่ถูกต้อง" });
  }

  const query = "SELECT id, username, email FROM users WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดของเซิร์ฟเวอร์" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }
    res.json(results[0]);
  });
});

// API สำหรับจองที่จอดรถ
app.post("/api/reserve", (req, res) => {
  const { userId, parkingLotId, slot, vehicleType, startTime, endTime } = req.body;

  // Input validation
  if (!userId || !parkingLotId || !slot || !vehicleType || !startTime || !endTime) {
    return res.status(400).json({ 
      message: "กรุณากรอกข้อมูลให้ครบถ้วน" 
    });
  }

  if (isNaN(userId) || isNaN(parkingLotId) || isNaN(slot)) {
    return res.status(400).json({ 
      message: "ข้อมูลตัวเลขไม่ถูกต้อง" 
    });
  }

  if (!['Car', 'Motorcycle'].includes(vehicleType)) {
    return res.status(400).json({ 
      message: "ประเภทยานพาหนะไม่ถูกต้อง" 
    });
  }

  // Validate date format
  if (!moment(startTime).isValid() || !moment(endTime).isValid()) {
    return res.status(400).json({ 
      message: "รูปแบบวันที่และเวลาไม่ถูกต้อง" 
    });
  }

  const formattedStartTime = moment(startTime).format("YYYY-MM-DD HH:mm:ss");
  const formattedEndTime = moment(endTime).format("YYYY-MM-DD HH:mm:ss");

  console.log("Start Time from Frontend:", startTime);
  console.log("End Time from Frontend:", endTime);
  console.log("Formatted Start Time (Saved to DB):", formattedStartTime);
  console.log("Formatted End Time (Saved to DB):", formattedEndTime);

  const now = moment().format("YYYY-MM-DD HH:mm:ss");

  if (formattedStartTime < now || formattedEndTime < now) {
    return res.status(400).json({ message: "ไม่สามารถจองเวลาในอดีตได้" });
  }

  if (formattedStartTime >= formattedEndTime) {
    return res.status(400).json({ message: "เวลาเข้าไม่สามารถเกินเวลาออกได้" });
  }

  // Check for time conflicts
  const checkQuery = `
    SELECT * FROM reservations 
    WHERE parking_lot_id = ? AND slot = ? 
    AND (
      (start_time <= ? AND end_time >= ?) OR
      (start_time >= ? AND start_time <= ?)
    )
  `;

  db.query(
    checkQuery,
    [
      parkingLotId,
      slot,
      formattedEndTime,
      formattedStartTime,
      formattedStartTime,
      formattedEndTime,
    ],
    (err, results) => {
      if (err) {
        console.error("Error checking reservations:", err);
        return res.status(500).json({ message: "เกิดข้อผิดพลาดในการตรวจสอบการจอง" });
      }

      if (results.length > 0) {
        return res.status(400).json({
          message: "ช่องที่เลือกได้มีการจองในเวลานี้แล้ว",
        });
      }

      // Check user role and vehicle type permissions
      const checkRoleQuery = `
        SELECT p.allowed_roles, u.role, p.vehicle_type 
        FROM parking_lots p
        JOIN users u ON u.id = ?
        WHERE p.id = ?
      `;

      db.query(checkRoleQuery, [userId, parkingLotId], (err, roleResults) => {
        if (err) {
          console.error("Error checking user role:", err);
          return res.status(500).json({ message: "เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์" });
        }

        if (roleResults.length === 0) {
          return res.status(400).json({ message: "ไม่พบข้อมูลที่จอดรถหรือผู้ใช้" });
        }

        const {
          allowed_roles,
          role,
          vehicle_type: allowedVehicleType,
        } = roleResults[0];

        console.log("Parking Lot ID:", parkingLotId);
        console.log("User ID:", userId);
        console.log("Allowed Roles:", allowed_roles);
        console.log("User Role:", role);
        console.log("Allowed Vehicle Type:", allowedVehicleType);
        console.log("Selected Vehicle Type:", vehicleType);

        if (allowed_roles !== "both" && allowed_roles !== role) {
          return res.status(403).json({
            message: `บทบาท (${role}) ไม่สามารถจอดที่จุดนี้ได้`,
          });
        }

        if (
          allowedVehicleType !== "All" &&
          allowedVehicleType !== vehicleType
        ) {
          return res.status(403).json({
            message: `ประเภทยานพาหนะของคุณ (${vehicleType}) ไม่สามารถจอดที่จุดนี้ได้`,
          });
        }

        // Insert reservation
        const insertQuery = `
          INSERT INTO reservations (user_id, parking_lot_id, slot, vehicle_type, start_time, end_time) 
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(
          insertQuery,
          [
            userId,
            parkingLotId,
            slot,
            vehicleType,
            formattedStartTime,
            formattedEndTime,
          ],
          (err, result) => {
            if (err) {
              console.error("Reservation failed:", err);
              return res.status(500).json({ 
                message: "จองที่จอดไม่สำเร็จ! กรุณาลองใหม่อีกครั้ง" 
              });
            }
            res.status(200).json({ 
              message: "จองที่จอดสำเร็จ! ✅",
              reservationId: result.insertId
            });
          }
        );
      });
    }
  );
});

// API สำหรับยกเลิกการจอง
app.delete("/api/reserve/:id", (req, res) => {
  const { id } = req.params;
  
  // Input validation
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "ID การจองไม่ถูกต้อง" });
  }

  const query = "DELETE FROM reservations WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting reservation:", err);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการยกเลิกการจอง" });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบการจองที่ต้องการยกเลิก" });
    }
    
    res.json({ success: true, message: "ยกเลิกการจองสำเร็จ" });
  });
});

// API สำหรับเพิ่มผู้ใช้ใหม่ (Admin เท่านั้น)
app.post("/api/admin/add-user", (req, res) => {
  const { username, password, email, role } = req.body;
  
  // Input validation
  if (!username || !password || !email || !role) {
    return res.status(400).json({ 
      message: "กรุณากรอกข้อมูลให้ครบถ้วน" 
    });
  }

  if (!['student', 'teacher'].includes(role)) {
    return res.status(400).json({ 
      message: "บทบาทไม่ถูกต้อง" 
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      message: "รูปแบบอีเมลไม่ถูกต้อง" 
    });
  }

  // Check if username already exists
  const checkQuery = "SELECT id FROM users WHERE username = ? OR email = ?";
  db.query(checkQuery, [username, email], (err, results) => {
    if (err) {
      console.error("Error checking existing user:", err);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการตรวจสอบผู้ใช้" });
    }

    if (results.length > 0) {
      return res.status(400).json({ 
        message: "ชื่อผู้ใช้หรืออีเมลนี้มีอยู่แล้ว" 
      });
    }

    const insertQuery = "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)";
    db.query(insertQuery, [username, password, email, role], (err, result) => {
      if (err) {
        console.error("Error adding user:", err);
        return res.status(500).json({ message: "เกิดข้อผิดพลาดในการเพิ่มผู้ใช้" });
      }
      res.status(200).json({ 
        message: "เพิ่มผู้ใช้สำเร็จ",
        userId: result.insertId
      });
    });
  });
});

app.get("/api/admin/reservations", (req, res) => {
  const query = `
    SELECT 
      r.id, p.name AS lot, r.slot, u.username AS reserved_user, 
      r.start_time, r.end_time, r.vehicle_type, 
      CASE 
        WHEN r.end_time > NOW() THEN 'Active'
        ELSE 'Expired'
      END AS status
    FROM reservations r
    JOIN parking_lots p ON r.parking_lot_id = p.id
    JOIN users u ON r.user_id = u.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching reservations:", err);
      return res.status(500).json({ message: "Error fetching reservations" });
    }

    const reservationsWithBangkokTime = results.map((reservation) => ({
      ...reservation,
      start_time: moment
        .utc(reservation.start_time)
        .tz("Asia/Bangkok")
        .format("YYYY-MM-DD HH:mm:ss"),
      end_time: moment
        .utc(reservation.end_time)
        .tz("Asia/Bangkok")
        .format("YYYY-MM-DD HH:mm:ss"),
    }));

    res.send(reservationsWithBangkokTime);
  });
});

app.delete("/api/admin/delete-reservation/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Reservation ID is required" });
  }

  const query = "DELETE FROM reservations WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting reservation:", err);
      return res.status(500).json({ message: "Error deleting reservation" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Reservation deleted successfully" });
  });
});

app.post("/api/admin/add-parking-lot", (req, res) => {
  const { name, max_capacity, allowed_roles, vehicle_type, image_url } =
    req.body;
  const query = `
    INSERT INTO parking_lots (name, max_capacity, allowed_roles, vehicle_type, image_url) 
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(
    query,
    [name, max_capacity, allowed_roles, vehicle_type, image_url],
    (err, result) => {
      if (err) {
        console.error("Error adding parking lot:", err);
        return res.status(500).json({ message: "Error adding parking lot" });
      }
      res.status(200).json({ message: "Parking lot added successfully" });
    }
  );
});

app.put("/api/admin/update-parking-lot/:id", (req, res) => {
  const { id } = req.params;
  const { name, max_capacity, allowed_roles, vehicle_type, image_url } =
    req.body;
  const query = `
    UPDATE parking_lots 
    SET name = ?, max_capacity = ?, allowed_roles = ?, vehicle_type = ?, image_url = ?
    WHERE id = ?
  `;
  db.query(
    query,
    [name, max_capacity, allowed_roles, vehicle_type, image_url, id],
    (err, result) => {
      if (err) {
        console.error("Error updating parking lot:", err);
        return res.status(500).json({ message: "Error updating parking lot" });
      }
      res.status(200).json({ message: "Parking lot updated successfully" });
    }
  );
});

app.delete("/api/admin/delete-parking-lot/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM parking_lots WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting parking lot:", err);
      return res.status(500).json({ message: "Error deleting parking lot" });
    }
    res.status(200).json({ message: "Parking lot deleted successfully" });
  });
});

// เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
