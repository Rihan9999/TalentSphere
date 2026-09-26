/**
 * Eligibility Service
 * Evaluates student academic and skill profile against drive requirements.
 * Returns exact reasons if student is not eligible.
 */

export const checkStudentEligibility = (student, drive) => {
  const reasons = [];
  const criteria = drive.eligibility || {};

  // 1. CGPA Check
  if (criteria.minCgpa !== undefined && criteria.minCgpa !== null) {
    const studentCgpa = Number(student.cgpa || 0);
    if (studentCgpa < criteria.minCgpa) {
      reasons.push(
        `CGPA requirement is ${criteria.minCgpa.toFixed(1)}, your CGPA is ${studentCgpa.toFixed(1)}.`
      );
    }
  }

  // 2. Active Backlogs Check
  if (criteria.maxBacklogs !== undefined && criteria.maxBacklogs !== null) {
    const studentBacklogs = Number(student.backlogs || 0);
    if (studentBacklogs > criteria.maxBacklogs) {
      reasons.push(
        `Maximum allowed active backlogs is ${criteria.maxBacklogs}, you currently have ${studentBacklogs} backlog(s).`
      );
    }
  }

  // 3. Eligible Branches Check
  if (Array.isArray(criteria.eligibleBranches) && criteria.eligibleBranches.length > 0) {
    const allowedBranches = criteria.eligibleBranches.map((b) => b.trim().toLowerCase());
    const studentBranch = (student.branch || '').trim().toLowerCase();

    // Check branch match or partial match (e.g. "CSE" or "Computer Science")
    const isBranchAllowed = allowedBranches.some(
      (b) =>
        b === studentBranch ||
        studentBranch.includes(b) ||
        b.includes(studentBranch)
    );

    if (!isBranchAllowed) {
      reasons.push(
        `Eligible branches are [${criteria.eligibleBranches.join(', ')}], your branch is ${student.branch || 'Not Specified'}.`
      );
    }
  }

  // 4. Eligible Departments Check
  if (Array.isArray(criteria.eligibleDepartments) && criteria.eligibleDepartments.length > 0) {
    const allowedDepts = criteria.eligibleDepartments.map((d) => d.trim().toLowerCase());
    const studentDept = (student.department || '').trim().toLowerCase();

    const isDeptAllowed = allowedDepts.some(
      (d) => d === studentDept || studentDept.includes(d) || d.includes(studentDept)
    );

    if (!isDeptAllowed) {
      reasons.push(
        `Eligible departments are [${criteria.eligibleDepartments.join(', ')}], your department is ${student.department || 'Not Specified'}.`
      );
    }
  }

  // 5. Eligible Graduation Years Check
  if (Array.isArray(criteria.eligibleGraduationYears) && criteria.eligibleGraduationYears.length > 0) {
    const allowedYears = criteria.eligibleGraduationYears.map(Number);
    const studentYear = Number(student.graduationYear);

    if (!allowedYears.includes(studentYear)) {
      reasons.push(
        `Eligible graduation year(s): [${criteria.eligibleGraduationYears.join(', ')}], your graduation year is ${studentYear || 'Not Specified'}.`
      );
    }
  }

  // 6. 10th Percentage Check
  if (criteria.minTenthPercentage && criteria.minTenthPercentage > 0) {
    const student10th = Number(student.tenthPercentage || 0);
    if (student10th < criteria.minTenthPercentage) {
      reasons.push(
        `10th standard score requirement is ${criteria.minTenthPercentage}%, your score is ${student10th}%.`
      );
    }
  }

  // 7. 12th / Diploma Percentage Check
  if (criteria.minTwelfthPercentage && criteria.minTwelfthPercentage > 0) {
    const student12th = Number(student.twelfthPercentage || 0);
    const studentDiploma = Number(student.diplomaPercentage || 0);
    const highestSecondary = Math.max(student12th, studentDiploma);

    if (highestSecondary < criteria.minTwelfthPercentage) {
      reasons.push(
        `12th / Diploma score requirement is ${criteria.minTwelfthPercentage}%, your highest score is ${highestSecondary}%.`
      );
    }
  }

  // 8. Required Skills Check (Optional advisory/soft requirement)
  let missingSkills = [];
  if (Array.isArray(criteria.requiredSkills) && criteria.requiredSkills.length > 0) {
    const studentSkills = (student.skills || []).map((s) => s.trim().toLowerCase());
    missingSkills = criteria.requiredSkills.filter(
      (reqSkill) => !studentSkills.some((s) => s.includes(reqSkill.toLowerCase()))
    );
  }

  const isEligible = reasons.length === 0;

  return {
    isEligible,
    reasons,
    missingSkills,
    summary: isEligible
      ? 'You meet all eligibility criteria for this placement drive.'
      : reasons.join(' '),
  };
};
