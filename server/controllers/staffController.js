import User from '../models/User.js';
import Student from '../models/Student.js';
import Company from '../models/Company.js';
import PlacementDrive from '../models/PlacementDrive.js';
import Application from '../models/Application.js';
import StudentDataShare from '../models/StudentDataShare.js';
import Interview from '../models/Interview.js';
import Notification from '../models/Notification.js';
import Recruiter from '../models/Recruiter.js';
import { checkStudentEligibility } from '../services/eligibilityService.js';
import { logAuditAction } from '../middleware/audit.js';

/**
 * @route   GET /api/staff/dashboard
 * @desc    Get comprehensive placement analytics & metrics
 * @access  Private (Staff, Admin)
 */
export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const placedStudents = await Student.countDocuments({ placementStatus: 'Placed' });
    const totalCompanies = await Company.countDocuments();
    const activeDrives = await PlacementDrive.countDocuments({ status: 'OPEN' });
    const totalApplications = await Application.countDocuments();
    const shortlistedCount = await Application.countDocuments({ status: { $in: ['SHORTLISTED', 'INTERVIEW', 'SELECTED'] } });
    const registeredCount = await Application.countDocuments({ status: 'REGISTERED' });

    const placementPercentage = totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0;

    // Package stats
    const placedStudentsWithPackage = await Student.find({
      placementStatus: 'Placed',
      placedPackage: { $gt: 0 },
    }).select('placedPackage');

    let highestPackage = 0;
    let lowestPackage = 0;
    let totalPackageSum = 0;

    if (placedStudentsWithPackage.length > 0) {
      const packages = placedStudentsWithPackage.map((s) => s.placedPackage);
      highestPackage = Math.max(...packages);
      lowestPackage = Math.min(...packages);
      totalPackageSum = packages.reduce((acc, curr) => acc + curr, 0);
    }
    const averagePackage =
      placedStudentsWithPackage.length > 0
        ? Number((totalPackageSum / placedStudentsWithPackage.length).toFixed(1))
        : 0;

    // Branch-wise placement statistics
    const branches = [
      'Computer Science & Engineering',
      'Information Technology',
      'Electronics & Communication Engineering',
      'Electrical & Electronics Engineering',
      'Mechanical Engineering',
    ];

    const branchStats = await Promise.all(
      branches.map(async (branch) => {
        const totalInBranch = await Student.countDocuments({ branch });
        const placedInBranch = await Student.countDocuments({ branch, placementStatus: 'Placed' });
        const shortName = branch
          .replace('Computer Science & Engineering', 'CSE')
          .replace('Information Technology', 'IT')
          .replace('Electronics & Communication Engineering', 'ECE')
          .replace('Electrical & Electronics Engineering', 'EEE')
          .replace('Mechanical Engineering', 'Mech');

        return {
          branch: shortName,
          fullName: branch,
          total: totalInBranch,
          placed: placedInBranch,
          rate: totalInBranch > 0 ? Math.round((placedInBranch / totalInBranch) * 100) : 0,
        };
      })
    );

    // Company-wise selections
    const companies = await Company.find().limit(6);
    const companyStats = await Promise.all(
      companies.map(async (comp) => {
        const selectedCount = await Student.countDocuments({ placedCompany: comp._id });
        return {
          name: comp.name,
          selections: selectedCount,
          tier: comp.tier,
        };
      })
    );

    // Application funnel
    const funnelStats = [
      { stage: 'Applications', count: totalApplications },
      { stage: 'Registered', count: registeredCount },
      { stage: 'Shortlisted', count: await Application.countDocuments({ status: { $in: ['SHORTLISTED', 'INTERVIEW', 'SELECTED'] } }) },
      { stage: 'Interviews', count: await Interview.countDocuments() },
      { stage: 'Placed', count: placedStudents },
    ];

    // Monthly trends (demo dynamic data)
    const monthlyTrends = [
      { month: 'Jul', placed: Math.max(2, Math.round(placedStudents * 0.05)), drives: 3 },
      { month: 'Aug', placed: Math.max(5, Math.round(placedStudents * 0.15)), drives: 7 },
      { month: 'Sep', placed: Math.max(12, Math.round(placedStudents * 0.35)), drives: 12 },
      { month: 'Oct', placed: Math.max(20, Math.round(placedStudents * 0.65)), drives: 18 },
      { month: 'Nov', placed: Math.max(25, Math.round(placedStudents * 0.85)), drives: 14 },
      { month: 'Dec', placed: placedStudents, drives: 8 },
    ];

    // Package distribution brackets
    const packageDistribution = [
      { bracket: '< 4 LPA', count: await Student.countDocuments({ placedPackage: { $lt: 4, $gt: 0 } }) },
      { bracket: '4 - 7 LPA', count: await Student.countDocuments({ placedPackage: { $gte: 4, $lt: 7 } }) },
      { bracket: '7 - 12 LPA', count: await Student.countDocuments({ placedPackage: { $gte: 7, $lt: 12 } }) },
      { bracket: '12 - 20 LPA', count: await Student.countDocuments({ placedPackage: { $gte: 12, $lt: 20 } }) },
      { bracket: '20+ LPA', count: await Student.countDocuments({ placedPackage: { $gte: 20 } }) },
    ];

    res.json({
      success: true,
      stats: {
        totalStudents,
        registeredCount,
        placedStudents,
        unplacedStudents: Math.max(0, totalStudents - placedStudents),
        placementPercentage,
        totalCompanies,
        activeDrives,
        totalApplications,
        shortlistedCount,
        highestPackage: highestPackage ? `${highestPackage} LPA` : '0 LPA',
        lowestPackage: lowestPackage ? `${lowestPackage} LPA` : '0 LPA',
        averagePackage: averagePackage ? `${averagePackage} LPA` : '0 LPA',
      },
      charts: {
        branchStats,
        companyStats,
        funnelStats,
        monthlyTrends,
        packageDistribution,
      },
    });
  } catch (error) {
    console.error('Staff dashboard stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/staff/students
 * @desc    Get all students with search, filters, sorting & pagination
 * @access  Private (Staff, Admin)
 */
export const getStudents = async (req, res) => {
  try {
    const {
      search,
      branch,
      department,
      minCgpa,
      maxBacklogs,
      graduationYear,
      placementStatus,
      page = 1,
      limit = 20,
      sortBy = 'studentId',
      sortOrder = 'asc',
    } = req.query;

    const query = {};

    if (branch) query.branch = branch;
    if (department) query.department = department;
    if (graduationYear) query.graduationYear = Number(graduationYear);
    if (placementStatus) query.placementStatus = placementStatus;
    if (minCgpa) query.cgpa = { ...query.cgpa, $gte: Number(minCgpa) };
    if (maxBacklogs !== undefined && maxBacklogs !== '') {
      query.backlogs = { $lte: Number(maxBacklogs) };
    }

    let students = await Student.find(query)
      .populate('userId', 'name email avatar isActive')
      .populate('placedCompany')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 });

    // Client/In-memory search filtering on name, roll no, email, skills
    if (search) {
      const term = search.toLowerCase();
      students = students.filter((s) => {
        const name = (s.userId?.name || '').toLowerCase();
        const email = (s.userId?.email || '').toLowerCase();
        const roll = (s.studentId || '').toLowerCase();
        const skills = (s.skills || []).join(' ').toLowerCase();
        return name.includes(term) || email.includes(term) || roll.includes(term) || skills.includes(term);
      });
    }

    const total = students.length;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const paginated = students.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.json({
      success: true,
      students: paginated,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/staff/students/:id
 * @desc    Get single student details with applications and history
 * @access  Private (Staff, Admin)
 */
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('userId', 'name email avatar isActive createdAt')
      .populate('placedCompany')
      .populate('placementDrive');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const applications = await Application.find({ studentId: student._id })
      .populate({
        path: 'driveId',
        populate: { path: 'companyId' },
      })
      .sort({ createdAt: -1 });

    const interviews = await Interview.find({ studentId: student._id })
      .populate('companyId driveId')
      .sort({ date: 1 });

    res.json({
      success: true,
      student,
      applications,
      interviews,
      profileCompletion: student.calculateProfileCompletion(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/staff/drives/:id/eligible-students
 * @desc    Automatically identify eligible students for a specific drive
 * @access  Private (Staff, Admin)
 */
export const getEligibleStudentsForDrive = async (req, res) => {
  try {
    const drive = await PlacementDrive.findById(req.params.id).populate('companyId');
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found' });
    }

    const allStudents = await Student.find()
      .populate('userId', 'name email avatar isActive')
      .populate('placedCompany');

    // Get all existing applications for this drive
    const applications = await Application.find({ driveId: drive._id });
    const appliedStudentMap = new Map();
    applications.forEach((app) => {
      appliedStudentMap.set(app.studentId.toString(), app);
    });

    // Get already shared students for this drive
    const previousShares = await StudentDataShare.find({ driveId: drive._id });
    const sharedStudentIds = new Set();
    previousShares.forEach((share) => {
      share.studentIds.forEach((sid) => sharedStudentIds.add(sid.toString()));
    });

    const eligibleList = [];
    const ineligibleList = [];

    allStudents.forEach((student) => {
      const evaluation = checkStudentEligibility(student, drive);
      const app = appliedStudentMap.get(student._id.toString());
      const isShared = sharedStudentIds.has(student._id.toString());

      const studentData = {
        _id: student._id,
        studentId: student.studentId,
        name: student.userId?.name || 'N/A',
        email: student.userId?.email || 'N/A',
        branch: student.branch,
        department: student.department,
        graduationYear: student.graduationYear,
        cgpa: student.cgpa,
        tenthPercentage: student.tenthPercentage,
        twelfthPercentage: student.twelfthPercentage,
        backlogs: student.backlogs,
        resume: student.resume,
        skills: student.skills,
        placementStatus: student.placementStatus,
        hasApplied: !!app,
        applicationStatus: app ? app.status : null,
        isSharedWithRecruiter: isShared,
        eligibilityReasons: evaluation.reasons,
      };

      if (evaluation.isEligible) {
        eligibleList.push(studentData);
      } else {
        ineligibleList.push(studentData);
      }
    });

    res.json({
      success: true,
      drive,
      stats: {
        totalEvaluated: allStudents.length,
        eligibleCount: eligibleList.length,
        ineligibleCount: ineligibleList.length,
        appliedCount: applications.length,
      },
      eligibleStudents: eligibleList,
      ineligibleStudents: ineligibleList,
    });
  } catch (error) {
    console.error('Eligible students check error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   POST /api/staff/drives/:id/share-students
 * @desc    CORE FEATURE: Select and send drive-specific student data to recruiter
 * @access  Private (Staff, Admin)
 */
export const shareStudentsWithCompany = async (req, res) => {
  try {
    const driveId = req.params.id;
    const { studentIds, notes, batchName } = req.body;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one student to share' });
    }

    const drive = await PlacementDrive.findById(driveId).populate('companyId');
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Placement drive not found' });
    }

    // Create the StudentDataShare record
    const shareRecord = await StudentDataShare.create({
      driveId: drive._id,
      companyId: drive.companyId._id,
      studentIds,
      sharedByStaffId: req.user._id,
      sharedAt: new Date(),
      status: 'SENT',
      notes: notes || `Shared ${studentIds.length} candidate profiles for ${drive.jobTitle}`,
      batchName: batchName || `Batch ${new Date().toLocaleDateString()}`,
    });

    // Update/create applications for these students if not already present
    await Promise.all(
      studentIds.map(async (sid) => {
        let app = await Application.findOne({ driveId: drive._id, studentId: sid });
        if (!app) {
          app = await Application.create({
            driveId: drive._id,
            studentId: sid,
            status: 'SHORTLISTED',
            timeline: [
              {
                status: 'ELIGIBILITY_VERIFIED',
                date: new Date(),
                note: `Verified eligible and forwarded to ${drive.companyId?.name} by Placement Cell`,
                updatedBy: req.user._id,
              },
              {
                status: 'SHORTLISTED',
                date: new Date(),
                note: `Profile forwarded in official recruitment batch`,
                updatedBy: req.user._id,
              },
            ],
          });
        } else {
          app.status = 'SHORTLISTED';
          app.timeline.push({
            status: 'SHORTLISTED',
            date: new Date(),
            note: `Profile shared with ${drive.companyId?.name} recruiter`,
            updatedBy: req.user._id,
          });
          await app.save();
        }

        // Notify student
        const student = await Student.findById(sid);
        if (student) {
          await Notification.create({
            userId: student.userId,
            title: `Profile Shared with ${drive.companyId?.name}! 🎉`,
            message: `Your profile has been shortlisted and forwarded to ${drive.companyId?.name} for the ${drive.jobTitle} drive.`,
            type: 'data_share',
            link: '/student/applications',
          });
        }
      })
    );

    // Notify recruiter(s) assigned to this company
    const recruiters = await Recruiter.find({ companyId: drive.companyId._id }).populate('userId');
    for (const rec of recruiters) {
      if (rec.userId) {
        await Notification.create({
          userId: rec.userId._id,
          title: `New Student Batch Received (${studentIds.length} profiles)`,
          message: `The placement cell has shared ${studentIds.length} verified candidate profiles for ${drive.jobTitle}.`,
          type: 'data_share',
          link: `/recruiter/drives/${drive._id}/students`,
        });
      }
    }

    // Audit log
    await logAuditAction({
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'DATA_SHARE',
      entity: 'StudentDataShare',
      entityId: shareRecord._id.toString(),
      details: `Sent ${studentIds.length} student profiles to ${drive.companyId?.name} for drive: ${drive.title}`,
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: `Successfully shared ${studentIds.length} student profile(s) with ${drive.companyId?.name}!`,
      shareRecord,
    });
  } catch (error) {
    console.error('Data share error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/staff/drives/:id/shares
 * @desc    Get data share history for a drive
 * @access  Private (Staff, Admin)
 */
export const getDriveShares = async (req, res) => {
  try {
    const shares = await StudentDataShare.find({ driveId: req.params.id })
      .populate('sharedByStaffId', 'name email')
      .populate('studentIds', 'studentId branch cgpa skills')
      .populate('companyId', 'name logo')
      .sort({ sharedAt: -1 });

    res.json({
      success: true,
      shares,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
