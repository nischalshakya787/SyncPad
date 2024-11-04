import mongoose from "mongoose";
import NotificationModel from "../model/Notification.js";
import DocumentModel from "../model/Document.js";

//To save the notification
export const saveNotification = async (req, res) => {
  const { senderId, recieverId, message, docId, type } = req.body;
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
      type,
    });
    if (!notification) {
      return res.status(400).json({ message: "failed to save notification" });
    }
    res.status(200).json({ notification });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const updateStatus = async (req, res) => {
  const { id, status } = req.body; // status may have accepted or rejected as a value
  try {
    // Find the notification by ID
    const notification = await NotificationModel.findById(id);
    console.log(notification);
    if (!notification) {
      return res.status(400).json({ message: "Notification not Found!!" });
    }

    // Update the status of the notification
    notification.status = status;
    await notification.save(); // Save the updated notification

    // If the status is accepted, add the user as a collaborator to the document
    if (status === "accepted") {
      const user = notification.reciever; // Assuming `receiver` is the userId
      const docId = notification.doc; // `doc` is the document Id (should be ObjectId)

      const document = await DocumentModel.findByIdAndUpdate(
        docId.toString(),
        {
          $addToSet: { collab: user }, // Append the user to the collab array
        },
        { new: true }
      );
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Respond with success
      return res.status(200).json({
        message: "Notification Updated successfully and collaborator added",
        notification,
        document,
      });
    }

    // Respond for other statuses (e.g., rejected)
    const document = await DocumentModel.findById(notification.doc);
    return res.status(200).json({
      message: "Notification Updated successfully",
      notification,
      document,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    return res.status(500).json({
      message: "An error occurred while updating status",
      error: error.message,
    });
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

    if (notification.length === 0) {
      return res.status(404).json({ message: "No Notifications yet!" });
    }
    res.status(200).json({ notification });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Server error", details: error.message });
  }
};
