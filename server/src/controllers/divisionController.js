const Division = require('../models/Division');

exports.getDivisions = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const divisions = await Division.find({ organizationId: orgId })
      .populate('departmentId', 'name code')
      .populate('homeRoomId', 'roomNumber building capacity')
      .populate('subjects.subjectId', 'name code type hoursPerWeek')
      .populate('subjects.facultyId', 'name designation');
    res.status(200).json({ success: true, count: divisions.length, data: divisions });
  } catch (err) {
    next(err);
  }
};

exports.createDivision = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const { name, departmentId, academicYear, semester, studentCount, homeRoomId, subjects } = req.body;

    const division = await Division.create({
      organizationId: orgId,
      departmentId,
      name,
      academicYear: academicYear || '2025-2026',
      semester: semester || 1,
      studentCount: studentCount || 60,
      homeRoomId: homeRoomId || null,
      subjects: subjects || [],
    });

    res.status(201).json({ success: true, data: division });
  } catch (err) {
    next(err);
  }
};

exports.updateDivision = async (req, res, next) => {
  try {
    const division = await Division.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!division) return res.status(404).json({ success: false, message: 'Division not found' });
    res.status(200).json({ success: true, data: division });
  } catch (err) {
    next(err);
  }
};

exports.deleteDivision = async (req, res, next) => {
  try {
    const division = await Division.findByIdAndDelete(req.params.id);
    if (!division) return res.status(404).json({ success: false, message: 'Division not found' });
    res.status(200).json({ success: true, message: 'Division removed' });
  } catch (err) {
    next(err);
  }
};
