import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  selectionRange: {
    startOffset: {
      type: Number,
      required: true,
    },
    endOffset: {
      type: Number,
      required: true,
    },
  },
  isRessolved: {
    type: Boolean,
    default: false,
  },
});

const DocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Untitled Document",
    },
    value: {
      type: String,
      default: "",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming UserModel is defined properly as mongoose.model("User", UserSchema)
    },
    comment: {
      type: [commentSchema],
      default: [],
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
