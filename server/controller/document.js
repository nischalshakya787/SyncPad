import mongoose from "mongoose";
import DocumentModel from "../model/Document.js";
import UserModel from "../model/User.js";

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
    console.log(updatedDocument);
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

export const fetchAllDocuments = async (req, res) => {
  const { id } = req.query;

  try {
    const creator = mongoose.Types.ObjectId.createFromHexString(id);
    if (creator) {
      const document = await DocumentModel.find({ creator: creator });
      return res.status(200).json(document);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchDocument = async (req, res) => {
  const { id } = req.query;
  try {
    const document = await DocumentModel.findById(id);

    res.status(200).json(document);
  } catch (error) {
    console.log(error);
  }
};
