import Employer from "../models/Employer.js";
import { NotFoundError } from "../errors/not-found-error.js";
import { ValidationError } from "../errors/validation-error.js";
import e from "express";
import JobPost from "../models/JobPost.js";
import JobSeeker from "../models/JobSeeker.js";
import axios from "axios";

export const updateEmployerProfile = async(req, res, next) => {
    try {
        const {
            companyName,
            industry,
            companyDescription,
            companyWebsite,
            foundedYear,
            companySize,
            contactPersonName,
            phone,
            address,
            facebook,
            twitter,
            linkedin,
        } = req.body;

        const updateData = {};

        if (companyName) updateData.companyName = companyName;
        if (industry) updateData.industry = industry;
        if (companyDescription) updateData.companyDescription = companyDescription;
        if (companyWebsite) updateData.companyWebsite = companyWebsite;
        if (foundedYear) updateData.foundedYear = foundedYear;
        if (companySize) updateData.companySize = companySize;
        if (contactPersonName) updateData.contactPersonName = contactPersonName;
        if (phone) updateData["contactInfo.phone"] = phone;
        if (address) updateData["contactInfo.address"] = address;
        if (facebook) updateData["socialLinks.facebook"] = facebook;
        if (twitter) updateData["socialLinks.twitter"] = twitter;
        if (linkedin) updateData["socialLinks.linkedin"] = linkedin;

        const employer = await Employer.findOneAndUpdate({ userId: req.user.id },
            updateData, { new: true, runValidators: true }
        );

        if (!employer) {
            return next(new NotFoundError("Employer profile not found"));
        }

        res.status(200).json({
            success: true,
            message: "Employer profile updated successfully",
        });
    } catch (error) {
        next(error);
    }
};


