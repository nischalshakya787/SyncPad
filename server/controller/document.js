import mongoose from "mongoose";
import DocumentModel from "../model/Document.js";
import UserModel from "../model/User.js";

//Creating a new Document
export const createDocument = async (req, res) => {
  const { username } = req.body;

  try {
    const user = await UserModel.findOne({ username });
    //If user found then this code block will run
    if (user) {
      const Document = await DocumentModel.create({
        creator: user,
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
  const { id } = req.query;
  try {
    const document = await DocumentModel.findById(id);

    res.status(200).json(document);
  } catch (error) {
    console.log(error);
  }
};

export const updateName = async (req, res) => {
  const { id, title } = req.body;
  console.log(req.body);
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
