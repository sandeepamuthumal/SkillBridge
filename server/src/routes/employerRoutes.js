import express from 'express';
import { getAllEmployers } from '../controllers/employerController.js';

const router = express.Router();

// Public route – no auth needed
router.get('/', getAllEmployers);

export default router;
