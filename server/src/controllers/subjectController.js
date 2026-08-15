const Subject = require('../models/Subject');

exports.getSubjects = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const subjects = await Subject.find({ organizationId: orgId })
      .populate('departmentId', 'name code')
      .populate('preferredFaculty', 'name designation');
    res.status(200).json({ success: true, count: subjects.length, data: subjects });
  } catch (err) {
    next(err);
  }
};

exports.createSubject = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const { name, code, departmentId, type, credits, hoursPerWeek, consecutiveHours, requiredRoomType, preferredFaculty } = req.body;

    const subject = await Subject.create({
      organizationId: orgId,
      departmentId,
      name,
      code: code.toUpperCase(),
      type: type || 'lecture',
      credits: credits || 4,
      hoursPerWeek: hoursPerWeek || 4,
      consecutiveHours: consecutiveHours || (type === 'lab' ? 2 : 1),
      requiredRoomType: requiredRoomType || (type === 'lab' ? 'lab' : 'lecture'),
      preferredFaculty: preferredFaculty || [],
    });

    res.status(201).json({ success: true, data: subject });
  } catch (err) {
    next(err);
  }
};

exports.updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    res.status(200).json({ success: true, data: subject });
  } catch (err) {
    next(err);
  }
};

exports.deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    res.status(200).json({ success: true, message: 'Subject deleted' });
  } catch (err) {
    next(err);
  }
};
