import express from "express";
import { createTask, getTasks, updateTask } from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.use(protect);
router.route("/").get(asyncHandler(getTasks)).post(asyncHandler(createTask));
router.put("/:id", asyncHandler(updateTask));

export default router;
