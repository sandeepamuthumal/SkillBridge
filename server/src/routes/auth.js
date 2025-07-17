import express from "express";
import { logout, getUser, signUpJobSeeker, signUpEmployer, signUpAdmin, verifyEmail, signIn, resetPassword, resendVerification, forgotPassword } from "../controllers/AuthController.js";
import { auth, authorize } from "../middlewares/auth.js";
import { employerSignupDTO, jobSeekerSignupDTO, signinDTO, forgotPasswordDTO, adminSignupDTO, resetPasswordDTO } from "../dto/auth.dto.js";
import rateLimit from "express-rate-limit";
import validateDTO from "../middlewares/validate.js";

const authRouter = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: {
        error: 'Too many authentication attempts',
        message: 'Please try again in 15 minutes',
        retryAfter: 15 * 60
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const emailLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3, // 3 emails per window
    message: {
        error: 'Too many email requests',
        message: 'Please wait 5 minutes before requesting another email',
        retryAfter: 5 * 60
    }
});

// Routes

// Public routes
authRouter.post("/signup/jobseeker", validateDTO(jobSeekerSignupDTO), signUpJobSeeker);
authRouter.post("/signup/employer", validateDTO(employerSignupDTO), signUpEmployer);
authRouter.post("/signin", validateDTO(signinDTO), signIn);
authRouter.get("/verify-email", verifyEmail);
authRouter.post("/reset-password", authLimiter, validateDTO(resetPasswordDTO), resetPassword);

// Email/resend
authRouter.get("/resend-verification", emailLimiter, resendVerification);
authRouter.post("/forgot-password", emailLimiter, validateDTO(forgotPasswordDTO), forgotPassword);

// Protected routes
authRouter.get("/me", auth, getUser);
authRouter.post("/signout", auth, logout);
authRouter.post("/signup/admin", auth, authorize('admin'), validateDTO(adminSignupDTO), signUpAdmin);


export default authRouter;