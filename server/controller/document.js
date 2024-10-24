import DocumentModel from "../model/Document";
import UserModel from "../model/User";

export const saveDocument = async (req, res) => {
  const { title, username } = req.body;

  try {
    const user = await UserModel.findOne(username);

    if (user) {
      await DocumentModel.create({
        title,
        creator: user,
      });
      res.status(200).json({ message: "Document created" });
    } else {
      res.status(201).json({ message: "User not found. PLease login" });
    }
  } catch (error) {}
};
