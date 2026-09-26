import XLSX from 'xlsx';

/**
 * Format records into clean tabular rows for reports
 */
export const formatStudentsForExport = (students) => {
  return students.map((s, idx) => {
    const user = s.userId || {};
    return {
      'S.No': idx + 1,
      'Student ID': s.studentId || 'N/A',
      'Full Name': user.name || s.name || 'N/A',
      'Email': user.email || s.email || 'N/A',
      'Phone': s.phone || 'N/A',
      'Branch': s.branch || 'N/A',
      'Department': s.department || 'N/A',
      'Graduation Year': s.graduationYear || 'N/A',
      'CGPA': s.cgpa || 0,
      '10th %': s.tenthPercentage || 0,
      '12th %': s.twelfthPercentage || 0,
      'Backlogs': s.backlogs || 0,
      'Placement Status': s.placementStatus || 'Unplaced',
      'Placed Company': s.placedCompany?.name || 'N/A',
      'Package (LPA)': s.placedPackage || '-',
      'Skills': Array.isArray(s.skills) ? s.skills.join(', ') : '',
    };
  });
};

/**
 * Generate CSV String
 */
export const generateCSV = (data, title = 'TalentSphere Report') => {
  if (!data || data.length === 0) {
    return `Title: ${title}\nGenerated on: ${new Date().toLocaleString()}\nNo records found.\n`;
  }

  const headers = Object.keys(data[0]);
  const headerLine = headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(',');

  const rows = data.map((row) => {
    return headers
      .map((header) => {
        const val = row[header] === undefined || row[header] === null ? '' : String(row[header]);
        return `"${val.replace(/"/g, '""')}"`;
      })
      .join(',');
  });

  const metadata = [
    `"TalentSphere — Intelligent Campus Recruitment & Career Management platform"`,
    `"Report: ${title}"`,
    `"Generated On: ${new Date().toLocaleString()}"`,
    `""`, // empty line
  ];

  return [...metadata, headerLine, ...rows].join('\r\n');
};

/**
 * Generate Excel Buffer using xlsx
 */
export const generateExcelBuffer = (data, sheetName = 'Report') => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
};
