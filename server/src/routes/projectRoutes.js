import express from "express";
import {
  addProjectMember,
  createProject,
  getProjectDetails,
  getProjects
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.use(protect);
router.route("/").get(asyncHandler(getProjects)).post(asyncHandler(createProject));
router.get("/:id", asyncHandler(getProjectDetails));
router.post("/:id/members", asyncHandler(addProjectMember));

export default router;
