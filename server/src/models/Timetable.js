const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
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
  title: {
    type: String,
    required: true,
    trim: true,
  },
  academicYear: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'under_review', 'published', 'archived'],
    default: 'draft',
  },
  activeVersionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TimetableVersion',
  },
  optimizationScore: {
    type: Number,
    default: 0,
  },
  hardConflictsCount: {
    type: Number,
    default: 0,
  },
  softViolationsCount: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

module.exports = mongoose.model('Timetable', TimetableSchema);
