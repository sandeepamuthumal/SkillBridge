import express from 'express';
import { auth, authorize } from '../middlewares/auth.js';
import validateDTO from '../middlewares/validate.js';
import rateLimit from 'express-rate-limit';
import {
    getAllUsers,
    updateUserStatus,
    adminResetPassword,
    getAdmins,
    addAdmin,
    updateAdminEmail,
    updateAdminPassword,
    deactivateAdmin,
    reactivateAdmin,
    getJobSeekers, 
    updateJobSeekerStatus, 
    adminResetJobSeekerPassword 
} from '../controllers/AdminController.js';
import {
    signUpJobSeeker,
    signUpEmployer,
    signUpAdmin,
    verifyEmail,
    signIn,
    resendVerification,
    forgotPassword,
    logout,
    getUser,
    resetPassword
} from '../controllers/AuthController.js';
import {
    employerSignupDTO,
    jobSeekerSignupDTO,
    signinDTO,
    forgotPasswordDTO,
    adminSignupDTO,
    resetPasswordDTO
} from '../dto/auth.dto.js';
import {
    addAdminDTO,
    updateAdminEmailDTO,
    updateAdminPasswordDTO
} from '../dto/admin.dto.js';

const authRouter = express.Router();
const adminRouter = express.Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many authentication attempts',
    retryAfter: 15 * 60,
    standardHeaders: true,
    legacyHeaders: false,
});

const emailLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 3,
    message: 'Too many email requests',
    retryAfter: 5 * 60
});

// Authentication and Public Auth Routes
authRouter.post('/signup/jobseeker', validateDTO(jobSeekerSignupDTO), signUpJobSeeker);
authRouter.post('/signup/employer', validateDTO(employerSignupDTO), signUpEmployer);
authRouter.post('/signin', authLimiter, validateDTO(signinDTO), signIn);
authRouter.get('/verify-email', verifyEmail);
authRouter.post('/reset-password', authLimiter, validateDTO(resetPasswordDTO), resetPassword);
authRouter.post('/forgot-password', emailLimiter, validateDTO(forgotPasswordDTO), forgotPassword);
authRouter.post('/resend-verification', emailLimiter, resendVerification);

// Authenticated User Routes
authRouter.get('/me', auth, getUser);
authRouter.post('/signout', auth, logout);

// Admin Routes
adminRouter.use(auth, authorize('Admin'));
adminRouter.get('/users', getAllUsers);
adminRouter.patch('/users/:id/status', updateUserStatus);
adminRouter.patch('/users/:id/reset-password', adminResetPassword);
adminRouter.get('/users/admins', getAdmins);
adminRouter.post('/users/admins', validateDTO(addAdminDTO), addAdmin);
adminRouter.patch('/users/admins/:id/email', validateDTO(updateAdminEmailDTO), updateAdminEmail);
adminRouter.patch('/users/admins/:id/password', validateDTO(updateAdminPasswordDTO), updateAdminPassword);
adminRouter.patch('/users/admins/:id/deactivate', deactivateAdmin);
adminRouter.patch('/users/admins/:id/reactivate', reactivateAdmin);
adminRouter.post('/signup/admin', validateDTO(adminSignupDTO), signUpAdmin);
adminRouter.get('/users/seekers', getJobSeekers); 
adminRouter.patch('/users/seekers/:id/status', updateJobSeekerStatus); 
adminRouter.patch('/users/seekers/:id/reset-password', adminResetJobSeekerPassword);

export { authRouter, adminRouter };