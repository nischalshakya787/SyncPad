import DocumentModel from "../model/Document.js";
import UserModel from "../model/User.js";

export const createDocument = async (req, res) => {
  const { username } = req.body;
  console.log(req.body);

  try {
    const user = await UserModel.findOne({ username });
    console.log(user);
    if (user) {
      const Document = await DocumentModel.create({
        creator: user,
      });

      res
        .status(200)
        .json({ message: "Document created", docsId: Document._id });
    } else {
      res.status(201).json({ message: "User not found. PLease login" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const saveDocument = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
};
