import DocumentModel from "../model/Document.js";
import UserModel from "../model/User.js";

export const createDocument = async (req, res) => {
  const { title, username } = req.body;

  try {
    const user = await UserModel.findOne(username);

    if (user) {
      const Document = await DocumentModel.create({
        title,
        creator: user,
      });

      res
        .status(200)
        .json({ message: "Document created", docsId: Document._id });
    } else {
      res.status(201).json({ message: "User not found. PLease login" });
    }
  } catch (error) {}
};