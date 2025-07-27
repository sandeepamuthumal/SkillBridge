import User from "../models/User.js";
import JobSeeker from "../models/JobSeeker.js";
import { NotFoundError } from "../errors/not-found-error.js";
import { ValidationError } from "../errors/validation-error.js";
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import JobPost from "../models/JobPost.js";

export const getJobSeekerProfile = async(req, res, next) => {
    try {
        let jobSeeker = await JobSeeker.findOne({ userId: req.user.id })
            .populate("userId", "firstName lastName email")
            .populate("cityId", "name country")

        if (!jobSeeker) {
            throw new NotFoundError("Job Seeker profile not found");
        }

        const responseData = {
            // Basic info from User model
            firstName: jobSeeker.userId.firstName,
            lastName: jobSeeker.userId.lastName,
            email: jobSeeker.userId.email,

            // JobSeeker specific fields
            contactNumber: jobSeeker.contactNumber,
            statementHeader: jobSeeker.statementHeader,
            statement: jobSeeker.statement,
            university: jobSeeker.university,
            fieldOfStudy: jobSeeker.fieldOfStudy,
            resumeUrl: jobSeeker.resumeUrl,
            profilePictureUrl: jobSeeker.profilePictureUrl,
            cityId: jobSeeker.cityId ? jobSeeker.cityId._id : null,
            cityName: jobSeeker.cityId ? jobSeeker.cityId.name : null,
            cityCountry: jobSeeker.cityId ? jobSeeker.cityId.country : null,
            availability: jobSeeker.availability,
            profileVisibility: jobSeeker.profileVisibility,
            profileViews: jobSeeker.profileViews,
            profileCompleteness: jobSeeker.profileCompleteness,
            expectedSalary: jobSeeker.expectedSalary,
            jobPreferences: {
                availability: jobSeeker.availability,
                jobTypes: jobSeeker.jobPreferences.jobTypes,
                categories: jobSeeker.jobPreferences.categories,
                remoteWork: jobSeeker.jobPreferences.remoteWork,
            },

            // Social links
            socialLinks: jobSeeker.socialLinks,

            // Additional data
            skills: jobSeeker.skills,
            experiences: jobSeeker.experiences,
            projects: jobSeeker.projects,
            educations: jobSeeker.educations,
        };

        res.status(200).json({
            success: true,
            data: responseData,
        });
    } catch (error) {
        next(error);
    }
};

