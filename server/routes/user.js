import express from "express";
import {
  register,
  login,
  logout,
  profile,
  getUser,
  updateProfile,
  changePassword,
} from "../controller/user.js";

const authRouter = express.Router();

authRouter.route("/signup").post(register);
authRouter.route("/login").post(login);
authRouter.route("/logout").post(logout);
authRouter.route("/update-profile/:id").put(updateProfile);
authRouter.route("/change-password/:id").put(changePassword);
authRouter.route("/profile").get(profile);
authRouter.route("/user").get(getUser);

export default authRouter;
