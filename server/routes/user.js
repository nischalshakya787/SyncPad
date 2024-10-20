import express from "express";
import { register, login, logout, profile } from "../controller/user.js";

const authRouter = express.Router();

authRouter.route("/signup").post(register);
authRouter.route("/login").post(login);
authRouter.route("/logout").post(logout);
authRouter.route("/profile").get(profile);

export default authRouter;
