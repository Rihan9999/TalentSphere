import User from '../models/User.js';
import Student from '../models/Student.js';
import Staff from '../models/Staff.js';
import Recruiter from '../models/Recruiter.js';
import Company from '../models/Company.js';
import PlacementDrive from '../models/PlacementDrive.js';
import Application from '../models/Application.js';
import AuditLog from '../models/AuditLog.js';
import Department from '../models/Department.js';
import { logAuditAction } from '../middleware/audit.js';

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get Super Admin platform-wide statistics
 * @access  Private (Admin)
 */
export const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const studentCount = await User.countDocuments({ role: 'student' });
    const staffCount = await User.countDocuments({ role: 'staff' });
    const recruiterCount = await User.countDocuments({ role: 'recruiter' });
    const companyCount = await Company.countDocuments();
    const driveCount = await PlacementDrive.countDocuments();
    const activeDrives = await PlacementDrive.countDocuments({ status: 'OPEN' });
    const placedStudents = await Student.countDocuments({ placementStatus: 'Placed' });
    const totalApplications = await Application.countDocuments();
    const auditLogsCount = await AuditLog.countDocuments();

    // Recent audit logs
    const recentLogs = await AuditLog.find().sort({ timestamp: -1 }).limit(10);

    // Recent users
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(6).select('-password');

    res.json({
      success: true,
      stats: {
        totalUsers,
        students: studentCount,
        staff: staffCount,
        recruiters: recruiterCount,
        companies: companyCount,
        totalDrives: driveCount,
        activeDrives,
        placedStudents,
        totalApplications,
        auditLogsCount,
      },
      recentLogs,
      recentUsers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with search & filters
 * @access  Private (Admin)
 */
export const getAllUsers = async (req, res) => {
  try {
    const { role, search, status } = req.query;
    const query = {};

    if (role) query.role = role;
    if (status !== undefined && status !== '') query.isActive = status === 'active';

    let users = await User.find(query).select('-password').sort({ createdAt: -1 });

    if (search) {
      const term = search.toLowerCase();
      users = users.filter((u) => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
    }

    res.json({
      success: true,
      users,
      count: users.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   PUT /api/admin/users/:id/toggle-status
 * @desc    Activate or deactivate user account
 * @access  Private (Admin)
 */
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    await logAuditAction({
      userId: req.user._id,
      userName: req.user.name,
      role: 'admin',
      action: user.isActive ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
      entity: 'User',
      entityId: user._id.toString(),
      details: `Admin changed status of ${user.name} (${user.email}) to ${user.isActive ? 'Active' : 'Inactive'}`,
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      message: `User account is now ${user.isActive ? 'Active' : 'Deactivated'}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   POST /api/admin/staff
 * @desc    Create a new Placement Officer / Staff account
 * @access  Private (Admin)
 */
export const createStaffUser = async (req, res) => {
  try {
    const { name, email, password, employeeId, department, designation, phone } = req.body;

    if (!name || !email || !password || !employeeId) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, password and employee ID' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'staff',
    });

    const staff = await Staff.create({
      userId: user._id,
      employeeId,
      department: department || 'Training & Placement Cell',
      designation: designation || 'Placement Coordinator',
      phone: phone || '',
    });

    await logAuditAction({
      userId: req.user._id,
      userName: req.user.name,
      role: 'admin',
      action: 'CREATE_STAFF',
      entity: 'Staff',
      entityId: staff._id.toString(),
      details: `Admin created staff profile: ${name} (${employeeId})`,
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'Staff account created successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      staff,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   POST /api/admin/recruiters
 * @desc    Create/Approve a Recruiter account and associate with company
 * @access  Private (Admin)
 */
export const createRecruiterUser = async (req, res) => {
  try {
    const { name, email, password, companyId, designation, phone } = req.body;

    if (!name || !email || !password || !companyId) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, password, and company' });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'recruiter',
    });

    const recruiter = await Recruiter.create({
      userId: user._id,
      companyId: company._id,
      designation: designation || 'Talent Acquisition Specialist',
      phone: phone || '',
      isApproved: true,
    });

    await logAuditAction({
      userId: req.user._id,
      userName: req.user.name,
      role: 'admin',
      action: 'CREATE_RECRUITER',
      entity: 'Recruiter',
      entityId: recruiter._id.toString(),
      details: `Admin provisioned recruiter account for ${name} at ${company.name}`,
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'Recruiter account created successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      recruiter,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/admin/audit-logs
 * @desc    View platform audit logs with pagination and filters
 * @access  Private (Admin, Staff)
 */
export const getAuditLogs = async (req, res) => {
  try {
    const { role, action, search, limit = 50 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (action) query.action = action;

    let logs = await AuditLog.find(query).sort({ timestamp: -1 }).limit(Number(limit));

    if (search) {
      const term = search.toLowerCase();
      logs = logs.filter(
        (l) =>
          l.action.toLowerCase().includes(term) ||
          l.userName.toLowerCase().includes(term) ||
          l.details.toLowerCase().includes(term) ||
          l.entity.toLowerCase().includes(term)
      );
    }

    res.json({
      success: true,
      logs,
      count: logs.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   POST /api/admin/companies
 * @desc    Create a partner company
 * @access  Private (Admin, Staff)
 */
export const createCompany = async (req, res) => {
  try {
    const { name, website, industry, logo, description, locations, tier, contactEmail, contactPhone } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Company name is required' });
    }

    const company = await Company.create({
      name,
      website: website || '',
      industry: industry || 'Technology',
      logo: logo || '',
      description: description || '',
      locations: locations || ['Bengaluru', 'Hyderabad'],
      tier: tier || 'Tier 1 - Dream',
      contactEmail: contactEmail || '',
      contactPhone: contactPhone || '',
      isApproved: true,
    });

    await logAuditAction({
      userId: req.user._id,
      userName: req.user.name,
      role: req.user.role,
      action: 'CREATE_COMPANY',
      entity: 'Company',
      entityId: company._id.toString(),
      details: `Created partner company: ${name}`,
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      company,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
