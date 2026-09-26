import mongoose from 'mongoose';

const placementDriveSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Drive title is required'],
      trim: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company is required'],
    },
    createdByStaffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    ctc: {
      type: Number, // In LPA, e.g. 8.5
      required: true,
    },
    ctcBreakup: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      required: true,
      default: 'Multiple Locations / PAN India',
    },
    driveDate: {
      type: Date,
      required: true,
    },
    applicationDeadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'OPEN', 'CLOSED', 'COMPLETED', 'CANCELLED'],
      default: 'OPEN',
    },
    vacancies: {
      type: Number,
      default: 10,
    },
    selectionProcess: [
      {
        type: String,
      },
    ],
    eligibility: {
      minCgpa: {
        type: Number,
        default: 6.0,
      },
      maxBacklogs: {
        type: Number,
        default: 0,
      },
      eligibleBranches: [
        {
          type: String,
        },
      ],
      eligibleDepartments: [
        {
          type: String,
        },
      ],
      eligibleGraduationYears: [
        {
          type: Number,
        },
      ],
      minTenthPercentage: {
        type: Number,
        default: 60,
      },
      minTwelfthPercentage: {
        type: Number,
        default: 60,
      },
      requiredSkills: [
        {
          type: String,
        },
      ],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for formatted CTC
placementDriveSchema.virtual('ctcFormatted').get(function () {
  return `₹${this.ctc} LPA`;
});

export default mongoose.model('PlacementDrive', placementDriveSchema);
