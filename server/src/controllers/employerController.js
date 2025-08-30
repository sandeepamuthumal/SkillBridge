import Employer from "../models/Employer.js";
import { NotFoundError } from "../errors/not-found-error.js";
import { ValidationError } from "../errors/validation-error.js";

export const updateEmployerProfile = async (req, res, next) => {
    try {
        const {
            companyName,
            industry,
            companyDescription,
            companyWebsite,
            foundedYear,
            companySize,
            contactPersonName,
            phone,
            address,
            facebook,
            twitter,
            linkedin,
        } = req.body;

        const updateData = {};

        if (companyName) updateData.companyName = companyName;
        if (industry) updateData.industry = industry;
        if (companyDescription) updateData.companyDescription = companyDescription;
        if (companyWebsite) updateData.companyWebsite = companyWebsite;
        if (foundedYear) updateData.foundedYear = foundedYear;
        if (companySize) updateData.companySize = companySize;
        if (contactPersonName) updateData.contactPersonName = contactPersonName;
        if (phone) updateData["contactInfo.phone"] = phone;
        if (address) updateData["contactInfo.address"] = address;
        if (facebook) updateData["socialLinks.facebook"] = facebook;
        if (twitter) updateData["socialLinks.twitter"] = twitter;
        if (linkedin) updateData["socialLinks.linkedin"] = linkedin;

        const employer = await Employer.findOneAndUpdate(
            { userId: req.user.id },
            updateData,
            { new: true, runValidators: true }
        );

        if (!employer) {
            return next(new NotFoundError("Employer profile not found"));
        }

        res.status(200).json({
            success: true,
            message: "Employer profile updated successfully",
        });
    } catch (error) {
        next(error);
    }
};


export const uploadLogo = async(req, res, next) => {
    try {
        if (!req.file) {
            throw new ValidationError("No file uploaded");
        }

        // Generate URL for the uploaded file
        const logoUrl = `/uploads/companies/${req.file.filename}`;

        // Update employer profile with logo URL
        let employer = await Employer.findOneAndUpdate({ userId: req.user.id }, { logoUrl }, {
            new: true,
            upsert: true,
        });

        await employer.save();

        res.status(200).json({
            success: true,
            message: "Logo uploaded successfully",
            data: {
                logoUrl,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getEmployerProfile = async(req, res, next) => {
    try {
        const userId = req.user._id;
        let employer = await Employer.findOne({ userId });

        if (!employer) {
            throw new NotFoundError("Employer profile not found");
        }

        const responseData = {
            companyName: employer.companyName,
            industry: employer.industry,
            companyDescription: employer.companyDescription,
            companyWebsite: employer.companyWebsite,
            foundedYear: employer.foundedYear,
            companySize: employer.companySize,
            contactPersonName: employer.contactPersonName,
            phone: employer.contactInfo?.phone,
            address: employer.contactInfo?.address,
            logoUrl: employer.logoUrl,
            linkedin: employer.socialLinks?.linkedin,
            facebook: employer.socialLinks?.facebook,
            twitter: employer.socialLinks?.twitter,
        };

        res.status(200).json({
            success: true,
            data: responseData,
        });
    } catch (error) {
        next(error);
    }
};

export async function createEmployer(req, res) {
    try {
        const {
            userId,
            companyName,
            companyDescription,
            companyWebsite,
            logoUrl,
            industry,
            companySize,
            foundedYear,
            contactPersonName,
            verified,
            verificationDocuments,
            contactInfo,
            socialLinks
        } = req.body;

        const createdEmployer = new Employer({
            userId: userId,
            companyName: companyName,
            companyDescription: companyDescription,
            companyWebsite: companyWebsite,
            logoUrl: logoUrl,
            industry: industry,
            companySize: companySize,
            foundedYear: foundedYear,
            contactPersonName: contactPersonName,
            verified: verified,
            verificationDocuments: verificationDocuments,
            contactInfo: contactInfo,
            socialLinks: socialLinks
        })

        await createdEmployer.save();
        res.status(201).json({
            companyName: companyName,
            logoUrl: logoUrl,
            message: 'Employer Added Successfully'
        });
    } catch (error) {
        res.status(500).json({ message: "Error Occured When Adding Employer" });
        console.error("Error occured in controller when adding employer", error);

    }
}

export async function getAllEmployers(req, res) {
    try {
        const employer = await Employer.find();
        if (!employer.length) return res.status(404).json({ message: "No employers found." });
        console.log(employer);
        res.status(200).json(employer);
    } catch (error) {
        res.status(500).json({ message: "Error Occured When Getting All Employers" });
        console.error("Error occured in controller when getting All employers", error);
    }
}

export async function getEmployerById(req, res) {
    try {
        const id = req.params.id;
        const employer = await Employer.findById(id);
        if (!employer) {
            res.status(404).json({ message: "Invalid Employer ID.." });
        }
        res.status(200).json(employer);
    } catch (error) {
        res.status(500).json({
            message: "Error Occured When Get Specific Employer",
            employer: id
        });
        console.error("Error occured in controller when Get Specific employer", id, error);
    }
}

export async function deleteEmployerById(req, res) {
    try {
        const id = req.params.id;
        const employer = await Employer.findByIdAndDelete(id);
        if (!employer) {
            res.status(404).json({ message: "Invalid Employer ID.." });
        }
        res.status(200).json({ message: "Employer Deleted Successfuly" });
    } catch (error) {
        res.status(500).json({
            message: "Error Occured When Deleting Employer",
            employer: id
        });
        console.error("Error occured in controller when Delete Specific employer", id, error);
    }
}

