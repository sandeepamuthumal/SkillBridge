export const getAllProfessionals = async (req, res) => {
  try {
    const employers = await Employer.find();

    const cleanedEmployers = employers.map(emp => ({
      ...emp.toObject(),
      skills: Array.isArray(emp.skills) ? emp.skills : []
    }));

    res.status(200).json(cleanedEmployers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};