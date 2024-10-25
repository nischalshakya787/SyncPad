import express from "express";
import {
  createDocument,
  fetchAllDocuments,
  saveDocument,
} from "../controller/document.js";

const docsRouter = express.Router();

docsRouter.route("/document").post(createDocument);
docsRouter.route("/document/:id").post(saveDocument);
docsRouter.route("/document/fetch").get(fetchAllDocuments);

export default docsRouter;
