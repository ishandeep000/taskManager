# 🚀 Team Task Manager (MERN Stack)

A full-stack **Team Task Management System** built using the MERN stack (MongoDB, Express, React, Node.js). This application helps teams efficiently manage projects, assign tasks, and track progress with **role-based access control**.

---

## 📌 Overview

The **Team Task Manager** is designed to streamline collaboration within teams by providing a centralized platform where:

- Admins can manage projects and team members  
- Members can view, update, and track assigned tasks  
- Everyone can monitor progress through an intuitive dashboard  

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- JavaScript (ES6+)
- CSS / Tailwind (if used)

### Backend
- Node.js
- Express.js

### Database
- MongoDB (Mongoose)

### Authentication
- JWT (JSON Web Tokens)

---

## ✨ Features

### 🔐 Authentication & Authorization
- Secure signup and login system
- JWT-based authentication
- Role-based access control (Admin & Member)

### 📁 Project Management
- Create and manage multiple projects
- Add/remove team members
- Assign roles within projects

### ✅ Task Management
- Create tasks with:
  - Title & description
  - Due dates
  - Priority levels
  - Status tracking (Pending, In Progress, Completed)
- Assign tasks to team members

### 📊 Dashboard
- Overview of all tasks
- Track overdue tasks
- Visual summary of progress

---

## 📂 Project Structure
```team-task-manager/
│
├── client/ # React frontend (Vite)
├── server/ # Express backend
├── models/ # Mongoose schemas
├── routes/ # API routes
├── controllers/ # Business logic
├── middleware/ # Auth & error handling
└── config/ # DB & environment configs
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```
bash
git clone https://github.com/your-username/team-task-manager.git
cd team-task-manager
```
### 2️⃣ Install Dependencies
```
npm install
cd client
npm install
```
### 3️⃣ Run the Application
```
npm run dev
```
### 👤 Demo Accounts
```
| Role   | Email                                           | Password    |
| ------ | ----------------------------------------------- | ----------- |
| Admin  | [admin@example.com](mailto:admin@example.com)   | password123 |
| Member | [member@example.com](mailto:member@example.com) | password123 |
```
## 👨‍💻 Author
Ishan
