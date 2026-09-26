import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    driveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PlacementDrive',
      required: true,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
    },
    interviewType: {
      type: String,
      enum: ['Online Assessment', 'Technical', 'HR', 'Managerial', 'Group Discussion', 'Aptitude'],
      default: 'Technical',
    },
    round: {
      type: String,
      default: 'Round 1 - Technical Interview',
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
      default: '10:00 AM',
    },
    location: {
      type: String,
      default: 'Virtual (Zoom / Google Meet)',
    },
    meetingLink: {
      type: String,
      default: '',
    },
    interviewer: {
      type: String,
      default: 'Recruitment Panel',
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'PASSED', 'FAILED'],
      default: 'SCHEDULED',
    },
    feedback: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Interview', interviewSchema);
