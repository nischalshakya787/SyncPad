import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running port: http://localhost:${PORT}/`);
});
