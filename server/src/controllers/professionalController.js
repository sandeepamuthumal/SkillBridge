import Employer from '../models/Employer.js'; // ✅ use Employer model

export const getAllProfessionals = async (req, res) => {
  try {
    const employers = await Employer.find();
    res.status(200).json(employers); // ✅ return employers (acting as professionals)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
