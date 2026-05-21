import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// ========================
// REGISTER
// ========================
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  console.log("Register API HIT !");

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "User already exists",
    });
  }

  let user;

  try {
    user = await User.create({
      name,
      email,
      password,
    });
  } catch (err) {
    console.log("CREATE ERROR:", err.message);
    return res.status(500).json({
      success: false,
      message: "User creation failed",
    });
  }

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// ========================
// LOGIN
// ========================
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log("Login API HIT !");

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  let user;
  try {
    user = await User.findOne({ email });
  } catch (err) {
    console.log("LOGIN ERROR:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  // compare password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  // ACCESS TOKEN (short-lived)
  const accessToken = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  // REFRESH TOKEN (long-lived)
  const refreshToken = jwt.sign(
    {
      id: user._id,
    },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  res.status(200).json({
    success: true,
    message: "Login successful",
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// ========================
// REFRESH TOKEN
// ========================
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  console.log("Refresh Token API HIT !");

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token required",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const newAccessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
});

// ========================
// LOGOUT
// ========================
const logout = asyncHandler(async (req, res) => {
  console.log("Logout API HIT !");

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// ========================
// EXPORTS
// ========================
export { register, login, refreshToken, logout };
