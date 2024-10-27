import express from "express";
import {
  addCollab,
  createDocument,
  fetchAllDocuments,
  fetchDocument,
  saveDocument,
  updateName,
} from "../controller/document.js";

const docsRouter = express.Router();

docsRouter.route("/document").post(createDocument).get(fetchDocument);
docsRouter.route("/document/update-name").post(updateName); // Renamed route for clarity
docsRouter.route("/document/add-collab").post(addCollab);
docsRouter.route("/document/:id").post(saveDocument);
docsRouter.route("/document/fetch").get(fetchAllDocuments);

export default docsRouter;
