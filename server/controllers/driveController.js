import PlacementDrive from '../models/PlacementDrive.js';
import Company from '../models/Company.js';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { logAuditAction } from '../middleware/audit.js';

/**
 * @route   GET /api/drives
 * @desc    Get all drives (with filters)
 * @access  Private / Public
 */
export const getAllDrives = async (req, res) => {
  try {
    const { status, companyId, branch } = req.query;
    const query = {};

    if (status) query.status = status;
    if (companyId) query.companyId = companyId;
    if (branch) query['eligibility.eligibleBranches'] = branch;

    const drives = await PlacementDrive.find(query)
      .populate('companyId')
      .populate('createdByStaffId', 'name email')
      .sort({ driveDate: 1 });

    res.json({
      success: true,
      drives,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/drives/:id
 * @desc    Get single drive with details & applicant summary
 * @access  Private
 */
export const getDriveById = async (req, res) => {
  try {
    const drive = await PlacementDrive.findById(req.params.id)
      .populate('companyId')
      .populate('createdByStaffId', 'name email');

    if (!drive) {
      return res.status(404).json({ success: false, message: 'Drive not found' });
    }

    const applicationCount = await Application.countDocuments({ driveId: drive._id });
    const shortlistedCount = await Application.countDocuments({
      driveId: drive._id,
      status: { $in: ['SHORTLISTED', 'INTERVIEW', 'SELECTED'] },
    });
    const selectedCount = await Application.countDocuments({ driveId: drive._id, status: 'SELECTED' });

    res.json({
      success: true,
      drive,
      stats: {
        applicationCount,
        shortlistedCount,
        selectedCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   POST /api/drives
 * @desc    Create a new placement drive
 * @access  Private (Staff, Admin)
 */
export const createDrive = async (req, res) => {
  try {
    const {
      title,
      companyId,
      jobTitle,
      jobDescription,
      ctc,
      ctcBreakup,
      location,
      driveDate,
      applicationDeadline,
      status,
      vacancies,
      selectionProcess,
      eligibility,
    } = req.body;

    if (!title || !companyId || !jobTitle || !ctc || !driveDate || !applicationDeadline) {
      return res.status(400).json({ success: false, message: 'Please provide all mandatory drive details' });
    }

    const drive = await PlacementDrive.create({
      title,
      companyId,
      createdByStaffId: req.user._id,
      jobTitle,
      jobDescription: jobDescription || 'Exciting software engineering opportunity',
      ctc: Number(ctc),
      ctcBreakup: ctcBreakup || '',
      location: location || 'Bangalore / Hyderabad / Pune',
      driveDate: new Date(driveDate),
      applicationDeadline: new Date(applicationDeadline),
      status: status || 'OPEN',
      vacancies: vacancies ? Number(vacancies) : 10,
      selectionProcess: selectionProcess || ['Online Assessment', 'Technical Interview', 'HR Round'],
      eligibility: {
        minCgpa: eligibility?.minCgpa ? Number(eligibility.minCgpa) : 6.0,
        maxBacklogs: eligibility?.maxBacklogs !== undefined ? Number(eligibility.maxBacklogs) : 0,
        eligibleBranches: eligibility?.eligibleBranches || [
          'Computer Science & Engineering',
          'Information Technology',
        ],
        eligibleDepartments: eligibility?.eligibleDepartments || ['Engineering & Technology'],
        eligibleGraduationYears: eligibility?.eligibleGraduationYears || [2025],
        minTenthPercentage: eligibility?.minTenthPercentage ? Number(eligibility.minTenthPercentage) : 60,
        minTwelfthPercentage: eligibility?.minTwelfthPercentage ? Number(eligibility.minTwelfthPercentage) : 60,
        requiredSkills: eligibility?.requiredSkills || ['DSA', 'Web Development'],
      },
    });

    const populatedDrive = await PlacementDrive.findById(drive._id).populate('companyId');

    // Notify all active students about the new drive
    const students = await User.find({ role: 'student', isActive: true }).select('_id');
    const notifications = students.map((s) => ({
      userId: s._id,
      title: `New Placement Drive: ${populatedDrive.companyId?.name} 🚀`,
      message: `${populatedDrive.companyId?.name} is hiring for ${jobTitle} (${drive.ctcFormatted}). Check eligibility and apply before ${new Date(applicationDeadline).toLocaleDateString()}!`,
      type: 'drive',
      link: `/student/drives/${drive._id}`,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    await logAuditAction({
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'CREATE_DRIVE',
      entity: 'PlacementDrive',
      entityId: drive._id.toString(),
      details: `Created new placement drive: ${title} for ${populatedDrive.companyId?.name}`,
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'Placement drive created successfully and students notified!',
      drive: populatedDrive,
    });
  } catch (error) {
    console.error('Create drive error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   PUT /api/drives/:id
 * @desc    Update placement drive details & status
 * @access  Private (Staff, Admin)
 */
export const updateDrive = async (req, res) => {
  try {
    const drive = await PlacementDrive.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('companyId')
      .populate('createdByStaffId', 'name email');

    if (!drive) {
      return res.status(404).json({ success: false, message: 'Drive not found' });
    }

    await logAuditAction({
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'UPDATE_DRIVE',
      entity: 'PlacementDrive',
      entityId: drive._id.toString(),
      details: `Updated drive ${drive.title} status: ${drive.status}`,
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      message: 'Drive updated successfully',
      drive,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
