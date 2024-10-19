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
  const { username, password } = req.body;
  try {
    const User = await UserModel.findOne({ username });
    const passOK = bcrypt.compareSync(password, User.password);

    if (passOK) {
      jwt.sign(
        { username, id: User._id },
        process.env.JWT_SECRET,
        (err, token) => {
          if (err) throw err;

          res.cookie("token", token).json({
            id: User._id,
            username,
          });
        }
      );
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
