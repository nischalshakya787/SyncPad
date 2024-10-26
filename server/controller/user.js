import UserModel from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
    const User = await UserModel.find({ username });
    const passOK = bcrypt.compareSync(password, User.password);
    if (passOK) {
      const token = jwt.sign(
        { username, id: User._id },
        process.env.JWT_SECRET
      );
      res.cookie("token", token);
      res.status(200).json({ message: "Login Successful", status: true });
    } else {
      res.status(400).json({ message: "Incorrect Password", status: false });
    }
  } catch (error) {
    console.log(error);
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
    res.json(info);
  });
};

const getUser = async (req, res) => {
  const { email } = req.query;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(201).json({ message: "User not found" });
    }
    console.log(user);
    res.status(200).json({ message: "User found", user });
  } catch (error) {
    console.log(error);
  }
};

export { register, login, logout, profile, getUser };
