import User from "../models/User.js";
import JobSeeker from "../models/JobSeeker.js";
import Employer from "../models/Employer.js";
import { NotFoundError } from "../errors/not-found-error.js";
import { ValidationError } from "../errors/validation-error.js";
import { generateToken } from "../utils/jwt.js";
import emailService from "../services/emailService.js";

//Auth functions
export const signUpJobSeeker = async(req, res, next) => {
    try {
        const { email, password, role, ...otherFields } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ValidationError("User already exists");
        }

        const userData = {
            firstName: otherFields.firstName,
            lastName: otherFields.lastName,
            email,
            password,
            role,
            status: 'active',
            profileCompleted: false,
            isEmailVerified: false,
        };

        const user = await User.create(userData);

        //create jobseeker profile
        const jobSeekerData = {
            userId: user._id,
            fieldOfStudy: otherFields.fieldOfStudy,
            university: otherFields.university
        };
        const jobSeeker = await JobSeeker.create(jobSeekerData);

        // Generate email verification token
        const verificationToken = user.generateEmailVerificationToken();
        await user.save();

        // Send verification email
        await emailService.sendEmailVerification(user, verificationToken);

        res.status(201).json({
            success: true,
            message: 'Account created successfully! Please check your business email to verify your account.',
            data: {
                email: user.email,
                verificationSent: true
            }
        });

    } catch (error) {
        next(error);
    }
}

export const signUpEmployer = async(req, res, next) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            throw new ValidationError("User already exists");
        }

        const userData = {
            firstName: req.body.companyName,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
            status: 'active',
            profileCompleted: false,
            isEmailVerified: false,
        };

        const user = await User.create(userData);

        //create employer profile
        const employerData = {
            userId: user._id,
            companyName: req.body.companyName,
            contactPersonName: req.body.contactPersonName,
            companySize: req.body.companySize,
            industry: req.body.industry
        };

        const employer = await Employer.create(employerData);

        // Generate email verification token
        const verificationToken = user.generateEmailVerificationToken();
        await user.save();

        // Send verification email
        await emailService.sendEmailVerification(user, verificationToken);

        res.status(201).json({
            success: true,
            message: 'Account created successfully! Please check your business email to verify your account.',
            data: {
                email: user.email,
                verificationSent: true
            }
        });

    } catch (error) {
        next(error);
    }
}

export const signUpAdmin = async(req, res, next) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            throw new ValidationError("User already exists");
        }

        const userData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
            status: 'active',
            profileCompleted: true,
            isEmailVerified: true,
        };

        const user = await User.create(userData);

        res.status(200).json({
            success: true,
            message: 'Admin account created successfully'
        });
    } catch (error) {
        next(error);
    }
}

export const verifyEmail = async(req, res, next) => {
    try {
        const { token, email } = req.query;

        if (!token || !email) {
            throw new ValidationError("Invalid verification link");
        }

        // Find user with verification token
        const user = await User.findOne({
            email: decodeURIComponent(email),
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            throw new ValidationError("Invalid or expired verification link");
        }

        // Verify email
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        // Send welcome email
        await emailService.sendWelcomeEmail(user);

        // Generate JWT token for automatic login
        const authToken = generateToken({ userId: user._id });

        res.json({
            success: true,
            message: 'Email verified successfully! Welcome to SkillBridge.',
            token: authToken,
            user
        });
    } catch (error) {
        next(error);
    }
}

export const resendVerification = async(req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            throw new ValidationError("Email is required");
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            throw new ValidationError("No account found with this email address");
        }

        if (user.isEmailVerified) {
            throw new ValidationError("Email is already verified");
        }

        // Generate email verification token
        const verificationToken = user.generateEmailVerificationToken();
        await user.save();

        // Send verification email
        await emailService.sendEmailVerification(user, verificationToken);

        res.status(200).json({
            success: true,
            message: 'Verification email sent successfully'
        });
    } catch (error) {
        next(error);
    }
}

export const signIn = async(req, res, next) => {
    try {
        const { email, password } = req.body;

        console.log("SignIn request received with email:", email);

        // Check if user exists
        const users = await User.find();
        console.log("Users in database:", users.map(user => user.email));
        const user = await User.findOne({
            email: email
        }).select('+password');
        if (!user) {
            throw new NotFoundError("User not found");
        }

        // Check if password is correct
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new ValidationError("Invalid password");
        }

        // Check if account is locked
        if (user.isLocked) {
            return res.status(423).json({
                success: false,
                message: 'Account temporarily locked due to too many failed login attempts. Please try again later.'
            });
        }

        // Check if account is suspended
        if (user.status === 'suspended' || user.status === 'inactive') {
            throw new ValidationError("Your account has been suspended. Please contact support for assistance.");
        }

        //Check if account is not verified
        if (!user.isEmailVerified) {
            throw new ValidationError("Your account is not verified. Please verify your email to continue.");
        }

        // Generate JWT
        const authToken = generateToken({ userId: user._id });

        //update user last login
        user.lastLogin = Date.now();
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            token: authToken,
            user
        });
    } catch (error) {
        next(error);
    }
}

export const forgotPassword = async(req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            throw new NotFoundError("User not found");
        }

        if (!user.isEmailVerified) {
            throw new ValidationError("Your account is not verified. Please verify your email to continue.");
        }

        // Generate reset token
        const resetToken = user.generatePasswordResetToken();
        await user.save();

        // Send reset email
        await emailService.sendPasswordReset(user, resetToken);
        res.status(200).json({
            success: true,
            message: 'Password reset email sent successfully'
        });
    } catch (error) {
        next(error);
    }
}

export const resetPassword = async(req, res, next) => {
    try {
        const { token, password } = req.body;

        // Find user with valid reset token
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        // Update password
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.loginAttempts = 0;
        user.lockUntil = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        })
    } catch (error) {
        next(error);
    }
}

export const logout = async(req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: 'User logged out successfully'
        });
    } catch (error) {
        next(error);
    }
}

export const getUser = async(req, res, next) => {
    try {

        const user = await User.findById(req.user._id).lean();

        if (!user) {
            throw new NotFoundError("User not found");
        }

        let profile = null;

        if (user.role === 'Job Seeker') {
            profile = await JobSeeker.findOne({ userId: req.user._id }).lean();
        } else if (user.role === 'Employer') {
            profile = await Employer.findOne({ userId: req.user._id }).lean();
        }

        res.status(200).json({
            success: true,
            message: 'User fetched successfully',
            user: {
                ...user,
                profile
            }
        });
    } catch (error) {
        next(error);
    }
}