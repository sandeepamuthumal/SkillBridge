import express from "express";
import City from "../models/City.js";
import JobCategory from "../models/JobCategory.js";
import JobType from "../models/JobType.js";

const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
    res.json({ message: "Hello from the API!" });
});

apiRouter.get('/cities', async(req, res) => {
    try {
        const cities = await City.find({ isActive: true });
        res.status(200).json({
            success: true,
            data: cities
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

//get job categories
apiRouter.get('/job-categories', async(req, res) => {
    try {
        const jobCategories = await JobCategory.find({ isActive: true });
        res.status(200).json({
            success: true,
            data: jobCategories
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

//get job types
apiRouter.get('/job-types', async(req, res) => {
    try {
        const jobTypes = await JobType.find({ isActive: true });
        res.status(200).json({
            success: true,
            data: jobTypes
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default apiRouter;