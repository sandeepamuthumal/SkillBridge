import User from '../models/User.js';
import JobPost from '../models/JobPost.js';
import Application from '../models/Application.js';

export const getDashboardOverview = async (req, res, next) => {
  try {
    // Fetch key statistics
    const totalUsers = await User.countDocuments();
    const totalJobSeekers = await User.countDocuments({ role: 'Job Seeker' });
    const totalEmployers = await User.countDocuments({ role: 'Employer' });
    const pendingJobPosts = await JobPost.countDocuments({ isApproved: false, status: 'Draft' });
    const totalApplications = await Application.countDocuments();
    const activeJobPosts = await JobPost.countDocuments({ status: 'Published' });
    const recentJobPosts = await JobPost.find({ isApproved: false, status: 'Draft' })
      .populate('employerId', 'companyName')
      .sort({ createdAt: -1 })
      .limit(5);

    // Prepare response data
    const overviewData = {
      stats: {
        totalUsers,
        totalJobSeekers,
        totalEmployers,
        pendingJobPosts,
        totalApplications,
        activeJobPosts,
      },
      recentJobPosts,
    };

    res.status(200).json({
      success: true,
      data: overviewData,
    });
  } catch (error) {
    next(error);
  }
};