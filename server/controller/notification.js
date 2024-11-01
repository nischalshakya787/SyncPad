import mongoose from "mongoose";
import NotificationModel from "../model/Notification.js";
import UserModel from "../model/User.js";

//To save the notification
export const saveNotification = async (req, res) => {
  const { senderId, recieverId, message, docId } = req.body;
  console.log(req.body);
  try {
    //Checking if the provided Id is valid or not
    if (!mongoose.Types.ObjectId.isValid(senderId)) {
      return res.status(400).json({ error: "Invalid Sender Id" });
    }
    if (!mongoose.Types.ObjectId.isValid(recieverId)) {
      return res.status(400).json({ error: "Invalid receiver Id" });
    }
    if (!mongoose.Types.ObjectId.isValid(docId)) {
      return res.status(400).json({ error: "Invalid Document Id" });
    }

    const sender = mongoose.Types.ObjectId.createFromHexString(senderId); //converting the string id into objectId type
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

//Updating the status if the collab request is accepted or rejected
export const updateStatus = async (req, res) => {
  const { id, status } = req.body; //status may have accepted or rejected as a value
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

export const fetchNotification = async (req, res) => {
  const { userId } = req.query;
  try {
    //To check if provided id is valid or not
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }
    const reciever = mongoose.Types.ObjectId.createFromHexString(userId);
    const notification = await NotificationModel.find({ reciever });
    if (!notification) {
      return res.status(201).json({ message: "Notification not Found!!" });
    }
    res.status(200).json({ notification });
  } catch (error) {
    return res.status(400).json(error);
  }
};
