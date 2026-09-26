import Student from '../models/Student.js';
import User from '../models/User.js';
import PlacementDrive from '../models/PlacementDrive.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import Notification from '../models/Notification.js';
import { checkStudentEligibility } from '../services/eligibilityService.js';
import { logAuditAction } from '../middleware/audit.js';

/**
 * @route   GET /api/students/profile
 * @desc    Get student profile
 * @access  Private (Student)
 */
export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id })
      .populate('userId', 'name email avatar')
      .populate('placedCompany')
      .populate('placementDrive');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const completion = student.calculateProfileCompletion();

    res.json({
      success: true,
      student,
      profileCompletion: completion,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   PUT /api/students/profile
 * @desc    Update student profile details
 * @access  Private (Student)
 */
export const updateStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const {
      department,
      branch,
      graduationYear,
      cgpa,
      tenthPercentage,
      twelfthPercentage,
      diplomaPercentage,
      backlogs,
      skills,
      certifications,
      projects,
      internships,
      phone,
      gender,
      dateOfBirth,
    } = req.body;

    if (department !== undefined) student.department = department;
    if (branch !== undefined) student.branch = branch;
    if (graduationYear !== undefined) student.graduationYear = Number(graduationYear);
    if (cgpa !== undefined) student.cgpa = Number(cgpa);
    if (tenthPercentage !== undefined) student.tenthPercentage = Number(tenthPercentage);
    if (twelfthPercentage !== undefined) student.twelfthPercentage = Number(twelfthPercentage);
    if (diplomaPercentage !== undefined) student.diplomaPercentage = Number(diplomaPercentage);
    if (backlogs !== undefined) student.backlogs = Number(backlogs);
    if (skills !== undefined) student.skills = skills;
    if (certifications !== undefined) student.certifications = certifications;
    if (projects !== undefined) student.projects = projects;
    if (internships !== undefined) student.internships = internships;
    if (phone !== undefined) student.phone = phone;
    if (gender !== undefined) student.gender = gender;
    if (dateOfBirth !== undefined) student.dateOfBirth = dateOfBirth;

    // Optional user name update if provided
    if (req.body.name) {
      await User.findByIdAndUpdate(req.user._id, { name: req.body.name });
    }

    await student.save();

    await logAuditAction({
      userId: req.user._id,
      userName: req.user.name,
      role: 'student',
      action: 'UPDATE_PROFILE',
      entity: 'Student',
      entityId: student._id.toString(),
      details: 'Updated student profile and academic details',
      ipAddress: req.ip,
    });

    const completion = student.calculateProfileCompletion();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      student,
      profileCompletion: completion,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   POST /api/students/resume
 * @desc    Upload student resume
 * @access  Private (Student)
 */
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a file to upload' });
    }

    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const relativeUrl = `/uploads/resumes/${req.file.filename}`;
    student.resume = relativeUrl;
    student.resumeOriginalName = req.file.originalname;
    await student.save();

    await logAuditAction({
      userId: req.user._id,
      userName: req.user.name,
      role: 'student',
      action: 'UPLOAD_RESUME',
      entity: 'Student',
      entityId: student._id.toString(),
      details: `Uploaded resume: ${req.file.originalname}`,
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      resumeUrl: relativeUrl,
      fileName: req.file.originalname,
      profileCompletion: student.calculateProfileCompletion(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   POST /api/students/photo
 * @desc    Upload profile photo
 * @access  Private (Student)
 */
export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image' });
    }

    const relativeUrl = `/uploads/profile-images/${req.file.filename}`;
    await Student.findOneAndUpdate({ userId: req.user._id }, { profilePhoto: relativeUrl });
    await User.findByIdAndUpdate(req.user._id, { avatar: relativeUrl });

    res.json({
      success: true,
      message: 'Profile photo updated successfully',
      avatarUrl: relativeUrl,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/students/drives
 * @desc    Get all available placement drives with calculated eligibility for student
 * @access  Private (Student)
 */
export const getAvailableDrives = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    // Find all open or completed drives
    const drives = await PlacementDrive.find({ status: { $in: ['OPEN', 'CLOSED'] } })
      .populate('companyId')
      .sort({ driveDate: 1 });

    // Check which drives student has already applied to
    const applications = await Application.find({ studentId: student._id });
    const appliedMap = new Map();
    applications.forEach((app) => {
      appliedMap.set(app.driveId.toString(), app);
    });

    const evaluatedDrives = drives.map((drive) => {
      const eligibilityResult = checkStudentEligibility(student, drive);
      const application = appliedMap.get(drive._id.toString());

      return {
        ...drive.toObject(),
        isEligible: eligibilityResult.isEligible,
        eligibilityReasons: eligibilityResult.reasons,
        eligibilitySummary: eligibilityResult.summary,
        hasApplied: !!application,
        applicationStatus: application ? application.status : null,
        applicationId: application ? application._id : null,
      };
    });

    res.json({
      success: true,
      drives: evaluatedDrives,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   POST /api/students/drives/:id/apply
 * @desc    Apply for an eligible placement drive
 * @access  Private (Student)
 */
export const applyForDrive = async (req, res) => {
  try {
    const driveId = req.params.id;
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const drive = await PlacementDrive.findById(driveId).populate('companyId');
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found' });
    }

    if (drive.status !== 'OPEN') {
      return res.status(400).json({ success: false, message: 'This placement drive is no longer accepting applications' });
    }

    // Check application deadline
    if (new Date() > new Date(drive.applicationDeadline)) {
      return res.status(400).json({ success: false, message: 'Application deadline for this drive has passed' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({ driveId, studentId: student._id });
    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'You have already applied for this placement drive' });
    }

    // Check eligibility strictly
    const eligibility = checkStudentEligibility(student, drive);
    if (!eligibility.isEligible) {
      return res.status(400).json({
        success: false,
        message: 'You are not eligible for this drive.',
        reasons: eligibility.reasons,
      });
    }

    // Create Application
    const application = await Application.create({
      driveId: drive._id,
      studentId: student._id,
      status: 'REGISTERED',
      timeline: [
        {
          status: 'REGISTERED',
          date: new Date(),
          note: `Application submitted successfully for ${drive.jobTitle} at ${drive.companyId?.name || 'Company'}`,
          updatedBy: req.user._id,
        },
      ],
    });

    // Create notification for student
    await Notification.create({
      userId: req.user._id,
      title: 'Application Submitted!',
      message: `You applied for ${drive.jobTitle} at ${drive.companyId?.name}. Best of luck!`,
      type: 'application',
      link: '/student/applications',
    });

    await logAuditAction({
      userId: req.user._id,
      userName: req.user.name,
      role: 'student',
      action: 'APPLY_DRIVE',
      entity: 'Application',
      entityId: application._id.toString(),
      details: `Applied for drive: ${drive.title} (${drive.companyId?.name})`,
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/students/applications
 * @desc    Get student's applications with timeline
 * @access  Private (Student)
 */
export const getStudentApplications = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const applications = await Application.find({ studentId: student._id })
      .populate({
        path: 'driveId',
        populate: { path: 'companyId' },
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/students/interviews
 * @desc    Get student's interviews
 * @access  Private (Student)
 */
export const getStudentInterviews = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const interviews = await Interview.find({ studentId: student._id })
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
