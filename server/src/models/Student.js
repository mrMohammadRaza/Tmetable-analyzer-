const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
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
  divisionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Division',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  rollNumber: {
    type: String,
    required: true,
    trim: true,
  },
  batch: {
    type: String, // e.g. "2024-2028"
    default: '',
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
}, { timestamps: true });

StudentSchema.index({ organizationId: 1, rollNumber: 1 }, { unique: true });

module.exports = mongoose.model('Student', StudentSchema);
