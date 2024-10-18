import UserModel from "../model/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const salt = bcrypt.genSalt(10);

const register = async (res, req) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const User = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "User created Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const login = async (res, req) => {};

export { register, login };
