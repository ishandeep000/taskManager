import { Task } from "../models/Task.js";
import { Project } from "../models/Project.js";

export const getDashboard = async (req, res) => {
  const userId = req.user._id;
  const now = new Date();

  const [projectsCount, assignedTasks, tasksByStatus] = await Promise.all([
    Project.countDocuments({ "members.user": userId }),
    Task.find({ assignedTo: userId }).populate("project", "name").sort({ dueDate: 1 }),
    Task.aggregate([
      { $match: { assignedTo: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  const summary = {
    totalProjects: projectsCount,
    totalTasks: assignedTasks.length,
    overdueTasks: assignedTasks.filter(
      (task) => task.status !== "done" && new Date(task.dueDate) < now
    ).length,
    tasksByStatus: {
      todo: 0,
      "in-progress": 0,
      done: 0
    }
  };

  tasksByStatus.forEach((item) => {
    summary.tasksByStatus[item._id] = item.count;
  });

  res.json({
    summary,
    assignedTasks
  });
};
