CREATE DATABASE parking_db;
USE parking_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'teacher') NOT NULL
);

CREATE TABLE parking_lots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  max_capacity INT NOT NULL,
  allowed_roles ENUM('student', 'teacher', 'both') NOT NULL
);

CREATE TABLE reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  parking_lot_id INT,
  slot INT,
  start_time DATETIME,
  end_time DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (parking_lot_id) REFERENCES parking_lots(id)
);