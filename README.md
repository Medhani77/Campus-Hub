# 🎓 ORYN Campus Hub

A comprehensive student campus management portal — providing a unified digital space for campus bookings, events, services, and community engagement.

![Status](https://img.shields.io/badge/Status-Complete-brightgreen) ![Version](https://img.shields.io/badge/Version-2.0.0-blue) ![License](https://img.shields.io/badge/License-Academic-orange)

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Team](#team)
- [Project Management](#project-management)
- [Sprint Progress](#sprint-progress)
- [License](#license)

---

## 🏫 About the Project

**ORYN Campus Hub** is a fully completed web application developed as part of the **5CS024 — Collaborative Software Development** module. The platform serves as a one-stop digital hub for university students, enabling them to access campus facilities, book resources, stay informed about events, and engage with campus services — all from a single interface.

The system is built with a **Node.js/Express** backend, a **MySQL** relational database, and a **vanilla HTML/CSS/JavaScript** frontend. Both Sprint 1 and Sprint 2 have been successfully delivered, including JWT authentication, secure password hashing, a fully functional booking system, student dashboard, admin panel, and rewards backend.

---

## ✨ Features

| Module | Description | Status |
|---|---|---|
| 🏠 Home Portal | Central landing page with navigation to all campus services | ✅ Complete |
| 🔐 Student Login | Secure JWT-authenticated student login | ✅ Complete |
| 📝 Student Registration | Full student account creation with personal and academic details | ✅ Complete |
| 📅 Facility Booking | Book campus facilities and register for events (full API) | ✅ Complete |
| 🎉 Campus Events | Browse and register for upcoming campus events | ✅ Complete |
| 📚 Digital Library | Access library resources, extend loans, reserve study rooms | ✅ Complete |
| ☕ ORYN Café | View the campus café menu — main dishes, snacks, hot drinks, desserts | ✅ Complete |
| 🏋️ Fitness Centre | Explore gym facilities and fitness class schedules | ✅ Complete |
| 🏛️ Clubs & Societies | Discover and join student clubs and societies | ✅ Complete |
| 🗺️ Campus Map | Interactive campus navigation and building directory | ✅ Complete |
| 🚌 Transit | Campus bus routes and transport schedules | ✅ Complete |
| 🛒 Marketplace | Student peer-to-peer marketplace for buying and selling items | ✅ Complete |
| 🎁 Rewards | Student loyalty rewards and points system (with backend) | ✅ Complete |
| 💼 Careers | Internship listings and career opportunity board | ✅ Complete |
| 💬 Social Feedback | Student feedback and social interaction module | ✅ Complete |
| 🧑‍💼 Student Dashboard | Personalised dashboard showing bookings, rewards, and profile | ✅ Complete |
| 🛡️ Admin Panel | Admin interface for managing students, bookings, and events | ✅ Complete |
| ℹ️ About | Campus information and university overview | ✅ Complete |

---

## 🛠️ Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Server-side JavaScript runtime |
| Express.js | REST API framework and middleware |
| MySQL | Relational database for student and booking data |
| mysql2 | Node.js MySQL client with connection pooling |
| jsonwebtoken | JWT-based authentication |
| bcrypt | Secure password hashing |
| cors | Cross-Origin Resource Sharing middleware |
| dotenv | Environment variable management |

### Frontend

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and UI layout |
| CSS3 | Styling, animations, responsive design |
| Vanilla JavaScript | Client-side interactivity and API calls |
| Google Fonts | Typography (Inter, Plus Jakarta Sans, Fraunces, Playfair Display) |

### Development Tools

| Tool | Purpose |
|---|---|
| VS Code | Primary code editor |
| Postman | API testing and endpoint verification |
| GitHub | Version control and source code management |

---

## 📁 Project Structure

```
oryn-campus-hub/
│
├── frontend/                      # All HTML/CSS/JS frontend pages
│   ├── home.html                  # Main student portal landing page
│   ├── student-login.html         # Student login page
│   ├── Register.html              # Student registration page
│   ├── Booking.html               # Facility booking & event registration
│   ├── Events.html                # Campus events listing
│   ├── LIBRARY.html               # Digital library module
│   ├── Cafe.html                  # Campus café menu
│   ├── fitness.html               # Fitness centre information
│   ├── clubs.html                 # Student clubs & societies
│   ├── map.html                   # Campus map
│   ├── transit.html               # Campus transport
│   ├── Marketplace.html           # Student marketplace
│   ├── REWARD.html                # Loyalty rewards system
│   ├── careers.html               # Careers & internships board
│   ├── social_feedback.html       # Social feedback module
│   ├── dashboard.html             # Student dashboard
│   ├── admin.html                 # Admin panel
│   ├── About.html                 # About the campus
│   └── assets/                    # Images and media files
│
├── backend/                       # Node.js / Express server
│   ├── server.js                  # Main Express application entry point
│   ├── middleware/
│   │   └── auth.js                # JWT verification middleware
│   ├── routes/
│   │   ├── auth.js                # Login / registration routes
│   │   ├── booking.js             # Booking routes (POST/GET)
│   │   ├── rewards.js             # Rewards system routes
│   │   └── admin.js               # Admin panel routes
│   ├── db/
│   │   └── connection.js          # MySQL connection pool setup
│   └── package.json               # Node dependencies
│
├── database/
│   └── schema.sql                 # MySQL database schema
│
└── README.md                      # This file
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **Git**
- A code editor — VS Code recommended

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/oryn-campus-hub.git
cd oryn-campus-hub
```

**2. Install backend dependencies**

```bash
cd backend
npm install
```

The following packages will be installed:

```
express  mysql2  cors  dotenv  jsonwebtoken  bcrypt
```

### Database Setup

**1. Start your MySQL server and log in**

```bash
mysql -u root -p
```

**2. Create the database**

```sql
CREATE DATABASE oryn_campus_hub;
USE oryn_campus_hub;
```

**3. Run the schema file**

```bash
mysql -u root -p oryn_campus_hub < database/schema.sql
```

**4. Database schema overview**

```sql
-- Students table
CREATE TABLE students (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  fullName    VARCHAR(100) NOT NULL,
  email       VARCHAR(100) NOT NULL UNIQUE,
  mobile      VARCHAR(20),
  nic         VARCHAR(20),
  address     TEXT,
  indexNo     VARCHAR(30) NOT NULL UNIQUE,
  faculty     VARCHAR(100),
  programme   VARCHAR(100),
  year        VARCHAR(10),
  username    VARCHAR(50) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,          -- bcrypt hashed
  dob         DATE,
  gender      VARCHAR(20),
  createdAt   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  studentId   INT NOT NULL,
  facilityId  INT NOT NULL,
  date        DATE NOT NULL,
  time        VARCHAR(20) NOT NULL,
  status      ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
  createdAt   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (studentId) REFERENCES students(id)
);

-- Rewards table
CREATE TABLE rewards (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  studentId   INT NOT NULL UNIQUE,
  points      INT DEFAULT 0,
  tier        ENUM('Bronze','Silver','Gold','Platinum') DEFAULT 'Bronze',
  updatedAt   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (studentId) REFERENCES students(id)
);
```

**5. Configure environment variables**

Create a `.env` file in the `backend/` directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=oryn_campus_hub
PORT=3000
JWT_SECRET=your_jwt_secret_key
```

> ⚠️ **Important:** Never commit your `.env` file. It is listed in `.gitignore`.

### Running the App

**1. Start the backend server**

```bash
cd backend
node server.js
```

You should see:

```
Server running on http://localhost:3000
Connected to MySQL database: oryn_campus_hub
```

**2. Open the frontend**

Open any HTML file directly in your browser, or use the **Live Server** extension in VS Code:

```
frontend/home.html → Open with Live Server
```

The frontend connects to the backend at `http://localhost:3000`.

---

## 🔌 API Endpoints

**Base URL:** `http://localhost:3000`

### Auth Routes

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/register` | Register a new student | ❌ |
| POST | `/login` | Student login — returns JWT token | ❌ |

### Booking Routes

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/booking` | Create a facility booking | ✅ JWT |
| GET | `/bookings/:id` | Get all bookings for a student | ✅ JWT |
| PUT | `/booking/:id/cancel` | Cancel a booking | ✅ JWT |

### Rewards Routes

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/rewards/:id` | Get rewards points and tier for a student | ✅ JWT |
| POST | `/rewards/:id/add` | Add points to a student's account | ✅ JWT |

### Admin Routes

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/admin/students` | List all registered students | ✅ Admin JWT |
| GET | `/admin/bookings` | List all bookings | ✅ Admin JWT |
| DELETE | `/admin/student/:id` | Remove a student | ✅ Admin JWT |

---

### Example — Login Student

**Request:**
```http
POST /login
Content-Type: application/json

{
  "username": "medhani21",
  "password": "securepassword"
}
```

**Response (Success):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "student": {
    "id": 1,
    "fullName": "Medhani Niwoda",
    "indexNo": "CS2021001",
    "faculty": "Computing"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

---

### Example — Create Booking

**Request:**
```http
POST /booking
Authorization: Bearer <token>
Content-Type: application/json

{
  "studentId": 1,
  "facilityId": 3,
  "date": "2024-05-20",
  "time": "10:00"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Booking confirmed",
  "bookingId": 42
}
```

---

## 👥 Team

| Name | Role |
|---|---|
| Medhani Niwoda | 📋 Project Manager |
| Pulindu Balasooriya | ⚙️ Backend Developer |
| Saduni Priyalakshi | 🎨 Frontend Developer |
| Dewmi Umegha | 🧪 QA Tester |
| Udara Nethmi | 🗄️ Database Administrator |
| Ginuka Weragoda | 📊 Business Analyst |

---

## 📊 Project Management

This project follows an **Agile Sprint** methodology across two completed sprints.

| Tool | Usage |
|---|---|
| Jira | Sprint planning, issue tracking, velocity |
| Trello | Kanban task board |
| Basecamp | Team communication & file sharing |
| GitHub | Version control, pull requests, issues |

### Branching Strategy

```
main        ← stable, release-ready code
├── dev     ← integration branch
│   ├── feature/jwt-authentication
│   ├── feature/booking-api
│   ├── feature/student-dashboard
│   ├── feature/admin-panel
│   ├── feature/rewards-backend
│   └── fix/password-hashing
```

All feature work is done on feature branches. PRs must be reviewed before merging into `dev`. `main` is only updated for releases and demos.

---

## 📅 Sprint Progress

### Sprint 1 — ✅ Complete

| Feature | Status |
|---|---|
| Student Registration (Frontend) | ✅ Done |
| Student Registration (Backend API) | ✅ Done |
| MySQL Database Setup | ✅ Done |
| Student Login Page (UI) | ✅ Done |
| Facility Booking Page (UI) | ✅ Done |
| Campus Events Page (UI) | ✅ Done |
| Home Portal | ✅ Done |
| Café Menu Page | ✅ Done |
| Library Page | ✅ Done |
| Clubs & Societies Page | ✅ Done |

### Sprint 2 — ✅ Complete

| Feature | Status |
|---|---|
| JWT Authentication | ✅ Done |
| Password Hashing (bcrypt) | ✅ Done |
| Booking API (POST / GET / Cancel) | ✅ Done |
| Student Dashboard | ✅ Done |
| Admin Panel | ✅ Done |
| Rewards System Backend | ✅ Done |
| Auth Middleware (route protection) | ✅ Done |
| Full API Integration (Frontend ↔ Backend) | ✅ Done |
| End-to-End Testing (QA) | ✅ Done |

---

## 📄 License

This project was developed for academic purposes as part of **5CS024 — Collaborative Software Development**.

---

> ORYN Campus Hub · Built with ❤️ by **Medhani · Pulindu · Saduni · Dewmi · Udara · Ginuka** · 5CS024 · Final Release
