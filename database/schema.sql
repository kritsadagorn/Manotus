-- Create database
CREATE DATABASE IF NOT EXISTS parking_system;
USE parking_system;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  role ENUM('student', 'teacher') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Parking lots table
CREATE TABLE parking_lots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  max_capacity INT NOT NULL,
  allowed_roles ENUM('student', 'teacher', 'both') NOT NULL,
  vehicle_type ENUM('Car', 'Motorcycle', 'All') NOT NULL,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reservations table
CREATE TABLE reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  parking_lot_id INT NOT NULL,
  slot INT NOT NULL,
  vehicle_type ENUM('Car', 'Motorcycle') NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parking_lot_id) REFERENCES parking_lots(id) ON DELETE CASCADE
);