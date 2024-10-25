import express from "express";
import { createDocument, saveDocument } from "../controller/document.js";

const docsRouter = express.Router();

docsRouter.route("/document").post(createDocument);
docsRouter.route("/document/:id").post(saveDocument);

export default docsRouter;
