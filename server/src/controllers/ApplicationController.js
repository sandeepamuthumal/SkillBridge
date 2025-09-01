import User from "../models/User.js";
import JobSeeker from "../models/JobSeeker.js";
import { NotFoundError } from "../errors/not-found-error.js";
import { ValidationError } from "../errors/validation-error.js";
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import JobPost from "../models/JobPost.js";
import Application from "../models/Application.js";
import Employer from "../models/Employer.js";
import { application } from "express";
import { app } from "../app.js";

export const seekerApplications = async(req, res, next) => {
    try {
        const userId = req.user._id;
        const jobSeeker = await JobSeeker.findOne({ userId });

        const applications = await Application.find({ jobSeekerId: jobSeeker._id })
            .populate({
                path: 'jobPostId',
                populate: [{
                        path: 'employerId',
                        select: 'companyName logoUrl'
                    },
                    {
                        path: 'categoryId',
                        select: 'name'
                    },
                    {
                        path: 'typeId',
                        select: 'name'
                    },
                    {
                        path: 'cityId',
                        select: 'name'
                    }
                ]
            })
            .populate({
                path: 'jobSeekerId',
                populate: [
                    { path: 'userId', select: 'firstName lastName email' },
                    { path: 'cityId', select: 'name' },
                ]
            }).sort({ appliedDate: -1 })

        res.status(200).json({
            success: true,
            data: applications
        });
    } catch (error) {
        next(error);
    }
};

export const employerApplications = async(req, res, next) => {
    try {
        const userId = req.user._id;
        console.log("Employer User ID:", userId); // Debugging line
        const employer = await Employer.findOne({ userId });

        if (!employer) {
            throw new NotFoundError("Employer not found");
        }

        //get employer job posts ids as an array
        const jobPosts = await JobPost.find({ employerId: employer._id });
        const jobPostIds = jobPosts.map(job => job._id);

        const applications = await Application.find({ jobPostId: { $in: jobPostIds } })
            .populate({
                path: 'jobPostId',
                populate: [
                    { path: 'employerId', select: 'companyName logoUrl' },
                    { path: 'cityId', select: 'name' },
                    { path: 'typeId', select: 'name' },
                ]
            })
            .populate({
                path: 'jobSeekerId',
                populate: [
                    { path: 'userId', select: 'firstName lastName email' },
                    { path: 'cityId', select: 'name' },
                ]
            });

        res.status(200).json({
            success: true,
            data: applications
        });
    } catch (error) {
        next(error);
    }
}

export const updateApplicationStatus = async(req, res, next) => {
    try {
        const applicationId = req.params.id;
        const { status } = req.body;

        if (!status) {
            throw new ValidationError("Status cannot be empty");
        }

        const application = await Application.findByIdAndUpdate(
            applicationId, {
                $set: { status: status }, // update the status field
                $push: {
                    statusHistory: {
                        status: status,
                        updatedBy: req.user._id,
                        updatedAt: new Date(),
                        notes: req.body.notes || ''
                    }
                }
            }, { new: true }
        );

        if (!application) {
            throw new NotFoundError("Application not found");
        }

        res.status(200).json({
            success: true,
            data: application,
            message: 'Application status updated successfully'
        });
    } catch (error) {
        next(error);
    }
}