-- Insert sample users
INSERT INTO users (username, password, email, role) VALUES
('john_student', 'password123', 'john@student.edu', 'student'),
('mary_teacher', 'password123', 'mary@school.edu', 'teacher'),
('bob_student', 'password123', 'bob@student.edu', 'student'),
('alice_teacher', 'password123', 'alice@school.edu', 'teacher'),
('demo_user', 'demo123', 'demo@example.com', 'student');

-- Insert sample parking lots
INSERT INTO parking_lots (name, max_capacity, allowed_roles, vehicle_type, image_url) VALUES
('Building A - Student Parking', 50, 'student', 'All', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500'),
('Building B - Faculty Parking', 30, 'teacher', 'Car', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'),
('Main Gate - Motorcycle Zone', 100, 'both', 'Motorcycle', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500'),
('Library Parking', 25, 'both', 'All', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500'),
('Sports Complex Parking', 40, 'student', 'All', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500');

-- Insert sample reservations (some current, some future)
INSERT INTO reservations (user_id, parking_lot_id, slot, vehicle_type, start_time, end_time) VALUES
(1, 1, 15, 'Car', '2024-01-20 08:00:00', '2024-01-20 17:00:00'),
(2, 2, 5, 'Car', '2024-01-20 09:00:00', '2024-01-20 16:00:00'),
(3, 3, 25, 'Motorcycle', '2024-01-20 10:00:00', '2024-01-20 15:00:00'),
(4, 4, 10, 'Car', '2024-01-21 08:30:00', '2024-01-21 17:30:00'),
(5, 5, 20, 'Motorcycle', '2024-01-21 07:00:00', '2024-01-21 18:00:00');