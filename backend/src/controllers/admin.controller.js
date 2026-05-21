import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";

// GET ALL STUDENTS INFO
export const getAllStudents = asyncHandler(async (req, res) => {
  console.log("Admin get all student api hit !");
  const students = await User.find({ role: "student" }).select("-password");

  return res.status(200).json({
    success: true,
    count: students.length,
    students,
  });
});

// GET  STUDENT INFO BY ID
export const getStudentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  console.log("studen id : ", id);

  const student = await User.findById(id).select("-password");

  console.log("student id : ", student);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Student fetched successfully",
    data: student,
  });
});

// CREATE NEW STUDENT
export const addStudent = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });

  if (exists) {
    return res.status(400).json({
      success: false,
      message: "Student already exists",
    });
  }

  const student = await User.create({
    name,
    email,
    password,
    role: "student",
  });

  return res.status(201).json({
    success: true,
    message: "Student created",
    student,
  });
});

// UPDATE STUDENT INFO
export const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const student = await User.findById(id);

  if (!student || student.role !== "student") {
    return res.status(404).json({
      success: false,
      message: "Student not found",
    });
  }

  const updated = await User.findByIdAndUpdate(id, req.body, {
    new: true,
  }).select("-password");

  return res.status(200).json({
    success: true,
    message: "Student updated",
    student: updated,
  });
});

// DELETE STUDENT INFO BY ID
export const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const student = await User.findById(id);

  if (!student || student.role !== "student") {
    return res.status(404).json({
      success: false,
      message: "Student not found",
    });
  }

  await User.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    message: "Student deleted successfully",
  });
});
