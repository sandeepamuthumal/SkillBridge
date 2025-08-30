import express from 'express';
import { auth, authorize } from '../middlewares/auth.js';
import validateDTO from '../middlewares/validate.js';
import { getAdmins, addAdmin, updateAdminEmail, updateAdminPassword, deleteAdmin } from '../controllers/AdminController.js';
import { addAdminDTO, updateAdminEmailDTO, updateAdminPasswordDTO } from '../dto/admin.dto.js';

const adminUsersRouter = express.Router();

adminUsersRouter.use(auth, authorize('Admin'));

adminUsersRouter.get('/admins', getAdmins);
adminUsersRouter.post('/admins', validateDTO(addAdminDTO), addAdmin);
adminUsersRouter.patch('/admins/:id/email', validateDTO(updateAdminEmailDTO), updateAdminEmail);
adminUsersRouter.patch('/admins/:id/password', validateDTO(updateAdminPasswordDTO), updateAdminPassword);
adminUsersRouter.delete('/admins/:id', deleteAdmin);

export default adminUsersRouter;