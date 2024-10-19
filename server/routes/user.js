import express from "express";
import { register, login, logout } from "../controller/user.js";

const authRouter = express.Router();

authRouter.route("/signup").post(register);
authRouter.route("/login").post(login);
authRouter.route("/logout").post(logout);

export default authRouter;
