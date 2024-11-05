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

export { register, login, logout, profile, getUser, updateProfile };
