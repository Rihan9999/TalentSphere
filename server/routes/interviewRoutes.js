import express from 'express';
import { scheduleInterview, updateInterviewResult, getInterviews } from '../controllers/interviewController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);
router.get('/', getInterviews);
router.post('/', requireRole('staff', 'recruiter', 'admin'), scheduleInterview);
router.put('/:id/result', requireRole('staff', 'recruiter', 'admin'), updateInterviewResult);

export default router;
