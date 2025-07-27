import Employer from '../models/Employer.js';

export const getAllEmployers = async (req, res, next) => {
  try {
    const employers = await Employer.find().populate('contactInfo.cityId');

    res.status(200).json({
      success: true,
      data: employers,
    });
  } catch (error) {
    next(error);
  }
};
