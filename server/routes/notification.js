import express from "express";
import {
  fetchNotification,
  saveNotification,
  updateStatus,
} from "../controller/notification.js";

const notificationRouter = express.Router();

notificationRouter.route("/save-notification").post(saveNotification);
notificationRouter.route("/update-status").post(updateStatus);
notificationRouter.route("/fetch").get(fetchNotification);

export default notificationRouter;
