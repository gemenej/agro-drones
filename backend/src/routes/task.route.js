import express from "express";
import * as taskController from "../controllers/task.controller.js";
import isAuth from "../middleware/is-auth.js";

const router = express.Router();

router.get("/", isAuth, taskController.getAllTasks);

router.get("/:id", isAuth, taskController.getTaskById);

router.post("/", isAuth, taskController.createTask);

router.put("/:id/status", isAuth, taskController.updateTaskStatus);

router.get("/:id/telemetry", isAuth, taskController.getTaskTelemetry);

router.delete("/:id", isAuth, taskController.deleteTask);

router.put("/:id", isAuth, taskController.updateTask);

export default router;
