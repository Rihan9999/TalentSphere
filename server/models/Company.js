import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      unique: true,
      trim: true,
    },
    website: {
      type: String,
      default: '',
    },
    industry: {
      type: String,
      default: 'Information Technology',
    },
    logo: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    locations: [{ type: String }],
    tier: {
      type: String,
      enum: ['Tier 1 - Dream', 'Tier 2 - Super Core', 'Tier 3 - Mass Recruiter', 'Startup'],
      default: 'Tier 1 - Dream',
    },
    contactEmail: {
      type: String,
      default: '',
    },
    contactPhone: {
      type: String,
      default: '',
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Company', companySchema);
