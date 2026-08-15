const express = require('express');
const router = express.Router();
const { getDivisions, createDivision, updateDivision, deleteDivision } = require('../controllers/divisionController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.route('/')
  .get(getDivisions)
  .post(authorize('admin'), createDivision);

router.route('/:id')
  .put(authorize('admin'), updateDivision)
  .delete(authorize('admin'), deleteDivision);

module.exports = router;
