import express from "express";
import {
  addCollab,
  checkDocument,
  createDocument,
  fetchAllDocuments,
  fetchDocument,
  getUserDocument,
  saveDocument,
  updateName,
  addComment,
  updateRessolve,
} from "../controller/document.js";

const docsRouter = express.Router();

docsRouter
  .route("/document")
  .post(createDocument)
  .get(checkDocument, fetchDocument);
docsRouter.route("/document/update-name").post(updateName); // Renamed route for clarity
docsRouter.route("/document/add-collab").post(addCollab);
docsRouter.route("/document/:id").put(saveDocument);
docsRouter.route("/comment/:id").put(addComment);
docsRouter.route("/ressolve-comment/:id").put(updateRessolve);
docsRouter.route("/document/fetch").get(fetchAllDocuments);
docsRouter.route("/user").get(getUserDocument);

export default docsRouter;
