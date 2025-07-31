import express from "express";
import { getAllPublicJobSeekers } from "../controllers/JobSeekerController.js";

const professionalsRouter = express.Router();

// Add some debugging
professionalsRouter.get("/", (req, res, next) => {
    console.log("Professionals route hit!");
    next();
}, getAllPublicJobSeekers);

// Test route
professionalsRouter.get("/test", (req, res) => {
    res.json({ message: "Professionals route is working!" });
});

export default professionalsRouter;