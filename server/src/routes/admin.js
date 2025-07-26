import express from 'express';
import { auth, authorize } from '../middlewares/auth.js';
import { getAllUsers, updateUserStatus, adminResetPassword } from '../controllers/AdminController.js'; // Will create this controller next
import validateDTO from '../middlewares/validate.js';
import { updateUserStatusDTO, adminResetPasswordDTO } from '../dto/user.dto.js'; // Will create this DTO next

const adminRouter = express.Router();

// All admin routes should be protected and only accessible by 'Admin' role
adminRouter.use(auth, authorize('Admin'));

// Get all users
adminRouter.get('/users', getAllUsers);

// Update user status (activate/deactivate)
adminRouter.patch('/users/:id/status', validateDTO(updateUserStatusDTO), updateUserStatus);

// Admin reset user password
adminRouter.patch('/users/:id/reset-password', validateDTO(adminResetPasswordDTO), adminResetPassword);

export default adminRouter;