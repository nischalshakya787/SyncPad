import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./routes/user.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

app.use(authRouter);

const PORT = 3000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to DB");

    app.listen(PORT, () => {
      console.log(`Server running on: http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.log(error);
  }
};
startServer();
