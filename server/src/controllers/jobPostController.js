import Employer from "../models/Employer.js";
import JobPost from "../models/JobPost.js";

// CREATE a JobPost
export const createJobPost = async(req, res, next) => {
    try {
        console.log(req.user);
        const userId = req.user._id;
        const employer = await Employer.findOne({ userId });
        const obj = req.body;
        obj.employerId = employer._id;
        obj.typeId = req.body.jobType;
        obj.cityId = req.body.city;
        obj.categoryId = req.body.jobCategory;
        obj.experienceYears.min = req.body.experienceYears;
        obj.experienceYears.max = req.body.experienceYears;
        const newJobPost = new JobPost(req.body);
        const savedJobPost = await newJobPost.save();

        res.status(201).json({
            success: true,
            message: "Job post created successfully",
            data: savedJobPost,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all JobPosts for a specific employer
export const getAllJobPostsByEmployer = async(req, res) => {
    try {
        const employerId = req.params.id;

        // Check if employer exists
        const employer = await Employer.findById(employerId);
        if (!employer) {
            return res.status(404).json({
                success: false,
                message: "Employer not found",
            });
        }

        // Fetch all job posts for the employer
        const jobs = await JobPost.find({ employerId }).sort({ createdAt: -1 }); // Latest first

        res.status(200).json({
            success: true,
            data: jobs,
            message: "All job posts for employer fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({
            success: false,
            error: "Server error while fetching jobs",
            message: error.message,
        });
    }
};

export const getEmployerJobPosts = async(req, res) => {
    try {
        const userId = req.user._id;
        const employer = await Employer.findOne({ userId });

        if (!employer) {
            return res.status(404).json({ message: "Employer not found" });
        }

        const employerId = employer._id;
        const jobPosts = await JobPost.find({ employerId, isActive: true })
            .populate("categoryId typeId cityId")
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: jobPosts,
            message: "All job posts for employer fetched successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// READ all JobPosts
export const getAllJobPosts = async(req, res) => {
    try {
        const jobPosts = await JobPost.find({ isActive: true }).populate(
            "employerId categoryId typeId cityId approvedBy"
        );
        res.json(jobPosts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// READ a single JobPost by ID
export const getJobPostById = async(req, res) => {
    try {
        const jobPost = await JobPost.findById(req.params.id).populate(
            "employerId categoryId typeId cityId approvedBy"
        );
        if (!jobPost)
            return res.status(404).json({ message: "Job post not found" });
        res.json(jobPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE a JobPost
export const updateJobPost = async(req, res) => {
    try {
        const obj = req.body;
        if (obj.jobType) obj.typeId = req.body.jobType;
        if (obj.city) obj.cityId = req.body.city;
        if (obj.jobCategory) obj.categoryId = req.body.jobCategory;
        if (obj.experienceYears) obj.experienceYears.min = req.body.experienceYears;
        if (obj.experienceYears) obj.experienceYears.max = req.body.experienceYears;

        console.log("Updating Job Post with data:", req.body);

        const updated = await JobPost.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        if (!updated)
            return res.status(404).json({ message: "Job post not found" });

        res.status(201).json({
            success: true,
            data: updated,
            message: "Job post updated successfully",
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE a JobPost
export const deleteJobPost = async(req, res) => {
    try {
        const deleted = await JobPost.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(404).json({ message: "Job post not found" });
        res.json({ message: "Job post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Inactivate a JobPost
export const inactiveJobPost = async(req, res) => {
    try {
        const updated = await JobPost.findByIdAndUpdate(req.params.id, {
            isActive: false,
        });
        if (!updated)
            return res.status(404).json({ message: "Job post not found" });
        res.json({ message: "Job post inactivated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteInactiveJobPosts = async(req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const deleted = await JobPost.deleteMany({ isActive: false });
        console.log("Deleted inactive job posts:", deleted);

        res.status(200).json({
            success: true,
            message: "Inactive job posts deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting inactive job posts:", error);
        res
            .status(500)
            .json({ message: "Server error while deleting inactive job posts" });
    }
};