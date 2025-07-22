import express from "express";
import { Resend } from 'resend';
import City from "../models/City.js";

const resend = new Resend('re_PoyqkuE7_PU7rSEtzAVuTn52bkBMN7rbg');
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