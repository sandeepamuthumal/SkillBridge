import express from "express";
import { Resend } from 'resend';

const resend = new Resend('re_PoyqkuE7_PU7rSEtzAVuTn52bkBMN7rbg');
const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
    res.json({ message: "Hello from the API!" });
});

apiRouter.get("/send-email", async(req, res) => {
    //send email using resend
    const { data, error } = await resend.emails.send({
        from: 'SkillBridge <onboarding@resend.dev>',
        to: ['ict22885@fot.sjp.ac.lk'],
        subject: 'Hello Testing',
        html: '<strong>It works!</strong>',
    });

    if (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
        return;
    }

    console.log({ data });

    res.json({ message: "Email sent successfully!", data });
});

export default apiRouter;