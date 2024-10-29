import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRouter from "./routes/user.js";
import { createServer } from "node:http";
import { Server } from "socket.io";
import docsRouter from "./routes/document.js";

dotenv.config();
const app = express();
//creating server
const server = createServer(app);
const io = new Server(server, {
  cors: {
    //Enabaling the cors with forntend server
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser()); //This allows us to interact with browser cookies

//router which includes login signup logout and getprofile
app.use(authRouter);
app.use(docsRouter);

const PORT = 3000;

const startServer = async () => {
  try {
    //If the following variables are not fgound then it will throw an error
    if (!process.env.MONGO_URL || !process.env.JWT_SECRET) {
      console.error(
        "Environment variables MONGO_URL or JWT_SECRET are missing."
      );
      process.exit(1);
    }

    //connection with mongodb
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to DB");

    io.on("connection", (socket) => {
      socket.on("joinDocument", (docId) => {
        socket.join(docId);
      });

      socket.on("document", (docId, value) => {
        socket.to(docId).emit("document", value);
      });
      // Handle when a user leaves a document room
      socket.on("leaveDocument", (docId) => {
        socket.leave(docId);
      });
    });
    server.listen(PORT, () => {
      console.log(`Server running on: http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.log("Error connecting to database or starting server:", error);
  }
};

startServer();
