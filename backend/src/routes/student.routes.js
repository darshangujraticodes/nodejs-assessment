import { Router } from "express";
import User from "../models/user.model.js";
import { protect } from "../middleware/auth.middleware.js";
import { getStudentProfile } from "../controllers/student.controller.js";

const router = Router();

// GET STUDENT PROFILE
router.get("/profile", protect, getStudentProfile);

export default router;
