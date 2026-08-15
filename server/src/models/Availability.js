const mongoose = require('mongoose');

const AvailabilitySchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  entityType: {
    type: String,
    enum: ['faculty', 'room', 'division'],
    required: true,
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  unavailabilityGrid: [{
    day: { type: String, required: true }, // e.g. "Monday"
    slotIndex: { type: Number, required: true }, // e.g. 0, 1, 2...
    reason: { type: String, default: 'Not Available' },
  }],
}, { timestamps: true });

AvailabilitySchema.index({ organizationId: 1, entityType: 1, entityId: 1 }, { unique: true });

module.exports = mongoose.model('Availability', AvailabilitySchema);
