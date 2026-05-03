import mongoose from "mongoose";
import { Project } from "../models/Project.js";

export const getProjectMembership = async (projectId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return null;
  }

  const project = await Project.findById(projectId).populate("members.user", "name email systemRole");

  if (!project) {
    return null;
  }

  const membership = project.members.find(
    (member) => member.user._id.toString() === userId.toString()
  );

  return {
    project,
    membership
  };
};
