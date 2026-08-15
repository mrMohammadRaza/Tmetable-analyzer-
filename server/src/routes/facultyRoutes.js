const express = require('express');
const router = express.Router();
const { getFaculty, createFaculty, updateFaculty, deleteFaculty } = require('../controllers/facultyController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.route('/')
  .get(getFaculty)
  .post(authorize('admin'), createFaculty);

router.route('/:id')
  .put(authorize('admin'), updateFaculty)
  .delete(authorize('admin'), deleteFaculty);

module.exports = router;
