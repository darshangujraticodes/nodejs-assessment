import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 8000;

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`Server is Running on PORT: ${port}`);
  });
};

startServer();
