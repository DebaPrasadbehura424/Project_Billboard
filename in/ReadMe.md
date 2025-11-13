# 🛰️ Billboard Risk Detection Dashboard

## 🧠 Overview

The **Billboard Risk Detection Dashboard** is a full-stack web application that helps detect and manage risky billboards in urban areas.  
Users can upload billboard images, which are analyzed to extract **coordinates**, **risk levels**, and **risk categories**.  
Authorities can review, verify, and approve or reject these reports directly from the dashboard.

This project is designed to improve **public safety** and **urban infrastructure monitoring** using technology and community participation.

---

## ⚙️ Tech Stack

### 🖥️ Frontend

- **React.js** – Component-based UI
- **Tailwind CSS** – Responsive and modern styling
- **Axios** – For secure API requests
- **Framer Motion (optional)** – Smooth animations and transitions

### 🔧 Backend

- **Node.js & Express.js** – RESTful API and server logic
- **MySQL** – Structured data storage
- **Multer** – Image upload handling
- **JWT** – Authentication and security

### ☁️ Cloud / Deployment

- **AWS EC2** – Backend hosting
- **AWS S3** – Image storage
- **Vercel / Netlify** – Frontend deployment

---

## 🧩 Key Features

### 👤 User Features

- 📸 **Upload Billboard Photos** — Users can upload billboard images for scanning.
- 📍 **Automatic Data Extraction** — The system detects coordinates, risk level, and risk category from the uploaded photo.
- 🧾 **View Own Reports** — Users can check the status of their uploaded reports (Pending, Approved, or Rejected).
- 🌍 **Explore Others' Reports** — Users can view verified billboard data and risk maps.

### 🛡️ Authority Features

- 🧾 **Dashboard Access** — See all uploaded billboard reports.
- 🔍 **Verify / Review Reports** — Authorities can approve, reject, or mark reports as pending.
- 🟢 **Update Status** — Manage the verification process and mark each report as:
  - **Pending**
  - **Rejected**
  - **Successful / Approved**
- 🗺️ **Map Visualization (Upcoming)** — Interactive map view showing billboard locations and risk categories.

---

## 📁 Folder Structure

│
├── backend/
│ ├── controllers/ # Logic for upload, verification, and scanning
│ ├── models/ # Database schemas (User, Report, etc.)
│ ├── routes/ # API routes
│ ├── middleware/ # Authentication and file handling
│ └── server.js # Main server file
│
├── frontend/
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Dashboard, Upload, Reports, etc.
│ │ ├── services/ # Axios API functions
│ │ └── App.jsx # Root component
│ └── tailwind.config.js
│
└── README.md

---

## 🌐 Pages / Modules

| Page                           | Description                               |
| ------------------------------ | ----------------------------------------- |
| **Login / Register**           | Secure user and authority login           |
| **Upload Page**                | Upload billboard image for scanning       |
| **Dashboard**                  | Shows uploaded reports and statuses       |
| **Reports Page**               | View other users' verified billboard data |
| **Verification Panel (Admin)** | Approve, reject, or mark reports          |
| **Map View (Future)**          | Interactive map with risk visualization   |

---

## 🧭 Data Flow

1. 🧑 User logs in or registers.
2. 📤 Uploads a billboard photo through the dashboard.
3. 🧠 Backend processes the image, detects:
   - Coordinates
   - Risk Level (High, Medium, Low)
   - Risk Category (Hazard, Structural, Visual, etc.)
4. 📊 Data is saved in MySQL and displayed in the user dashboard.
5. 🛡️ Authority reviews and updates the report status.

---

## 🧱 Database Schema (Simplified)

**Table: Users**
| id | name | email | role | password |

**Table: Reports**
| id | user_id | photo_url | coordinates | risk_level | risk_category | status | created_at |

---

## 🚀 Future Enhancements

- 🗺️ Map view using Leaflet.js or Google Maps API
- 📱 Mobile-friendly responsive design
- 🧠 AI model for automated billboard detection from live camera feed
- 🔔 Real-time notifications for report updates

---

## 🧑‍💻 Developer

**Developed by:** [Your Name]  
**Tech Stack:** React, Node.js, MySQL, Tailwind CSS, AWS  
**Purpose:** Urban billboard risk management through community-driven reports.

---

⭐ _A step toward smarter, safer cities using technology and collaboration._
