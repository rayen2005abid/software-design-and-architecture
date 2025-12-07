# Medical Appointment Booking System - Complete Implementation Guide

A full-stack 3-layer microservices architecture for managing medical appointments between patients and doctors.

## 📋 Table of Contents
- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Features](#features)
- [Testing Guide](#testing-guide)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)

---

## 🏗️ Architecture Overview

### 3-Layer Architecture

```
┌─────────────────────────────────────────┐
│   Layer 1: User Interface (Frontend)   │
│   React + Axios + React Router          │
│   - Login/Registration                  │
│   - Patient Dashboard                   │
│   - Doctor Dashboard                    │
└─────────────────┬───────────────────────┘
                  │ HTTP/REST API
┌─────────────────▼───────────────────────┐
│   Layer 2: Backend (Microservices)     │
│   Node.js + Express + JWT               │
│   - Authentication Service              │
│   - User Management Service             │
│   - Availability Service                │
│   - Booking Service                     │
│   - Scheduling Service                  │
│   - Notification Service                │
└─────────────────┬───────────────────────┘
                  │ SQL Queries
┌─────────────────▼───────────────────────┐
│   Layer 3: Database (PostgreSQL)       │
│   - Users Table                         │
│   - Availability Table                  │
│   - Appointments Table                  │
│   - Notifications Table                 │
└─────────────────────────────────────────┘
```

---

## 💻 Technology Stack

### Frontend (Layer 1)
- **React** 18.x - UI framework
- **React Router** 6.x - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling (inline classes)

### Backend (Layer 2)
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **pg** - PostgreSQL client

### Database (Layer 3)
- **PostgreSQL** 15 - Relational database
- **Redis** (optional) - Caching layer

### DevOps
- **Docker** & **Docker Compose** - Containerization
- **Git** - Version control

---

## 📁 Project Structure

```
appointment-booking-system/
│
├── frontend/                           # Layer 1: UI
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/                 # Reusable components
│   │   ├── pages/                      # Page components
│   │   │   ├── Login.jsx               # Login/Register page
│   │   │   ├── PatientDashboard.jsx    # Patient interface
│   │   │   └── DoctorDashboard.jsx     # Doctor interface
│   │   ├── services/                   # API services
│   │   │   ├── api.js                  # Axios configuration
│   │   │   └── authService.js          # Auth functions
│   │   ├── App.js                      # Main app component
│   │   └── index.js                    # Entry point
│   ├── package.json
│   └── README.md
│
├── backend/                            # Layer 2: Backend
│   ├── config/
│   │   └── database.js                 # DB connection config
│   ├── middleware/
│   │   └── auth.js                     # JWT middleware
│   ├── routes/
│   │   ├── auth.js                     # Auth endpoints
│   │   ├── users.js                    # User management
│   │   ├── availability.js             # Availability management
│   │   └── appointments.js             # Booking management
│   ├── server.js                       # Main server file
│   ├── .env                            # Environment variables
│   ├── package.json
│   └── README.md
│
├── database/                           # Layer 3: Database
│   ├── init.sql                        # Database schema
│   └── seed.sql                        # Sample data (optional)
│
├── docker-compose.yml                  # Docker orchestration
├── .gitignore
└── README.md                           # This file
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v13 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Docker** (optional, for containerized setup) - [Download](https://www.docker.com/)

Check installations:
```bash
node --version      # Should show v16+
npm --version       # Should show 8+
psql --version      # Should show 13+
docker --version    # Optional
```

---

## 🚀 Installation

### Clone the Repository
```bash
git clone https://github.com/yourusername/appointment-booking-system.git
cd appointment-booking-system
```

---

## 🎯 Running the Application

You can run the application in two ways:

### **Option 1: Manual Setup (Development)**

#### Step 1: Setup Database

```bash
# Start PostgreSQL service
# On Mac:
brew services start postgresql

# On Linux:
sudo systemctl start postgresql

# On Windows: Start from Services

# Create database
psql -U postgres

# In psql terminal, run:
CREATE DATABASE appointment_booking;
\c appointment_booking;

# Copy and paste the contents of database/init.sql
# Or run:
\i /path/to/database/init.sql

# Exit psql
\q
```

#### Step 2: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file (if not exists)
cat > .env << EOF
PORT=8000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=appointment_booking
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EOF

# Start the server
node server.js

# Or for development with auto-reload:
npm install -g nodemon
nodemon server.js
```

**Backend will run on:** `http://localhost:8000`

#### Step 3: Setup Frontend

```bash
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

**Frontend will run on:** `http://localhost:3000`

The browser should automatically open. If not, navigate to `http://localhost:3000`

---

### **Option 2: Docker Setup (Recommended for Production)**

```bash
# From project root directory
docker-compose up --build

# Or run in detached mode (background):
docker-compose up -d

# View logs:
docker-compose logs -f

# Stop the application:
docker-compose down

# Remove all containers and volumes:
docker-compose down -v
```

**Access Points:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

---

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient"  // or "doctor"
}

Response: 201 Created
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

### User Management Endpoints

#### Get All Doctors
```http
GET /api/users/doctors
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 2,
    "name": "Dr. Smith",
    "email": "drsmith@hospital.com",
    "specialty": "Cardiology"
  }
]
```

#### Get User by ID
```http
GET /api/users/:id
Authorization: Bearer {token}

Response: 200 OK
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "patient"
}
```

### Availability Endpoints

#### Publish Availability (Doctor)
```http
POST /api/availability
Authorization: Bearer {token}
Content-Type: application/json

{
  "doctorId": 2,
  "date": "2024-12-15",
  "startTime": "09:00",
  "endTime": "10:00"
}

Response: 201 Created
{
  "id": 1,
  "doctor_id": 2,
  "date": "2024-12-15",
  "start_time": "09:00:00",
  "end_time": "10:00:00",
  "is_booked": false
}
```

#### Search Available Slots
```http
GET /api/availability/search?doctorId=2&date=2024-12-15
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 1,
    "doctor_id": 2,
    "date": "2024-12-15",
    "start_time": "09:00:00",
    "end_time": "10:00:00",
    "is_booked": false
  }
]
```

#### Get Doctor's Availability
```http
GET /api/availability/doctor/:doctorId
Authorization: Bearer {token}

Response: 200 OK
[...]
```

#### Delete Availability
```http
DELETE /api/availability/:id
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Availability deleted"
}
```

### Appointment Endpoints

#### Book Appointment
```http
POST /api/appointments
Authorization: Bearer {token}
Content-Type: application/json

{
  "patientId": 1,
  "doctorId": 2,
  "availabilityId": 1
}

Response: 201 Created
{
  "id": 1,
  "patient_id": 1,
  "doctor_id": 2,
  "availability_id": 1,
  "status": "confirmed"
}
```

#### Get Patient's Appointments
```http
GET /api/appointments/patient/:patientId
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 1,
    "patient_id": 1,
    "doctor_id": 2,
    "doctor_name": "Dr. Smith",
    "date": "2024-12-15",
    "start_time": "09:00:00",
    "end_time": "10:00:00",
    "status": "confirmed"
  }
]
```

#### Get Doctor's Appointments
```http
GET /api/appointments/doctor/:doctorId
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 1,
    "patient_id": 1,
    "patient_name": "John Doe",
    "date": "2024-12-15",
    "start_time": "09:00:00",
    "end_time": "10:00:00",
    "status": "confirmed"
  }
]
```

#### Cancel Appointment
```http
DELETE /api/appointments/:id
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Appointment cancelled"
}
```

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────────────┐
│       users         │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ email (UNIQUE)      │
│ password            │
│ role                │
│ specialty           │
│ created_at          │
└──────┬──────────────┘
       │
       │ 1:N
       │
┌──────▼──────────────┐         ┌─────────────────────┐
│   availability      │         │    appointments     │
├─────────────────────┤         ├─────────────────────┤
│ id (PK)             │◄────────┤ id (PK)             │
│ doctor_id (FK)      │  1:N    │ patient_id (FK)     │
│ date                │         │ doctor_id (FK)      │
│ start_time          │         │ availability_id (FK)│
│ end_time            │         │ status              │
│ is_booked           │         │ created_at          │
│ created_at          │         └─────────────────────┘
└─────────────────────┘
```

### Table Definitions

#### users
| Column     | Type         | Constraints                    | Description              |
|------------|--------------|--------------------------------|--------------------------|
| id         | SERIAL       | PRIMARY KEY                    | User ID                  |
| name       | VARCHAR(255) | NOT NULL                       | Full name                |
| email      | VARCHAR(255) | UNIQUE NOT NULL                | Email address            |
| password   | VARCHAR(255) | NOT NULL                       | Hashed password          |
| role       | VARCHAR(50)  | NOT NULL, CHECK (patient/doctor)| User role               |
| specialty  | VARCHAR(255) | NULL                           | Doctor's specialty       |
| created_at | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP      | Registration date        |

#### availability
| Column     | Type       | Constraints           | Description              |
|------------|------------|-----------------------|--------------------------|
| id         | SERIAL     | PRIMARY KEY           | Slot ID                  |
| doctor_id  | INTEGER    | FK → users(id)        | Doctor reference         |
| date       | DATE       | NOT NULL              | Appointment date         |
| start_time | TIME       | NOT NULL              | Slot start time          |
| end_time   | TIME       | NOT NULL              | Slot end time            |
| is_booked  | BOOLEAN    | DEFAULT false         | Booking status           |
| created_at | TIMESTAMP  | DEFAULT CURRENT_TIMESTAMP | Creation date       |

**Unique Constraint:** `UNIQUE(doctor_id, date, start_time)`

#### appointments
| Column          | Type       | Constraints           | Description              |
|-----------------|------------|-----------------------|--------------------------|
| id              | SERIAL     | PRIMARY KEY           | Appointment ID           |
| patient_id      | INTEGER    | FK → users(id)        | Patient reference        |
| doctor_id       | INTEGER    | FK → users(id)        | Doctor reference         |
| availability_id | INTEGER    | FK → availability(id) | Time slot reference      |
| status          | VARCHAR(50)| DEFAULT 'confirmed'   | Appointment status       |
| created_at      | TIMESTAMP  | DEFAULT CURRENT_TIMESTAMP | Booking date        |

#### notifications
| Column      | Type       | Constraints           | Description              |
|-------------|------------|-----------------------|--------------------------|
| id          | SERIAL     | PRIMARY KEY           | Notification ID          |
| user_id     | INTEGER    | FK → users(id)        | Recipient reference      |
| message     | TEXT       | NOT NULL              | Notification message     |
| type        | VARCHAR(50)| NULL                  | Notification type        |
| read_status | BOOLEAN    | DEFAULT false         | Read status              |
| created_at  | TIMESTAMP  | DEFAULT CURRENT_TIMESTAMP | Creation date       |

---

## ✨ Features

### Functional Requirements Implemented

✅ **FR1 - User Registration & Login**
- Secure registration with password hashing
- JWT-based authentication
- Role-based access control

✅ **FR2 - Role-Based Interface**
- Separate dashboards for patients and doctors
- Route protection based on user role

✅ **FR3 - Search Availability**
- Patients can search doctors by specialty
- View available time slots

✅ **FR4 - Book Appointment**
- One-click booking
- Real-time slot validation
- Past date prevention

✅ **FR5 - View Appointments**
- Patients see their bookings
- Doctors see their schedule

✅ **FR6 - Cancel Appointment**
- Patient-initiated cancellation
- Automatic slot release

✅ **FR7 - Publish Availability**
- Doctors define time slots
- Multiple slots per day support

✅ **FR8 - Modify/Cancel Availability**
- Update or remove slots
- Only unbooked slots can be deleted

✅ **FR9 - View Doctor Schedule**
- Complete schedule overview
- Filter by date

✅ **FR10 - Prevent Double Booking**
- Database-level locking
- Transaction-based booking

### Non-Functional Requirements

✅ **NFR1 - Usability**
- Clean, intuitive interface
- Mobile-responsive design

✅ **NFR2 - Performance**
- Booking completes in < 3 seconds
- Database query optimization

✅ **NFR3 - Reliability**
- Transaction support
- Data integrity constraints

✅ **NFR4 - Security**
- Password hashing (bcrypt)
- JWT authentication
- SQL injection prevention

✅ **NFR5 - Scalability**
- Microservices architecture
- Horizontal scaling ready

✅ **NFR6 - Maintainability**
- Modular code structure
- Clear separation of concerns

✅ **NFR7 - Extensibility**
- Easy to add new features
- Plugin-ready architecture

✅ **NFR8 - Portability**
- Web-based (cross-platform)
- Docker support

---

## 🧪 Testing Guide

### Manual Testing Workflow

#### 1. Create Test Accounts

**Register a Doctor:**
1. Go to `http://localhost:3000`
2. Click "Need an account? Register"
3. Fill in:
   - Name: `Dr. Sarah Johnson`
   - Email: `sarah@test.com`
   - Password: `password123`
   - Role: `Doctor`
4. Click "Register"
5. You'll see "Registration successful"

**Register a Patient:**
1. Click "Need an account? Register"
2. Fill in:
   - Name: `John Patient`
   - Email: `john@test.com`
   - Password: `password123`
   - Role: `Patient`
3. Click "Register"

#### 2. Test Doctor Features

1. **Login as Doctor** (`sarah@test.com`)
2. **Publish Availability:**
   - Select tomorrow's date
   - Start time: `09:00`
   - End time: `10:00`
   - Click "Publish Slot"
3. **Verify:** Slot appears in "My Availability"
4. **Add More Slots:**
   - Create slots for different times
   - Try different dates

#### 3. Test Patient Features

1. **Login as Patient** (`john@test.com`)
2. **Search Doctors:**
   - You'll see Dr. Sarah Johnson listed
   - Click "View Availability"
3. **Book Appointment:**
   - See the available slots
   - Click "Book" on a slot
   - Confirm booking success
4. **View Appointments:**
   - Check "My Appointments" section
   - Verify appointment details
5. **Cancel Appointment:**
   - Click "Cancel" on an appointment
   - Verify it's removed
   - Login as doctor to confirm slot is available again

#### 4. Test Edge Cases

**Double Booking Prevention:**
1. Open two browser windows
2. Login as different patients
3. Try booking the same slot simultaneously
4. Only one should succeed

**Past Date Validation:**
1. Manually try to book a past date via API
2. Should return error

**Availability Constraints:**
1. Login as doctor
2. Try to delete a booked slot
3. Should be prevented

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Frontend Issues

**Issue:** Frontend shows "Network Error"
```
Solution:
1. Check if backend is running: http://localhost:8000
2. Verify CORS is enabled in backend/server.js
3. Check API_BASE_URL in frontend/src/services/api.js
```

**Issue:** "Module not found" errors
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### Backend Issues

**Issue:** "EADDRINUSE: Port 8000 already in use"
```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>

# Or change port in backend/.env
PORT=8001
```

**Issue:** "Connection refused" to database
```
Solution:
1. Check PostgreSQL is running:
   - Mac: brew services list
   - Linux: sudo systemctl status postgresql
   - Windows: Check Services

2. Verify credentials in backend/.env
3. Check database exists:
   psql -U postgres -l
```

**Issue:** "JWT malformed" error
```
Solution:
1. Clear localStorage in browser
2. Register/login again
3. Check JWT_SECRET in backend/.env
```

#### Database Issues

**Issue:** "relation does not exist" errors
```bash
# Drop and recreate database
psql -U postgres
DROP DATABASE appointment_booking;
CREATE DATABASE appointment_booking;
\c appointment_booking;
\i /path/to/database/init.sql
```

**Issue:** Duplicate key violations
```sql
-- Clean up data
DELETE FROM appointments;
DELETE FROM availability;
DELETE FROM users WHERE id > 0;

-- Reset sequences
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE availability_id_seq RESTART WITH 1;
ALTER SEQUENCE appointments_id_seq RESTART WITH 1;
```

#### Docker Issues

**Issue:** "Cannot connect to Docker daemon"
```bash
# Start Docker Desktop (Mac/Windows)
# Or on Linux:
sudo systemctl start docker
```

**Issue:** Containers not starting
```bash
# View logs
docker-compose logs backend
docker-compose logs postgres

# Rebuild
docker-compose down -v
docker-compose up --build
```

**Issue:** Database initialization fails
```bash
# Manually initialize
docker-compose exec postgres psql -U postgres appointment_booking < /docker-entrypoint-initdb.d/init.sql
```

---

## 🔐 Security Best Practices

### In Development
- ✅ Use environment variables for secrets
- ✅ Never commit `.env` files
- ✅ Use strong JWT secrets
- ✅ Hash passwords with bcrypt

### In Production
- 🔒 Use HTTPS only
- 🔒 Set secure HTTP headers
- 🔒 Implement rate limiting
- 🔒 Enable CORS properly
- 🔒 Use prepared statements (already done)
- 🔒 Regular security audits
- 🔒 Keep dependencies updated

```bash
# Check for vulnerabilities
npm audit
npm audit fix
```

---

## 🚀 Future Enhancements

### Phase 1 (High Priority)
- [ ] Email notifications for bookings/cancellations
- [ ] SMS notifications via Twilio
- [ ] Appointment reminders (24h before)
- [ ] Doctor profile pictures
- [ ] Patient medical history

### Phase 2 (Medium Priority)
- [ ] Advanced search filters (specialty, location, rating)
- [ ] Doctor ratings and reviews
- [ ] Calendar view for appointments
- [ ] Export appointments to PDF/iCal
- [ ] Multi-language support

### Phase 3 (AI Features)
- [ ] AI chatbot for conversational booking
- [ ] Smart rescheduling suggestions
- [ ] Predictive availability recommendations
- [ ] Symptom checker (preliminary)

### Phase 4 (Advanced Features)
- [ ] Video consultation integration
- [ ] Payment gateway (Stripe/PayPal)
- [ ] Insurance verification
- [ ] Electronic Health Records (EHR)
- [ ] Prescription management
- [ ] Lab results integration

---

## 📄 License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2024 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

For issues and questions:
- 📧 Email: support@appointmentbooking.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/appointment-booking-system/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/appointment-booking-system/discussions)

---

## 🙏 Acknowledgments

- React documentation
- Express.js community
- PostgreSQL documentation
- All contributors and testers

---

**Made with ❤️ for better healthcare management**

---

## Quick Start Commands

```bash
# Clone repository
git clone https://github.com/yourusername/appointment-booking-system.git
cd appointment-booking-system

# Setup database
psql -U postgres -c "CREATE DATABASE appointment_booking;"
psql -U postgres -d appointment_booking -f database/init.sql

# Start backend
cd backend
npm install
node server.js

# Start frontend (new terminal)
cd frontend
npm install
npm start

# Or use Docker
docker-compose up --build
```

Visit `http://localhost:3000` and start booking! 🎉
