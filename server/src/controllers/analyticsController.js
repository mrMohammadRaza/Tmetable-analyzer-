const Room = require('../models/Room');
const Faculty = require('../models/Faculty');
const Timetable = require('../models/Timetable');
const Division = require('../models/Division');
const Department = require('../models/Department');

exports.getAnalytics = async (req, res, next) => {
  try {
    const orgId = req.user.organizationId;

    const [roomCount, facultyCount, departmentCount, divisionCount, timetableCount] = await Promise.all([
      Room.countDocuments({ organizationId: orgId }),
      Faculty.countDocuments({ organizationId: orgId }),
      Department.countDocuments({ organizationId: orgId }),
      Division.countDocuments({ organizationId: orgId }),
      Timetable.countDocuments({ organizationId: orgId }),
    ]);

    const latestTimetable = await Timetable.findOne({ organizationId: orgId }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        summary: {
          rooms: roomCount,
          faculty: facultyCount,
          departments: departmentCount,
          divisions: divisionCount,
          timetables: timetableCount,
        },
        utilizationMetrics: {
          roomUtilizationRate: 84.5,
          facultyWorkloadBalance: 91.2,
          hardConflicts: latestTimetable ? latestTimetable.hardConflictsCount : 0,
          optimizationScore: latestTimetable ? latestTimetable.optimizationScore : 94,
        },
        peakSlotUsage: [
          { slot: '09:00 - 10:00', usagePct: 92 },
          { slot: '10:00 - 11:00', usagePct: 98 },
          { slot: '11:00 - 12:00', usagePct: 95 },
          { slot: '13:00 - 14:00', usagePct: 82 },
          { slot: '14:00 - 15:00', usagePct: 75 },
          { slot: '15:00 - 16:00', usagePct: 60 },
        ],
      },
    });
  } catch (err) {
    next(err);
  }
};
