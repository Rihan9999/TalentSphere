import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Staff from '../models/Staff.js';
import Recruiter from '../models/Recruiter.js';
import Company from '../models/Company.js';
import { JWT_SECRET } from '../middleware/auth.js';
import { logAuditAction } from '../middleware/audit.js';

// Helper to sign JWT
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new student
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      studentId,
      branch,
      department,
      graduationYear,
      cgpa,
      tenthPercentage,
      twelfthPercentage,
      phone,
    } = req.body;

    if (!name || !email || !password || !studentId) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const existingStudentId = await Student.findOne({ studentId });
    if (existingStudentId) {
      return res.status(400).json({ success: false, message: 'Student ID / Roll number already registered' });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'student',
    });

    // Create student profile
    const student = await Student.create({
      userId: user._id,
      studentId,
      branch: branch || 'Computer Science & Engineering',
      department: department || 'Engineering & Technology',
      graduationYear: graduationYear || 2025,
      cgpa: cgpa ? Number(cgpa) : 7.0,
      tenthPercentage: tenthPercentage ? Number(tenthPercentage) : 75,
      twelfthPercentage: twelfthPercentage ? Number(twelfthPercentage) : 75,
      phone: phone || '',
      skills: ['JavaScript', 'React', 'Problem Solving'],
    });

    const token = generateToken(user._id, user.role);

    await logAuditAction({
      userId: user._id,
      userName: user.name,
      role: user.role,
      action: 'REGISTER_STUDENT',
      entity: 'Student',
      entityId: student._id.toString(),
      details: `New student registration: ${user.name} (${studentId})`,
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      student,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user & get token
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'This account has been deactivated.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
    }

    // Role-specific profile lookup
    let profileData = null;
    if (user.role === 'student') {
      profileData = await Student.findOne({ userId: user._id }).populate('placedCompany');
    } else if (user.role === 'staff') {
      profileData = await Staff.findOne({ userId: user._id });
    } else if (user.role === 'recruiter') {
      profileData = await Recruiter.findOne({ userId: user._id }).populate('companyId');
    }

    const token = generateToken(user._id, user.role);

    await logAuditAction({
      userId: user._id,
      userName: user.name,
      role: user.role,
      action: 'LOGIN',
      entity: 'User',
      entityId: user._id.toString(),
      details: `User logged in successfully with role [${user.role}]`,
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      profile: profileData,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during login' });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let profile = null;

    if (user.role === 'student') {
      profile = await Student.findOne({ userId: user._id }).populate('placedCompany placementDrive');
    } else if (user.role === 'staff') {
      profile = await Staff.findOne({ userId: user._id });
    } else if (user.role === 'recruiter') {
      profile = await Recruiter.findOne({ userId: user._id }).populate('companyId');
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      profile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   POST /api/auth/change-password
 * @desc    Change password
 * @access  Private
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new passwords' });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password does not match' });
    }

    user.password = newPassword;
    await user.save();

    await logAuditAction({
      userId: user._id,
      userName: user.name,
      role: user.role,
      action: 'CHANGE_PASSWORD',
      entity: 'User',
      entityId: user._id.toString(),
      details: 'Password updated successfully',
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Forgot password request
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email' });
    }

    // Demo reset token
    const demoToken = 'reset-token-' + Math.random().toString(36).substring(2);
    user.resetPasswordToken = demoToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    res.json({
      success: true,
      message: 'Password reset link simulated. Use reset token or demo link.',
      resetToken: demoToken,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password using token
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Password has been reset successfully. Please login.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
