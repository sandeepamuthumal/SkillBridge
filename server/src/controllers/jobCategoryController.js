import JobCategory from "../models/JobCategory.js";

// Create a Job Category
export const createJobCategory = async (req, res) => {
  try {
    const jobCategory = new JobCategory(req.body);
    const saved = await jobCategory.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all Job Categories
export const getAllJobCategories = async (req, res) => {
  try {
    const categories = await JobCategory.find().populate('parentCategory');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get one Job Category by ID
export const getJobCategoryById = async (req, res) => {
  try {
    const category = await JobCategory.findById(req.params.id).populate('parentCategory');
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a Job Category
export const updateJobCategory = async (req, res) => {
  try {
    const updated = await JobCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Category not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a Job Category
export const deleteJobCategory = async (req, res) => {
  try {
    const deleted = await JobCategory.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
