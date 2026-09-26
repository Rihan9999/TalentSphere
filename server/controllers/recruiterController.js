import Recruiter from '../models/Recruiter.js';
import Company from '../models/Company.js';
import PlacementDrive from '../models/PlacementDrive.js';
import StudentDataShare from '../models/StudentDataShare.js';
import Student from '../models/Student.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import Notification from '../models/Notification.js';
import { logAuditAction } from '../middleware/audit.js';

/**
 * @route   GET /api/recruiter/dashboard
 * @desc    Get recruiter overview metrics
 * @access  Private (Recruiter)
 */
export const getRecruiterDashboard = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ userId: req.user._id }).populate('companyId');
    if (!recruiter) {
      return res.status(404).json({ success: false, message: 'Recruiter profile not found' });
    }

    const companyId = recruiter.companyId._id;

    // Drives assigned to this company
    const drives = await PlacementDrive.find({ companyId });
    const driveIds = drives.map((d) => d._id);

    // Data shares sent to this company
    const dataShares = await StudentDataShare.find({ companyId });
    const sharedStudentIdSet = new Set();
    dataShares.forEach((share) => {
      share.studentIds.forEach((sid) => sharedStudentIdSet.add(sid.toString()));
    });

    const receivedStudentsCount = sharedStudentIdSet.size;

    // Applications for this company's drives
    const applications = await Application.find({ driveId: { $in: driveIds } });
    const shortlistedCount = applications.filter((a) => a.status === 'SHORTLISTED').length;
    const interviewCount = applications.filter((a) => a.status === 'INTERVIEW').length;
    const selectedCount = applications.filter((a) => a.status === 'SELECTED').length;
    const rejectedCount = applications.filter((a) => a.status === 'REJECTED').length;

    // Interviews scheduled
    const interviews = await Interview.find({ companyId })
      .populate('studentId')
      .populate('driveId')
      .sort({ date: 1 })
      .limit(5);

    res.json({
      success: true,
      company: recruiter.companyId,
      metrics: {
        activeDrives: drives.filter((d) => d.status === 'OPEN').length,
        totalDrives: drives.length,
        receivedStudents: receivedStudentsCount,
        shortlisted: shortlistedCount,
        interviews: interviewCount,
        selected: selectedCount,
        rejected: rejectedCount,
      },
      recentInterviews: interviews,
      drives,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/recruiter/drives
 * @desc    Get drives assigned to recruiter's company
 * @access  Private (Recruiter)
 */
export const getRecruiterDrives = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ userId: req.user._id });
    if (!recruiter) {
      return res.status(404).json({ success: false, message: 'Recruiter profile not found' });
    }

    const drives = await PlacementDrive.find({ companyId: recruiter.companyId })
      .populate('companyId')
      .sort({ driveDate: -1 });

    // For each drive, count shared students
    const drivesWithStats = await Promise.all(
      drives.map(async (drive) => {
        const shares = await StudentDataShare.find({ driveId: drive._id });
        const sharedIds = new Set();
        shares.forEach((s) => s.studentIds.forEach((id) => sharedIds.add(id.toString())));

        const apps = await Application.find({ driveId: drive._id });

        return {
          ...drive.toObject(),
          sharedStudentsCount: sharedIds.size,
          shortlistedCount: apps.filter((a) => a.status === 'SHORTLISTED').length,
          interviewCount: apps.filter((a) => a.status === 'INTERVIEW').length,
          selectedCount: apps.filter((a) => a.status === 'SELECTED').length,
        };
      })
    );

    res.json({
      success: true,
      drives: drivesWithStats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/recruiter/drives/:id/students
 * @desc    CRITICAL ACCESS CONTROL: View ONLY student profiles officially shared for this drive
 * @access  Private (Recruiter)
 */
export const getSharedStudentsForDrive = async (req, res) => {
  try {
    const driveId = req.params.id;
    const recruiter = await Recruiter.findOne({ userId: req.user._id });
    if (!recruiter) {
      return res.status(404).json({ success: false, message: 'Recruiter profile not found' });
    }

    const drive = await PlacementDrive.findById(driveId).populate('companyId');
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found' });
    }

    // Verify company match
    if (drive.companyId._id.toString() !== recruiter.companyId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Security Violation: You can only access student profiles shared with your company.',
      });
    }

    // Find ALL student data shares for this drive
    const dataShares = await StudentDataShare.find({ driveId: drive._id, companyId: recruiter.companyId });
    const sharedStudentIds = new Set();
    dataShares.forEach((share) => {
      share.studentIds.forEach((id) => sharedStudentIds.add(id.toString()));
    });

    const studentIdList = Array.from(sharedStudentIds);

    // Fetch ONLY these students, excluding sensitive fields (passwords, tokens, private internal admin notes)
    const students = await Student.find({ _id: { $in: studentIdList } })
      .populate('userId', 'name email avatar')
      .select('-__v');

    // Fetch application statuses
    const applications = await Application.find({
      driveId: drive._id,
      studentId: { $in: studentIdList },
    });

    const appMap = new Map();
    applications.forEach((a) => appMap.set(a.studentId.toString(), a));

    // Combine safe placement profile with application status
    const sanitizedCandidateProfiles = students.map((student) => {
      const app = appMap.get(student._id.toString());
      return {
        _id: student._id,
        studentId: student.studentId,
        name: student.userId?.name || 'Candidate',
        email: student.userId?.email,
        phone: student.phone,
        department: student.department,
        branch: student.branch,
        graduationYear: student.graduationYear,
        cgpa: student.cgpa,
        tenthPercentage: student.tenthPercentage,
        twelfthPercentage: student.twelfthPercentage,
        diplomaPercentage: student.diplomaPercentage,
        backlogs: student.backlogs,
        skills: student.skills || [],
        projects: student.projects || [],
        certifications: student.certifications || [],
        internships: student.internships || [],
        resume: student.resume,
        resumeOriginalName: student.resumeOriginalName,
        profilePhoto: student.profilePhoto || student.userId?.avatar,
        applicationId: app ? app._id : null,
        applicationStatus: app ? app.status : 'SHORTLISTED',
        recruiterNotes: app?.recruiterNotes || '',
      };
    });

    res.json({
      success: true,
      drive,
      students: sanitizedCandidateProfiles,
      totalShared: sanitizedCandidateProfiles.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   PUT /api/recruiter/applications/:id/status
 * @desc    Shortlist, Reject, or Select a student
 * @access  Private (Recruiter)
 */
export const updateCandidateStatus = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { status, note, offeredCtc } = req.body;

    const allowedStatuses = ['SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED', 'WAITLISTED'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid application status' });
    }

    const application = await Application.findById(applicationId)
      .populate('driveId')
      .populate('studentId');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const recruiter = await Recruiter.findOne({ userId: req.user._id }).populate('companyId');
    if (application.driveId.companyId.toString() !== recruiter.companyId._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized for this company application' });
    }

    const previousStatus = application.status;
    application.status = status;
    if (note) application.recruiterNotes = note;

    if (status === 'SELECTED' && offeredCtc) {
      application.offerDetails = {
        offeredCtc: Number(offeredCtc),
        acceptedAt: new Date(),
      };
    }

    // Add to timeline
    application.timeline.push({
      status,
      date: new Date(),
      note: note || `Status updated to ${status} by ${recruiter.companyId.name} recruiter`,
      updatedBy: req.user._id,
    });

    await application.save();

    // If SELECTED, update student's primary placementStatus and placedCompany
    const student = await Student.findById(application.studentId._id);
    if (student) {
      if (status === 'SELECTED') {
        student.placementStatus = 'Placed';
        student.placedCompany = recruiter.companyId._id;
        student.placedPackage = offeredCtc ? Number(offeredCtc) : application.driveId.ctc;
        student.placementDate = new Date();
        student.placementDrive = application.driveId._id;
        student.placementRole = application.driveId.jobTitle;
        await student.save();
      }

      // Notify student
      let title = `Update on ${application.driveId.title}`;
      let message = `Your application status has been updated to: ${status}`;

      if (status === 'SELECTED') {
        title = `🎉 Congratulations! Selected at ${recruiter.companyId.name}!`;
        message = `You have been officially selected for ${application.driveId.jobTitle} with a package of ₹${student.placedPackage || application.driveId.ctc} LPA!`;
      } else if (status === 'SHORTLISTED') {
        title = `Shortlisted by ${recruiter.companyId.name}`;
        message = `You have been shortlisted for ${application.driveId.jobTitle}. Prepare for upcoming rounds!`;
      } else if (status === 'REJECTED') {
        title = `Application Status Update`;
        message = `Thank you for your interest in ${application.driveId.jobTitle} at ${recruiter.companyId.name}. You were not selected for this drive.`;
      }

      await Notification.create({
        userId: student.userId,
        title,
        message,
        type: status === 'SELECTED' ? 'selection' : 'application',
        link: status === 'SELECTED' ? '/student/selection-celebration' : '/student/applications',
      });
    }

    // Audit log
    await logAuditAction({
      userId: req.user._id,
      userName: req.user.name,
      role: 'recruiter',
      action: `CANDIDATE_${status}`,
      entity: 'Application',
      entityId: application._id.toString(),
      details: `Recruiter updated application status from ${previousStatus} to ${status}`,
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      message: `Candidate marked as ${status} successfully`,
      application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   PUT /api/recruiter/company
 * @desc    Update company profile details
 * @access  Private (Recruiter)
 */
export const updateCompanyProfile = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ userId: req.user._id });
    if (!recruiter) {
      return res.status(404).json({ success: false, message: 'Recruiter profile not found' });
    }

    const { website, industry, description, locations, contactEmail, contactPhone } = req.body;

    const company = await Company.findByIdAndUpdate(
      recruiter.companyId,
      {
        ...(website && { website }),
        ...(industry && { industry }),
        ...(description && { description }),
        ...(locations && { locations }),
        ...(contactEmail && { contactEmail }),
        ...(contactPhone && { contactPhone }),
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Company profile updated successfully',
      company,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
