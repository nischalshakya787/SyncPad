import UserModel from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import crypto from "crypto";
import nodemailer from "nodemailer";

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    //Checking if username already exits or not
    const usernameCheck = await UserModel.findOne({ username });
    if (usernameCheck) {
      return res.status(400).json({ message: "Username already in use" });
    }
    //Checking if email already exits or not
    const emailCheck = await UserModel.findOne({ email });
    if (emailCheck) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Failed to create User", status: false });
    }

    res.status(201).json({
      message: "User registered. Please Log in",
      status: true,
    });
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
        { username, id: user._id, persona: user.persona },
        process.env.JWT_SECRET
      );
      res.cookie("token", jwtToken, { maxAge: 24 * 60 * 60 * 1000 }); //initializing the token in frontend side
      res.status(200).json({
        message: "Login Successful",
        status: true,
        user,
      });
    } else {
      res.status(400).json({ message: "Incorrect Password", status: false });
    }
  } catch (error) {
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
  const { id } = req.query;
  try {
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  const userId = req.params.id;
  const { email, username, description } = req.body;

  // Check if required fields are provided
  if (!email || !username || !description) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User Id" });
    }

    // Update user profile and return the updated document
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { email, username, description },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User Profile Updated Successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error); // Log the actual error for debugging
    res.status(500).json({ message: "Server error", error: error.message }); // Return the error message
  }
};

const changePassword = async (req, res) => {
  const userId = req.params.id;
  const { password, new_password } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User Id" });
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    const passOK = bcrypt.compareSync(password, user.password);
    if (!passOK) {
      return res
        .status(400)
        .json({ message: "Password Incorrect", status: false });
    }
    const salt = bcrypt.genSaltSync(10);
    await UserModel.findByIdAndUpdate(userId, {
      password: bcrypt.hashSync(new_password, salt),
    });
    res
      .status(200)
      .json({ message: "Password Changed Successful", status: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    //Generating a random token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "syncpad993@gmail.com",
        pass: "kieu hzxq xyvs wbie",
      },
    });

    const mailOptions = {
      from: "syncpad993@gmail.com",
      to: email,
      subject: "Forgot Your Password",
      text: `Please change your password by clicking on the following link: 
      http://localhost:5173/forgot-password/${verificationToken}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "Link sent successfully. Please check your email",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const resetPassword = async (req, res) => {
  const token = req.params.token;
  const { password } = req.body;
  try {
    const user = await UserModel.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    user.password = hashedPassword;
    await user.save();

    res
      .status(200)
      .json({ message: "Password changed successfully.", status: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const changePersona = async (req, res) => {
  const id = req.params.id;
  const { persona } = req.body;
  try {
    const user = await UserModel.findByIdAndUpdate(id, { persona });
    if (!user) {
      return res.status(400)({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export {
  register,
  login,
  logout,
  profile,
  getUser,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  changePersona,
};
