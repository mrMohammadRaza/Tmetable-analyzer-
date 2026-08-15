const Room = require('../models/Room');

exports.getRooms = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const rooms = await Room.find({ organizationId: orgId });
    res.status(200).json({ success: true, count: rooms.length, data: rooms });
  } catch (err) {
    next(err);
  }
};

exports.createRoom = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const { building, roomNumber, name, capacity, type, amenities } = req.body;

    const room = await Room.create({
      organizationId: orgId,
      building: building || 'Main Building',
      roomNumber,
      name: name || `Room ${roomNumber}`,
      capacity: capacity || 60,
      type: type || 'lecture',
      amenities: amenities || {},
    });

    res.status(201).json({ success: true, data: room });
  } catch (err) {
    next(err);
  }
};

exports.updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    res.status(200).json({ success: true, data: room });
  } catch (err) {
    next(err);
  }
};

exports.deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    res.status(200).json({ success: true, message: 'Room deleted' });
  } catch (err) {
    next(err);
  }
};
