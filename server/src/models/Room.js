const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  building: {
    type: String,
    default: 'Main Block',
    trim: true,
  },
  roomNumber: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    default: '',
  },
  capacity: {
    type: Number,
    required: true,
    default: 60,
  },
  type: {
    type: String,
    enum: ['lecture', 'lab', 'computer_lab', 'seminar_hall'],
    default: 'lecture',
  },
  amenities: {
    hasProjector: { type: Boolean, default: true },
    hasAC: { type: Boolean, default: false },
    hasSmartBoard: { type: Boolean, default: false },
    hasComputers: { type: Boolean, default: false },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

RoomSchema.index({ organizationId: 1, building: 1, roomNumber: 1 }, { unique: true });

module.exports = mongoose.model('Room', RoomSchema);
