import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";

// GET STUDENT PROFILE (SELF ONLY)
export const getStudentProfile = asyncHandler(async (req, res) => {
  console.log("trigger getSudentProfileHandelr !");
  console.log("REQ USER:", req.user);

  const student = await User.findById(req.user._id).select("-password");

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student not found",
    });
  }

  return res.status(200).json({
    success: true,
    student,
  });
});
