import express from "express";
import { saveNotification, updateStatus } from "../controller/notification";

const notificationRouter = express.Router();
notificationRouter.route("/save-notification").post(saveNotification);
notificationRouter.route("/update-status").post(updateStatus);

export default notificationRouter;
