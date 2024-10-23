import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Untitled Document",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming UserModel is defined properly as mongoose.model("User", UserSchema)
    },
    collab: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to UserModel for collaborators
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const DocumentModel = mongoose.model("Document", DocumentSchema);

export default DocumentModel;
