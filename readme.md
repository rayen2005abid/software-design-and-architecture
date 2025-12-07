Medical Appointment Booking System
Project Structure
appointment-booking-system/
├── frontend/                 # React Frontend (Layer 1)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── PatientDashboard.jsx
│   │   │   └── DoctorDashboard.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── authService.js
│   │   └── App.js
│   └── package.json
├── backend/                  # Node.js Backend (Layer 2)
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── availability.js
│   │   └── appointments.js
│   ├── server.js
│   ├── .env
│   └── package.json
├── database/                 # PostgreSQL Database (Layer 3)
│   └── init.sql
└── docker-compose.yml

Installation & Setup
Prerequisites

Node.js (v16+)
PostgreSQL (v13+)
npm or yarn


Option 1: Manual Setup (Without Docker)
Step 1: Setup Database
bash# Install PostgreSQL, then create database
psql -U postgres

# In psql terminal:
CREATE DATABASE appointment_booking;
\c appointment_booking;

# Run the init.sql script
\i /path/to/database/init.sql

# Or copy-paste the SQL from init.sql
Step 2: Setup Backend
bashcd backend
npm install

# Create .env file (already provided, just verify values)
# Start the server
node server.js
# Or for development with auto-reload:
npm install -g nodemon
nodemon server.js
Backend will run on http://localhost:8000
Step 3: Setup Frontend
bashcd frontend

# Install dependencies
npm install

# Start the development server
npm start
Frontend will run on http://localhost:3000

Option 2: Docker Setup (Recommended)
Step 1: Build and Run
bash# From project root directory
docker-compose up --build

# Or run in detached mode:
docker-compose up -d
Step 2: Access the Application

Frontend: http://localhost:3000
Backend API: http://localhost:8000
Database: localhost:5432

Stop the Application
bashdocker-compose down

# To remove volumes as well:
docker-compose down -v

Testing the Application
1. Register Users

Go to http://localhost:3000
Click "Need an account? Register"
Create a Doctor account:

Name: Dr. Smith
Email: drsmith@test.com
Password: password123
Role: Doctor


Create a Patient account:

Name: John Patient
Email: patient@test.com
Password: password123
Role: Patient



2. Doctor Workflow

Login as Doctor
Publish Availability:

Select future dates
Add time slots (e.g., 09:00 - 10:00)
Click "Publish Slot"



3. Patient Workflow

Login as Patient
Search Doctors:

View available doctors
Click "View Availability"


Book Appointment:

Select a time slot
Click "Book"


View & Cancel:

See your appointments in "My Appointments"
Cancel if needed




API Endpoints
Authentication

POST /api/auth/register - Register new user
POST /api/auth/login - Login user

Users

GET /api/users/doctors - Get all doctors
GET /api/users/:id - Get user by ID

Availability

POST /api/availability - Publish availability (Doctor)
GET /api/availability/search?doctorId={id} - Search available slots
GET /api/availability/doctor/:doctorId - Get doctor's availability
DELETE /api/availability/:id - Delete availability slot

Appointments

POST /api/appointments - Book appointment
GET /api/appointments/patient/:patientId - Get patient's appointments
GET /api/appointments/doctor/:doctorId - Get doctor's schedule
DELETE /api/appointments/:id - Cancel appointment


Database Schema
users
ColumnTypeDescriptionidSERIALPrimary keynameVARCHAR(255)User's full nameemailVARCHAR(255)Unique emailpasswordVARCHAR(255)Hashed passwordroleVARCHAR(50)'patient' or 'doctor'specialtyVARCHAR(255)Doctor's specialty
availability
ColumnTypeDescriptionidSERIALPrimary keydoctor_idINTEGERForeign key to usersdateDATEAppointment datestart_timeTIMEStart timeend_timeTIMEEnd timeis_bookedBOOLEANBooking status
appointments
ColumnTypeDescriptionidSERIALPrimary keypatient_idINTEGERForeign key to usersdoctor_idINTEGERForeign key to usersavailability_idINTEGERForeign key to availabilitystatusVARCHAR(50)'confirmed', 'cancelled'

Features Implemented
✅ Layer 1 (Frontend)

Login/Registration interface
Role-based routing (Patient/Doctor)
Patient: Search doctors, book appointments, view/cancel bookings
Doctor: Publish availability, view schedule

✅ Layer 2 (Backend)

Authentication with JWT
User management
Availability management
Appointment booking with transaction handling
Prevents double booking

✅ Layer 3 (Database)

PostgreSQL with proper relationships
Constraints to prevent data inconsistency
Transaction support for atomic operations


Troubleshooting
Frontend can't connect to backend

Check if backend is running on port 8000
Verify API_BASE_URL in frontend/src/services/api.js

Database connection error

Verify PostgreSQL is running
Check credentials in backend/.env
Ensure database appointment_booking exists

Port already in use

Change ports in docker-compose.yml or .env files
Kill processes using the port:

bash  # Find process
  lsof -i :3000
  # Kill it
  kill -9 <PID>

Next Steps / Enhancements

Add email notifications
Implement scheduling service with rescheduling logic
Add AI assistant for conversational booking
Add appointment reminders
Implement payment integration
Add video consultation feature
Add patient medical history


License
MIT License