import User from "../models/User.js";
import JobSeeker from "../models/JobSeeker.js";
import { NotFoundError } from "../errors/not-found-error.js";
import { ValidationError } from "../errors/validation-error.js";
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import JobPost from "../models/JobPost.js";
import Application from "../models/Application.js";


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
                runValidators: true,
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


        let jobSeeker = await JobSeeker.findOneAndUpdate({ userId: req.user.id },
                jobSeekerUpdateData, {
                    new: true,
                    upsert: true,
                    runValidators: true,
                }
            )
            .populate("userId", "firstName lastName email")
            .populate("cityId", "name country");

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
            message: "Profile image uploaded successfully",
            data: {
                profilePictureUrl,
                profileCompleteness: jobSeeker.profileCompleteness,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getAllPublicJobSeekers = async(req, res) => {
    try {
        const seekers = await JobSeeker.find({ profileVisibility: "Public" })
            .populate({
                path: "userId", // <-- make sure this matches your schema field name
                select: "firstName lastName email",
            })
            .populate("cityId");

        res.json(seekers);
    } catch (err) {
        console.error("Error getting public job seekers:", err);
        res.status(500).json({ message: "Server error" });
    }
};


export const getJobSeekerById = async(req, res, next) => {
    try {
        const { seekerId } = req.params; // Get the ID from the URL parameter

        // CORRECTED LINE: Use findOne with userId field
        let jobSeeker = await JobSeeker.findOne({ userId: seekerId })
            .populate("userId", "firstName lastName email")
            .populate("cityId", "name country");

        // ... (rest of your getJobSeekerById logic remains the same)
        // Optional: uncomment if you enforce public profiles
        if (!jobSeeker || jobSeeker.profileVisibility !== "Public") {
            throw new NotFoundError("Job Seeker profile not found or is private");
        }

        if (!jobSeeker) {
            throw new NotFoundError("Job Seeker profile not found");
        }

        //increase profile views
        jobSeeker.profileViews += 1;
        await jobSeeker.save();

        const responseData = {
            // ... (your existing responseData structure) ...
            firstName: jobSeeker.userId ? jobSeeker.userId.firstName : null,
            lastName: jobSeeker.userId ? jobSeeker.userId.lastName : null,
            email: jobSeeker.userId ? jobSeeker.userId.email : null,
            userId: { // Add userId object as frontend expects p.userId._id
                _id: jobSeeker.userId._id,
                firstName: jobSeeker.userId.firstName,
                lastName: jobSeeker.userId.lastName,
                email: jobSeeker.userId.email,
            },
            _id: jobSeeker._id, // Add JobSeeker's _id
            statementHeader: jobSeeker.statementHeader,
            statement: jobSeeker.statement,
            university: jobSeeker.university,
            fieldOfStudy: jobSeeker.fieldOfStudy,
            profilePictureUrl: jobSeeker.profilePictureUrl,
            cityId: jobSeeker.cityId ? { // Ensure cityId is an object if populated
                _id: jobSeeker.cityId._id,
                name: jobSeeker.cityId.name,
                country: jobSeeker.cityId.country,
            } : null,
            cityName: jobSeeker.cityId ? jobSeeker.cityId.name : null,
            cityCountry: jobSeeker.cityId ? jobSeeker.cityId.country : null,
            availability: jobSeeker.availability,
            profileVisibility: jobSeeker.profileVisibility,
            profileViews: jobSeeker.profileViews,
            profileCompleteness: jobSeeker.profileCompleteness,
            socialLinks: jobSeeker.socialLinks,
            skills: jobSeeker.skills,
            experiences: jobSeeker.experiences,
            projects: jobSeeker.projects,
            educations: jobSeeker.educations,
            expectedSalary: jobSeeker.expectedSalary,
            jobPreferences: jobSeeker.jobPreferences,
            resumeUrl: jobSeeker.resumeUrl,
            experience: jobSeeker.experience, // Make sure this field is included if your frontend uses it
        };

        res.status(200).json(responseData);
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

export const submitJobApplication = async(req, res, next) => {
    try {
        const jobId = req.body.jobId;
        const userId = req.user._id;
        const jobSeeker = await JobSeeker.findOne({ userId });

        // Check if job exists
        const job = await JobPost.findById(jobId);
        if (!job) {
            throw new NotFoundError("Job not found");
        }

        // Check if user has already applied
        const existingApplication = await Application.findOne({
            jobSeekerId: jobSeeker._id,
            jobPostId: jobId
        });

        if (existingApplication) {
            throw new ValidationError("You have already applied for this job");
        }

        let cvFile = req.files ? req.files.cv ? req.files.cv[0] : null : null;
        const coverLetterFile = req.files ? req.files.coverLetter ? req.files.coverLetter[0] : null : null;

        if (req.body.useCurrentResume == "true") {
            if (!jobSeeker.resumeUrl) {
                throw new ValidationError("No resume found in your profile");
            }
            cvFile = jobSeeker.resumeUrl;
        } else {
            if (!cvFile) {
                throw new ValidationError("No CV file uploaded");
            }
            cvFile = cvFile ? `/uploads/applications/${cvFile.filename}` : null;
        }

        // Create application data
        const applicationData = {
            jobSeekerId: jobSeeker._id,
            jobPostId: jobId,
            resumeUrl: cvFile,
            coverLetterUrl: coverLetterFile ? `/uploads/applications/${req.files.coverLetter[0].filename}` : null,
            additionalNotes: req.body.additionalNotes,
            appliedDate: new Date()
        };

        // Update JobSeeker profile with new application
        await Application.create(applicationData);

        // Increment job's application count
        job.applicationCount += 1;
        await job.save();

        res.status(200).json({
            success: true,
            message: 'Job application submitted successfully',
            data: applicationData
        });
    } catch (error) {
        next(error);
    }
};

export const seekerApplications = async(req, res, next) => {
    try {
        const userId = req.user._id;
        const jobSeeker = await JobSeeker.findOne({ userId });

        const applications = await Application.find({ jobSeekerId: jobSeeker._id })
            .populate({
                path: 'jobPostId',
                populate: [{
                        path: 'employerId',
                        select: 'companyName logoUrl'
                    },
                    {
                        path: 'categoryId',
                        select: 'name'
                    },
                    {
                        path: 'typeId',
                        select: 'name'
                    },
                    {
                        path: 'cityId',
                        select: 'name'
                    }
                ]
            })

        res.status(200).json({
            success: true,
            data: applications
        });
    } catch (error) {
        next(error);
    }
};

export const deleteApplication = async(req, res, next) => {
    try {
        const applicationId = req.params.id;
        const application = await Application.findById(applicationId);
        if (!application) {
            throw new NotFoundError("Application not found");
        }
        await Application.findByIdAndDelete(applicationId);

        //reduce application count
        const jobPost = await JobPost.findById(application.jobPostId);
        jobPost.applicationCount -= 1;
        await jobPost.save();

        res.status(200).json({
            success: true,
            message: 'Application deleted successfully'
        });
    } catch (error) {
        next(error);
    }
}

export const getJobRecommendations = async(req, res, next) => {
    try {
        const userId = req.user._id;
        const jobSeeker = await JobSeeker.findOne({ userId });
        const query = {
            status: 'Published',
            isApproved: true,
            deadline: { $gte: new Date() }
        };

        if (Array.isArray(jobSeeker.jobPreferences.categories) && jobSeeker.jobPreferences.categories.length > 0) {
            query.categoryId = { $in: jobSeeker.jobPreferences.categories };
        }

        const jobPosts = await JobPost.find(query).sort({ createdAt: -1 });

        // Format jobSeeker
        const formattedSeeker = {
            skills: jobSeeker.skills,
            statement: jobSeeker.statement,
            fieldOfStudy: jobSeeker.fieldOfStudy,
            projects: jobSeeker.projects,
            experiences: jobSeeker.experiences
        };

        const formattedJobs = jobPosts.map(job => ({
            id: job._id,
            title: job.title,
            description: job.description,
            requirements: job.requirements,
            preferredSkills: job.preferredSkills
        }));

        const pythonServiceUrl = process.env.PYTHON_AI_SERVICE_URL || 'http://localhost:8000';

        const response = await axios.post(`${pythonServiceUrl}/recommend-jobs`, {
            jobSeeker: formattedSeeker,
            jobs: formattedJobs
        });

        const recommendJobs = await Promise.all(
            response.data.recommendedJobs.map(async(job) => {
                const jobPost = await JobPost.findById(job.id)
                    .populate('employerId', 'companyName logoUrl')
                    .populate('categoryId', 'name')
                    .populate('typeId', 'name')
                    .populate('cityId', 'name');

                if (!jobPost) return null;

                const jobData = jobPost.toObject();
                jobData.similarity = job.similarity;
                jobData.matchLabel = job.matchLabel;
                jobData.details = job.details;

                return jobData;
            })
        );

        const filteredJobs = recommendJobs.filter(Boolean);

        res.status(200).json({
            success: true,
            data: filteredJobs
        });
    } catch (error) {
        console.error('AI match error:', error);

        res.status(500).json({
            success: false,
            message: error.response ? error.response.data || error.message : 'Server error'
        });
    }
}

export const getDashboardOverview = async(req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        const jobSeeker = await JobSeeker.findOne({ userId });

        // Get basic stats
        const [totalApplications, applications, savedJobs] = await Promise.all([
            Application.countDocuments({ jobSeekerId: jobSeeker._id }),
            Application.find({ jobSeekerId: jobSeeker._id }).populate('jobPostId'),
            user.savedJobs.length
        ]);

        const activeApplications = applications.filter(app =>
            !['Rejected', 'Withdrawn', 'Offer Accepted', 'Offer Declined'].includes(app.status)
        ).length;

        const responseRate = totalApplications > 0 ? ((applications.filter(app => app.status !== 'Applied').length) / totalApplications) * 100 : 0;

        // Calculate weekly growth (optional - can be added later)
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);

        const weeklyApplications = await Application.countDocuments({
            jobSeekerId: jobSeeker._id,
            createdAt: { $gte: lastWeek }
        });



        // Get recent applications (last 5)
        const docs = await Application
            .find({ jobSeekerId: jobSeeker._id })
            .populate({
                path: 'jobPostId',
                populate: [
                    { path: 'employerId', select: 'companyName logoUrl' },
                    { path: 'cityId', select: 'name' }
                ]
            })
            .sort({ createdAt: -1 }) // Mongoose sort spec
            .limit(5) // instead of slice
            .lean(); // optional, return plain objects

        const recentApplications = docs.map(app => ({
            id: app._id,
            jobTitle: app.jobPostId.title,
            company: app.jobPostId.employerId.companyName,
            logo: app.jobPostId.employerId.logoUrl,
            appliedDate: formatRelativeTime(app.createdAt),
            status: app.status,
            location: app.jobPostId.cityId.name,
            salary: `${app.jobPostId.salaryRange.currency} ${app.jobPostId.salaryRange.min.toLocaleString()} - ${app.jobPostId.salaryRange.max.toLocaleString()}`
        }));

        res.json({
            user: {
                name: user.firstName,
                email: user.email,
                profileCompletion: jobSeeker.profileCompleteness,
                lastLogin: formatRelativeTime(user.lastLogin)
            },
            stats: {
                totalApplications,
                activeApplications,
                savedJobs,
                profileViews: jobSeeker.profileViews || 0, // Track this when employers view
                responseRate: Math.round(responseRate * 10) / 10,
                weeklyGrowth: {
                    applications: weeklyApplications,
                    profileViews: 0, // Calculate if tracking
                    savedJobs: 0 // Calculate if needed
                }
            },
            recentApplications
        });

    } catch (error) {
        next(error);
    }

}

function formatRelativeTime(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 14) return '1 week ago';
    return `${Math.floor(days / 7)} weeks ago`;
}