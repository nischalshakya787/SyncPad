import mongoose from "mongoose";
import NotificationModel from "../model/Notification";

export const saveNotification = async (req, res) => {
  const { senderId, recieverId, message, docId } = req.body;
  try {
    const sender = mongoose.Types.ObjectId.createFromHexString(senderId);
    const reciever = mongoose.Types.ObjectId.createFromHexString(recieverId);
    const doc = mongoose.Types.ObjectId.createFromHexString(docId);
    const notification = await NotificationModel.create({
      sender,
      reciever,
      message,
      doc,
    });
    if (!notification) {
      return res.status(400).json({ message: "failed to save notification" });
    }
    res
      .status(200)
      .json({ message: "Notification saved successfully", notification });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const updateStatus = async (req, res) => {
  const { id, status } = req.body;
  try {
    const notification = await NotificationModel.findByIdAndUpdate(id, {
      status: status,
    });
    if (!notification) {
      return res.status(400).json({ message: "Notification not Found!!" });
    }
    res
      .status(200)
      .json({ message: "Notification Updated successfully", notification });
  } catch (error) {
    return res.status(400).json(error);
  }
};
