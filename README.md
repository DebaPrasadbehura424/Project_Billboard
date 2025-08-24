📢 Billboard Monitoring & Violation Reporting System

A full-stack Node.js + React web application that allows citizens to report illegal billboard placements and enables authorities to manage, review, and act on those reports. The platform provides dashboards, role-based access, AI analysis integration, and a heatmap view for spatial insights.

🚀 Features
👤 Citizen Portal

Register & login securely (JWT-based auth).

Submit violation reports (with media uploads).

Track report status (Pending / Approved / Rejected).

Dashboard with personal stats + history.

🏛️ Authority Portal

Secure login with role-based access.

Approve / reject reports.

View pending, approved, rejected reports.

Dashboard with overview + citizen reports.

Access specific citizen reports via ID.

🤖 AI Analysis

Citizens can view AI-generated analysis of their reports.

Integrated through backend aiModelController.js.

🗺️ Heatmap & Map Features

Interactive violation heatmap (Leaflet).

Risk-based color coding (High, Medium, Low).

Filter reports dynamically.

Legend & popups with violation details.

🛠️ Tech Stack
Backend (bill_backend/)

Node.js + Express

MySQL(via Mongoose models)

JWT Authentication

File upload middleware

RESTful API routes

Frontend (bill_frontend/)

React (Vite)

Tailwind CSS (UI styling)

React Router DOM (navigation)

Leaflet.js + React-Leaflet (maps)

📂 Folder Structure

bill_backend/
│── index.js # Entry point (Express app)
│── package.json
│── server/
│ ├── controller/
│ │ └── aiModelController.js
│ ├── database/
│ │ └── TestDb.js
│ ├── middleware/
│ │ ├── authMiddleware.js
│ │ └── uplodeMiddleware.js
│ ├── model/
│ │ ├── AuthModel.js
│ │ └── citizenReports.js
│ └── routes/
│ ├── Authority/
│ │ ├── ApproveRejectReports.js
│ │ ├── AuthorityAthentication.js
│ │ ├── CitizenReportsByIdFromDash.js
│ │ ├── CitizenStatus.js
│ │ ├── GerAlluserForAuthority.js
│ │ ├── GettingAuthorityNameEmail.js
│ │ └── ShowingonlyPendingReports.js
│ └── Citizens/
│ ├── AuthRoutes.js
│ ├── GetAuthRoute.js
│ ├── GettingAiAnalysisDeatils.js
│ ├── citizenReportRoute.js
│ ├── getAuthReporting.js
│ └── uplodeFileAccess.js

bill_frontend/
│── index.html
│── package.json
│── vite.config.js
│── src/
│ ├── App.jsx
│ ├── main.jsx
│ ├── index.css
│ ├── assets/
│ │ ├── billboard-placement.png
│ │ └── roadside-billboard.png
│ ├── component/
│ │ ├── Navbar.jsx, Footer.jsx, Button.jsx, Card.jsx
│ │ ├── AuthorityDashComp/
│ │ │ ├── Card.jsx, CitizenList.jsx, CitizenReport.jsx
│ │ │ ├── ParticularReports.jsx, ShowingPendingReports.jsx
│ │ └── hmComponent/
│ │ ├── MapFilters.jsx, MapLegend.jsx, ViolationMapPage.jsx
│ ├── hooks/
│ │ ├── Authority/ (APIs for authority dashboard)
│ │ └── Citizen/ (APIs for citizen dashboard)
│ ├── middleware/
│ │ ├── AuthController.jsx
│ │ └── RollBasedAccessController.jsx
│ ├── navigation/
│ │ └── Navigation.jsx
│ └── pages/
│ ├── Home.jsx, About.jsx
│ ├── auth/ (Login.jsx, Signup.jsx)
│ ├── DashBoard/ (AuthorityDashboard.jsx, CitizenDashboard.jsx, CitizenReport.jsx)
│ ├── HeatMap/ (HeatMapPage.jsx)
│ └── Report/ (ReportDetails.jsx)

🔗 API Routes
Citizen Routes

POST /citizen/register → Register

POST /citizen/login → Login

POST /citizen/report → Submit new report

GET /citizen/reports → Fetch citizen’s reports

Authority Routes

POST /authority/login → Authority login

GET /authority/reports → Get all reports

PUT /authority/reports/:id → Approve / Reject a report

GET /authority/pending → View pending reports

📊 Dashboards
👤 Citizen Dashboard

Shows total reports

Filters by status (Approved / Rejected / Pending)

Report history with status icons

🏛️ Authority Dashboard

View citizen list & reports

Manage pending reports

Statistics cards (total / approved / rejected / pending)

🚀 Future Enhancements

Real-time notifications (WebSockets).

AI-powered automated violation categorization.

Mobile app integration.

Advanced analytics for authorities.

👨‍💻 Contributors

You (Project Developer)

🗄️ MySQL Schema (suggested)

Adjust names/types as your actual models require. Matches fields used in the frontend hooks/components.

CREATE DATABASE IF NOT EXISTS billboardwatch CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE billboardwatch;

