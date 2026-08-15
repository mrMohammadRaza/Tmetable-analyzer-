const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  employeeId: {
    type: String,
    required: true,
    trim: true,
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
  designation: {
    type: String,
    enum: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Visiting Faculty'],
    default: 'Assistant Professor',
  },
  qualification: {
    type: String,
    default: '',
  },
  maxHoursPerWeek: {
    type: Number,
    default: 20,
  },
  maxHoursPerDay: {
    type: Number,
    default: 4,
  },
  specializationSubjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
  }],
}, { timestamps: true });

FacultySchema.index({ organizationId: 1, employeeId: 1 }, { unique: true });

module.exports = mongoose.model('Faculty', FacultySchema);
