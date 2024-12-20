import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
    },
    reciever: {
      type: mongoose.Schema.Types.ObjectId,
    },
    message: {
      type: String,
    },
    type: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
    },
    doc: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model("Notification", NotificationSchema);

export default NotificationModel;
