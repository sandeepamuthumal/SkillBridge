import express from 'express';
import {
    createJobPost,
    getAllJobPosts,
    getJobPostById,
    updateJobPost,
    deleteJobPost
} from '../controllers/jobPostController.js';

const jobPostRouter = express.Router();

jobPostRouter.post('/', createJobPost);
jobPostRouter.get('/', getAllJobPosts);
jobPostRouter.get('/:id', getJobPostById);
jobPostRouter.put('/:id', updateJobPost);
jobPostRouter.delete('/:id', deleteJobPost);

export default jobPostRouter;