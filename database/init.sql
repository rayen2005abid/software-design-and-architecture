-- database/init.sql
-- Create database (run this in psql first)
-- CREATE DATABASE appointment_booking;
-- \c appointment_booking;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('patient', 'doctor')),
    specialty VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Availability table
CREATE TABLE IF NOT EXISTS availability (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_booked BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_doctor_slot UNIQUE(doctor_id, date, start_time)
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    availability_id INTEGER REFERENCES availability(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    type VARCHAR(50),
    read_status BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample doctors (password: 'password123' hashed)
INSERT INTO users (name, email, password, role, specialty) VALUES
('Dr. John Smith', 'john@hospital.com', '$2a$10$YourHashedPasswordHere', 'doctor', 'Cardiology'),
('Dr. Sarah Johnson', 'sarah@hospital.com', '$2a$10$YourHashedPasswordHere', 'doctor', 'Neurology'),
('Dr. Michael Brown', 'michael@hospital.com', '$2a$10$YourHashedPasswordHere', 'doctor', 'Dermatology')
ON CONFLICT (email) DO NOTHING;

-- Insert sample patient
INSERT INTO users (name, email, password, role) VALUES
('Alice Patient', 'alice@email.com', '$2a$10$YourHashedPasswordHere', 'patient'),
('Bob Patient', 'bob@email.com', '$2a$10$YourHashedPasswordHere', 'patient')
ON CONFLICT (email) DO NOTHING;