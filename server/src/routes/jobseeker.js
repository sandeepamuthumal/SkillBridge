import express from "express";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { auth, authorize } from "../middlewares/auth.js";
import { getAllPublicJobSeekers } from "../controllers/JobSeekerController.js";


// Import JobSeekerController methods
import {
    getJobSeekerProfile,
    updateJobSeekerProfile,
    uploadProfilePicture
} from "../controllers/JobSeekerController.js";

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const jobseekerRouter = express.Router();

jobseekerRouter.get("/public", getAllPublicJobSeekers);


// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads/profiles');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `profile-${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});


// Routes for Job Seeker profile
jobseekerRouter.get("/profile", auth, getJobSeekerProfile);
jobseekerRouter.put("/profile", auth, authorize('Job Seeker'), updateJobSeekerProfile);
jobseekerRouter.post("/profile/image", auth, authorize('Job Seeker'), upload.single('profileImage'), uploadProfilePicture);
jobseekerRouter.get("/public", getAllPublicJobSeekers);


export default jobseekerRouter;