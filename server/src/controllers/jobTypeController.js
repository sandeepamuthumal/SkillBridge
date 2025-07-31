import JobType from '../models/JobType.js';  

// Create a new JobType
export async function createJobType(req, res) {
  try {
    const { name, description, isActive } = req.body;

    const newJobType = new JobType({
      name,
      description,
      isActive
    });

    await newJobType.save();

    res.status(201).json({
      message: 'JobType created successfully',
      data: newJobType
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating JobType', error: error.message });
  }
}

// Get all JobTypes
export async function getAllJobTypes(req, res) {
  try {
    const jobTypes = await JobType.find();
    res.status(200).json(jobTypes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching JobTypes', error: error.message });
  }
}

// Get a single JobType by ID
export async function getJobTypeById(req, res) {
  try {
    const { id } = req.params;
    const jobType = await JobType.findById(id);

    if (!jobType) {
      return res.status(404).json({ message: 'JobType not found' });
    }

    res.status(200).json(jobType);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching JobType', error: error.message });
  }
}

// Update a JobType by ID
export async function updateJobTypeById(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedJobType = await JobType.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!updatedJobType) {
      return res.status(404).json({ message: 'JobType not found' });
    }

    res.status(200).json({
      message: 'JobType updated successfully',
      data: updatedJobType
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating JobType', error: error.message });
  }
}

// Delete a JobType by ID
export async function deleteJobTypeById(req, res) {
  try {
    const { id } = req.params;

    const deletedJobType = await JobType.findByIdAndDelete(id);

    if (!deletedJobType) {
      return res.status(404).json({ message: 'JobType not found' });
    }

    res.status(200).json({ message: 'JobType deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting JobType', error: error.message });
  }
}
