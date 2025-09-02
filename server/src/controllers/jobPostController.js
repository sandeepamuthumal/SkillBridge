import Employer from '../models/Employer.js';
import JobPost from '../models/JobPost.js';

// CREATE a JobPost
export const createJobPost = async (req, res, next) => {
    try {
        console.log(req.user);
        const userId = req.user._id;
        const employer = await Employer.findOne({ userId });
        const obj = req.body;
        obj.employerId = employer._id;
        obj.typeId = '688524d8c80fdf2275702f14';
        obj.cityId = '687f36a184c4873409ab34aa';
        obj.categoryId = '688524e5719673b5574da891';
        const newJobPost = new JobPost(req.body);
        const savedJobPost = await newJobPost.save();

        res.status(201).json({
            success: true,
            message: 'Job post created successfully',
            data: savedJobPost
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all JobPosts for a specific employer
export const getAllJobPostsByEmployer = async (req, res) => {
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
        const jobs = await JobPost.find({ employerId })
            .sort({ createdAt: -1 }); // Latest first

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


// READ all JobPosts
export const getAllJobPosts = async (req, res) => {
    try {
        const jobPosts = await JobPost.find().populate('employerId categoryId typeId cityId approvedBy');
        res.json(jobPosts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// READ a single JobPost by ID
export const getJobPostById = async (req, res) => {
    try {
        const jobPost = await JobPost.findById(req.params.id).populate('employerId categoryId typeId cityId approvedBy');
        if (!jobPost) return res.status(404).json({ message: "Job post not found" });
        res.json(jobPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE a JobPost
export const updateJobPost = async (req, res) => {
    try {
        const updated = await JobPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Job post not found" });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE a JobPost
export const deleteJobPost = async (req, res) => {
    try {
        const deleted = await JobPost.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Job post not found" });
        res.json({ message: "Job post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};