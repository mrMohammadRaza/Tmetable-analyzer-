const Department = require('../models/Department');

exports.getDepartments = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const departments = await Department.find({ organizationId: orgId }).populate('headOfDepartment', 'name email');
    res.status(200).json({ success: true, count: departments.length, data: departments });
  } catch (err) {
    next(err);
  }
};

exports.createDepartment = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const { name, code, description, headOfDepartment } = req.body;
    const department = await Department.create({
      organizationId: orgId,
      name,
      code: code.toUpperCase(),
      description,
      headOfDepartment: headOfDepartment || null,
    });
    res.status(201).json({ success: true, data: department });
  } catch (err) {
    next(err);
  }
};

exports.updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!department) return res.status(404).json({ success: false, message: 'Department not found' });
    res.status(200).json({ success: true, data: department });
  } catch (err) {
    next(err);
  }
};

exports.deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) return res.status(404).json({ success: false, message: 'Department not found' });
    res.status(200).json({ success: true, message: 'Department removed' });
  } catch (err) {
    next(err);
  }
};
