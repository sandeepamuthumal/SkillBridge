import express from 'express';
import { getAllJobs, getJobById, getSavedJobs, saveJobPost, unsaveJobPost } from '../controllers/JobController.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getAllJobs);
router.get('/saved', auth, getSavedJobs);
router.get('/:id', getJobById);
router.post('/save/:id', auth, saveJobPost);
router.delete('/save/:id', auth, unsaveJobPost);


export default router;