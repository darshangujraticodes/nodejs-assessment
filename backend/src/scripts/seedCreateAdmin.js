import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import User from "../models/user.model.js";
import { DB_NAME } from "../constants.js";

// fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// correct .env path
dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const createAdmin = async () => {
  try {
    console.log("URI =", process.env.MONGODB_URI);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: DB_NAME,
    });

    console.log("MongoDB Connected:", conn.connection.host);

    const existingAdmin = await User.findOne({ email: "admin@test.com" });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const admin = await User.create({
      name: "Admin",
      email: "admin@test.com",
      password: "123456",
      role: "admin",
    });

    console.log("Admin created:", admin.email);
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

createAdmin();
