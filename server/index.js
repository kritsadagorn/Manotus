const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const moment = require("moment");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// เชื่อมต่อ MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Jai36086", // ใส่รหัสผ่าน MySQL ของคุณ
  database: "parking_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected...");
});

// API สำหรับล็อกอิน
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  // ✅ ถ้า username และ password เป็น admin ให้ข้ามการเช็คฐานข้อมูล
  if (username === "admin" && password === "admin") {
    return res.json({
      success: true,
      user: { username: "admin", role: "teacher" }, // simulate teacher role
    });
  }

  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (results.length === 0) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const user = results[0];

    if (user.role === "teacher") {
      return res.json({
        success: true,
        user: { username: user.username, role: "teacher" },
      });
    }

    res.json({ success: true, user });
  });
});

// API สำหรับดึงข้อมูลที่จอดรถ
app.get("/api/parking-lots", (req, res) => {
  const query = "SELECT * FROM parking_lots";
  db.query(query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// API สำหรับจองที่จอดรถ
app.post("/api/reserve", (req, res) => {
  const { userId, parkingLotId, slot, vehicleType, startTime, endTime } =
    req.body;
  const formattedStartTime = moment
    .utc(startTime)
    .format("YYYY-MM-DD HH:mm:ss");
  const formattedEndTime = moment.utc(endTime).format("YYYY-MM-DD HH:mm:ss");

  // ตรวจสอบว่ามีการจองในช่วงเวลานี้อยู่แล้วหรือไม่
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
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length > 0) {
        return res.status(400).json({
          message: "This slot is already reserved during this time",
        });
      }

      // ถ้าไม่มีการจอง -> บันทึกการจอง
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
            return res.status(500).json({ message: "Reservation failed" });
          }
          res.status(200).json({ message: "Reservation successful" });
        }
      );
    }
  );
});

// API สำหรับดึงข้อมูลการจอง
app.get("/api/reservations", (req, res) => {
  const { parking_lot_id } = req.query;

  // ลบรายการที่หมดอายุก่อน
  const deleteExpiredQuery = `DELETE FROM reservations WHERE end_time < NOW()`;
  db.query(deleteExpiredQuery, (err, result) => {
    if (err) {
      console.error("Error deleting expired reservations:", err);
      return res
        .status(500)
        .json({ message: "Error deleting expired reservations" });
    }
    console.log("Deleted expired reservations:", result.affectedRows);

    // ดึงรายการที่ยังไม่หมดอายุ
    const fetchQuery = `
      SELECT r.id, u.username, r.slot, r.start_time, r.end_time, r.vehicle_type 
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      WHERE r.parking_lot_id = ?
    `;

    db.query(fetchQuery, [parking_lot_id], (err, results) => {
      if (err) {
        console.error("Error fetching reservations:", err);
        return res.status(500).json({ message: "Server error" });
      }

      console.log("Updated Reservations Data:", results);
      res.json(results);
    });
  });
});

// API สำหรับดึงข้อมูลการจองทั้งหมด
app.get("/api/reservations_slot", (req, res) => {
  const query = "SELECT * FROM reservations";
  db.query(query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// API สำหรับตรวจสอบเวลาออก (ลบการจองที่หมดเวลาแล้ว)
app.get("/api/admin/reservations", (req, res) => {
  // ลบรายการที่หมดอายุออกก่อน
  const deleteExpiredQuery = `DELETE FROM reservations WHERE end_time < NOW()`;
  db.query(deleteExpiredQuery, (err, result) => {
    if (err) {
      console.error("Error deleting expired reservations:", err);
      return res
        .status(500)
        .json({ message: "Error deleting expired reservations" });
    }
    console.log("Deleted expired reservations:", result.affectedRows);

    // ดึงรายการที่ยังไม่หมดอายุ
    const fetchQuery = `
      SELECT 
        r.id, p.name AS lot, p.slot, u.username AS reserved_user, 
        r.start_time, r.end_time, r.vehicle_type
      FROM reservations r
      JOIN parking_lots p ON r.parking_lot_id = p.id
      JOIN users u ON r.user_id = u.id
    `;

    db.query(fetchQuery, (err, results) => {
      if (err) {
        console.error("Error fetching reservations:", err);
        return res.status(500).json({ message: "Error fetching reservations" });
      }

      console.log("Updated Reservations Data:", results);
      res.send(results);
    });
  });
});

// ดึงข้อมูลการจองทั้งหมด
app.get("/api/admin/reservations", (req, res) => {
  const query = `
    SELECT 
      r.id, p.name AS lot, r.slot, u.username AS reserved_user, 
      r.start_time, r.end_time, r.vehicle_type,
      CASE 
        WHEN r.end_time < NOW() THEN 'Expired' 
        ELSE 'Active' 
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

    console.log("Updated Reservations Data:", results); // ✅ ตรวจสอบข้อมูล
    res.send(results);
  });
});

// ลบรายการจอง
app.delete("/api/admin/delete-reservation/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM reservations WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting reservation:", err);
      return res.status(500).json({ message: "Error deleting reservation" });
    }
    res.status(200).json({ message: "Reservation deleted successfully" });
  });
});


// API สำหรับดึงข้อมูล parking_lots ทั้งหมด
app.get("/api/admin/parking-lots", (req, res) => {
  const query = "SELECT * FROM parking_lots";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching parking lots:", err);
      return res.status(500).json({ message: "Error fetching parking lots" });
    }
    res.send(results);
  });
});

// API สำหรับเพิ่ม parking_lots
app.post("/api/admin/add-parking-lot", (req, res) => {
  const { name, max_capacity, allowed_roles, vehicle_type, image_url } = req.body;
  const query = `
    INSERT INTO parking_lots (name, max_capacity, allowed_roles, vehicle_type, image_url) 
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(query, [name, max_capacity, allowed_roles, vehicle_type, image_url], (err, result) => {
    if (err) {
      console.error("Error adding parking lot:", err);
      return res.status(500).json({ message: "Error adding parking lot" });
    }
    res.status(200).json({ message: "Parking lot added successfully" });
  });
});

// API สำหรับแก้ไข parking_lots
app.put("/api/admin/update-parking-lot/:id", (req, res) => {
  const { id } = req.params;
  const { name, max_capacity, allowed_roles, vehicle_type, image_url } = req.body;
  const query = `
    UPDATE parking_lots 
    SET name = ?, max_capacity = ?, allowed_roles = ?, vehicle_type = ?, image_url = ?
    WHERE id = ?
  `;
  db.query(query, [name, max_capacity, allowed_roles, vehicle_type, image_url, id], (err, result) => {
    if (err) {
      console.error("Error updating parking lot:", err);
      return res.status(500).json({ message: "Error updating parking lot" });
    }
    res.status(200).json({ message: "Parking lot updated successfully" });
  });
});

// API สำหรับลบ parking_lots
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
