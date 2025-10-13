import User from '../models/User.js';
import JobSeeker from '../models/JobSeeker.js';
import Employer from '../models/Employer.js';
import { NotFoundError } from '../errors/not-found-error.js';
import { ValidationError } from '../errors/validation-error.js';
import emailService from '../services/emailService.js';
import bcrypt from 'bcryptjs';

// Get all users with pagination and filtering
export const getAllUsers = async (req, res, next) => {
    try {
        // Extract query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const role = req.query.role; // 'Admin', 'Job Seeker', 'Employer', or undefined for all
        const status = req.query.status; // 'active', 'inactive', or undefined for all
        const search = req.query.search; // Search by name or email

        // Calculate skip value for pagination
        const skip = (page - 1) * limit;

        // Build query filter
        const filter = {};
        
        if (role && role !== 'All') {
            filter.role = role;
        }
        
        if (status && status !== 'All') {
            filter.status = status;
        }

        // Search filter (name or email)
        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Get total count for pagination
        const totalUsers = await User.countDocuments(filter);

        // Fetch paginated users
        const users = await User.find(filter)
            .select('-password -emailVerificationToken -passwordResetToken -loginAttempts -lockUntil')
            .sort({ createdAt: -1 }) // Most recent first
            .skip(skip)
            .limit(limit)
            .lean();

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalUsers / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            data: users,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalUsers: totalUsers,
                limit: limit,
                hasNextPage: hasNextPage,
                hasPrevPage: hasPrevPage
            }
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

// Admin management functions start from here

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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const search = req.query.search;
        const skip = (page - 1) * limit;
        const filter = { role: 'Admin' };

        if (status && status !== 'All') {
            filter.status = status;
        }
        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const totalAdmins = await User.countDocuments(filter);
        const admins = await User.find(filter)
            .select('-password -emailVerificationToken -passwordResetToken -loginAttempts -lockUntil')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const totalpages = Math.ceil(totalAdmins / limit);

        res.status(200).json({
            success: true,
            message: 'Admin users fetched successfully',
            data: admins,
            pagination: {
                currentPage: page,
                totalPages: totalpages,
                totalUsers: totalAdmins,
                limit: limit,
                hasNextPage: page < totalpages,
                hasPrevPage: page > 1
            }
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

// Get all job seekers
export const getJobSeekers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const search = req.query.search;
        const skip = (page - 1) * limit;
        const filter = {role: 'Job Seeker'};

        if (status && status !== 'All'){
            filter.status = status;
        }
        if (search){
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const totalJobSeekers = await User.countDocuments(filter);
        const jobSeekers = await User.find(filter)
            .select('-password -emailVerificationToken -passwordResetToken -loginAttempts -lockUntil')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const totalPages = Math.ceil(totalJobSeekers / limit);

        res.status(200).json({
            success: true,
            message: 'Job seekers fetched successfully',
            data: jobSeekers,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalUsers: totalJobSeekers,
                limit: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }

        });
    } catch (error) {
        next(error);
    }
};

// Update job seeker status
export const updateJobSeekerStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const jobSeekerToUpdate = await User.findById(id);

        if (!jobSeekerToUpdate) {
            throw new NotFoundError('Job seeker not found.');
        }

        if (jobSeekerToUpdate.status === status) {
             throw new ValidationError(`Job seeker is already ${status}.`);
        }
        
        jobSeekerToUpdate.status = status;
        await jobSeekerToUpdate.save();

        res.status(200).json({
            success: true,
            message: `Job seeker status updated to '${status}' successfully`,
            data: jobSeekerToUpdate.toJSON()
        });
    } catch (error) {
        next(error);
    }
};

// Admin reset job seeker password
export const adminResetJobSeekerPassword = async (req, res, next) => {
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
            throw new NotFoundError('Job seeker not found');
        }
        res.status(200).json({
            success: true,
            message: 'Job seeker password reset successfully.'
        });
    } catch (error) {
        next(error);
    }
};

// Get all employers
export const getEmployers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const search = req.query.search;
        const skip = (page - 1) * limit;
        const filter = {role: 'Employer'};
        if (status && status !== 'All'){
            filter.status = status;
        }
        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const totalEmployers = await User.countDocuments(filter);
        const employers = await User.find(filter)
            .select('-password -emailVerificationToken -passwordResetToken -loginAttempts -lockUntil')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        const totalPages = Math.ceil(totalEmployers / limit);
        res.status(200).json({
            success: true,
            message: 'Employers fetched successfully',
            data: employers,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalUsers: totalEmployers,
                limit: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        next(error);
    }
};

// Update employer status
export const updateEmployerStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const employerToUpdate = await User.findById(id);
        if (!employerToUpdate) {
            throw new NotFoundError('Employer not found.');
        }

        if (employerToUpdate.status === status) {
             throw new ValidationError(`Employer is already ${status}.`);
        }
        employerToUpdate.status = status;
        await employerToUpdate.save();
        res.status(200).json({
            success: true,
            message: `Employer status updated to '${status}' successfully`,
            data: employerToUpdate.toJSON()
        });
    } catch (error) {
        next(error);
    }
};

// Admin reset employer password
export const adminResetEmployerPassword = async (req, res, next) => {
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
            throw new NotFoundError('Employer not found');
        }
        res.status(200).json({
            success: true,
            message: 'Employer password reset successfully.'
        });
    } catch (error) {
        next(error);
    }
};