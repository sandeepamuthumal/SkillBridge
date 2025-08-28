import express from "express";
import { createEmployer, updateEmployerProfile, uploadLogo, getEmployerProfile, getAllEmployers, getEmployerById, deleteEmployerById } from "../controllers/employerController.js";
import { auth, authorize } from "../middlewares/auth.js";
import { createMulterUpload } from "../utils/multerConfig.js";


const employerRouter = express.Router();

// Allowed types per route
const imageTypes = /jpeg|jpg|png|gif|webp/;

// Create uploaders
const profileUploader = createMulterUpload('companies', 'logo', imageTypes);

employerRouter.post("/", createEmployer);
employerRouter.get("/", getAllEmployers);
employerRouter.get("/profile", auth, authorize('Employer'), getEmployerProfile);
employerRouter.put("/profile", auth, authorize('Employer'), updateEmployerProfile);
employerRouter.post("/profile/logo", auth, authorize('Employer'), profileUploader.single('logoImage'), uploadLogo);
employerRouter.get("/:id", getEmployerById);
// employerRouter.delete("/:id", deleteEmployerById);


export default employerRouter;