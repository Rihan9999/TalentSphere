import express from 'express';
import {
  getRecruiterDashboard,
  getRecruiterDrives,
  getSharedStudentsForDrive,
  updateCandidateStatus,
  updateCompanyProfile,
} from '../controllers/recruiterController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);
router.use(requireRole('recruiter'));

router.get('/dashboard', getRecruiterDashboard);
router.get('/drives', getRecruiterDrives);
router.get('/drives/:id/students', getSharedStudentsForDrive);
router.put('/applications/:id/status', updateCandidateStatus);
router.put('/company', updateCompanyProfile);

export default router;
