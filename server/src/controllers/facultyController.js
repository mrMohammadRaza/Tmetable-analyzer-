const Faculty = require('../models/Faculty');
const User = require('../models/User');

exports.getFaculty = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const facultyList = await Faculty.find({ organizationId: orgId })
      .populate('departmentId', 'name code')
      .populate('specializationSubjects', 'name code type');
    res.status(200).json({ success: true, count: facultyList.length, data: facultyList });
  } catch (err) {
    next(err);
  }
};

exports.createFaculty = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;
    const { name, email, employeeId, departmentId, designation, qualification, maxHoursPerWeek, maxHoursPerDay, specializationSubjects } = req.body;

    const faculty = await Faculty.create({
      organizationId: orgId,
      departmentId,
      employeeId,
      name,
      email,
      designation: designation || 'Assistant Professor',
      qualification: qualification || '',
      maxHoursPerWeek: maxHoursPerWeek || 20,
      maxHoursPerDay: maxHoursPerDay || 4,
      specializationSubjects: specializationSubjects || [],
    });

    // Create user login for faculty if not exists
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        password: 'Password@123', // Default initial password
        role: 'faculty',
        organizationId: orgId,
        departmentId,
        facultyProfile: faculty._id,
      });
      faculty.userId = user._id;
      await faculty.save();
    }

    res.status(201).json({ success: true, data: faculty });
  } catch (err) {
    next(err);
  }
};

exports.updateFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!faculty) return res.status(404).json({ success: false, message: 'Faculty member not found' });
    res.status(200).json({ success: true, data: faculty });
  } catch (err) {
    next(err);
  }
};

exports.deleteFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);
    if (!faculty) return res.status(404).json({ success: false, message: 'Faculty member not found' });
    res.status(200).json({ success: true, message: 'Faculty member removed' });
  } catch (err) {
    next(err);
  }
};
