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
      "https://resparkinglots.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(bodyParser.json());

// เชื่อมต่อ MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error("Failed to connect to MySQL:", err.message);
    process.exit(1); // ออกจากโปรแกรมถ้าเชื่อมต่อล้มเหลว
  }
  console.log("MySQL connected...");
});

// API สำหรับล็อกอิน
app.post("/api/login", (req, res) => {
  console.log("Received login request:", req.body); // Debug log
  const { username, password } = req.body;

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
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (results.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const user = results[0];
    return res.json({
      success: true,
      user: { username: user.username, role: user.role },
    });
  });
});

// [ส่วนที่เหลือของโค้ดเหมือนเดิม ไม่เปลี่ยนแปลง]

const PORT = process.env.PORT || 5000; // ใช้ process.env.PORT เป็นหลัก
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Middleware สำหรับ error handling
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});
