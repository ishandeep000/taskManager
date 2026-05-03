import mongoose from "mongoose";
import { Project } from "../models/Project.js";
import { User } from "../models/User.js";
import { Task } from "../models/Task.js";
import { getProjectMembership } from "../middleware/projectAccess.js";

const buildMemberList = (creatorId, members = []) => {
  const unique = new Map();
  unique.set(creatorId.toString(), { user: creatorId, role: "admin" });

  members.forEach((member) => {
    if (member.user) {
      unique.set(member.user.toString(), {
        user: member.user,
        role: member.role === "admin" ? "admin" : "member"
      });
    }
  });

  return Array.from(unique.values());
};

export const getProjects = async (req, res) => {
  const projects = await Project.find({
    "members.user": req.user._id
  })
    .populate("createdBy", "name email")
    .populate("members.user", "name email systemRole")
    .sort({ createdAt: -1 });

  const projectIds = projects.map((project) => project._id);
  const taskCounts = await Task.aggregate([
    { $match: { project: { $in: projectIds } } },
    {
      $group: {
        _id: "$project",
        total: { $sum: 1 },
        done: {
          $sum: {
            $cond: [{ $eq: ["$status", "done"] }, 1, 0]
          }
        }
      }
    }
  ]);

  const countsMap = new Map(taskCounts.map((item) => [item._id.toString(), item]));

  res.json(
    projects.map((project) => {
      const counts = countsMap.get(project._id.toString()) || { total: 0, done: 0 };
      return {
        ...project.toObject(),
        progress: counts.total ? Math.round((counts.done / counts.total) * 100) : 0,
        taskCount: counts.total
      };
    })
  );
};

export const createProject = async (req, res) => {
  const { name, description, members = [] } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ message: "Project name is required" });
  }

  const memberList = buildMemberList(req.user._id, members);
  const memberIds = memberList.map((member) => member.user);

  const validUsers = await User.find({ _id: { $in: memberIds } });
  if (validUsers.length !== memberIds.length) {
    return res.status(400).json({ message: "One or more members are invalid" });
  }

  const project = await Project.create({
    name,
    description,
    createdBy: req.user._id,
    members: memberList
  });

  const populatedProject = await Project.findById(project._id)
    .populate("createdBy", "name email")
    .populate("members.user", "name email systemRole");

  res.status(201).json(populatedProject);
};

export const getProjectDetails = async (req, res) => {
  const access = await getProjectMembership(req.params.id, req.user._id);

  if (!access?.project) {
    return res.status(404).json({ message: "Project not found" });
  }

  if (!access.membership) {
    return res.status(403).json({ message: "Access denied" });
  }

  const tasks = await Task.find({ project: access.project._id })
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .sort({ dueDate: 1, createdAt: -1 });

  res.json({
    ...access.project.toObject(),
    tasks
  });
};

export const addProjectMember = async (req, res) => {
  const { userId, role } = req.body;
  const access = await getProjectMembership(req.params.id, req.user._id);

  if (!access?.project) {
    return res.status(404).json({ message: "Project not found" });
  }

  if (access.membership?.role !== "admin") {
    return res.status(403).json({ message: "Only project admins can add members" });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const exists = access.project.members.some((member) => member.user._id.toString() === userId);
  if (exists) {
    return res.status(400).json({ message: "User is already a project member" });
  }

  access.project.members.push({
    user: user._id,
    role: role === "admin" ? "admin" : "member"
  });
  await access.project.save();

  const updatedProject = await Project.findById(access.project._id)
    .populate("createdBy", "name email")
    .populate("members.user", "name email systemRole");

  res.json(updatedProject);
};
