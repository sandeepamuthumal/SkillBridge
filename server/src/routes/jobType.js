import express from 'express';
import {
  createJobType,
  getAllJobTypes,
  getJobTypeById,
  updateJobTypeById,
  deleteJobTypeById
} from '../controllers/jobTypeController.js';

const jobTypeRouter = express.Router();

jobTypeRouter.post('/', createJobType);
jobTypeRouter.get('/', getAllJobTypes);
jobTypeRouter.get('/:id', getJobTypeById);
jobTypeRouter.put('/:id', updateJobTypeById);
jobTypeRouter.delete('/:id', deleteJobTypeById);

export default jobTypeRouter;
