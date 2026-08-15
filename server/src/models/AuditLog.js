const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  userRole: {
    type: String,
    default: 'admin',
  },
  action: {
    type: String,
    required: true, // e.g. "GENERATE_TIMETABLE", "PUBLISH_TIMETABLE", "UPDATE_ROOM"
  },
  entity: {
    type: String,
    required: true, // e.g. "Timetable", "Faculty", "Room"
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  ipAddress: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
