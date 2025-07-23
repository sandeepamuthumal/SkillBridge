import express from "express";
import City from "../models/City.js";

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

export default apiRouter;