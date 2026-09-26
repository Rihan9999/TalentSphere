import mongoose from 'mongoose';

const studentDataShareSchema = new mongoose.Schema(
  {
    driveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PlacementDrive',
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    studentIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
      },
    ],
    sharedByStaffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sharedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['PENDING', 'SENT', 'ACKNOWLEDGED', 'COMPLETED'],
      default: 'SENT',
    },
    notes: {
      type: String,
      default: '',
    },
    batchName: {
      type: String,
      default: 'Eligible Candidates Batch',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('StudentDataShare', studentDataShareSchema);
