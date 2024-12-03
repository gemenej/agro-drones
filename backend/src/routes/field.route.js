import express from "express";
import * as fieldController from "../controllers/field.controller.js";
import isAuth from "../middleware/is-auth.js";

const router = express.Router();

router.get("/", isAuth, fieldController.getAllFields);

router.get("/:id", isAuth, fieldController.getFieldById);

router.post("/", isAuth, fieldController.createField);

router.put("/:id", isAuth, fieldController.updateField);

router.put("/:id/operation", isAuth, fieldController.updateFieldOperation);

router.delete("/:id", isAuth, fieldController.deleteField);

export default router;
