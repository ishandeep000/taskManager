# Team Task Manager

Full-stack MERN app for managing projects, assigning tasks, and tracking progress with role-based access control for Admin and Member users.

## Stack

- MongoDB + Mongoose
- Express + Node.js
- React + Vite

## Features

- Signup and login with JWT authentication
- Project creation and team management
- Task creation, assignment, due dates, priority, and status tracking
- Dashboard with task summary and overdue tracking
- Role-based access control at both app and project level

## Run locally

1. Create `server/.env` using `server/.env.example`
2. Install dependencies:
   - `npm install --workspaces`
3. Start MongoDB locally or use MongoDB Atlas
4. Run the app:
   - `npm run dev`

Client runs on `http://localhost:5173`
Server runs on `http://localhost:5001`

## Demo seed

Run `npm run seed` after configuring the server env to create demo users and sample data.

Demo accounts after seed:

- Admin: `admin@example.com` / `password123`
- Member: `member@example.com` / `password123`
