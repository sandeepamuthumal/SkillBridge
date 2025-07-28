// controllers/jobController.js
export const getAllJobs = async (req, res) => {
  try {
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

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
