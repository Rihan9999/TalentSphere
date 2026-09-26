import mongoose from 'mongoose';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Staff from '../models/Staff.js';
import Recruiter from '../models/Recruiter.js';
import Company from '../models/Company.js';
import PlacementDrive from '../models/PlacementDrive.js';
import Application from '../models/Application.js';
import StudentDataShare from '../models/StudentDataShare.js';
import Interview from '../models/Interview.js';
import Notification from '../models/Notification.js';
import AuditLog from '../models/AuditLog.js';
import Department from '../models/Department.js';

export const seedInitialData = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️ [Seed] Skipping DB seed because MongoDB is not connected.');
      return;
    }

    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('⚡ [Seed] Database already seeded with existing records.');
      return;
    }

    console.log('🌱 [Seed] Seeding realistic sample dataset for TalentSphere...');

    // 1. Departments
    const cseDept = await Department.create({
      name: 'Computer Science & Engineering',
      code: 'CSE',
      branches: ['Computer Science & Engineering', 'Information Technology'],
      headOfDepartment: 'Dr. Sarah Mitchell',
    });

    const eceDept = await Department.create({
      name: 'Electronics & Communication',
      code: 'ECE',
      branches: ['Electronics & Communication Engineering', 'Electrical & Electronics Engineering'],
      headOfDepartment: 'Dr. Rajiv Menon',
    });

    const mechDept = await Department.create({
      name: 'Mechanical Engineering',
      code: 'MECH',
      branches: ['Mechanical Engineering', 'Civil Engineering'],
      headOfDepartment: 'Dr. Arthur Campbell',
    });

    // 2. Demo Users (Admin, Staff, Recruiter, Student)
    const adminUser = await User.create({
      name: 'Dr. Eleanor Vance (Super Admin)',
      email: 'admin@talentsphere.demo',
      password: 'Password@123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    });

    const staffUser = await User.create({
      name: 'Prof. David Reynolds',
      email: 'staff@talentsphere.demo',
      password: 'Password@123',
      role: 'staff',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    });

    const staffProfile = await Staff.create({
      userId: staffUser._id,
      employeeId: 'EMP-TPO-001',
      department: 'Training & Placement Cell',
      designation: 'Head Placement Officer',
      phone: '+91 98765 43210',
    });

    // 3. Partner Companies
    const tcs = await Company.create({
      name: 'Tata Consultancy Services',
      website: 'https://www.tcs.com',
      industry: 'Information Technology & Consulting',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg',
      description: 'Global leader in IT services, consulting, and business solutions.',
      locations: ['Bangalore', 'Hyderabad', 'Pune', 'Mumbai', 'Chennai'],
      tier: 'Tier 1 - Dream',
      contactEmail: 'campus.hiring@tcs.com',
      contactPhone: '+91 80 6725 1000',
    });

    const infosys = await Company.create({
      name: 'Infosys',
      website: 'https://www.infosys.com',
      industry: 'Next-Generation Digital Services & Consulting',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg',
      description: 'A global leader in next-generation digital services and consulting.',
      locations: ['Bangalore', 'Mysore', 'Pune', 'Hyderabad'],
      tier: 'Tier 1 - Dream',
      contactEmail: 'careers@infosys.com',
    });

    const accenture = await Company.create({
      name: 'Accenture',
      website: 'https://www.accenture.com',
      industry: 'Management & Technology Consulting',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg',
      description: 'Leading global professional services company specializing in digital and cloud capabilities.',
      locations: ['Bangalore', 'Gurgaon', 'Mumbai', 'Hyderabad'],
      tier: 'Tier 1 - Dream',
      contactEmail: 'campus.accenture@accenture.com',
    });

    const wipro = await Company.create({
      name: 'Wipro Limited',
      website: 'https://www.wipro.com',
      industry: 'Information Technology & Cloud',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Logo.svg',
      description: 'Leading global information technology, consulting and business process services company.',
      locations: ['Bangalore', 'Chennai', 'Hyderabad'],
      tier: 'Tier 2 - Super Core',
      contactEmail: 'campus@wipro.com',
    });

    const cognizant = await Company.create({
      name: 'Cognizant',
      website: 'https://www.cognizant.com',
      industry: 'Information Technology Services',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Cognizant_logo_2022.svg',
      description: 'Transforming clients business, operating and technology models for the digital era.',
      locations: ['Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'],
      tier: 'Tier 2 - Super Core',
      contactEmail: 'campus.relations@cognizant.com',
    });

    const deloitte = await Company.create({
      name: 'Deloitte',
      website: 'https://www.deloitte.com',
      industry: 'Audit, Consulting, Advisory & Tax',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg',
      description: 'Industry-leading audit, consulting, tax and advisory services to many of the world’s most admired brands.',
      locations: ['Hyderabad', 'Bangalore', 'Mumbai', 'Gurgaon'],
      tier: 'Tier 1 - Dream',
      contactEmail: 'deloitte.campus@deloitte.com',
    });

    // 4. Recruiter User for TCS
    const recruiterUser = await User.create({
      name: 'Priya Sharma (TCS Talent Acquisition)',
      email: 'recruiter@talentsphere.demo',
      password: 'Password@123',
      role: 'recruiter',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    });

    const recruiterProfile = await Recruiter.create({
      userId: recruiterUser._id,
      companyId: tcs._id,
      designation: 'Senior Lead Campus Recruiter',
      phone: '+91 99887 76655',
      isApproved: true,
    });

    // 5. Students across branches
    const demoStudentsData = [
      {
        name: 'Aarav Patel',
        email: 'student@talentsphere.demo', // Primary Demo Student
        studentId: 'CS2025001',
        branch: 'Computer Science & Engineering',
        graduationYear: 2025,
        cgpa: 8.8,
        tenthPercentage: 92.5,
        twelfthPercentage: 89.0,
        backlogs: 0,
        phone: '+91 91234 56780',
        skills: ['React.js', 'Node.js', 'MongoDB', 'Python', 'Data Structures & Algorithms', 'Docker', 'AWS'],
        projects: [
          {
            title: 'AI Smart Health Diagnostic Portal',
            description: 'Full stack telemedicine web application with machine learning disease risk prediction.',
            technologies: ['React', 'Express', 'Python', 'FastAPI'],
            link: 'https://github.com/demo/smart-health',
          },
          {
            title: 'Distributed Distributed Cache Simulator',
            description: 'High-throughput LRU and LFU cache built with Node.js and Redis cluster.',
            technologies: ['Node.js', 'Redis', 'WebSockets'],
            link: 'https://github.com/demo/cache-sim',
          },
        ],
        certifications: [
          {
            title: 'AWS Certified Cloud Practitioner',
            organization: 'Amazon Web Services',
            issueDate: '2024-03-15',
            credentialUrl: 'https://aws.amazon.com/verify',
          },
        ],
        internships: [
          {
            role: 'Software Development Intern',
            company: 'TechNovus Solutions',
            duration: 'May 2024 - Jul 2024',
            description: 'Engineered RESTful microservices and optimized PostgreSQL query latencies by 35%.',
          },
        ],
        placementStatus: 'Shortlisted',
      },
      {
        name: 'Sneha Kulkarni',
        email: 'sneha.it@talentsphere.demo',
        studentId: 'IT2025014',
        branch: 'Information Technology',
        graduationYear: 2025,
        cgpa: 9.2,
        tenthPercentage: 95.0,
        twelfthPercentage: 93.5,
        backlogs: 0,
        phone: '+91 91234 56781',
        skills: ['Java', 'Spring Boot', 'React', 'Kubernetes', 'System Design'],
        projects: [
          {
            title: 'Fintech Microservices Gateway',
            description: 'High availability payment processing engine with fault-tolerant circuit breakers.',
            technologies: ['Java', 'Spring Cloud', 'Kafka'],
          },
        ],
        placementStatus: 'Placed',
        placedCompany: deloitte._id,
        placedPackage: 8.2,
        placementDate: new Date('2024-11-20'),
        placementRole: 'Technology Analyst - Cloud Advisory',
      },
      {
        name: 'Rohan Verma',
        email: 'rohan.ece@talentsphere.demo',
        studentId: 'EC2025042',
        branch: 'Electronics & Communication Engineering',
        graduationYear: 2025,
        cgpa: 7.9,
        tenthPercentage: 86.0,
        twelfthPercentage: 82.5,
        backlogs: 0,
        phone: '+91 91234 56782',
        skills: ['Embedded C', 'Python', 'VLSI', 'IoT Protocols', 'C++'],
        projects: [
          {
            title: 'Smart Campus IoT Environmental Sensor Grid',
            description: 'LoRaWAN networked sensor hub transmitting real-time air quality metrics to dashboard.',
            technologies: ['ESP32', 'MQTT', 'Python'],
          },
        ],
        placementStatus: 'Registered',
      },
      {
        name: 'Ananya Deshmukh',
        email: 'ananya.eee@talentsphere.demo',
        studentId: 'EE2025029',
        branch: 'Electrical & Electronics Engineering',
        graduationYear: 2025,
        cgpa: 7.4,
        tenthPercentage: 84.0,
        twelfthPercentage: 80.0,
        backlogs: 0,
        phone: '+91 91234 56783',
        skills: ['MATLAB', 'Power Systems', 'Python', 'AutoCAD Electrical'],
        projects: [
          {
            title: 'Renewable Microgrid Load Flow Analysis',
            description: 'Simulation model evaluating solar PV grid synchronization and power factor correction.',
            technologies: ['MATLAB', 'Simulink'],
          },
        ],
        placementStatus: 'Unplaced',
      },
      {
        name: 'Vikramaditya Rao',
        email: 'vikram.mech@talentsphere.demo',
        studentId: 'ME2025018',
        branch: 'Mechanical Engineering',
        graduationYear: 2025,
        cgpa: 6.9,
        tenthPercentage: 78.0,
        twelfthPercentage: 75.0,
        backlogs: 1, // Has 1 backlog for realistic eligibility testing!
        phone: '+91 91234 56784',
        skills: ['SolidWorks', 'ANSYS', 'AutoCAD', 'Python', 'Finite Element Analysis'],
        projects: [
          {
            title: 'Aerodynamic Optimization of Formula Student Chassis',
            description: 'Computational Fluid Dynamics simulation testing downforce and drag coefficients.',
            technologies: ['ANSYS Fluent', 'SolidWorks'],
          },
        ],
        placementStatus: 'Unplaced',
      },
      {
        name: 'Pooja Nair',
        email: 'pooja.cse@talentsphere.demo',
        studentId: 'CS2025088',
        branch: 'Computer Science & Engineering',
        graduationYear: 2025,
        cgpa: 8.4,
        tenthPercentage: 89.0,
        twelfthPercentage: 88.0,
        backlogs: 0,
        phone: '+91 91234 56785',
        skills: ['Python', 'Django', 'React', 'Machine Learning', 'TensorFlow', 'PostgreSQL'],
        projects: [
          {
            title: 'NLP Sentiment Analysis for Customer Reviews',
            description: 'BERT-powered classification model deployed with FastAPI on Google Cloud Run.',
            technologies: ['PyTorch', 'Transformers', 'FastAPI'],
          },
        ],
        placementStatus: 'Shortlisted',
      },
    ];

    const createdStudents = [];

    for (const data of demoStudentsData) {
      const studentUser = await User.create({
        name: data.name,
        email: data.email,
        password: 'Password@123',
        role: 'student',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}&backgroundColor=4f46e5`,
      });

      const student = await Student.create({
        userId: studentUser._id,
        studentId: data.studentId,
        department: data.branch.includes('Mechanical')
          ? 'Mechanical Engineering'
          : data.branch.includes('Electronics') || data.branch.includes('Electrical')
          ? 'Electronics & Electrical'
          : 'Computer Science & Engineering',
        branch: data.branch,
        graduationYear: data.graduationYear,
        cgpa: data.cgpa,
        tenthPercentage: data.tenthPercentage,
        twelfthPercentage: data.twelfthPercentage,
        backlogs: data.backlogs,
        phone: data.phone,
        skills: data.skills,
        projects: data.projects,
        certifications: data.certifications || [],
        internships: data.internships || [],
        resume: `/uploads/resumes/sample-resume-${data.studentId.toLowerCase()}.pdf`,
        resumeOriginalName: `${data.name.replace(' ', '_')}_Resume_2025.pdf`,
        placementStatus: data.placementStatus,
        placedCompany: data.placedCompany,
        placedPackage: data.placedPackage,
        placementDate: data.placementDate,
        placementRole: data.placementRole,
      });

      createdStudents.push({ user: studentUser, student });
    }

    const primaryStudent = createdStudents[0].student;
    const secondaryStudent = createdStudents[1].student;
    const poojaStudent = createdStudents[5].student;

    // 6. Placement Drives
    const drive1 = await PlacementDrive.create({
      title: 'TCS Digital & Innovator Campus Drive 2025',
      companyId: tcs._id,
      createdByStaffId: staffUser._id,
      jobTitle: 'Software Engineer - Digital Practice',
      jobDescription:
        'TCS Digital is looking for high-caliber engineers proficient in modern full stack development, cloud platforms, and algorithmic problem solving. Join our digital innovation lab.',
      ctc: 7.5,
      ctcBreakup: 'Fixed: ₹6.8 LPA + Performance Bonus: ₹0.7 LPA',
      location: 'Pan India (Bengaluru, Hyderabad, Pune, Mumbai)',
      driveDate: new Date(Date.now() + 7 * 24 * 3600 * 1000), // In 7 days
      applicationDeadline: new Date(Date.now() + 5 * 24 * 3600 * 1000), // In 5 days
      status: 'OPEN',
      vacancies: 25,
      selectionProcess: ['Online Assessment', 'Technical Round 1', 'Managerial Interview', 'HR Interview'],
      eligibility: {
        minCgpa: 7.5,
        maxBacklogs: 0,
        eligibleBranches: [
          'Computer Science & Engineering',
          'Information Technology',
          'Electronics & Communication Engineering',
        ],
        eligibleDepartments: ['Computer Science & Engineering', 'Electronics & Electrical', 'Engineering & Technology'],
        eligibleGraduationYears: [2025],
        minTenthPercentage: 70,
        minTwelfthPercentage: 70,
        requiredSkills: ['Problem Solving', 'Data Structures', 'Web Development'],
      },
    });

    const drive2 = await PlacementDrive.create({
      title: 'Infosys Specialist Programmer (SP) Drive 2025',
      companyId: infosys._id,
      createdByStaffId: staffUser._id,
      jobTitle: 'Specialist Programmer (Power Programmer)',
      jobDescription:
        'Specialist Programmer role focusing on high-impact technology architectures, distributed computing, microservices, and AI integrations.',
      ctc: 9.5,
      location: 'Bengaluru / Pune / Mysore',
      driveDate: new Date(Date.now() + 14 * 24 * 3600 * 1000),
      applicationDeadline: new Date(Date.now() + 10 * 24 * 3600 * 1000),
      status: 'OPEN',
      vacancies: 15,
      selectionProcess: ['HackWithInfy Coding Round', 'Technical Interview', 'HR Round'],
      eligibility: {
        minCgpa: 8.0,
        maxBacklogs: 0,
        eligibleBranches: ['Computer Science & Engineering', 'Information Technology'],
        eligibleDepartments: ['Computer Science & Engineering'],
        eligibleGraduationYears: [2025],
        minTenthPercentage: 75,
        minTwelfthPercentage: 75,
        requiredSkills: ['Java', 'Algorithms', 'System Design'],
      },
    });

    const drive3 = await PlacementDrive.create({
      title: 'Deloitte USI Technology Advisory Campus 2025',
      companyId: deloitte._id,
      createdByStaffId: staffUser._id,
      jobTitle: 'Technology Analyst - Cloud & Cyber Risk',
      jobDescription:
        'Join Deloitte USI Technology practice to architect enterprise-grade cloud transformations, cyber threat resilience, and automated DevOps workflows.',
      ctc: 8.2,
      location: 'Hyderabad / Bengaluru / Gurugram',
      driveDate: new Date(Date.now() - 15 * 24 * 3600 * 1000), // Past completed drive
      applicationDeadline: new Date(Date.now() - 20 * 24 * 3600 * 1000),
      status: 'COMPLETED',
      vacancies: 12,
      selectionProcess: ['Aptitude & Coding Test', 'Technical Interview', 'Partner Round'],
      eligibility: {
        minCgpa: 6.8,
        maxBacklogs: 0,
        eligibleBranches: [
          'Computer Science & Engineering',
          'Information Technology',
          'Electronics & Communication Engineering',
          'Electrical & Electronics Engineering',
        ],
        eligibleDepartments: ['Computer Science & Engineering', 'Electronics & Electrical'],
        eligibleGraduationYears: [2025],
        minTenthPercentage: 65,
        minTwelfthPercentage: 65,
      },
    });

    const drive4 = await PlacementDrive.create({
      title: 'Accenture Advanced App Engineering Hiring 2025',
      companyId: accenture._id,
      createdByStaffId: staffUser._id,
      jobTitle: 'Advanced Application Engineering Analyst',
      jobDescription:
        'Deliver state-of-the-art software solutions across global enterprises using React, Cloud native architectures, and AI tooling.',
      ctc: 6.5,
      location: 'PAN India',
      driveDate: new Date(Date.now() + 18 * 24 * 3600 * 1000),
      applicationDeadline: new Date(Date.now() + 12 * 24 * 3600 * 1000),
      status: 'OPEN',
      vacancies: 40,
      selectionProcess: ['Cognitive & Technical Assessment', 'Coding Test', 'Communication Test', 'Interview'],
      eligibility: {
        minCgpa: 6.5,
        maxBacklogs: 1, // Allows Vikramaditya (Mech, 1 backlog) to be eligible!
        eligibleBranches: [
          'Computer Science & Engineering',
          'Information Technology',
          'Electronics & Communication Engineering',
          'Electrical & Electronics Engineering',
          'Mechanical Engineering',
        ],
        eligibleDepartments: ['Computer Science & Engineering', 'Electronics & Electrical', 'Mechanical Engineering'],
        eligibleGraduationYears: [2025],
        minTenthPercentage: 60,
        minTwelfthPercentage: 60,
      },
    });

    // 7. Applications
    // Aarav (student@talentsphere.demo) applied to TCS
    const app1 = await Application.create({
      driveId: drive1._id,
      studentId: primaryStudent._id,
      status: 'SHORTLISTED',
      appliedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
      timeline: [
        {
          status: 'REGISTERED',
          date: new Date(Date.now() - 3 * 24 * 3600 * 1000),
          note: 'Application registered successfully by student',
          updatedBy: primaryStudent.userId,
        },
        {
          status: 'ELIGIBILITY_VERIFIED',
          date: new Date(Date.now() - 2 * 24 * 3600 * 1000),
          note: 'Eligibility verified: CGPA 8.8 >= 7.5, Backlogs 0, CSE branch match.',
          updatedBy: staffUser._id,
        },
        {
          status: 'SHORTLISTED',
          date: new Date(Date.now() - 1 * 24 * 3600 * 1000),
          note: 'Official candidate profile shared with TCS Campus Recruitment Team',
          updatedBy: staffUser._id,
        },
      ],
      recruiterNotes: 'Impressive GitHub portfolio and strong full stack fundamentals.',
    });

    // Pooja applied to TCS
    const app2 = await Application.create({
      driveId: drive1._id,
      studentId: poojaStudent._id,
      status: 'SHORTLISTED',
      appliedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
      timeline: [
        {
          status: 'REGISTERED',
          date: new Date(Date.now() - 3 * 24 * 3600 * 1000),
          note: 'Application registered successfully by student',
          updatedBy: poojaStudent.userId,
        },
        {
          status: 'SHORTLISTED',
          date: new Date(Date.now() - 1 * 24 * 3600 * 1000),
          note: 'Profile shared with TCS Recruiter',
          updatedBy: staffUser._id,
        },
      ],
    });

    // Sneha selected at Deloitte
    const app3 = await Application.create({
      driveId: drive3._id,
      studentId: secondaryStudent._id,
      status: 'SELECTED',
      appliedAt: new Date(Date.now() - 25 * 24 * 3600 * 1000),
      timeline: [
        { status: 'REGISTERED', date: new Date(Date.now() - 25 * 24 * 3600 * 1000), note: 'Applied' },
        { status: 'SHORTLISTED', date: new Date(Date.now() - 20 * 24 * 3600 * 1000), note: 'Shortlisted' },
        { status: 'INTERVIEW', date: new Date(Date.now() - 16 * 24 * 3600 * 1000), note: 'Passed Technical Round' },
        { status: 'SELECTED', date: new Date('2024-11-20'), note: 'Selected for offer with CTC ₹8.2 LPA' },
      ],
      offerDetails: {
        offeredCtc: 8.2,
        acceptedAt: new Date('2024-11-20'),
      },
    });

    // 8. Core Data Share Record: Staff shared Aarav & Pooja with TCS for Drive 1
    const dataShareRecord = await StudentDataShare.create({
      driveId: drive1._id,
      companyId: tcs._id,
      studentIds: [primaryStudent._id, poojaStudent._id],
      sharedByStaffId: staffUser._id,
      sharedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000),
      status: 'SENT',
      notes: 'Initial shortlist of top CSE candidates meeting 7.5+ CGPA and zero backlogs for Digital role.',
      batchName: 'TCS Digital Batch 1',
    });

    // 9. Scheduled Interview for Aarav with TCS
    const interview1 = await Interview.create({
      studentId: primaryStudent._id,
      companyId: tcs._id,
      driveId: drive1._id,
      applicationId: app1._id,
      interviewType: 'Technical',
      round: 'Round 1 - Algorithms & System Architecture',
      date: new Date(Date.now() + 3 * 24 * 3600 * 1000),
      time: '11:00 AM IST',
      location: 'Virtual Video Conference',
      meetingLink: 'https://meet.google.com/xyz-talentsphere-tcs',
      interviewer: 'Priya Sharma & Technical Lead',
      notes: 'Please keep webcam enabled and have code editor ready for live coding exercises.',
      status: 'SCHEDULED',
    });

    // 10. Sample Notifications
    await Notification.create({
      userId: primaryStudent.userId,
      title: 'Profile Shared with Tata Consultancy Services! 🚀',
      message:
        'Your profile has been officially shortlisted and sent to TCS by the College Placement Cell for Software Engineer - Digital Practice.',
      type: 'data_share',
      link: '/student/applications',
    });

    await Notification.create({
      userId: primaryStudent.userId,
      title: 'Technical Interview Scheduled! 📅',
      message:
        'TCS has scheduled your Round 1 Technical Interview on ' +
        new Date(Date.now() + 3 * 24 * 3600 * 1000).toLocaleDateString() +
        ' at 11:00 AM IST.',
      type: 'interview',
      link: '/student/interviews',
    });

    await Notification.create({
      userId: recruiterUser._id,
      title: 'New Student Data Received (2 Profiles)',
      message: 'Placement Officer Prof. David Reynolds shared 2 eligible student profiles for TCS Digital Drive 2025.',
      type: 'data_share',
      link: `/recruiter/drives/${drive1._id}/students`,
    });

    // 11. Audit Logs
    await AuditLog.create({
      userId: staffUser._id,
      userName: staffUser.name,
      role: 'staff',
      action: 'DATA_SHARE',
      entity: 'StudentDataShare',
      entityId: dataShareRecord._id.toString(),
      details: 'Shared 2 student profiles (CS2025001, CS2025088) with Tata Consultancy Services',
      ipAddress: '127.0.0.1',
    });

    await AuditLog.create({
      userId: staffUser._id,
      userName: staffUser.name,
      role: 'staff',
      action: 'CREATE_DRIVE',
      entity: 'PlacementDrive',
      entityId: drive1._id.toString(),
      details: 'Created placement drive: TCS Digital & Innovator Campus Drive 2025',
      ipAddress: '127.0.0.1',
    });

    console.log('✅ [Seed] Successfully seeded all demo users, departments, companies, drives, and student records!');
  } catch (error) {
    console.error('❌ [Seed Error]', error);
  }
};

if (process.argv[1] && process.argv[1].endsWith('seedData.js')) {
  const { connectDB } = await import('../config/db.js');
  await connectDB();
  await seedInitialData();
  process.exit(0);
}