export const uploadLogo = async(req, res, next) => {
    try {
        if (!req.file) {
            throw new ValidationError("No file uploaded");
        }

        // Generate URL for the uploaded file
        const logoUrl = `/uploads/companies/${req.file.filename}`;

        // Update employer profile with logo URL
        let employer = await Employer.findOneAndUpdate({ userId: req.user.id }, { logoUrl }, {
            new: true,
            upsert: true,
        });

        await employer.save();

        res.status(200).json({
            success: true,
            message: "Logo uploaded successfully",
            data: {
                logoUrl,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getEmployerProfile = async(req, res, next) => {
    try {
        const userId = req.user._id;
        let employer = await Employer.findOne({ userId });

        if (!employer) {
            throw new NotFoundError("Employer profile not found");
        }

        const responseData = {
            companyName: employer.companyName,
            industry: employer.industry,
            companyDescription: employer.companyDescription,
            companyWebsite: employer.companyWebsite,
            foundedYear: employer.foundedYear,
            companySize: employer.companySize,
            contactPersonName: employer.contactPersonName,
            phone: employer.contactInfo ? employer.contactInfo.phone : null,
            address: employer.contactInfo ? employer.contactInfo.address : null,
            logoUrl: employer.logoUrl,
            linkedin: employer.socialLinks ? employer.socialLinks.linkedin : null,
            facebook: employer.socialLinks ? employer.socialLinks.facebook : null,
            twitter: employer.socialLinks ? employer.socialLinks.twitter : null,
        };

        res.status(200).json({
            success: true,
            data: responseData,
        });
    } catch (error) {
        next(error);
    }
};

export async function createEmployer(req, res) {
    try {
        const {
            userId,
            companyName,
            companyDescription,
            companyWebsite,
            logoUrl,
            industry,
            companySize,
            foundedYear,
            contactPersonName,
            verified,
            verificationDocuments,
            contactInfo,
            socialLinks
        } = req.body;

        const createdEmployer = new Employer({
            userId: userId,
            companyName: companyName,
            companyDescription: companyDescription,
            companyWebsite: companyWebsite,
            logoUrl: logoUrl,
            industry: industry,
            companySize: companySize,
            foundedYear: foundedYear,
            contactPersonName: contactPersonName,
            verified: verified,
            verificationDocuments: verificationDocuments,
            contactInfo: contactInfo,
            socialLinks: socialLinks
        })

        await createdEmployer.save();
        res.status(201).json({
            companyName: companyName,
            logoUrl: logoUrl,
            message: 'Employer Added Successfully'
        });
    } catch (error) {
        res.status(500).json({ message: "Error Occured When Adding Employer" });
        console.error("Error occured in controller when adding employer", error);

    }
}

export async function getAllEmployers(req, res) {
    try {
        const employers = await Employer.find().populate({
            path: 'userId',
            select: 'firstName lastName email',
            match: { status: 'active', isEmailVerified: true } // Only include active users
        });

        const activeEmployers = employers.filter(emp => emp.userId);

        res.status(200).json(activeEmployers);
    } catch (error) {
        res.status(500).json({ message: "Error Occured When Getting All Employers" });
        console.error("Error occured in controller when getting All employers", error);
    }
}

export async function getEmployerById(req, res) {
    try {
        const id = req.params.id;
        let employer = await Employer.findById(id).populate({
            path: 'userId',
            select: 'firstName  lastName email',
        });
        if (!employer) {
            res.status(404).json({ message: "Invalid Employer ID.." });
        }

        //get employer job posts stats
        const allJobCount = await JobPost.countDocuments({ employerId: id });
        const activeJobCount = await JobPost.countDocuments({ employerId: id, status: "Published", deadline: { $gte: new Date() } });
        const hiredCount = await JobPost.countDocuments({ employerId: id, status: "Closed" });

        employer = employer.toObject(); // Convert Mongoose document to plain object
        employer.jobStats = {
            allJobCount,
            activeJobCount,
            hiredCount
        };

        res.status(200).json(employer);
    } catch (error) {
        res.status(500).json({ message: "Error Occured When Getting Specific Employer", error: error.message });
    }
}

export async function deleteEmployerById(req, res) {
    try {
        const id = req.params.id;
        const employer = await Employer.findByIdAndDelete(id);
        if (!employer) {
            res.status(404).json({ message: "Invalid Employer ID.." });
        }
        res.status(200).json({ message: "Employer Deleted Successfuly" });
    } catch (error) {
        res.status(500).json({
            message: "Error Occured When Deleting Employer",
            employer: id
        });
        console.error("Error occured in controller when Delete Specific employer", id, error);
    }
}

export async function getJobPostsByEmployer(req, res) {
    try {
        const id = req.params.id;
        const filter = {
            employerId: id,
            status: "Published",
            isApproved: true,
            deadline: { $gte: new Date() },
        };
        const jobs = await JobPost.find(filter)
            .populate("employerId", "companyName logoUrl")
            .populate("categoryId", "name")
            .populate("typeId", "name")
            .populate("cityId", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: jobs
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ success: false, error: "Server error while fetching jobs", message: error.message });
    }
}

export const getSeekerSuggestions = async(req, res, next) => {
    try {
        const userId = req.user._id;

        const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';
        const employer = await Employer.findOne({ userId });

        if (!employer) {
            throw new NotFoundError("Employer not found");
        }

        const jobPost = await JobPost.findById(req.params.id);
        const candidates = await JobSeeker.find({
            profileVisibility: "Public",
            "jobPreferences.categories": jobPost.categoryId
        }).populate({
            path: 'userId',
            select: 'firstName lastName email',
            match: { status: 'active', isEmailVerified: true } // Only include active users
        });

        const formattedJobPost = {
            id: jobPost._id,
            title: jobPost.title,
            description: jobPost.description,
            requirements: jobPost.requirements,
            preferredSkills: jobPost.preferredSkills
        };

        const formattedCandidates = candidates.map(candidate => ({
            id: candidate._id,
            skills: candidate.skills,
            statement: candidate.statement,
            projects: candidate.projects,
            experiences: candidate.experiences,
            fieldOfStudy: candidate.fieldOfStudy
        }));

        const response = await axios.post(`${pythonServiceUrl}/recommend-candidates`, {
            job: formattedJobPost,
            jobSeekers: formattedCandidates
        });

        const recommendCandidates = await Promise.all(
            response.data.recommendedCandidates.map(async(candidate) => {
                const suggestedCandidates = await JobSeeker.findById(candidate.id)
                    .populate('userId', 'firstName lastName email');

                if (!suggestedCandidates) return null;

                const candidateData = suggestedCandidates.toObject();
                candidateData.similarity = candidate.similarity;
                candidateData.matchLabel = candidate.matchLabel;
                candidateData.details = candidate.details;

                return candidateData;
            })
        );

        const filteredCandidates = recommendCandidates.filter(Boolean);

        res.status(200).json({
            success: true,
            data: filteredCandidates,
        });
    } catch (error) {
        next(error);
    }
}