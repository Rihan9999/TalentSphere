import express from 'express';
import { exportStudentsReport, exportDriveApplicantsReport } from '../controllers/reportController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);
router.use(requireRole('staff', 'admin'));

router.get('/students', exportStudentsReport);
router.get('/drive/:id/applicants', exportDriveApplicantsReport);

export default router;
