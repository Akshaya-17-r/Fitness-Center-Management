# 🏋️ FitHub CRM — Fitness Center Management System

A full-stack CRM built on **Node.js + Express** (backend) and **HTML/CSS/JS** (frontend), designed to manage fitness center operations — membership tracking, class scheduling, trainer allocation, payments, and personalized notifications.

---

## 📁 Project Structure

```
fithub-crm/
├── frontend/
│   └── index.html          ← Complete SPA (all 7 modules)
├── backend/
│   ├── server.js           ← Express app entry point
│   ├── package.json
│   ├── routes/
│   │   ├── members.js      ← CRUD + expiry alerts
│   │   ├── trainers.js     ← CRUD + dynamic allocation
│   │   ├── classes.js      ← CRUD + weekly schedule
│   │   ├── payments.js     ← CRUD + revenue summary
│   │   ├── notifications.js← CRUD + mark read
│   │   └── reports.js      ← Analytics endpoints
│   ├── models/
│   │   ├── Member.js       ← Validation + business logic
│   │   ├── Trainer.js      ← Allocation algorithm
│   │   ├── Payment.js      ← Revenue computation
│   │   └── Class.js        ← Schedule + capacity logic
│   ├── data/               ← JSON flat-file database
│   │   ├── members.json
│   │   ├── trainers.json
│   │   ├── classes.json
│   │   ├── payments.json
│   │   └── notifications.json
│   └── tests/
│       └── api.test.js     ← Full API test suite
└── docs/
    └── README.md
```

---

## 🚀 Quick Start

### 1. Install & Run Backend

```bash
cd backend
npm install
npm start
# Server runs on http://localhost:3000
```

For development with auto-reload:
```bash
npm run dev
```

### 2. Open Frontend

The backend serves the frontend automatically.  
Open → **http://localhost:3000**

Or open `frontend/index.html` directly in any browser (works standalone with mock data).

### 3. Run API Tests

```bash
# Make sure server is running first
node tests/api.test.js
```

---

## 🌐 API Reference

### Base URL: `http://localhost:3000/api`

#### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |
| GET | `/dashboard` | Summary stats |

#### Members
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/members` | List all members |
| GET | `/members?status=Active` | Filter by status |
| GET | `/members?plan=Premium` | Filter by plan |
| GET | `/members?search=rahul` | Search members |
| GET | `/members/:id` | Get single member |
| POST | `/members` | Create member |
| PUT | `/members/:id` | Update member |
| DELETE | `/members/:id` | Delete member |
| GET | `/members/alerts/expiring?days=7` | Expiry alerts |

#### Trainers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/trainers` | List all trainers |
| GET | `/trainers?avail=Full+Time` | Filter by availability |
| GET | `/trainers/:id` | Get single trainer |
| POST | `/trainers` | Create trainer |
| PUT | `/trainers/:id` | Update trainer |
| DELETE | `/trainers/:id` | Delete trainer |

#### Classes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/classes` | List all classes |
| GET | `/classes?day=Monday` | Filter by day |
| GET | `/classes?type=hiit` | Filter by type |
| GET | `/classes/schedule/weekly` | Full weekly schedule |
| POST | `/classes` | Create class |
| PUT | `/classes/:id` | Update class |
| DELETE | `/classes/:id` | Delete class |

#### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/payments` | List all payments |
| GET | `/payments?status=Paid` | Filter by status |
| GET | `/payments/summary/revenue` | Revenue summary |
| POST | `/payments` | Record payment |
| PUT | `/payments/:id` | Update payment |

#### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | List all |
| GET | `/notifications?unread=true` | Unread only |
| POST | `/notifications` | Create notification |
| PUT | `/notifications/:id/read` | Mark one read |
| PUT | `/notifications/mark/all-read` | Mark all read |

#### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports/summary` | Full analytics summary |
| GET | `/reports/revenue-trend` | Monthly revenue data |
| GET | `/reports/growth-trend` | Membership growth data |

---

## 📋 Sample API Requests

### Create a Member
```json
POST /api/members
{
  "name": "Rahul Sharma",
  "email": "rahul@email.com",
  "phone": "+91 9876543210",
  "plan": "Premium",
  "trainer": "Riya Kapoor",
  "join": "2026-04-05"
}
```

### Record a Payment
```json
POST /api/payments
{
  "member": "Rahul Sharma",
  "memberId": "M001",
  "plan": "Premium",
  "amount": 5000,
  "method": "UPI",
  "date": "2026-04-05"
}
```

### Add a Class
```json
POST /api/classes
{
  "name": "Power Yoga",
  "type": "yoga",
  "day": "Wednesday",
  "time": "7:00 AM",
  "trainer": "Riya Kapoor",
  "capacity": 25
}
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JS, Chart.js |
| Backend | Node.js, Express.js |
| Database | JSON flat-files (no setup required) |
| Testing | Built-in Node fetch API |
| Fonts | Bebas Neue, DM Sans (Google Fonts) |
| Charts | Chart.js 4.x |

---

## ✅ Salesforce Skills Demonstrated

| Skill | Implementation |
|-------|---------------|
| **Data Modelling** | Member, Trainer, Class, Payment entities with relationships |
| **Data Validation** | Input validation in models + API layer |
| **Data Security** | Role-based UI, no sensitive data exposure |
| **Automation** | Expiry alert triggers, auto status computation |
| **Synchronous Apex** | Synchronous REST API calls (GET/POST/PUT/DELETE) |
| **Asynchronous Apex** | Background notification generation, deferred billing alerts |
| **Data Management** | CRUD on all 5 entities with filters and search |
| **Salesforce** | CRM architecture, lead/member lifecycle management |

---

## 👨‍💻 Author

FitHub CRM — Built for Fitness Center Management  
Salesforce-based architecture | Node.js backend | Vanilla JS frontend
