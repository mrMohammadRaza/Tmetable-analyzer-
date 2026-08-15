const express = require('express');
const router = express.Router();
const { generateTimetable, getTimetables, getTimetableById, publishTimetable } = require('../controllers/timetableController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/', getTimetables);
router.post('/generate', authorize('admin'), generateTimetable);
router.get('/:id', getTimetableById);
router.post('/:id/publish', authorize('admin'), publishTimetable);

module.exports = router;
