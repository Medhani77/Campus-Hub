# 🎓 Live Campus Hub — CINEC Campus

<div align="center">

![Live Campus Hub Banner](https://img.shields.io/badge/CINEC-Campus%20Hub-f59e0b?style=for-the-badge&logo=react&logoColor=white)

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![License](https://img.shields.io/badge/License-Academic%20Use-blue?style=for-the-badge)](./LICENSE)
[![Module](https://img.shields.io/badge/Module-5CS024-8b5cf6?style=for-the-badge)](.)
[![Status](https://img.shields.io/badge/Status-In%20Development-10b981?style=for-the-badge)](.)

**A centralised campus information and engagement platform for CINEC students.**  
*Check in. Earn points. Stay connected. Never miss a thing.*

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Database](#-database-setup) · [Team](#-team)

</div>

---

## 📖 About The Project

**Live Campus Hub** is a social campus application built for **CINEC Campus, Malabe** as part of the **5CS024 Collaborative Development** module. The app serves as a single, reliable source for everything happening on campus — keeping students informed, connected, and rewarded for engaging with university life.

> *"Right now, key campus information is scattered. Gym times, events, bus schedules — students have to check multiple places. Live Campus Hub solves this."*

### 🎯 The Problem We're Solving

| Before | After |
|--------|-------|
| Check multiple apps for gym status | One dashboard shows everything live |
| Miss events because of no central feed | SU events aggregated in one place |
| Not sure when the next bus leaves | Real-time transit schedule at a glance |
| No reward for engaging with campus | Check-in system awards points for visits |
| Hard to find clubs and join them | Club Hub with one-click join |

---

## ✨ Features

### 🔴 Core Features (Must Have)
- **📍 Check-in & Rewards System** — Students check in at campus locations (Library, Gym, SU) and earn points redeemable for rewards
- **🏋️ Facility & Event Updates** — Live gym status (open/closed, pool availability), Students' Union event feed
- **🚌 Transit & Navigation** — Real-time bus schedules between Malabe, Kaduwela, Negombo, Rajagiriya and Colombo
- **👥 Campus Clubs Connector** — Discover and join campus clubs (Coding Club, Cyber Wolves, IEEE, Rotaract, E-Sports)
- **🔐 User Authentication** — Secure student registration and login with password hashing

### 🟡 Stretch Goals (Nice to Have)
- **📚 Study Support Links** — Integration with library resources and Skills for Learning
- **🤝 Peer Support Portal** — Student Ambassador space for informal guidance
- **💬 Social Feed** — Campus community posts, tips, and event announcements

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React.js | UI components, routing, state management |
| **Styling** | CSS3 / Tailwind CSS | Responsive dark-theme design |
| **Backend** | Node.js / Express | REST API, business logic |
| **Database** | MySQL | Student data, check-ins, rewards, events |
| **Auth** | JWT + bcrypt | Secure login, password hashing |
| **Version Control** | Git + GitHub | Collaboration, branching strategy |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

```bash
node --version    # v18.0.0 or higher
npm --version     # v9.0.0 or higher
mysql --version   # v8.0 or higher
git --version     # any recent version
```

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/live-campus-hub.git
cd live-campus-hub
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `/backend` folder:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=live_campus_hub

# JWT Secret
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# Server
PORT=5000
```

### 4. Set Up the Database

```bash
# Log in to MySQL
mysql -u root -p

# Run the database script
source /path/to/cinec_campus_hub_database.sql
```

Or import via **MySQL Workbench** or **phpMyAdmin** — open `cinec_campus_hub_database.sql` and execute.

### 5. Start the Application

```bash
# Start backend server (from /backend folder)
npm run dev

# Start React frontend (from /frontend folder — new terminal)
npm start
```

Open your browser and go to:
```
http://localhost:3000
```

---

## 🗄 Database Setup

The database contains **13 tables** covering all core features:

```
students           → Student profiles, points balance
locations          → Campus check-in spots with GPS coordinates
check_ins          → Check-in history and validation records
gym_facility       → Live gym status and availability
campus_events      → Students' Union and campus events
transit_routes     → Bus schedules and delay tracking
clubs              → Campus club directory
club_memberships   → Student–club join records
library_status     → Floor-by-floor library occupancy
rewards            → Reward catalogue (tea, meals, merch)
redemptions        → Reward redemption history
social_posts       → Campus social feed posts
notifications      → Student alerts and push messages
```

### Sample Data Included

The SQL script includes realistic sample data:
- **12 students** with CINEC student IDs and local city data
- **10 campus locations** with real Malabe GPS coordinates
- **8 campus events** including Tech Fest, Hackathon, Avurudu celebrations
- **8 bus routes** — Malabe → Colombo Fort, Kaduwela, Rajagiriya, Negombo
- **10 clubs** — Coding Club, Cyber Wolves, IEEE, Rotaract, E-Sports and more
- **10 rewards** — Free tea, Rice & curry voucher, CINEC cap/T-shirt, USB drive

---

## 📁 Project Structure

```
live-campus-hub/
│
├── frontend/                  # React application
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Dashboard/
│   │   │   ├── CheckIn/
│   │   │   ├── Events/
│   │   │   ├── Transit/
│   │   │   ├── Clubs/
│   │   │   └── Rewards/
│   │   ├── pages/             # Page-level components
│   │   ├── services/          # API call functions
│   │   ├── context/           # React context (auth, user)
│   │   └── App.js
│   └── package.json
│
├── backend/                   # Node.js + Express API
│   ├── controllers/           # Route handler logic
│   ├── models/                # Database query functions
│   ├── routes/                # API route definitions
│   ├── middleware/            # Auth middleware, validators
│   ├── config/                # DB connection config
│   └── server.js
│
├── database/
│   └── cinec_campus_hub_database.sql
│
├── docs/
│   ├── class_diagram.png
│   ├── database_schema.png
│   └── agile_flowchart.png
│
└── README.md
```

---

## 🔌 API Endpoints (Key Routes)

```
POST   /api/auth/register        → Register new student
POST   /api/auth/login           → Student login

GET    /api/students/:id         → Get student profile
PATCH  /api/students/:id/points  → Update points balance

POST   /api/checkins             → Submit a check-in
GET    /api/checkins/:studentId  → Get student check-in history

GET    /api/events               → Get all campus events
GET    /api/gym                  → Get live gym status
GET    /api/transit              → Get bus schedules

GET    /api/clubs                → Get all clubs
POST   /api/clubs/:id/join       → Join a club

GET    /api/rewards              → Get rewards catalogue
POST   /api/rewards/redeem       → Redeem a reward
```

---

## 🔒 Security

- Passwords stored using **bcrypt** hashing (never plain text)
- API routes protected with **JWT authentication middleware**
- Input validation and sanitisation on all endpoints
- GPS location validated server-side before awarding check-in points
- Environment variables used for all sensitive credentials (never hardcoded)

This project follows **BCS (British Computing Society)** professional guidelines for data handling, ethics, and documentation as required by module **5CS024**.

---

## 🏃 Agile Development — Sprint Overview

| Sprint | Focus | Duration |
|--------|-------|----------|
| **Sprint 1** | Project setup, DB schema, User authentication | Week 1–2 |
| **Sprint 2** | Check-in logic, Points & Rewards system | Week 3–4 |
| **Sprint 3** | Gym, Events & Transit live data feeds | Week 5–6 |
| **Sprint 4** | Clubs Hub, Social Feed, Notifications | Week 7–8 |
| **Sprint 5** | Testing, Security audit, Deployment | Week 9–10 |

---

## 👥 Team

| Name | Student ID | Role |
|------|-----------|------|
| **Medhani Niwoda** | CINEC-2024-001 | 🧭 Project Manager |
| **Pulindu Balasooriya** | CINEC-2024-002 | 💻 Developer |
| **Saduni Priyalakshi** | CINEC-2024-003 | 💻 Developer |
| **Dewmi Umegha** | CINEC-2024-004 | 🧪 QA Tester |
| **Udara Nethmi** | CINEC-2024-006 | 🗄️ Database Engineer |
| **Ginuka Weragoda** | CINEC-2024-005 | 📋 Business Analyst |

---

## 📚 Module Information

| | |
|--|--|
| **Module** | 5CS024 — Collaborative Development |
| **Institution** | CINEC Campus, Malabe, Sri Lanka |
| **Academic Year** | 2025 / 2026 |
| **Project** | Live Campus Hub |

---

## 📄 License

This project is developed for **academic purposes** as part of module **5CS024** at CINEC Campus.  
All rights reserved © 2026 — Live Campus Hub Team.

---

<div align="center">

Built with ❤️ by the **Live Campus Hub Team** · CINEC Campus, Malabe 🇱🇰

</div>
