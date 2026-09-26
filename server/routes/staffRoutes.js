import express from 'express';
import {
  getDashboardStats,
  getStudents,
  getStudentById,
  getEligibleStudentsForDrive,
  shareStudentsWithCompany,
  getDriveShares,
} from '../controllers/staffController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);
router.use(requireRole('staff', 'admin'));

router.get('/dashboard', getDashboardStats);
router.get('/students', getStudents);
router.get('/students/:id', getStudentById);
router.get('/drives/:id/eligible-students', getEligibleStudentsForDrive);
router.post('/drives/:id/share-students', shareStudentsWithCompany);
router.get('/drives/:id/shares', getDriveShares);

export default router;
