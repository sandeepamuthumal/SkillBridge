import express from "express";
import { createEmployer, getAllEmployers, getEmployerById, deleteEmployerById, updateEmployerById } from "../controllers/employerController.js";

const employerRouter = express.Router();

employerRouter.post("/", createEmployer);
// employerRouter.get("/", getAllEmployers);
// employerRouter.get("/:id", getEmployerById);
// employerRouter.delete("/:id", deleteEmployerById);
// employerRouter.put("/:id", updateEmployerById);

export default employerRouter;