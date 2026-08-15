const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true,
  },
  code: {
    type: String,
    required: [true, 'Organization code is required'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  address: {
    type: String,
    default: '',
  },
  contactEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  settings: {
    workingDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    timeSlots: [{
      slotIndex: Number,
      startTime: String, // e.g. "09:00"
      endTime: String,   // e.g. "10:00"
      isBreak: { type: Boolean, default: false },
      label: String,     // e.g. "Period 1" or "Lunch Break"
    }],
    slotDurationMinutes: {
      type: Number,
      default: 60,
    },
    maxDailySlotsPerDivision: {
      type: Number,
      default: 7,
    },
  },
  logoUrl: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Organization', OrganizationSchema);
