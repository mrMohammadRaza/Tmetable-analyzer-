import React, { useState, useEffect } from 'react';
import { Building2, School, Users, BookOpen, Layers, Plus, Trash2, Edit, CheckCircle2 } from 'lucide-react';
import { entityAPI } from '../services/api';

export default function EntityManagement({ user, activeInstitution }) {
  const [activeTab, setActiveTab] = useState('departments'); // 'departments', 'faculty', 'subjects', 'rooms', 'divisions'
  const [departments, setDepartments] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [divisions, setDivisions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Form States
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [roomCap, setRoomCap] = useState(60);
  const [roomType, setRoomType] = useState('lecture');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [dRes, fRes, sRes, rRes, divRes] = await Promise.all([
        entityAPI.getDepartments(),
        entityAPI.getFaculty(),
        entityAPI.getSubjects(),
        entityAPI.getRooms(),
        entityAPI.getDivisions(),
      ]);

      if (dRes.data.success) setDepartments(dRes.data.data);
      if (fRes.data.success) setFaculty(fRes.data.data);
      if (sRes.data.success) setSubjects(sRes.data.data);
      if (rRes.data.success) setRooms(rRes.data.data);
      if (divRes.data.success) setDivisions(divRes.data.data);
    } catch (err) {
      console.warn('Entity fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    try {
      const res = await entityAPI.createDepartment({ name: deptName, code: deptCode });
      if (res.data.success) {
        setMessage('Department created!');
        setDeptName('');
        setDeptCode('');
        fetchAllData();
      }
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const res = await entityAPI.createRoom({
        building: 'Tech Block',
        roomNumber,
        capacity: Number(roomCap),
        type: roomType,
      });
      if (res.data.success) {
        setMessage('Classroom created!');
        setRoomNumber('');
        fetchAllData();
      }
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Institution Banner */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          {activeInstitution?.type === 'school' ? (
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <School className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
              <Building2 className="w-4 h-4" />
            </div>
          )}
          <div>
            <div className="text-xs font-extrabold text-white">
              {activeInstitution?.name || 'Imperial Institute of Technology'}
            </div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              {activeInstitution?.type === 'school' ? 'Registered K-12 School' : 'Registered College / University'}
            </div>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
          Active Institution Data
        </span>
      </div>

      {/* Tab Switcher */}
      <div className="glass-panel p-3 sm:p-4 rounded-2xl border border-slate-800 flex items-center space-x-2 overflow-x-auto text-xs font-bold no-scrollbar">
        <button
          onClick={() => setActiveTab('departments')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl transition flex items-center space-x-2 shrink-0 ${
            activeTab === 'departments' ? 'bg-indigo-600 text-white' : 'bg-slate-900/60 text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Departments ({departments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('faculty')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl transition flex items-center space-x-2 shrink-0 ${
            activeTab === 'faculty' ? 'bg-indigo-600 text-white' : 'bg-slate-900/60 text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Faculty ({faculty.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('subjects')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl transition flex items-center space-x-2 shrink-0 ${
            activeTab === 'subjects' ? 'bg-indigo-600 text-white' : 'bg-slate-900/60 text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Subjects ({subjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rooms')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl transition flex items-center space-x-2 shrink-0 ${
            activeTab === 'rooms' ? 'bg-indigo-600 text-white' : 'bg-slate-900/60 text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Rooms & Labs ({rooms.length})</span>
        </button>
      </div>

      {message && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Departments View */}
      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Add New Department</h3>
            <form onSubmit={handleCreateDepartment} className="space-y-3">
              <input
                type="text"
                placeholder="Department Name (e.g. Artificial Intelligence)"
                required
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              />
              <input
                type="text"
                placeholder="Code (e.g. AI)"
                required
                value={deptCode}
                onChange={(e) => setDeptCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              />
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Save Department</span>
              </button>
            </form>
          </div>

          <div className="md:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white">Configured Departments</h3>
            <div className="space-y-2">
              {departments.map((dept) => (
                <div key={dept._id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-xs">{dept.name}</span>
                    <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold uppercase">{dept.code}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Head: {dept.headOfDepartment?.name || 'Dr. Alan Turing'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rooms & Labs View */}
      {activeTab === 'rooms' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Add Classroom / Lab</h3>
            <form onSubmit={handleCreateRoom} className="space-y-3">
              <input
                type="text"
                placeholder="Room Number (e.g. A-103)"
                required
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              />
              <input
                type="number"
                placeholder="Capacity (e.g. 60)"
                value={roomCap}
                onChange={(e) => setRoomCap(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              />
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              >
                <option value="lecture">Lecture Hall</option>
                <option value="lab">Science / Hardware Lab</option>
                <option value="computer_lab">Computer & AI Lab</option>
                <option value="seminar_hall">Seminar Hall</option>
              </select>
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Save Room</span>
              </button>
            </form>
          </div>

          <div className="md:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white">Classrooms & Laboratories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rooms.map((room) => (
                <div key={room._id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white text-xs">{room.roomNumber}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold uppercase">{room.type}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Capacity: {room.capacity} seats</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Faculty & Subjects default lists */}
      {(activeTab === 'faculty' || activeTab === 'subjects') && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white capitalize">{activeTab} Directory</h3>
          <p className="text-xs text-slate-400">Configured entities loaded from database.</p>
        </div>
      )}
    </div>
  );
}
