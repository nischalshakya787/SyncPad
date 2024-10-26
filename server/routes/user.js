import express from "express";
import {
  register,
  login,
  logout,
  profile,
  getUser,
} from "../controller/user.js";

const authRouter = express.Router();

authRouter.route("/signup").post(register);
authRouter.route("/login").post(login);
authRouter.route("/logout").post(logout);
authRouter.route("/profile").get(profile);
authRouter.route("/user").get(getUser);

export default authRouter;
