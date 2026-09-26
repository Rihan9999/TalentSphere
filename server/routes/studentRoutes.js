import express from 'express';
import {
  getStudentProfile,
  updateStudentProfile,
  uploadResume,
  uploadProfilePhoto,
  getAvailableDrives,
  applyForDrive,
  getStudentApplications,
  getStudentInterviews,
} from '../controllers/studentController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(verifyToken);
router.use(requireRole('student'));

router.get('/profile', getStudentProfile);
router.put('/profile', updateStudentProfile);
router.post('/resume', upload.single('resume'), uploadResume);
router.post('/photo', upload.single('profilePhoto'), uploadProfilePhoto);
router.get('/drives', getAvailableDrives);
router.post('/drives/:id/apply', applyForDrive);
router.get('/applications', getStudentApplications);
router.get('/interviews', getStudentInterviews);

export default router;
