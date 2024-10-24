import express from "express";
import { createDocument } from "../controller/document.js";

const docsRouter = express.Router();

docsRouter.route("/document").post(createDocument);

export default docsRouter;
