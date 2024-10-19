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
    const User = await UserModel.findOne({ username });
    const passOK = bcrypt.compareSync(password, User.password);

    if (passOK) {
      jwt.sign(
        { username, id: User._id },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) throw err;

          res.cookie("token", "your_jwt_token_here", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000, // 1 hour
            sameSite: "Lax",
          });
        }
      );
      res.status(200).json({ message: "Login Successful" });
    } else {
      res.status(400).json(passOK);
    }
  } catch (error) {
    console.log(error);
  }
};

const logout = async (req, res) => {
  res.cookie("token", "").json("ok");
};

export { register, login, logout };
