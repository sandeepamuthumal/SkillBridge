import express from 'express';
import JobPost from '../models/JobPost.js';
import { getAllJobs } from '../controllers/JobController.js';

const router = express.Router();

// Public route: Fetch all approved and published jobs
router.get('/', async (req, res) => {
  try {
//    const jobs = await JobPost.find({}) // ← fetch everything
//   .populate('employerId', 'companyName logoUrl')
//   .populate('categoryId', 'name')
//   .populate('typeId', 'name')
//   .populate('cityId', 'name')
//   .sort({ createdAt: -1 });

const jobs = await JobPost.find({}).sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
