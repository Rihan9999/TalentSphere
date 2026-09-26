import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organization: { type: String, required: true },
  issueDate: { type: String },
  credentialUrl: { type: String },
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [{ type: String }],
  link: { type: String },
});

const internshipSchema = new mongoose.Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  duration: { type: String },
  description: { type: String },
});

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      default: 'Engineering & Technology',
    },
    branch: {
      type: String,
      required: true,
      enum: [
        'Computer Science & Engineering',
        'Information Technology',
        'Electronics & Communication Engineering',
        'Electrical & Electronics Engineering',
        'Mechanical Engineering',
        'Civil Engineering',
      ],
    },
    graduationYear: {
      type: Number,
      required: true,
      default: 2025,
    },
    cgpa: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    tenthPercentage: {
      type: Number,
      default: 0,
    },
    twelfthPercentage: {
      type: Number,
      default: 0,
    },
    diplomaPercentage: {
      type: Number,
      default: 0,
    },
    backlogs: {
      type: Number,
      default: 0,
      min: 0,
    },
    skills: [{ type: String }],
    certifications: [certificationSchema],
    projects: [projectSchema],
    internships: [internshipSchema],
    resume: {
      type: String,
      default: '',
    },
    resumeOriginalName: {
      type: String,
      default: '',
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
      default: 'Prefer not to say',
    },
    dateOfBirth: {
      type: Date,
    },
    placementStatus: {
      type: String,
      enum: ['Unplaced', 'Registered', 'Shortlisted', 'Interviewing', 'Placed', 'Opted Out'],
      default: 'Unplaced',
    },
    placedCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    placedPackage: {
      type: Number, // In LPA
    },
    placementDate: {
      type: Date,
    },
    placementDrive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PlacementDrive',
    },
    placementRole: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Method to calculate profile completion percentage
studentSchema.methods.calculateProfileCompletion = function () {
  let score = 0;
  const weights = {
    studentId: 5,
    department: 5,
    branch: 10,
    graduationYear: 5,
    cgpa: 10,
    tenthPercentage: 5,
    twelfthPercentage: 5,
    phone: 5,
    skills: 15,
    projects: 15,
    resume: 15,
    internships: 5,
  };

  if (this.studentId) score += weights.studentId;
  if (this.department) score += weights.department;
  if (this.branch) score += weights.branch;
  if (this.graduationYear) score += weights.graduationYear;
  if (this.cgpa > 0) score += weights.cgpa;
  if (this.tenthPercentage > 0) score += weights.tenthPercentage;
  if (this.twelfthPercentage > 0 || this.diplomaPercentage > 0) score += weights.twelfthPercentage;
  if (this.phone) score += weights.phone;
  if (this.skills && this.skills.length > 0) score += weights.skills;
  if (this.projects && this.projects.length > 0) score += weights.projects;
  if (this.resume) score += weights.resume;
  if (this.internships && this.internships.length > 0) score += weights.internships;

  return Math.min(100, score);
};

studentSchema.virtual('profileCompletion').get(function () {
  return this.calculateProfileCompletion();
});

export default mongoose.model('Student', studentSchema);
