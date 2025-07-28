import User from "../models/User.js";
import JobSeeker from "../models/JobSeeker.js";
import { NotFoundError } from "../errors/not-found-error.js";
import { ValidationError } from "../errors/validation-error.js";

export const getJobSeekerProfile = async (req, res, next) => {
  try {
    let jobSeeker = await JobSeeker.findOne({ userId: req.user.id })
      .populate("userId", "firstName lastName email")
      .populate("cityId", "name country");

    if (!jobSeeker) {
      throw new NotFoundError("Job Seeker profile not found");
    }

    const responseData = {
      // Basic info from User model
      firstName: jobSeeker.userId.firstName,
      lastName: jobSeeker.userId.lastName,
      email: jobSeeker.userId.email,

      // JobSeeker specific fields
      statementHeader: jobSeeker.statementHeader,
      statement: jobSeeker.statement,
      university: jobSeeker.university,
      fieldOfStudy: jobSeeker.fieldOfStudy,
      profilePictureUrl: jobSeeker.profilePictureUrl,
      cityId: jobSeeker.cityId ? jobSeeker.cityId._id : null,
      cityName: jobSeeker.cityId ? jobSeeker.cityId.name : null,
      cityCountry: jobSeeker.cityId ? jobSeeker.cityId.country : null,
      availability: jobSeeker.availability,
      profileVisibility: jobSeeker.profileVisibility,
      profileViews: jobSeeker.profileViews,
      profileCompleteness: jobSeeker.profileCompleteness,

      // Social links
      socialLinks: jobSeeker.socialLinks,

      // Additional data
      skills: jobSeeker.skills,
      experiences: jobSeeker.experiences,
      projects: jobSeeker.projects,
      educations: jobSeeker.educations,
    };

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};

export const updateJobSeekerProfile = async (req, res, next) => {
  try {
    // Update fields from request body
    const {
      firstName,
      lastName,
      statementHeader,
      statement,
      university,
      fieldOfStudy,
      cityId,
      availability,
      profileVisibility,
    } = req.body;

    // Update User model fields
    const userUpdateData = {};
    if (firstName) userUpdateData.firstName = firstName;
    if (lastName) userUpdateData.lastName = lastName;

    if (Object.keys(userUpdateData).length > 0) {
      await User.findByIdAndUpdate(req.user.id, userUpdateData, {
        new: true,
        runValidators: true,
      });
    }

    // Update JobSeeker model fields
    const jobSeekerUpdateData = {
      statementHeader,
      statement,
      university,
      fieldOfStudy,
      availability,
      profileVisibility,
    };

    if (cityId) {
      jobSeekerUpdateData.cityId = cityId;
    }

    let jobSeeker = await JobSeeker.findOneAndUpdate(
      { userId: req.user.id },
      jobSeekerUpdateData,
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    )
      .populate("userId", "firstName lastName email")
      .populate("cityId", "name country");

    // Format response
    const responseData = {
      firstName: jobSeeker.userId.firstName,
      lastName: jobSeeker.userId.lastName,
      email: jobSeeker.userId.email,
      statementHeader: jobSeeker.statementHeader,
      statement: jobSeeker.statement,
      university: jobSeeker.university,
      fieldOfStudy: jobSeeker.fieldOfStudy,
      profilePictureUrl: jobSeeker.profilePictureUrl,
      cityId: jobSeeker.cityId ? jobSeeker.cityId._id : null,
      cityName: jobSeeker.cityId ? jobSeeker.cityId.name : null,
      availability: jobSeeker.availability,
      profileVisibility: jobSeeker.profileVisibility,
      profileCompleteness: jobSeeker.profileCompleteness,
      socialLinks: jobSeeker.socialLinks,
    };

    res.status(200).json({
      success: true,
      message: "Job Seeker profile updated successfully",
      data: responseData,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return next(error);
    }
    next(error);
  }
};

export const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ValidationError("No file uploaded");
    }

    // Generate URL for the uploaded file
    const profilePictureUrl = `/uploads/profiles/${req.file.filename}`;

    // Update jobseeker profile with image URL
    let jobSeeker = await JobSeeker.findOneAndUpdate(
      { userId: req.user.id },
      { profilePictureUrl },
      {
        new: true,
        upsert: true,
      }
    );

    await jobSeeker.save();

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      data: {
        profilePictureUrl,
        profileCompleteness: jobSeeker.profileCompleteness,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPublicJobSeekers = async (req, res) => {
  try {
    const seekers = await JobSeeker.find({ profileVisibility: "Public" })
      .populate({
        path: "userId", // <-- make sure this matches your schema field name
        select: "firstName lastName email",
      })
      .populate("cityId");

    res.json(seekers);
  } catch (err) {
    console.error("Error getting public job seekers:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getJobSeekerById = async (req, res, next) => {
    try {
        const { seekerId } = req.params; // Get the ID from the URL parameter

        // CORRECTED LINE: Use findOne with userId field
        let jobSeeker = await JobSeeker.findOne({ userId: seekerId })
            .populate("userId", "firstName lastName email")
            .populate("cityId", "name country");

        // ... (rest of your getJobSeekerById logic remains the same)
        // Optional: uncomment if you enforce public profiles
        if (!jobSeeker || jobSeeker.profileVisibility !== "Public") {
             throw new NotFoundError("Job Seeker profile not found or is private");
        }

        if (!jobSeeker) {
            throw new NotFoundError("Job Seeker profile not found");
        }

        const responseData = {
            // ... (your existing responseData structure) ...
            firstName: jobSeeker.userId?.firstName,
            lastName: jobSeeker.userId?.lastName,
            email: jobSeeker.userId?.email,
            userId: { // Add userId object as frontend expects p.userId._id
                _id: jobSeeker.userId._id,
                firstName: jobSeeker.userId.firstName,
                lastName: jobSeeker.userId.lastName,
                email: jobSeeker.userId.email,
            },
            _id: jobSeeker._id, // Add JobSeeker's _id
            statementHeader: jobSeeker.statementHeader,
            statement: jobSeeker.statement,
            university: jobSeeker.university,
            fieldOfStudy: jobSeeker.fieldOfStudy,
            profilePictureUrl: jobSeeker.profilePictureUrl,
            cityId: jobSeeker.cityId ? { // Ensure cityId is an object if populated
                _id: jobSeeker.cityId._id,
                name: jobSeeker.cityId.name,
                country: jobSeeker.cityId.country,
            } : null,
            cityName: jobSeeker.cityId?.name || null,
            cityCountry: jobSeeker.cityId?.country || null,
            availability: jobSeeker.availability,
            profileVisibility: jobSeeker.profileVisibility,
            profileViews: jobSeeker.profileViews,
            profileCompleteness: jobSeeker.profileCompleteness,
            socialLinks: jobSeeker.socialLinks,
            skills: jobSeeker.skills,
            experiences: jobSeeker.experiences,
            projects: jobSeeker.projects,
            educations: jobSeeker.educations,
            expectedSalary: jobSeeker.expectedSalary,
            jobPreferences: jobSeeker.jobPreferences,
            resumeUrl: jobSeeker.resumeUrl,
            experience: jobSeeker.experience, // Make sure this field is included if your frontend uses it
        };

        res.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
};