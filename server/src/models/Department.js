const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Department name is required'],
    trim: true,
  },
  code: {
    type: String,
    required: [true, 'Department code is required'],
    uppercase: true,
    trim: true,
  },
  headOfDepartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  description: {
    type: String,
    default: '',
  },
}, { timestamps: true });

DepartmentSchema.index({ organizationId: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('Department', DepartmentSchema);
