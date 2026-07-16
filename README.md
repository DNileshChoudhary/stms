# 🚀 Smart Task Management System (STMS)

A modern **AI-powered Full Stack Task Management Portal** built using **React.js, Spring Boot, and MySQL**. STMS helps users efficiently organize, track, and manage their daily tasks with intelligent scheduling, secure authentication, file management, and an admin dashboard.

---

## 🌐 Live Demo

🔗 **Website:** https://stms-xi.vercel.app/

---

## 📌 Features

* 🔐 JWT Authentication
* 🔑 Google OAuth Login
* 🔒 Forgot Password
* ✅ Create, Update & Delete Tasks
* 📂 Task Categorization
* 📅 Due Date Management
* 🤖 AI Task Analysis (Google Gemini API)
* 🧠 AI Smart Schedule Generation
* 📎 File Upload & Attachments
* 🔔 Due Date & Overdue Notifications
* 📆 Calendar Integration
* 📊 Analytics Dashboard
* 👑 Admin Dashboard
* 🎯 Drag & Drop Task Management
* 🌙 Dark & Light Mode
* 📱 Responsive Design

---

## 🛠️ Tech Stack

### Frontend

* React.js
* HTML5
* CSS3
* JavaScript
* Axios

### Backend

* Spring Boot
* Spring Security
* JWT Authentication
* Google OAuth 2.0
* REST APIs

### Database

* MySQL

### AI Integration

* Google Gemini API

### Other Technologies

* Maven
* Chart.js
* React Calendar
* React Beautiful DnD
* Git & GitHub

---

## 🏗️ System Architecture

```text
User
   │
   ▼
React Frontend
   │
REST APIs
   │
Spring Boot Backend
   ├──────────────► Google Gemini API
   │
   ├──────────────► MySQL Database
   │
   └──────────────► File Storage
```

---

## 📂 Project Structure

```text
STMS/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── uploads/
│
└── README.md
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/DNileshChodhary/STMS.git
```

### Backend

```bash
cd backend
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## 🔧 Environment Variables

Configure the following variables before running the project:

```properties
DB_URL=
DB_USERNAME=
DB_PASSWORD=

JWT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GROQ_API_KEY=
```

---

## 📸 Screenshots

> Add screenshots of:

* Login Page
* Dashboard
* AI Task Analysis
* AI Schedule Generation
* Calendar
* Analytics Dashboard
* Admin Dashboard

---

## 📈 Future Enhancements

* Cloudinary File Storage
* Team Collaboration
* Real-Time Notifications (WebSockets)
* Mobile Application
* AI-Based Productivity Analytics
* Multi-language Support

---

## 👨‍💻 Developed By

**D. Nilesh Choudhary**

* GitHub: https://github.com/DNileshChoudhary

---

## ⭐ If you found this project useful, don't forget to star the repository!
