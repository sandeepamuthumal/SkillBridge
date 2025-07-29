import express from 'express';
import { auth, authorize } from '../middlewares/auth.js';
import {
    getAllJobPostsAdmin,
    getJobPostByIdAdmin,
    approveJobPost,
    deleteJobPostAdmin
} from '../controllers/AdminJobController.js'; 
import validateDTO from '../middlewares/validate.js';


const adminJobRouter = express.Router();

// Apply auth and authorize middleware for all routes in this router
adminJobRouter.use(auth, authorize('Admin'));

// Get all job posts (with pagination and filtering)
adminJobRouter.get('/', getAllJobPostsAdmin);

// Get single job post by ID
adminJobRouter.get('/:id', getJobPostByIdAdmin);

// Approve a job post
adminJobRouter.patch('/:id/approve', approveJobPost);

// Delete (soft delete) a job post
adminJobRouter.delete('/:id', deleteJobPostAdmin);

export default adminJobRouter;