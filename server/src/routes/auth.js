import express from "express";
import { signUp, signIn, signOut, getUser } from "../controllers/AuthController.js";
import { auth, isAdmin } from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.post("/signout", auth, signOut);
authRouter.get("/me", auth, getUser);

export default authRouter;