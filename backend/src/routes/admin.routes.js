import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

import {
  getAllStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getStudentById,
} from "../controllers/admin.controller.js";

const router = Router();

router.use(protect);
router.use(authorize("admin"));

router.get("/students", getAllStudents);

router.post("/students", addStudent);

router.get("/student/:id", getStudentById);

router.put("/students/:id", updateStudent);

router.delete("/students/:id", deleteStudent);

export default router;
