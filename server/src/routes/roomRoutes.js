const express = require('express');
const router = express.Router();
const { getRooms, createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.route('/')
  .get(getRooms)
  .post(authorize('admin'), createRoom);

router.route('/:id')
  .put(authorize('admin'), updateRoom)
  .delete(authorize('admin'), deleteRoom);

module.exports = router;
