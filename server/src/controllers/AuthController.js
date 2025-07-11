import User from "../models/User";
import JobSeeker from "../models/JobSeeker";
import Employer from "../models/Employer";
import { NotFoundError } from "../errors/not-found-error";
import { ValidationError } from "../errors/validation-error";
import generateToken from "../utils/generateToken";

//Auth functions
export const signUp = async(req, res, next) => {
    try {
        const { email, password, role, ...otherFields } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ValidationError("User already exists");
        }

        // Create user based on role
        const userData = { email, password, role };

        if (role === 'jobseeker') {
            const { firstName, lastName } = otherFields;
            Object.assign(userData, { firstName, lastName });
        }

        Object.assign(userData, {
            status: 'active',
            profileCompleted: false,
            emailVerified: false,
            isVerified: false
        });

        const user = await User.create(userData);

        if (role === 'jobseeker') {
            //create jobseeker profile
            const jobSeekerData = {
                userId: user._id,
                fieldOfStudy: otherFields.fieldOfStudy,
                university: otherFields.university
            };

            const jobSeeker = await JobSeeker.create(jobSeekerData);
        } else if (role === 'employer') {
            //create employer profile
            const employerData = {
                userId: user._id,
                companyName: otherFields.companyName,
                contactName: otherFields.contactName,
                companySize: otherFields.companySize,
                industry: otherFields.industry
            };

            const employer = await Employer.create(employerData);
        }

        // Generate JWT
        const token = generateToken({ userId: user._id });

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            token,
            user
        });
    } catch (error) {
        next(error);
    }
}

export const signIn = async(req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            throw new NotFoundError("User not found");
        }

        // Check if password is correct
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new ValidationError("Invalid password");
        }

        // Generate JWT
        const token = generateToken({ userId: user._id });

        //update user last login
        user.lastLogin = Date.now();
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            token,
            user
        });
    } catch (error) {
        next(error);
    }
}

export const signOut = async(req, res, next) => {
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
        const user = await User.findById(req.user.userId);
        res.status(200).json({
            success: true,
            message: 'User fetched successfully',
            user
        });
    } catch (error) {
        next(error);
    }
}