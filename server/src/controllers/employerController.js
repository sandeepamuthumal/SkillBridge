import Employer from "../models/Employer.js";

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
        if (!employer) res.status(404).json({ message: "Empty Rows in Employers.." });
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

export async function updateEmployerById(req, res) {
    try {
        const {
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

        const updatedEmployer = await Employer.findByIdAndUpdate(req.params.id, {
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
        }, { new: true }, { runValidators: true });

        if (!updatedEmployer) {
            res.status(404).json({ message: "Invalid Employer ID.." });
        }

        res.status(201).json({
            companyName: companyName,
            logoUrl: logoUrl,
            message: 'Employer Updated Successfully'
        });
    } catch (error) {
        res.status(500).json({ message: "Error Occured When Updating Employer" });
        console.error("Error occured in controller when updating employer", error);

    }
}