import express from 'express';
import { auth, authorize } from '../middlewares/auth.js';
import { getDashboardOverview } from '../controllers/AdminDashboardController.js';

const adminDashboardRouter = express.Router();

adminDashboardRouter.use(auth, authorize('Admin'));
adminDashboardRouter.get('/overview', getDashboardOverview);

export default adminDashboardRouter;