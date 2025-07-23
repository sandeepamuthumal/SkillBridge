import express from 'express';
import { getAllProfessionals } from '../controllers/professionalController.js';

const router = express.Router();

router.get('/', getAllProfessionals);

export default router;
