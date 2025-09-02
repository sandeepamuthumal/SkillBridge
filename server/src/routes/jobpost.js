import express from 'express';
import {
    createJobPost,
    getAllJobPosts,
    getJobPostById,
    updateJobPost,
    deleteJobPost, 
    getAllJobPostsByEmployer,
} from '../controllers/jobPostController.js';
import { auth, authorize } from '../middlewares/auth.js';

const jobPostRouter = express.Router();

jobPostRouter.post('/', auth, authorize('Employer'), createJobPost);
jobPostRouter.get('/', auth, authorize('Employer'), getAllJobPosts);
jobPostRouter.get('/employer/:id', auth, authorize('Employer'), getAllJobPostsByEmployer);
jobPostRouter.get('/:id', getJobPostById);
jobPostRouter.put('/:id', auth, authorize('Employer'), updateJobPost);
jobPostRouter.delete('/:id', auth, authorize('Employer'), deleteJobPost);

export default jobPostRouter;