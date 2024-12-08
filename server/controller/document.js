import mongoose from "mongoose";
import DocumentModel from "../model/Document.js";
import UserModel from "../model/User.js";

//Creating a new Document
export const createDocument = async (req, res) => {
  const { username, template } = req.body;

  try {
    const user = await UserModel.findOne({ username });
    //If user found then this code block will run
    if (user) {
      const Document = await DocumentModel.create({
        creator: user,
        value: template ? template : "", //If template exist it will save the template if not blank document
      });

      res
        .status(200)
        .json({ message: "Document created", docsId: Document._id });
    } else {
      res.status(201).json({ message: "User not found. PLease login" }); // user not found
    }
  } catch (error) {
    console.log(error);
  }
};

//To save the document
export const saveDocument = async (req, res) => {
  //This is to retreve the id from /document/:id
  const docId = req.params.id;
  //value contains the html body
  const { value } = req.body;

  try {
    //this finds document by id and updates only its value
    const updatedDocument = await DocumentModel.findByIdAndUpdate(docId, {
      value,
    });
    if (!updatedDocument) {
      //docs with this id not found
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json({ message: "Document Updated Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error updating document" });
  }
};

//To fetch all the Document connected with the user
export const fetchAllDocuments = async (req, res) => {
  const { id } = req.query;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid User Id" });
    }
    const user = mongoose.Types.ObjectId.createFromHexString(id); //Type casting the string id into ObjectID
    if (user) {
      const document = await DocumentModel.find({ creator: user }); // To fetch the document created by the user
      const collabDocs = await DocumentModel.find({
        //to Fetch the document which the user is in collab
        collab: { $in: [user] },
      });
      const combinedDocument = [...document, ...collabDocs]; // Combining both the created as well as collab docs
      return res.status(200).json({ document: combinedDocument });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
  }
};

//To fetch only single Document
export const fetchDocument = async (req, res) => {
  const { docId } = req.query;
  try {
    const document = await DocumentModel.findById(docId).populate({
      path: "collab creator",
      select: "username persona",
    });

    res.status(200).json(document);
  } catch (error) {
    console.log(error);
  }
};

export const updateName = async (req, res) => {
  const { id, title } = req.body;

  try {
    const document = await DocumentModel.findByIdAndUpdate(id, { title });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json({ message: "Name updated successfully" });
  } catch (error) {
    console.log(error);
  }
};

//Adding the collab in the document
export const addCollab = async (req, res) => {
  const { userId, docId } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User Id" });
    }
    const user = mongoose.Types.ObjectId.createFromHexString(userId);
    if (user) {
      const document = await DocumentModel.findByIdAndUpdate(
        docId,
        {
          $addToSet: { collab: user }, // $addToSet is used to append the array. Collab is an array and we are appending the collab array with th user
        },
        { new: true }
      );
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      res
        .status(200)
        .json({ message: "Collaborator added successfully", document });
    }
  } catch (error) {
    console.error("Error adding collaborator:", error);
    res.status(500).json({
      message: "An error occurred while adding collaborator",
      error: error.message,
    });
  }
};

//Middleware to check if the user can access the document or not
export const checkDocument = async (req, res, next) => {
  const { docId, userId } = req.query;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User Id" });
    }
    const user = mongoose.Types.ObjectId.createFromHexString(userId);
    const document = await DocumentModel.findById(docId);
    if (document) {
      const isCreator = document.creator.equals(user);
      const isCollab = document.collab.some((id) => id.equals(user));
      if (isCreator || isCollab) {
        next();
      } else {
        return res.status(404).json({
          message: "User cannot access this Document",
          notAuthenticated: true,
        });
      }
    } else {
      return res
        .status(404)
        .json({ message: "Document Not Found!!", notAuthenticated: true });
    }
  } catch (error) {}
};
export const getUserDocument = async (req, res) => {
  const { email, docId } = req.query;
  try {
    const document = await DocumentModel.findById(docId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(201).json({ message: "User not found" });
    }
    const isCollaborator = document.collab.includes(user._id);

    if (isCollaborator) {
      return res.status(200).json({
        message: "User is already a collaborator",
        user,
        isCollab: true,
      });
    }

    res.status(200).json({ message: "User found", user, isCollab: false });
  } catch (error) {
    console.log(error);
  }
};

export const addComment = async (req, res) => {
  const docId = req.params.id;
  const { comment } = req.body;
  try {
    const updatedDocument = await DocumentModel.findByIdAndUpdate(
      docId,
      {
        $push: { comments: comment },
      },
      { new: true }
    );

    if (!updatedDocument) {
      return res.status(400).json({ message: "Document not Found" });
    }

    res.status(200).json({
      message: "Comment added successfully",
      document: updatedDocument,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while adding comment",
      error: error.message,
    });
  }
};

export const updateRessolve = async (req, res) => {
  const documentId = req.params.id; // Assuming you pass the documentId and commentId in the URL params
  const { commentId } = req.body;
  try {
    // Find the document by its ID
    const document = await DocumentModel.findById(documentId);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Find the comment in the comments array by its ID
    const comment = document.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Update the isRessolved field of the comment to true
    comment.isRessolved = true;

    // Save the updated document
    await document.save();

    // Respond with the updated document
    res.status(200).json({
      message: "Comment marked as resolved",
      updatedComment: comment,
    });
  } catch (error) {
    console.error("Error updating resolve status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
