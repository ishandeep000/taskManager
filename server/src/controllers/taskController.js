import mongoose from "mongoose";
import { Task } from "../models/Task.js";
import { getProjectMembership } from "../middleware/projectAccess.js";

const isProjectMember = (project, userId) =>
  project.members.some((member) => member.user._id.toString() === userId.toString());

export const createTask = async (req, res) => {
  const { title, description, projectId, assignedTo, status, priority, dueDate } = req.body;

  if (!title || !projectId || !assignedTo || !dueDate) {
    return res
      .status(400)
      .json({ message: "Title, project, assignee, and due date are required" });
  }

  const access = await getProjectMembership(projectId, req.user._id);
  if (!access?.project) {
    return res.status(404).json({ message: "Project not found" });
  }

  if (access.membership?.role !== "admin") {
    return res.status(403).json({ message: "Only project admins can create tasks" });
  }

  if (!mongoose.Types.ObjectId.isValid(assignedTo) || !isProjectMember(access.project, assignedTo)) {
    return res.status(400).json({ message: "Task assignee must belong to the project" });
  }

  const task = await Task.create({
    title,
    description,
    project: projectId,
    assignedTo,
    createdBy: req.user._id,
    status: ["todo", "in-progress", "done"].includes(status) ? status : "todo",
    priority: ["low", "medium", "high"].includes(priority) ? priority : "medium",
    dueDate
  });

  const populatedTask = await Task.findById(task._id)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  res.status(201).json(populatedTask);
};

export const getTasks = async (req, res) => {
  const query = {};
  const projectId = req.query.projectId;

  if (projectId) {
    const access = await getProjectMembership(projectId, req.user._id);
    if (!access?.project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (!access.membership) {
      return res.status(403).json({ message: "Access denied" });
    }
    query.project = projectId;
  } else {
    query.assignedTo = req.user._id;
  }

  const tasks = await Task.find(query)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .populate("project", "name")
    .sort({ dueDate: 1, createdAt: -1 });

  res.json(tasks);
};

export const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id).populate({
    path: "project",
    populate: { path: "members.user", select: "name email systemRole" }
  });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const project = task.project;
  const membership = project.members.find(
    (member) => member.user._id.toString() === req.user._id.toString()
  );

  if (!membership) {
    return res.status(403).json({ message: "Access denied" });
  }

  const isAdmin = membership.role === "admin";
  const isAssignee = task.assignedTo.toString() === req.user._id.toString();

  if (!isAdmin && !isAssignee) {
    return res.status(403).json({ message: "Only admins or the assignee can update this task" });
  }

  const { title, description, assignedTo, status, priority, dueDate } = req.body;

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status && ["todo", "in-progress", "done"].includes(status)) task.status = status;
  if (priority && ["low", "medium", "high"].includes(priority)) task.priority = priority;
  if (dueDate) task.dueDate = dueDate;

  if (assignedTo !== undefined) {
    if (!isAdmin) {
      return res.status(403).json({ message: "Only admins can reassign tasks" });
    }

    const memberExists = project.members.some(
      (member) => member.user._id.toString() === assignedTo.toString()
    );

    if (!memberExists) {
      return res.status(400).json({ message: "New assignee must belong to the project" });
    }

    task.assignedTo = assignedTo;
  }

  await task.save();

  const updatedTask = await Task.findById(task._id)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .populate("project", "name");

  res.json(updatedTask);
};