-- Users (citizen & authority)
CREATE TABLE IF NOT EXISTS users (
id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(120) NOT NULL,
email VARCHAR(160) NOT NULL UNIQUE,
password_hash VARCHAR(255) NOT NULL,
number VARCHAR(20),
role ENUM('citizen','authority') NOT NULL DEFAULT 'citizen',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reports submitted by citizens
CREATE TABLE IF NOT EXISTS reports (
report_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
user_id BIGINT UNSIGNED NOT NULL,
title VARCHAR(200) NOT NULL,
category ENUM('Size','Placement','Content','Hazard','Other') DEFAULT 'Other',
location VARCHAR(255),
latitude DECIMAL(10,7),
longitude DECIMAL(10,7),
risk ENUM('low','medium','high') DEFAULT 'low',
status ENUM('pending','approved','rejected','under-review') DEFAULT 'pending',
media_url VARCHAR(255),
notes TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP NULL,
CONSTRAINT fk_reports_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Optional: AI analysis attached to a report
CREATE TABLE IF NOT EXISTS ai_analysis (
id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
report_id BIGINT UNSIGNED NOT NULL,
summary TEXT,
score DECIMAL(5,2),
analysis_json JSON,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_ai_report FOREIGN KEY (report_id) REFERENCES reports(report_id) ON DELETE CASCADE
);

-- Optional: authority actions log
CREATE TABLE IF NOT EXISTS authority_actions (
id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
report_id BIGINT UNSIGNED NOT NULL,
authority_id BIGINT UNSIGNED NOT NULL,
action ENUM('approve','reject','review') NOT NULL,
reason TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (report_id) REFERENCES reports(report_id) ON DELETE CASCADE,
FOREIGN KEY (authority_id) REFERENCES users(id) ON DELETE SET NULL
);

🔐 Environment Variables

Create bill_backend/.env:

# Server

PORT=2000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# MySQL

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=billboardwatch

# Auth

JWT_SECRET=super_secret_jwt_key
JWT_EXPIRES=7d

# Uploads

FILE_UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE_MB=25

🚀 Setup & Run

1. Install & run backend
   cd bill_backend
   npm install

# ensure MySQL is running and schema created (see SQL above)

npm start # or: node index.js / nodemon

# Server should be at http://localhost:2000

2. Install & run frontend
   cd ../bill_frontend
   npm install
   npm run dev

# App at http://localhost:5173

🔌 API Overview (based on your routes)

Base URL: http://localhost:2000/api

Citizens

POST /auth/userAuth-register → register citizen (name, email, password, number, userType=citizen)

POST /auth/userAuth-login → login, returns token, user

GET /auth-user → get logged-in citizen profile (requires Authorization: Bearer <token>)

GET /auth-reporting → list reports belonging to current citizen

POST /citizen-report (from citizenReportRoute.js) → create a report (supports file upload via uplodeFileAccess.js)

GET /ai-analysis/:reportId → AI analysis for one report (GettingAiAnalysisDeatils.js)

Authority

POST /authority-register → create authority account (optional/seed)

POST /authority-login → login as authority, returns token

GET /authority-info → current authority info (JWT required)

GET /authority/getalluser-for-authority → list citizens (for dashboard)

GET /status/citizen-status → array of statuses for global stats

GET /authority/pending → pending reports (ShowingonlyPendingReports.js)

GET /authority/reports/:citizenId → reports by citizen (CitizenReportsByIdFromDash.js)

PUT /authority/reports/:reportId/approve → approve (ApproveRejectReports.js)

PUT /authority/reports/:reportId/reject → reject (ApproveRejectReports.js)

GET /authority/name-email → authority identity (GettingAuthorityNameEmail.js)

Exact handler names come from your file tree; paths above match what the frontend is calling in the code you shared (e.g., /api/auth-reporting, /api/authority-login, /api/ai-analysis/:id, etc.).

🧭 Frontend Routes (React Router)

/ → Home

/about → About

/login, /signup → Auth pages

/citizen-dashboard → Citizen dashboard (protected via UseRollBased + AuthController)

/authority-dash → Authority dashboard (protected)

/pending-citizen-reports → Authority’s pending list

/reports/:citizenId → Authority view of a citizen’s reports

/report-deatils/:reportId → Citizen report detail with AI analysis

/heatmap → Map/heatmap with markers (risk color coding)

🗺️ Map Legend & Risk Colors

High risk → #ef4444

Medium risk → #f59e0b

Low risk → #22c55e

Markers rendered via react-leaflet in ViolationMapPage.jsx with popups (name, risk, status, category).

🔐 Auth Flow (Frontend)

Citizen login: stores token, user, isauth=true in localStorage

Authority login: stores authorityToken and userType="authority" (via roll-based state)

AuthController.jsx exposes authenticated, login(), logout()

RollBasedAccessController.jsx exposes { type, setType } (defaults to "citizen")

🧪 Quick cURL Tests

# Citizen register

curl -X POST http://localhost:2000/api/auth/userAuth-register \
 -H "Content-Type: application/json" \
 -d '{"name":"Test User","email":"test@user.com","password":"pass123","number":"9999999999","userType":"citizen"}'

# Citizen login

curl -X POST http://localhost:2000/api/auth/userAuth-login \
 -H "Content-Type: application/json" \
 -d '{"email":"test@user.com","password":"pass123"}'

# Get my profile (replace TOKEN)

curl http://localhost:2000/api/auth-user \
 -H "Authorization: Bearer TOKEN"

"scripts": { "dev": "nodemon index.js" }
Frontend (bill_frontend/package.json)
npm run dev → Vite dev server

npm run build → production build

npm run preview → preview build

🧭 What each key file does (backend)
server/database/TestDb.js → creates MySQL connection/pool.

server/middleware/authMiddleware.js → verifies JWT, attaches user to req.

server/middleware/uplodeMiddleware.js → Multer config for file uploads.

server/model/AuthModel.js → user queries (MySQL).

server/model/citizenReports.js → report queries (MySQL).

server/controller/aiModelController.js → returns AI analysis payload for a report.

server/routes/Citizens/\* → citizen register/login/profile/report CRUD.

server/routes/Authority/\* → authority auth + moderation flows.
