import express from "express";
import * as droneController from "../controllers/drone.controller.js";
import isAuth from "../middleware/is-auth.js";

const router = express.Router();

router.get("/", isAuth, droneController.getAllDrones);

router.get("/:id", isAuth, droneController.getDroneById);

router.post("/", isAuth, droneController.createDrone);

router.put("/:id", isAuth, droneController.updateDrone);

router.patch("/:id/status", isAuth, droneController.updateDroneStatus);

router.delete("/:id", isAuth, droneController.deleteDrone);

export default router;
