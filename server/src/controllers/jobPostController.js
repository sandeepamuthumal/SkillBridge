import JobPost from '../models/JobPost.js';

// CREATE a JobPost
export const createJobPost = async (req, res) => {
    try {
        const newJobPost = new JobPost(req.body);
        const savedJobPost = await newJobPost.save();
        res.status(201).json(savedJobPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
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
