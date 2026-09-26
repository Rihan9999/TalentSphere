import Interview from '../models/Interview.js';
import Application from '../models/Application.js';
import Student from '../models/Student.js';
import PlacementDrive from '../models/PlacementDrive.js';
import Notification from '../models/Notification.js';
import Recruiter from '../models/Recruiter.js';
import { logAuditAction } from '../middleware/audit.js';

/**
 * @route   POST /api/interviews
 * @desc    Schedule interview for a candidate
 * @access  Private (Staff, Recruiter, Admin)
 */
export const scheduleInterview = async (req, res) => {
  try {
    const {
      studentId,
      driveId,
      companyId,
      interviewType,
      round,
      date,
      time,
      location,
      meetingLink,
      interviewer,
      notes,
    } = req.body;

    if (!studentId || !driveId || !date || !time) {
      return res.status(400).json({ success: false, message: 'Please provide student, drive, date, and time' });
    }

    const drive = await PlacementDrive.findById(driveId).populate('companyId');
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Drive not found' });
    }

    const student = await Student.findById(studentId).populate('userId');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const effectiveCompanyId = companyId || drive.companyId._id;

    // Check/update application status to INTERVIEW
    let application = await Application.findOne({ driveId: drive._id, studentId: student._id });
    if (application) {
      application.status = 'INTERVIEW';
      application.timeline.push({
        status: 'INTERVIEW',
        date: new Date(),
        note: `Interview scheduled: ${round || 'Technical'} on ${new Date(date).toLocaleDateString()} at ${time}`,
        updatedBy: req.user._id,
      });
      await application.save();
    }

    // Create interview record
    const interview = await Interview.create({
      studentId: student._id,
      companyId: effectiveCompanyId,
      driveId: drive._id,
      applicationId: application ? application._id : null,
      interviewType: interviewType || 'Technical',
      round: round || 'Round 1 - Technical Interview',
      date: new Date(date),
      time: time || '10:00 AM',
      location: location || 'Virtual Video Call',
      meetingLink: meetingLink || '',
      interviewer: interviewer || 'Recruitment Panel',
      notes: notes || '',
      status: 'SCHEDULED',
    });

    // Notify student automatically
    await Notification.create({
      userId: student.userId._id,
      title: `Interview Scheduled: ${drive.companyId?.name} 📅`,
      message: `Your ${round || 'Interview'} for ${drive.jobTitle} is scheduled on ${new Date(date).toLocaleDateString()} at ${time}.`,
      type: 'interview',
      link: '/student/interviews',
    });

    // Audit log
    await logAuditAction({
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'SCHEDULE_INTERVIEW',
      entity: 'Interview',
      entityId: interview._id.toString(),
      details: `Scheduled ${round} for ${student.studentId} with ${drive.companyId?.name}`,
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully and student notified',
      interview,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   PUT /api/interviews/:id/result
 * @desc    Update interview result and feedback
 * @access  Private (Staff, Recruiter, Admin)
 */
export const updateInterviewResult = async (req, res) => {
  try {
    const { status, feedback } = req.body;
    const interview = await Interview.findById(req.params.id)
      .populate('studentId')
      .populate('companyId')
      .populate('driveId');

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    interview.status = status;
    if (feedback) interview.feedback = feedback;
    await interview.save();

    // If passed or failed, update application timeline
    if (interview.applicationId) {
      const application = await Application.findById(interview.applicationId);
      if (application) {
        application.timeline.push({
          status: status === 'PASSED' ? 'INTERVIEW' : 'REJECTED',
          date: new Date(),
          note: `Interview result: ${status}. Feedback: ${feedback || 'Completed'}`,
          updatedBy: req.user._id,
        });
        if (status === 'PASSED') {
          // Keep in INTERVIEW stage or ready for offer
        } else if (status === 'FAILED') {
          application.status = 'REJECTED';
        }
        await application.save();
      }
    }

    // Notify student
    const student = await Student.findById(interview.studentId._id);
    if (student) {
      await Notification.create({
        userId: student.userId,
        title: `Interview Status Updated: ${interview.companyId?.name}`,
        message: `Your interview status for ${interview.driveId?.jobTitle} has been updated to: ${status}.`,
        type: 'interview',
        link: '/student/interviews',
      });
    }

    res.json({
      success: true,
      message: `Interview result updated to ${status}`,
      interview,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/interviews
 * @desc    Get interviews list filtered by role
 * @access  Private
 */
export const getInterviews = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user._id });
      query.studentId = student ? student._id : null;
    } else if (req.user.role === 'recruiter') {
      const recruiter = await Recruiter.findOne({ userId: req.user._id });
      query.companyId = recruiter ? recruiter.companyId : null;
    }

    const interviews = await Interview.find(query)
      .populate('studentId')
      .populate('companyId')
      .populate('driveId')
      .sort({ date: 1 });

    res.json({
      success: true,
      interviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
