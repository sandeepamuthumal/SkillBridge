import express from 'express';
import {
  createJobCategory,
  getAllJobCategories,
  getJobCategoryById,
  updateJobCategory,
  deleteJobCategory
} from '../controllers/jobCategoryController.js';

const jobCategoryRouter = express.Router();

jobCategoryRouter.post('/', createJobCategory);
jobCategoryRouter.get('/', getAllJobCategories);
jobCategoryRouter.get('/:id', getJobCategoryById);
jobCategoryRouter.put('/:id', updateJobCategory);
jobCategoryRouter.delete('/:id', deleteJobCategory);

export default jobCategoryRouter;
