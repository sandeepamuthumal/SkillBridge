import User from '../models/User.js';
import JobSeeker from '../models/JobSeeker.js';
import Employer from '../models/Employer.js';
import { NotFoundError } from '../errors/not-found-error.js';
import { ValidationError } from '../errors/validation-error.js';
import emailService from '../services/emailService.js';
import bcrypt from 'bcryptjs';

// Get all users (general management) 
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

// Update user status (general management) 
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
            id, {
                password: hashedPassword,
                passwordResetToken: undefined,
                passwordResetExpires: undefined,
                loginAttempts: 0,
                lockUntil: undefined,
                isEmailVerified: true,
            }, {
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



// Get all Admin users
export const getAdmins = async (req, res, next) => {
    try {
        const admins = await User.find({ role: 'Admin' })
            .select('-password -emailVerificationToken -passwordResetToken -loginAttempts -lockUntil')
            .lean();

        res.status(200).json({
            success: true,
            message: 'Admin users fetched successfully',
            data: admins
        });
    } catch (error) {
        next(error);
    }
};

// Add a new Admin user
export const addAdmin = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ValidationError('User with this email already exists.');
        }

        const newAdmin = await User.create({
            firstName,
            lastName,
            email,
            password,
            role: 'Admin',
            isEmailVerified: true,
            profileCompleted: true
        });

        res.status(201).json({
            success: true,
            message: 'Admin user added successfully',
            data: newAdmin.toJSON()
        });
    } catch (error) {
        next(error);
    }
};


export const updateAdminEmail = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { email } = req.body;

        const adminToUpdate = await User.findById(id);
        if (!adminToUpdate) {
            throw new NotFoundError('Admin user not found.');
        }

        if (email !== adminToUpdate.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && String(existingUser._id) !== id) {
                throw new ValidationError('Email already in use by another user.');
            }
        }

        adminToUpdate.email = email;
        await adminToUpdate.save();

        res.status(200).json({
            success: true,
            message: 'Admin email updated successfully',
            data: adminToUpdate.toJSON()
        });
    } catch (error) {
        next(error);
    }
};


export const updateAdminPassword = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        const adminToUpdate = await User.findById(id);
        if (!adminToUpdate) {
            throw new NotFoundError('Admin user not found.');
        }

        adminToUpdate.password = newPassword;
        adminToUpdate.loginAttempts = 0;
        adminToUpdate.lockUntil = undefined;
        await adminToUpdate.save();

        res.status(200).json({
            success: true,
            message: 'Admin password updated successfully',
            data: adminToUpdate.toJSON()
        });
    } catch (error) {
        next(error);
    }
};

export const deactivateAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const adminToUpdate = await User.findById(id);

        if (!adminToUpdate) {
            throw new NotFoundError('Admin user not found.');
        }

        if (String(req.user._id) === id) {
            throw new ValidationError('An admin cannot deactivate their own account.');
        }

        if (adminToUpdate.status === 'inactive') {
             throw new ValidationError('Admin user is already inactive.');
        }
        
        adminToUpdate.status = 'inactive';
        await adminToUpdate.save();

        res.status(200).json({
            success: true,
            message: 'Admin user deactivated successfully',
            data: adminToUpdate.toJSON()
        });
    } catch (error) {
        next(error);
    }
};


export const reactivateAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const adminToUpdate = await User.findById(id);

        if (!adminToUpdate) {
            throw new NotFoundError('Admin user not found.');
        }

        if (adminToUpdate.status === 'active') {
             throw new ValidationError('Admin user is already active.');
        }
        
        adminToUpdate.status = 'active';
        await adminToUpdate.save();

        res.status(200).json({
            success: true,
            message: 'Admin user reactivated successfully',
            data: adminToUpdate.toJSON()
        });
    } catch (error) {
        next(error);
    }
};