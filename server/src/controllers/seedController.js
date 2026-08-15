const Organization = require('../models/Organization');
const Department = require('../models/Department');
const Faculty = require('../models/Faculty');
const Subject = require('../models/Subject');
const Division = require('../models/Division');
const Room = require('../models/Room');
const Constraint = require('../models/Constraint');
const User = require('../models/User');

exports.seedCollegeData = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;

    // Clear existing data for org
    await Promise.all([
      Department.deleteMany({ organizationId: orgId }),
      Faculty.deleteMany({ organizationId: orgId }),
      Subject.deleteMany({ organizationId: orgId }),
      Division.deleteMany({ organizationId: orgId }),
      Room.deleteMany({ organizationId: orgId }),
      Constraint.deleteMany({ organizationId: orgId }),
    ]);

    // 1. Create Departments
    const deptCS = await Department.create({
      organizationId: orgId,
      name: 'Computer Science & Engineering',
      code: 'CSE',
      description: 'Department of Computer Science & Artificial Intelligence',
    });

    const deptEC = await Department.create({
      organizationId: orgId,
      name: 'Electronics & Communication',
      code: 'ECE',
      description: 'Department of Microelectronics and Signals',
    });

    // 2. Create Rooms
    const room101 = await Room.create({
      organizationId: orgId,
      building: 'Tech Block A',
      roomNumber: 'A-101',
      name: 'CSE Lecture Hall 1',
      capacity: 70,
      type: 'lecture',
      amenities: { hasProjector: true, hasAC: true, hasSmartBoard: true },
    });

    const room102 = await Room.create({
      organizationId: orgId,
      building: 'Tech Block A',
      roomNumber: 'A-102',
      name: 'CSE Lecture Hall 2',
      capacity: 70,
      type: 'lecture',
      amenities: { hasProjector: true, hasAC: true },
    });

    const lab201 = await Room.create({
      organizationId: orgId,
      building: 'Tech Block B',
      roomNumber: 'B-201',
      name: 'Advanced AI & Data Lab',
      capacity: 40,
      type: 'computer_lab',
      amenities: { hasProjector: true, hasAC: true, hasComputers: true },
    });

    const lab202 = await Room.create({
      organizationId: orgId,
      building: 'Tech Block B',
      roomNumber: 'B-202',
      name: 'VLSI & Embedded Systems Lab',
      capacity: 40,
      type: 'lab',
      amenities: { hasProjector: true, hasAC: true },
    });

    // 3. Create Faculty
    const f1 = await Faculty.create({
      organizationId: orgId,
      departmentId: deptCS._id,
      employeeId: 'EMP-CS-01',
      name: 'Dr. Alan Turing',
      email: 'turing@college.edu',
      designation: 'Professor',
      maxHoursPerWeek: 16,
      maxHoursPerDay: 4,
    });

    const f2 = await Faculty.create({
      organizationId: orgId,
      departmentId: deptCS._id,
      employeeId: 'EMP-CS-02',
      name: 'Prof. Grace Hopper',
      email: 'hopper@college.edu',
      designation: 'Associate Professor',
      maxHoursPerWeek: 18,
      maxHoursPerDay: 4,
    });

    const f3 = await Faculty.create({
      organizationId: orgId,
      departmentId: deptCS._id,
      employeeId: 'EMP-CS-03',
      name: 'Dr. Donald Knuth',
      email: 'knuth@college.edu',
      designation: 'Assistant Professor',
      maxHoursPerWeek: 20,
      maxHoursPerDay: 5,
    });

    const f4 = await Faculty.create({
      organizationId: orgId,
      departmentId: deptEC._id,
      employeeId: 'EMP-EC-01',
      name: 'Dr. Claude Shannon',
      email: 'shannon@college.edu',
      designation: 'Professor',
      maxHoursPerWeek: 16,
      maxHoursPerDay: 4,
    });

    // 4. Create Subjects
    const s1 = await Subject.create({
      organizationId: orgId,
      departmentId: deptCS._id,
      name: 'Data Structures & Algorithms',
      code: 'CS-301',
      type: 'lecture',
      credits: 4,
      hoursPerWeek: 4,
      consecutiveHours: 1,
      requiredRoomType: 'lecture',
      preferredFaculty: [f1._id, f3._id],
    });

    const s2 = await Subject.create({
      organizationId: orgId,
      departmentId: deptCS._id,
      name: 'Database Management Systems',
      code: 'CS-302',
      type: 'lecture',
      credits: 3,
      hoursPerWeek: 3,
      consecutiveHours: 1,
      requiredRoomType: 'lecture',
      preferredFaculty: [f2._id],
    });

    const s3 = await Subject.create({
      organizationId: orgId,
      departmentId: deptCS._id,
      name: 'AI & Machine Learning Lab',
      code: 'CS-303L',
      type: 'lab',
      credits: 2,
      hoursPerWeek: 4,
      consecutiveHours: 2,
      requiredRoomType: 'computer_lab',
      preferredFaculty: [f1._id, f2._id],
    });

    const s4 = await Subject.create({
      organizationId: orgId,
      departmentId: deptEC._id,
      name: 'Digital Signal Processing',
      code: 'EC-301',
      type: 'lecture',
      credits: 4,
      hoursPerWeek: 4,
      consecutiveHours: 1,
      requiredRoomType: 'lecture',
      preferredFaculty: [f4._id],
    });

    // 5. Create Division
    const divA = await Division.create({
      organizationId: orgId,
      departmentId: deptCS._id,
      name: 'CSE-3A',
      academicYear: '2025-2026',
      semester: 5,
      studentCount: 60,
      homeRoomId: room101._id,
      subjects: [
        { subjectId: s1._id, facultyId: f1._id },
        { subjectId: s2._id, facultyId: f2._id },
        { subjectId: s3._id, facultyId: f3._id },
        { subjectId: s4._id, facultyId: f4._id },
      ],
    });

    // 6. Create Default Constraints
    await Constraint.create([
      {
        organizationId: orgId,
        name: 'Faculty Overlap Prevention',
        type: 'hard',
        category: 'faculty_no_overlap',
      },
      {
        organizationId: orgId,
        name: 'Classroom Double Booking Prevention',
        type: 'hard',
        category: 'room_no_overlap',
      },
      {
        organizationId: orgId,
        name: 'Room Capacity Validation',
        type: 'hard',
        category: 'room_capacity_check',
      },
      {
        organizationId: orgId,
        name: 'Minimize Daily Schedule Gaps for Students',
        type: 'soft',
        category: 'minimize_gaps',
        weight: 15,
      },
    ]);

    res.status(200).json({
      success: true,
      message: 'College infrastructure data seeded successfully!',
      stats: {
        departments: 2,
        rooms: 4,
        faculty: 4,
        subjects: 4,
        divisions: 1,
      }
    });
  } catch (err) {
    next(err);
  }
};
