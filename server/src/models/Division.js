const mongoose = require('mongoose');

const DivisionSchema = new mongoose.Schema({
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
    type: String, // e.g. "CS-A", "CS-B", "IT-1"
    required: true,
    trim: true,
  },
  academicYear: {
    type: String, // e.g. "2025-2026"
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  studentCount: {
    type: Number,
    default: 60,
  },
  homeRoomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  },
  subjects: [{
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
  }],
}, { timestamps: true });

DivisionSchema.index({ organizationId: 1, departmentId: 1, name: 1, semester: 1 }, { unique: true });

module.exports = mongoose.model('Division', DivisionSchema);