export const updateJobSeekerProfile = async(req, res, next) => {
    try {
        // Update fields from request body
        const {
            firstName,
            lastName,
            contactNumber,
            statementHeader,
            statement,
            university,
            fieldOfStudy,
            cityId,
            availability,
            profileVisibility,
            skills,
            educations,
            experiences,
            projects,
            socialLinks,
            expectedSalary,
            jobPreferences
        } = req.body;

        console.log(req.body);

        // Update User model fields
        const userUpdateData = {};
        if (firstName) userUpdateData.firstName = firstName;
        if (lastName) userUpdateData.lastName = lastName;

        if (Object.keys(userUpdateData).length > 0) {
            await User.findByIdAndUpdate(req.user.id, userUpdateData, {
                new: true,
                runValidators: true
            });
        }

        // Update JobSeeker model fields
        const jobSeekerUpdateData = {
            contactNumber,
            statementHeader,
            statement,
            university,
            fieldOfStudy,
            availability,
            profileVisibility,
            jobPreferences
        };

        if (cityId) {
            jobSeekerUpdateData.cityId = cityId;
        }

        if (skills) {
            jobSeekerUpdateData.skills = skills;
        }

        if (educations) {
            jobSeekerUpdateData.educations = educations;
        }

        if (experiences) {
            jobSeekerUpdateData.experiences = experiences;
        }

        if (projects) {
            jobSeekerUpdateData.projects = projects;
        }

        if (socialLinks) {
            jobSeekerUpdateData.socialLinks = socialLinks;
        }

        if (expectedSalary) {
            jobSeekerUpdateData.expectedSalary = {
                min: expectedSalary.min,
                max: expectedSalary.max
            };
        }

        if (jobPreferences) {
            jobSeekerUpdateData.jobPreferences = {
                jobTypes: jobPreferences.jobTypes,
                categories: jobPreferences.categories,
                remoteWork: jobPreferences.remoteWork,
            };
        }


        let jobSeeker = await JobSeeker.findOneAndUpdate({ userId: req.user.id }, jobSeekerUpdateData, {
                new: true,
                upsert: true,
                runValidators: true
            }).populate('userId', 'firstName lastName email')
            .populate('cityId', 'name country');

        jobSeeker.profileCompleteness = jobSeeker.calculateProfileCompleteness();
        await jobSeeker.save();

        res.status(200).json({
            success: true,
            message: 'Job Seeker profile updated successfully'
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            return next(error);
        }
        next(error);
    }
};

export const uploadProfilePicture = async(req, res, next) => {
    try {
        if (!req.file) {
            throw new ValidationError("No file uploaded");
        }

        // Generate URL for the uploaded file
        const profilePictureUrl = `/uploads/profiles/${req.file.filename}`;

        // Update jobseeker profile with image URL
        let jobSeeker = await JobSeeker.findOneAndUpdate({ userId: req.user.id }, { profilePictureUrl }, {
            new: true,
            upsert: true,
        });

        await jobSeeker.save();

        res.status(200).json({
            success: true,
            message: 'Profile image uploaded successfully',
            data: {
                profilePictureUrl,
                profileCompleteness: jobSeeker.profileCompleteness
            }
        });
    } catch (error) {
        next(error);
    }
};

export const uploadAndParseCV = async(req, res, next) => {
    try {
        const userId = req.user.id; // From auth middleware
        const cvPath = req.file.path;
        const cvFile = req.file;

        console.log(`Received CV upload for user: ${userId}, file: ${cvPath}`);

        if (!cvFile) {
            return res.status(400).json({
                success: false,
                message: 'No CV file uploaded'
            });
        }

        const seekerResumeUrl = `/uploads/cvs/${req.file.filename}`;

        console.log(`Processing CV: ${cvFile.filename} for user: ${userId}`);

        let jobSeeker = await JobSeeker.findOne({ userId });

        // Send CV to Python FastAPI
        const form = new FormData();
        form.append('file', fs.createReadStream(cvPath));

        console.log('Sending CV to Python service for parsing...');
        const pythonServiceUrl = process.env.PYTHON_AI_SERVICE_URL || 'http://localhost:8000';

        const response = await axios.post(`${pythonServiceUrl}/parse-cv`, form, {
            headers: form.getHeaders(),
        });

        const parsed = response.data;

        const extractedData = parsed;

        if (!extractedData.success) {
            fs.unlinkSync(cvPath); // Clean up
            throw new Error(extractedData.message || 'Failed to parse CV');
        }

        //update job seeker profile with parsed data
        jobSeeker.resumeUrl = seekerResumeUrl;
        await jobSeeker.save();

        console.log('CV parsed successfully, updating job seeker profile...');

        res.json({
            success: true,
            message: 'CV parsed and profile updated successfully',
            data: {
                extractedData: extractedData.data,
                profileCompleteness: jobSeeker.calculateProfileCompleteness(),
            }
        });
    } catch (error) {
        next(error);
    }
}

export const removeCV = async(req, res, next) => {
    try {
        const jobSeeker = await JobSeeker.findOne({ userId: req.user.id });

        if (!jobSeeker || !jobSeeker.resumeUrl) {
            return res.status(404).json({
                success: false,
                message: 'No CV found to remove'
            });
        }

        // Remove CV file from server
        const cvFilePath = `uploads/cvs/${jobSeeker.resumeUrl.split('/').pop()}`;
        if (fs.existsSync(cvFilePath)) {
            fs.unlinkSync(cvFilePath);
        }

        // Update job seeker profile
        jobSeeker.resumeUrl = null;
        await jobSeeker.save();

        res.status(200).json({
            success: true,
            message: 'CV removed successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const getAllJobs = async(req, res, next) => {
    try {
        // Fetch all jobs from the database
        const jobs = await JobPost.find({
                status: 'Published',
                isApproved: true,
                deadline: { $gte: new Date() },
            })
            .populate('employerId', 'companyName logoUrl')
            .populate('categoryId', 'name')
            .populate('typeId', 'name')
            .populate('cityId', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: jobs
        });
    } catch (error) {
        next(error);
    }
};