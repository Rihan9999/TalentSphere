import mongoose from 'mongoose';

const applicationTimelineSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['REGISTERED', 'ELIGIBILITY_VERIFIED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED', 'WAITLISTED'],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
    default: '',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const applicationSchema = new mongoose.Schema(
  {
    driveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PlacementDrive',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    status: {
      type: String,
      enum: ['REGISTERED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED', 'WAITLISTED'],
      default: 'REGISTERED',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    timeline: [applicationTimelineSchema],
    recruiterNotes: {
      type: String,
      default: '',
    },
    offerDetails: {
      offeredCtc: Number,
      offerLetterUrl: String,
      acceptedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique application per student per drive
applicationSchema.index({ driveId: 1, studentId: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
