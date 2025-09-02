import express from 'express';
import {
    createJobPost,
    getAllJobPosts,
    getJobPostById,
    updateJobPost,
    deleteJobPost,
    deleteInactiveJobPosts,
    getAllJobPostsByEmployer,
    getEmployerJobPosts,
    inactiveJobPost,
} from '../controllers/jobPostController.js';
import { auth, authorize } from '../middlewares/auth.js';

const jobPostRouter = express.Router();

jobPostRouter.post('/', auth, authorize('Employer'), createJobPost);
jobPostRouter.get('/', auth, authorize('Employer'), getAllJobPosts);
jobPostRouter.get('/employer', auth, authorize('Employer'), getEmployerJobPosts);
jobPostRouter.get('/:id', getJobPostById);
jobPostRouter.post('/update/:id', auth, authorize('Employer'), updateJobPost);
jobPostRouter.delete('/:id', auth, authorize('Employer'), deleteJobPost);
jobPostRouter.post('/inactive/:id', auth, authorize('Employer'), inactiveJobPost);
jobPostRouter.post('/inactive', deleteInactiveJobPosts);

export default jobPostRouter;