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
import Feedback from "../models/Feedback.js";

export const getFeedbacks = async(req, res, next) => {
    try {
        const userId = req.user._id;

        let filter = {};

        if (req.user.role === 'employer') {
            const employer = await Employer.findOne({ userId });
            filter.employerId = employer._id;
        } else if (req.user.role === 'jobseeker') {
            const jobSeeker = await JobSeeker.findOne({ userId });
            filter.jobSeekerId = jobSeeker._id;
        }

        const feedbacks = await Feedback.find(filter)
            .populate('employerId', 'companyName logoUrl')
            .populate({
                path: 'jobSeekerId',
                select: 'profilePictureUrl',
                populate: [
                    { path: 'userId', select: 'firstName lastName email' },
                ]
            })
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            data: feedbacks
        });
    } catch (error) {
        next(error);
    }
};

export const createFeedback = async(req, res, next) => {
    try {
        const userId = req.user._id;
        const employer = await Employer.findOne({ userId });

        const obj = req.body;
        obj.employerId = employer._id;
        const newFeedback = new Feedback(req.body);
        const savedFeedback = await newFeedback.save();

        res.status(201).json({
            success: true,
            message: 'Feedback added successfully',
            data: savedFeedback
        });
    } catch (error) {
        next(error);
    }
};

export const getFeedbackById = async(req, res, next) => {
    try {
        const id = req.params.id;
        let feedback = await Feedback.findById(id)
            .populate('employerId', 'companyName logoUrl')
            .populate('cityId', 'name')
            .populate('userId', 'firstName lastName email')
            .lean();

        if (!feedback) {
            throw new NotFoundError("Feedback not found");
        }

        //get employer job posts ids as an array
        const jobPosts = await JobPost.find({ employerId: feedback.employerId });
        const jobPostIds = jobPosts.map(job => job._id);

        const formattedFeedback = {
            ...feedback,
            employerName: feedback.employerId ? feedback.employerId.companyName : 'N/A',
            cityName: feedback.cityId ? feedback.cityId.name : 'N/A',
            userName: feedback.userId ? feedback.userId.firstName + ' ' + feedback.userId.lastName : 'N/A',
            jobPostIds: jobPostIds,
        };

        res.status(200).json({
            success: true,
            data: formattedFeedback,
            message: 'Feedback details fetched successfully'
        });
    } catch (error) {
        next(error);
    }
};