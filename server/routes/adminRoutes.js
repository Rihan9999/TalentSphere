import express from 'express';
import {
  getAdminDashboard,
  getAllUsers,
  toggleUserStatus,
  createStaffUser,
  createRecruiterUser,
  getAuditLogs,
  createCompany,
} from '../controllers/adminController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);
router.use(requireRole('admin'));

router.get('/dashboard', getAdminDashboard);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.post('/staff', createStaffUser);
router.post('/recruiters', createRecruiterUser);
router.get('/audit-logs', getAuditLogs);
router.post('/companies', createCompany);

export default router;
