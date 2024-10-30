import UserModel from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import DocumentModel from "../model/Document.js";

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const User = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "User created Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Use findOne to get a single user document
    const user = await UserModel.findOne({ username });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    // Compare passwords
    const passOK = bcrypt.compareSync(password, user.password);
    if (passOK) {
      //Creating a jwtToken
      const jwtToken = jwt.sign(
        { username, id: user._id },
        process.env.JWT_SECRET
      );
      res.cookie("token", jwtToken); //initializing the token in frontend side
      res.status(200).json({
        message: "Login Successful",
        status: true,
        user: { username: user.username, id: user._id },
      });
    } else {
      res.status(400).json({ message: "Incorrect Password", status: false });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token").json("ok");
};

const profile = async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "No token, user is not logged in" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
    if (err) throw err;
    res.json({ user: info });
  });
};

const getUser = async (req, res) => {
  const { email, docId } = req.query;
  try {
    const document = await DocumentModel.findById(docId);
    console.log(document);
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

export { register, login, logout, profile, getUser };
