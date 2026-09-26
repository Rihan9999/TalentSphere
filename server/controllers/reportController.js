import Student from '../models/Student.js';
import Application from '../models/Application.js';
import PlacementDrive from '../models/PlacementDrive.js';
import Company from '../models/Company.js';
import { formatStudentsForExport, generateCSV, generateExcelBuffer } from '../services/exportService.js';

/**
 * @route   GET /api/reports/students
 * @desc    Export student data in CSV or Excel format
 * @access  Private (Staff, Admin)
 */
export const exportStudentsReport = async (req, res) => {
  try {
    const { format = 'csv', branch, placementStatus } = req.query;
    const query = {};
    if (branch) query.branch = branch;
    if (placementStatus) query.placementStatus = placementStatus;

    const students = await Student.find(query)
      .populate('userId', 'name email phone avatar')
      .populate('placedCompany', 'name');

    const formattedRows = formatStudentsForExport(students);

    if (format === 'excel') {
      const buffer = generateExcelBuffer(formattedRows, 'Students');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=talentsphere-students-${Date.now()}.xlsx`);
      return res.send(buffer);
    }

    // Default CSV
    const csvData = generateCSV(formattedRows, 'Student Directory Report');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=talentsphere-students-${Date.now()}.csv`);
    return res.send(csvData);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   GET /api/reports/drive/:id/applicants
 * @desc    Export drive applicants in CSV or Excel
 * @access  Private (Staff, Admin)
 */
export const exportDriveApplicantsReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { format = 'csv' } = req.query;

    const drive = await PlacementDrive.findById(id).populate('companyId');
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Drive not found' });
    }

    const applications = await Application.find({ driveId: drive._id })
      .populate({
        path: 'studentId',
        populate: { path: 'userId' },
      })
      .sort({ appliedAt: 1 });

    const rows = applications.map((app, idx) => {
      const student = app.studentId || {};
      const user = student.userId || {};
      return {
        'S.No': idx + 1,
        'Application ID': app._id.toString(),
        'Student ID': student.studentId || 'N/A',
        'Student Name': user.name || 'N/A',
        'Email': user.email || 'N/A',
        'Phone': student.phone || 'N/A',
        'Branch': student.branch || 'N/A',
        'CGPA': student.cgpa || 0,
        'Backlogs': student.backlogs || 0,
        'Application Status': app.status,
        'Applied Date': new Date(app.appliedAt).toLocaleDateString(),
        'Company': drive.companyId?.name || '',
        'Job Role': drive.jobTitle,
      };
    });

    if (format === 'excel') {
      const buffer = generateExcelBuffer(rows, `${drive.companyId?.name || 'Drive'}-Applicants`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=drive-applicants-${Date.now()}.xlsx`);
      return res.send(buffer);
    }

    const csvData = generateCSV(rows, `Drive Applicants - ${drive.companyId?.name} (${drive.jobTitle})`);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=drive-applicants-${Date.now()}.csv`);
    return res.send(csvData);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
