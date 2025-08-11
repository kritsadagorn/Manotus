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
      "https://your-vercel-app.vercel.app", // Add your actual Vercel URL
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

app.get("/api/user/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT id, username, email FROM users WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ message: "Server error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(results[0]);
  });
});

// API สำหรับดึงข้อมูลที่จอดรถ
app.get("/api/parking-lots", (req, res) => {
  const query = "SELECT * FROM parking_lots";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching parking lots:", err);
      return res.status(500).json({ message: "Server error" });
    }
    console.log("Parking lots fetched:", results);
    res.json(results);
  });
});

// API สำหรับจองที่จอดรถ
app.post("/api/reserve", (req, res) => {
  const { userId, parkingLotId, slot, vehicleType, startTime, endTime } =
    req.body;

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
          message: "ช่องที่เลือกได้มีการจองในเวลานี้แล้ว",
        });
      }

      const checkRoleQuery = `
        SELECT p.allowed_roles, u.role, p.vehicle_type 
        FROM parking_lots p
        JOIN users u ON u.id = ?
        WHERE p.id = ?
      `;

      db.query(checkRoleQuery, [userId, parkingLotId], (err, roleResults) => {
        if (err) {
          console.error("Error checking user role:", err);
          return res.status(500).json({ message: "Server error" });
        }

        if (roleResults.length === 0) {
          return res.status(400).json({ message: "Parking lot not found" });
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
              return res
                .status(500)
                .json({ message: "จองที่จอดไม่สำเร็จ! ❌" });
            }
            res.status(200).json({ message: "จองที่จอดสำเร็จ! ✅" });
          }
        );
      });
    }
  );
});

// API สำหรับยกเลิกการจอง
app.delete("/api/reserve/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM reservations WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting reservation:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.send({ success: true });
  });
});

app.get("/api/reservations", (req, res) => {
  const { parking_lot_id } = req.query;
  let query = `
    SELECT r.id, u.username, r.slot, r.start_time, r.end_time, r.vehicle_type 
    FROM reservations r
    JOIN users u ON r.user_id = u.id
  `;

  const params = [];
  if (parking_lot_id) {
    query += " WHERE r.parking_lot_id = ?";
    params.push(parking_lot_id);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching reservations:", err);
      return res.status(500).json({ message: "Server error" });
    }

    const reservationsWithBangkokTime = results.map((reservation) => {
      return {
        ...reservation,
        start_time: moment
          .utc(reservation.start_time)
          .tz("Asia/Bangkok")
          .format("YYYY-MM-DD HH:mm:ss"),
        end_time: moment
          .utc(reservation.end_time)
          .tz("Asia/Bangkok")
          .format("YYYY-MM-DD HH:mm:ss"),
      };
    });

    console.log("Converted Bangkok Time:", reservationsWithBangkokTime);
    res.json(reservationsWithBangkokTime);
  });
});

app.get("/api/reservations_slot", (req, res) => {
  const query = `
    SELECT 
      r.id, 
      p.name AS lot_name,
      r.slot, 
      u.username, 
      r.start_time, 
      r.end_time, 
      r.vehicle_type, 
      r.status
    FROM reservations r
    LEFT JOIN users u ON r.user_id = u.id
    LEFT JOIN parking_lots p ON r.parking_lot_id = p.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
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

    res.json(reservationsWithBangkokTime);
  });
});

app.get("/api/user-reservations/:userId", (req, res) => {
  const { userId } = req.params;
  const query = `
    SELECT * FROM reservations 
    WHERE user_id = ? AND end_time > NOW()
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error checking user reservations:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(results);
  });
});

app.post("/api/check-reservations", (req, res) => {
  const now = moment().format("YYYY-MM-DD HH:mm:ss");

  db.query(
    "DELETE FROM reservations WHERE end_time <= ?",
    [now],
    (err, results) => {
      if (err) {
        console.error("Error deleting expired reservations:", err);
        return res.status(500).json({ message: "Error checking reservations" });
      }

      console.log(`Deleted ${results.affectedRows} expired reservations.`);
      res.json({ success: true, deleted: results.affectedRows });
    }
  );
});

app.post("/api/admin/add-user", (req, res) => {
  const { username, password, role } = req.body;
  const query = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
  db.query(query, [username, password, role], (err, result) => {
    if (err) {
      console.error("Error adding user:", err);
      return res.status(500).json({ message: "Error adding user" });
    }
    res.status(200).json({ message: "User added successfully" });
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
