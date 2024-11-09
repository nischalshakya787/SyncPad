import express from "express";
import { fetchChat } from "../controller/chat.js";

const chatRouter = express.Router();

chatRouter.route("/:docId").get(fetchChat);

export default chatRouter;
