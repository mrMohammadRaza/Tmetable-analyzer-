const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['lecture', 'lab', 'tutorial'],
    default: 'lecture',
  },
  credits: {
    type: Number,
    default: 4,
  },
  hoursPerWeek: {
    type: Number,
    default: 4,
  },
  consecutiveHours: {
    type: Number,
    default: 1, // 1 for regular lecture, 2 or 3 for lab practicals
  },
  requiredRoomType: {
    type: String,
    enum: ['lecture', 'lab', 'computer_lab', 'seminar_hall'],
    default: 'lecture',
  },
  preferredFaculty: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
  }],
}, { timestamps: true });

SubjectSchema.index({ organizationId: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('Subject', SubjectSchema);
