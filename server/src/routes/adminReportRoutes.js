import express from 'express';
import { auth, authorize } from '../middlewares/auth.js';
import { getJobAnalytics, exportJobAnalyticsPdf } from '../controllers/AdminReportController.js';
import { getApplicationReport, downloadApplicationFile, exportApplicationReportPdf } from '../controllers/AdminReportController.js';

const adminReportRouter = express.Router();

adminReportRouter.use(auth, authorize('Admin'));

// Get job analytics overview
adminReportRouter.get('/jobs', getJobAnalytics);

// Export job analytics as a PDF
adminReportRouter.get('/jobs/export/pdf', exportJobAnalyticsPdf);

adminReportRouter.get('/applications', getApplicationReport);
adminReportRouter.get('/applications/:id/download', downloadApplicationFile);
adminReportRouter.get('/applications/export/pdf', exportApplicationReportPdf);

export default adminReportRouter;