import express from "express";

const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
    res.json({ message: "Hello from the API!" });
});

export default apiRouter;