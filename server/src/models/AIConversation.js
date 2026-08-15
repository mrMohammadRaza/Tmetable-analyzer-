const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  suggestedAction: {
    type: mongoose.Schema.Types.Mixed, // E.g. proposed slot swap or schedule alteration
    default: null,
  },
});

const AIConversationSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timetableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Timetable',
  },
  title: {
    type: String,
    default: 'Timetable AI Copilot Chat',
  },
  messages: [ChatMessageSchema],
}, { timestamps: true });

module.exports = mongoose.model('AIConversation', AIConversationSchema);
