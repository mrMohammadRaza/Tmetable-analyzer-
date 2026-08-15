const mongoose = require('mongoose');

const ConstraintSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['hard', 'soft'],
    required: true,
  },
  category: {
    type: String,
    enum: [
      'faculty_no_overlap',
      'room_no_overlap',
      'division_no_overlap',
      'room_capacity_check',
      'room_type_match',
      'faculty_max_hours_daily',
      'minimize_gaps',
      'balance_daily_workload',
      'preferred_time_slot',
      'avoid_last_slot_labs'
    ],
    required: true,
  },
  weight: {
    type: Number,
    default: 10, // Penalty score weighting for soft constraints
  },
  parameters: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Constraint', ConstraintSchema);
