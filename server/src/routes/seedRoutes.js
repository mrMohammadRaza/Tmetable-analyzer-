const express = require('express');
const router = express.Router();
const { seedCollegeData } = require('../controllers/seedController');
const { protect, authorize } = require('../middleware/auth');

router.post('/seed-demo', protect, authorize('admin'), seedCollegeData);

module.exports = router;
