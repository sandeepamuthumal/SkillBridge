import express from "express";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { auth, authorize } from "../middlewares/auth.js";
import { createMulterUpload } from "../utils/multerConfig.js";
import { deleteApplication, getAllPublicJobSeekers, seekerApplications, submitJobApplication } from "../controllers/JobSeekerController.js";


// Import JobSeekerController methods
import {
    getAllJobs,
    getJobSeekerProfile,
    removeCV,
    updateJobSeekerProfile,
    uploadAndParseCV,
    uploadProfilePicture
} from "../controllers/JobSeekerController.js";

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const jobseekerRouter = express.Router();

jobseekerRouter.get("/public", getAllPublicJobSeekers);

// Allowed types per route
const imageTypes = /jpeg|jpg|png|gif|webp/;
const documentTypes = /pdf|doc|docx/;

// Create uploaders
const profileUploader = createMulterUpload('profiles', 'profile', imageTypes);
const cvUploader = createMulterUpload('cvs', 'cv', documentTypes);
const applicationUploader = createMulterUpload('applications', 'app', documentTypes);


// Routes for Job Seeker profile
jobseekerRouter.get("/profile", auth, getJobSeekerProfile);
jobseekerRouter.put("/profile", auth, authorize('Job Seeker'), updateJobSeekerProfile);
jobseekerRouter.post("/profile/image", auth, authorize('Job Seeker'), profileUploader.single('profileImage'), uploadProfilePicture);
jobseekerRouter.post("/upload-cv", auth, authorize('Job Seeker'), cvUploader.single('cv'), uploadAndParseCV);
jobseekerRouter.delete('/remove-cv', auth, authorize('Job Seeker'), removeCV);
jobseekerRouter.get("/public", getAllPublicJobSeekers);

//Job seeker applications
jobseekerRouter.post("/apply/job", auth, authorize('Job Seeker'), applicationUploader.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 }
]), submitJobApplication);

jobseekerRouter.get("/job/applications", auth, authorize('Job Seeker'), seekerApplications);
jobseekerRouter.delete("/job/applications/:id", auth, authorize('Job Seeker'), deleteApplication);


export default jobseekerRouter;