import express from 'express';
import { getAllDrives, getDriveById, createDrive, updateDrive } from '../controllers/driveController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllDrives);
router.get('/:id', getDriveById);
router.post('/', verifyToken, requireRole('staff', 'admin'), createDrive);
router.put('/:id', verifyToken, requireRole('staff', 'admin'), updateDrive);

export default router;
