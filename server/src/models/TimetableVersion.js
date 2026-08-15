const mongoose = require('mongoose');

const SlotAssignmentSchema = new mongoose.Schema({
  day: { type: String, required: true },
  slotIndex: { type: Number, required: true },
  timeString: { type: String, default: '' },
  divisionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Division', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  isLab: { type: Boolean, default: false },
});

const TimetableVersionSchema = new mongoose.Schema({
  timetableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Timetable',
    required: true,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  versionNumber: {
    type: Number,
    required: true,
  },
  slots: [SlotAssignmentSchema],
  score: {
    type: Number,
    default: 100,
  },
  conflicts: [{
    severity: { type: String, enum: ['hard', 'soft'], default: 'soft' },
    code: String,
    description: String,
    day: String,
    slotIndex: Number,
    involvedEntities: mongoose.Schema.Types.Mixed,
  }],
  changeLog: {
    type: String,
    default: 'Initial draft version generated',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

TimetableVersionSchema.index({ timetableId: 1, versionNumber: 1 }, { unique: true });

module.exports = mongoose.model('TimetableVersion', TimetableVersionSchema);
