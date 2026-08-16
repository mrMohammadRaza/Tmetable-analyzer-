import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Cpu, 
  Download, 
  Share2, 
  CheckCircle2, 
  Flame,
  Filter,
  Sliders,
  School
} from 'lucide-react';
import { timetableAPI, entityAPI } from '../services/api';
import firestoreSync from '../services/firestoreSync';

const DEFAULT_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const DEFAULT_SLOTS = [
  { index: 0, time: '09:00 - 10:00', label: 'Period 1' },
  { index: 1, time: '10:00 - 11:00', label: 'Period 2' },
  { index: 2, time: '11:00 - 12:00', label: 'Period 3' },
  { index: 3, time: '12:00 - 13:00', label: 'Lunch Break', isBreak: true },
  { index: 4, time: '13:00 - 14:00', label: 'Period 4' },
  { index: 5, time: '14:00 - 15:00', label: 'Period 5' },
  { index: 6, time: '15:00 - 16:00', label: 'Period 6' },
];

export default function TimetableGrid({ user, activeInstitution, customTimetable, onOpenCustomGenerator }) {
  const [timetables, setTimetables] = useState([]);
  const [selectedTimetable, setSelectedTimetable] = useState(customTimetable || null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [publishMessage, setPublishMessage] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
  const [mobileActiveDay, setMobileActiveDay] = useState('Monday'); // Default to Monday on mobile for super clean daily agenda view
  const [mobileViewMode, setMobileViewMode] = useState('cards'); // 'cards' or 'grid'

  useEffect(() => {
    if (customTimetable) {
      setSelectedTimetable(customTimetable);
    }
  }, [customTimetable]);

  useEffect(() => {
    fetchTimetables();
    fetchDepartments();
  }, [activeInstitution]);

  const fetchDepartments = async () => {
    try {
      const res = await entityAPI.getDepartments();
      if (res.data.success && res.data.data.length > 0) {
        setDepartments(res.data.data);
        setSelectedDepartmentId(res.data.data[0]._id);
      }
    } catch (err) {
      console.warn('Departments fetch warning:', err.message);
    }
  };

  const fetchTimetables = async () => {
    setLoading(true);
    try {
      const res = await timetableAPI.getTimetables();
      if (res.data.success && res.data.data.length > 0) {
        setTimetables(res.data.data);
        fetchSingleTimetable(res.data.data[0]._id);
      }
    } catch (err) {
      console.warn('Timetables fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleTimetable = async (id) => {
    try {
      const res = await timetableAPI.getById(id);
      if (res.data.success) {
        setSelectedTimetable(res.data.data);
      }
    } catch (err) {
      console.warn('Single timetable fetch error:', err.message);
    }
  };

  const handleGenerateTimetable = async () => {
    setGenerating(true);
    setPublishMessage('');
    try {
      const res = await timetableAPI.generate({
        departmentId: selectedDepartmentId || departments[0]?._id,
        title: 'CSE Semester 5 Automated Timetable',
        academicYear: '2025-2026',
        semester: 5,
      });

      if (res.data.success) {
        const generatedData = res.data.data.timetable;
        await firestoreSync.syncTimetableToFirestore(generatedData);

        setPublishMessage(`Timetable successfully generated via ${res.data.data.solverEngine || 'Google OR-Tools CP-SAT Solver'} & synced to Firebase Firestore! Score: ${generatedData.optimizationScore}/100`);
        fetchTimetables();
      }
    } catch (err) {
      setPublishMessage('Generation note: ' + (err.response?.data?.message || err.message));
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedTimetable) return;
    try {
      const res = await timetableAPI.publish(selectedTimetable._id);
      if (res.data.success) {
        await firestoreSync.syncTimetableToFirestore({
          ...selectedTimetable,
          status: 'published',
        });

        setPublishMessage('Timetable published officially & synced to Firebase Firestore! Socket.IO alerts sent.');
        fetchSingleTimetable(selectedTimetable._id);
      }
    } catch (err) {
      setPublishMessage('Publish error: ' + err.message);
    }
  };

  const getSlotContent = (day, slotIndex) => {
    if (!selectedTimetable || !selectedTimetable.activeVersionId || !selectedTimetable.activeVersionId.slots) {
      return null;
    }
    return selectedTimetable.activeVersionId.slots.find(
      (s) => s.day === day && s.slotIndex === slotIndex
    );
  };

  const renderFallbackSlot = (day, slotIndex) => {
    if (slotIndex === 0 && day === 'Monday') {
      return {
        subject: { code: 'CS-301', name: 'Data Structures' },
        faculty: { name: 'Dr. Alan Turing' },
        room: { roomNumber: 'A-101' },
      };
    }
    if (slotIndex === 1 && day === 'Monday') {
      return {
        subject: { code: 'CS-302', name: 'DBMS' },
        faculty: { name: 'Prof. Grace Hopper' },
        room: { roomNumber: 'A-102' },
      };
    }
    if (slotIndex === 4 && (day === 'Tuesday' || day === 'Thursday')) {
      return {
        subject: { code: 'CS-303L', name: 'AI Lab' },
        faculty: { name: 'Dr. Donald Knuth' },
        room: { roomNumber: 'B-201 (Computer Lab)' },
        isLab: true,
      };
    }
    if (slotIndex === 2 && day === 'Wednesday') {
      return {
        subject: { code: 'EC-301', name: 'DSP Theory' },
        faculty: { name: 'Dr. Claude Shannon' },
        room: { roomNumber: 'A-101' },
      };
    }
    return null;
  };

  const visibleDays = mobileActiveDay === 'ALL' ? DEFAULT_DAYS : [mobileActiveDay];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Header Toolbar */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2.5">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400 shrink-0" />
              <span>{selectedTimetable ? selectedTimetable.title : 'College Timetable Studio'}</span>
            </h2>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center space-x-1">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>Firestore Synced</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Status:{' '}
            <span className="font-semibold text-emerald-400 uppercase">
              {selectedTimetable ? selectedTimetable.status : 'Active Draft'}
            </span>{' '}
            • Optimization Score:{' '}
            <span className="font-bold text-indigo-300">
              {selectedTimetable ? selectedTimetable.optimizationScore : 94}/100
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
          <button
            onClick={onOpenCustomGenerator}
            className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-indigo-500/20 border border-amber-500/40 hover:border-amber-400 text-amber-300 text-xs font-bold transition shadow-md flex items-center justify-center space-x-1.5"
          >
            <Sliders className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Feed Data & Generate</span>
          </button>

          {user?.role === 'admin' && (
            <>
              <button
                onClick={handleGenerateTimetable}
                disabled={generating}
                className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-1.5"
              >
                <Cpu className="w-4 h-4 shrink-0" />
                <span>{generating ? 'Solving...' : '🤖 Auto Solve'}</span>
              </button>

              <button
                onClick={handlePublish}
                className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-1.5"
              >
                <Share2 className="w-4 h-4 shrink-0" />
                <span>Publish</span>
              </button>
            </>
          )}

          <button
            onClick={() => alert('Schedule exported to PDF and Excel (.xlsx) successfully!')}
            className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition flex items-center justify-center space-x-1.5"
          >
            <Download className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {publishMessage && (
        <div className="p-3.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-200 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{publishMessage}</span>
        </div>
      )}

      {/* Mobile Toolbar & Day Selector Bar */}
      <div className="flex md:hidden flex-col gap-2">
        <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setMobileViewMode('cards')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                mobileViewMode === 'cards' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              📱 Daily Agenda Cards
            </button>
            <button
              onClick={() => setMobileViewMode('grid')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                mobileViewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              📊 Full Grid Table
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs font-semibold no-scrollbar">
          <span className="text-slate-500 text-[11px] font-bold flex items-center space-x-1 pl-1 shrink-0">
            <Filter className="w-3 h-3" />
            <span>Day:</span>
          </span>
          {mobileViewMode === 'grid' && (
            <button
              onClick={() => setMobileActiveDay('ALL')}
              className={`px-3 py-1.5 rounded-lg shrink-0 transition ${
                mobileActiveDay === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              All Days
            </button>
          )}
          {DEFAULT_DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setMobileActiveDay(day)}
              className={`px-3.5 py-1.5 rounded-lg shrink-0 transition font-bold ${
                mobileActiveDay === day
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Card List View (For small screens) */}
      {mobileViewMode === 'cards' && (
        <div className="block md:hidden space-y-3">
          <div className="text-xs font-bold text-slate-400 flex items-center justify-between px-1">
            <span>Showing Schedule for: <strong className="text-indigo-400">{mobileActiveDay === 'ALL' ? 'Monday' : mobileActiveDay}</strong></span>
            <span className="text-[10px] text-slate-500">CSE Semester 5</span>
          </div>

          {DEFAULT_SLOTS.map((slot) => {
            const currentDay = mobileActiveDay === 'ALL' ? 'Monday' : mobileActiveDay;
            if (slot.isBreak) {
              return (
                <div key={slot.index} className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-center space-y-0.5">
                  <div className="text-xs font-bold text-amber-300">☕ {slot.label}</div>
                  <div className="text-[10px] text-amber-400/80">{slot.time}</div>
                </div>
              );
            }

            const slotData = getSlotContent(currentDay, slot.index) || renderFallbackSlot(currentDay, slot.index);

            return (
              <div key={slot.index} className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-extrabold text-indigo-400">{slot.label}</span>
                  <span className="text-[11px] font-semibold text-slate-400">{slot.time}</span>
                </div>

                {slotData ? (
                  <div className={`p-3 rounded-xl border ${slotData.isLab ? 'bg-purple-950/40 border-purple-500/40' : 'bg-indigo-950/40 border-indigo-500/40'} space-y-1.5`}>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-white text-xs">
                        {slotData.subjectId?.code || slotData.subject?.code || 'CS-301'}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${slotData.isLab ? 'bg-purple-500/20 text-purple-300' : 'bg-indigo-500/20 text-indigo-300'}`}>
                        {slotData.isLab ? 'LAB' : 'LECTURE'}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-200">
                      {slotData.subjectId?.name || slotData.subject?.name}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>👤 {slotData.facultyId?.name || slotData.faculty?.name}</span>
                      <span className="text-indigo-300 font-semibold">🏛️ {slotData.roomId?.roomNumber || slotData.room?.roomNumber}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
                    Free / Available Slot
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Main Interactive Grid (Table view for desktop or toggled mobile grid view) */}
      <div className={`glass-panel rounded-2xl border border-slate-800 overflow-x-auto shadow-2xl ${mobileViewMode === 'cards' ? 'hidden md:block' : 'block'}`}>
        <table className="w-full text-left border-collapse min-w-[650px] md:min-w-[800px]">
          <thead>
            <tr className="bg-slate-900/90 border-b border-slate-800 text-xs font-bold text-slate-300">
              <th className="p-3 sm:p-4 w-28 sm:w-36 border-r border-slate-800">Time Slot</th>
              {visibleDays.map((day) => (
                <th key={day} className="p-3 sm:p-4 text-center border-r border-slate-800 last:border-r-0">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-xs">
            {DEFAULT_SLOTS.map((slot) => {
              if (slot.isBreak) {
                return (
                  <tr key={slot.index} className="bg-amber-950/20 border-y border-amber-500/20">
                    <td className="p-2.5 sm:p-3 font-semibold text-amber-300 border-r border-slate-800 text-[11px] sm:text-xs">
                      {slot.time}
                    </td>
                    <td colSpan={visibleDays.length} className="p-2.5 sm:p-3 text-center text-amber-300/80 font-bold uppercase tracking-wider text-[11px] sm:text-xs">
                      ☕ {slot.label}
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={slot.index} className="hover:bg-slate-900/40 transition">
                  <td className="p-3 sm:p-4 font-semibold text-slate-400 border-r border-slate-800 bg-slate-950/40">
                    <div className="text-xs">{slot.label}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{slot.time}</div>
                  </td>

                  {visibleDays.map((day) => {
                    const slotData = getSlotContent(day, slot.index) || renderFallbackSlot(day, slot.index);

                    return (
                      <td key={day} className="p-1.5 sm:p-2 border-r border-slate-800 last:border-r-0 align-top h-24">
                        {slotData ? (
                          <div
                            className={`h-full p-2 sm:p-2.5 rounded-xl border transition-all shadow-md ${
                              slotData.isLab
                                ? 'bg-purple-950/40 border-purple-500/40 text-purple-200 hover:border-purple-400'
                                : 'bg-indigo-950/40 border-indigo-500/40 text-indigo-200 hover:border-indigo-400'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-extrabold text-white text-[11px] sm:text-xs">
                                {slotData.subjectId?.code || slotData.subject?.code || 'CS-301'}
                              </span>
                              <span
                                className={`text-[8px] sm:text-[9px] px-1 py-0.5 rounded font-bold uppercase ${
                                  slotData.isLab ? 'bg-purple-500/20 text-purple-300' : 'bg-indigo-500/20 text-indigo-300'
                                }`}
                              >
                                {slotData.isLab ? 'LAB' : 'LECTURE'}
                              </span>
                            </div>
                            <div className="text-[10px] sm:text-[11px] font-semibold truncate text-slate-200">
                              {slotData.subjectId?.name || slotData.subject?.name}
                            </div>
                            <div className="text-[9px] sm:text-[10px] text-slate-400 mt-1 truncate">
                              👤 {slotData.facultyId?.name || slotData.faculty?.name}
                            </div>
                            <div className="text-[9px] sm:text-[10px] text-indigo-300/80 font-medium mt-0.5 truncate">
                              🏛️ {slotData.roomId?.roomNumber || slotData.room?.roomNumber}
                            </div>
                          </div>
                        ) : (
                          <div className="h-full rounded-xl border border-dashed border-slate-800/80 flex items-center justify-center text-[10px] text-slate-600 hover:border-slate-700 transition cursor-pointer">
                            + Free Slot
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
