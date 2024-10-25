import express from "express";
import {
  createDocument,
  fetchAllDocuments,
  fetchDocument,
  saveDocument,
} from "../controller/document.js";

const docsRouter = express.Router();

docsRouter.route("/document").post(createDocument);
docsRouter.route("/document").get(fetchDocument);
docsRouter.route("/document/:id").post(saveDocument);
docsRouter.route("/document/fetch").get(fetchAllDocuments);

export default docsRouter;
