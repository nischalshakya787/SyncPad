import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRouter from "./routes/user.js";
import { createServer } from "node:http";
import { Server } from "socket.io";
import docsRouter from "./routes/document.js";
import notificationRouter from "./routes/notification.js";
import DocumentModel from "./model/Document.js";
import ChatModel from "./model/Chat.js";
import chatRouter from "./routes/chat.js";

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

app.use("/auth/", authRouter);
app.use("/docs/", docsRouter);
app.use("/notifications/", notificationRouter);
app.use("/chat/", chatRouter);
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
      //To join a particular document
      socket.on("joinDocument", (docId) => {
        socket.join(docId);
      });
      //To handle the changes in the document
      socket.on("document", (docId, value) => {
        socket.to(docId).emit("document", value);
      });
      // Handle when a user leaves a document room
      socket.on("leaveDocument", (docId) => {
        socket.leave(docId);
      });
      //To save the documents
      socket.on("save-document", async (docId, value) => {
        try {
          await DocumentModel.findByIdAndUpdate(docId, { value });
          console.log("Document saved:", docId);
        } catch (error) {
          console.error("Error saving document:", error);
        }
      });
      //For group chat in document
      socket.on(
        "send-message",
        async ({ docId, senderId, message, username, persona, timestamp }) => {
          try {
            let chat = await ChatModel.findOne({ docId }); //To check if the chat is unique or not
            const newMessage = {
              senderId,
              message,
              timestamp,
            };
            if (chat) {
              //If chat exists
              chat.message.push(newMessage);
              await chat.save();
            } else {
              //If chat doesnot exists creating a new one
              chat = await ChatModel.create({ docId, message: [newMessage] });
            }

            //Sending the message back to the client side
            socket.to(docId).emit("receive-message", {
              senderId,
              message,
              username,
              persona,
              timestamp,
            });
          } catch (error) {
            console.error("Error saving Message:", error);
          }
        }
      );

      //To join a room for notification
      socket.on("joinRoom", (userId) => {
        socket.join(userId);
        console.log(`${userId} has Joined`);
      });

      //To send the collab request to the user
      socket.on("sendCollabRequest", (userId, document, sender) => {
        io.to(userId).emit("collabNotification", {
          type: "request",
          message: `${sender.username} has invited you to collab on '${document.title}' document.`,
          senderId: sender.id,
          recieverId: userId,
          docId: document._id,
        });
      });
      //To send the response of the collab
      socket.on("sendResponse", (response, username, document) => {
        io.to(response.sender).emit("collabNotification", {
          type: "response",
          message: `${username} has ${response.status} your request on '${document.title}'`,
          senderId: response.reciever,
          recieverId: response.sender,
          docId: document._id,
        });
      });
      socket.on("sendMentionNotification", (message) => {
        io.to(message.id).emit("collabNotification", {
          type: "response",
          message: `${message.sender} has mentioned you in Group Chat.'`,
          senderId: message.senderId,
          recieverId: message.id,
          docId: message.docId,
        });
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
