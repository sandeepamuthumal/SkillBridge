// controllers/jobController.js
import JobPost from "../models/JobPost.js";

import JobCategory from '../models/JobCategory.js';   
import JobType from '../models/JobType.js';           
import City from '../models/City.js';                  
import Employer from '../models/Employer.js'; 

export const getAllJobs = async (req, res) => {
  try {
    const {
      cityId,
      typeId,
      categoryId,
      experienceLevel,
      workArrangement,
      keyword,
      minSalary,
      maxSalary,
    } = req.query;

    // Build dynamic filter object
    const filter = {
      status: "Published",
      isApproved: true,
      deadline: { $gte: new Date() },
    };

    if (cityId) filter.cityId = cityId;
    if (typeId) filter.typeId = typeId;
    if (categoryId) filter.categoryId = categoryId;
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (workArrangement) filter.workArrangement = workArrangement;

   if (minSalary || maxSalary) {
  filter['salaryRange.min'] = {};
  const min = parseInt(minSalary);
  const max = parseInt(maxSalary);
  if (!isNaN(min)) filter['salaryRange.min'].$gte = min;
  if (!isNaN(max)) filter['salaryRange.min'].$lte = max;

  // If both min and max are invalid, remove salaryRange.min filter entirely
  if (Object.keys(filter['salaryRange.min']).length === 0) {
    delete filter['salaryRange.min'];
  }
}

    if (keyword) {
      const regex = new RegExp(keyword, "i");
      filter.$or = [
        { title: regex },
        { description: regex },
        { responsibilities: regex },
        { requirements: regex },
        { preferredSkills: regex },
      ];
    }

    const jobs = await JobPost.find(filter)
      .populate("employerId", "companyName logoUrl")
      .populate("categoryId", "name")
      .populate("typeId", "name")
      .populate("cityId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Server error while fetching jobs" });
  }
};
