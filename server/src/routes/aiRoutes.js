const express = require('express');
const router = express.Router();
const { chatWithCopilot } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/chat', protect, chatWithCopilot);

module.exports = router;
