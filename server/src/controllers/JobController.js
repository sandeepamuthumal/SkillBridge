import JobPost from "../models/JobPost.js";
import User from "../models/User.js";

// controllers/jobController.js
export const getAllJobs = async(req, res, next) => {
    try {
        // Fetch all jobs from the database
        let jobs = await JobPost.find({
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

export const getJobById = async(req, res, next) => {
    try {
        const jobId = req.params.id;
        const job = await JobPost.findById(jobId)
            .populate('employerId')
            .populate('categoryId', 'name')
            .populate('typeId', 'name')
            .populate('cityId', 'name');

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Increment view count
        job.viewCount = (job.viewCount || 0) + 1;
        await job.save();

        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        next(error);
    }
}

export const saveJobPost = async(req, res, next) => {
    try {
        const jobId = req.params.id;
        const userId = req.user._id; // Assuming user ID is available in req.user

        const user = await User.findById(userId);
        if (!user.savedJobs.includes(jobId)) {
            user.savedJobs.push(jobId);
            await user.save();
        }
        res.status(200).json({
            success: true,
            message: 'Job post saved successfully',
        });

    } catch (error) {
        next(error);
    }
};

export const unsaveJobPost = async(req, res, next) => {
    try {
        const jobId = req.params.id;
        const userId = req.user._id; // Assuming user ID is available in req.user

        const user = await User.findById(userId);
        if (user.savedJobs.includes(jobId)) {
            user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
            await user.save();
        }
        res.status(200).json({
            success: true,
            message: 'Job post unsaved successfully',
        });

    } catch (error) {
        next(error);
    }
}

export const getSavedJobs = async(req, res, next) => {
    try {
        const userId = req.user._id; // Assuming user ID is available in req.user
        const user = await User.findById(userId).populate('savedJobs');

        res.status(200).json({
            success: true,
            data: user.savedJobs
        });
    } catch (error) {
        next(error);
    }
}