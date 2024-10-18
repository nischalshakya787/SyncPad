import express from "express";
import { register, login } from "../controller/user.js";

const authRouter = express.Router();

authRouter.route("/signup").post(register);
authRouter.route("/login").post(login);

export default authRouter;
