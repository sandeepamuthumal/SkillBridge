import User from '../models/User.js';
import JobSeeker from '../models/JobSeeker.js';
import Employer from '../models/Employer.js';
import { NotFoundError } from '../errors/not-found-error.js';
import { ValidationError } from '../errors/validation-error.js';
import emailService from '../services/emailService.js';
import bcrypt from 'bcryptjs'; // Import bcryptjs for direct hashing 

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({})
            .select('-password -emailVerificationToken -passwordResetToken -loginAttempts -lockUntil')
            .lean();

        res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            users
        });
    } catch (error) {
        next(error);
    }
};

export const updateUserStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const user = await User.findById(id);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        if (req.user.id === id && status === 'inactive') {
            throw new ValidationError('Admin cannot deactivate their own account.');
        }

        user.status = status;
        await user.save();

        res.status(200).json({
            success: true,
            message: `User account ${status}d successfully`,
            user: user.toJSON()
        });
    } catch (error) {
        next(error);
    }
};

export const adminResetPassword = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        
        const hashedPassword = await bcrypt.hash(newPassword, 12); 

        
        const user = await User.findByIdAndUpdate(
            id,
            {
                password: hashedPassword, 
                passwordResetToken: undefined,
                passwordResetExpires: undefined,
                loginAttempts: 0,
                lockUntil: undefined,
                isEmailVerified: true, 
            },
            {
                new: true, 
                runValidators: true, 
                select: '-password -emailVerificationToken -passwordResetToken -loginAttempts -lockUntil' 
            }
        );

        if (!user) {
            throw new NotFoundError('User not found');
        }

        res.status(200).json({
            success: true,
            message: 'User password reset successfully.'
        });
    } catch (error) {
        next(error);
    }
};