import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDb } from "../config/db.js";
import { User } from "../models/User.js";
import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";

dotenv.config();
await connectDb();

try {
  await Promise.all([Task.deleteMany({}), Project.deleteMany({}), User.deleteMany({})]);

  const admin = await User.create({
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    systemRole: "admin"
  });

  const member = await User.create({
    name: "Member User",
    email: "member@example.com",
    password: "password123",
    systemRole: "member"
  });

  const project = await Project.create({
    name: "Launch Team Portal",
    description: "Initial sample project for the assignment demo.",
    createdBy: admin._id,
    members: [
      { user: admin._id, role: "admin" },
      { user: member._id, role: "member" }
    ]
  });

  await Task.insertMany([
    {
      title: "Design dashboard layout",
      description: "Prepare the first dashboard wireframe.",
      project: project._id,
      assignedTo: member._id,
      createdBy: admin._id,
      status: "in-progress",
      priority: "high",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    },
    {
      title: "Prepare launch checklist",
      description: "List release tasks and team owners.",
      project: project._id,
      assignedTo: admin._id,
      createdBy: admin._id,
      status: "todo",
      priority: "medium",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    }
  ]);

  console.log("Seed data created successfully");
} catch (error) {
  console.error("Seed failed", error);
} finally {
  await mongoose.connection.close();
}
