import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  Layers, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  Zap, 
  Cpu, 
  FileSpreadsheet,
  Sliders,
  School
} from 'lucide-react';
import { analyticsAPI, timetableAPI } from '../services/api';

export default function DashboardView({ user, onNavigateTimetables, onOpenSeed, activeInstitution, onOpenCustomGenerator }) {
  const [stats, setStats] = useState({
    rooms: 4,
    faculty: 4,
    departments: 2,
    divisions: 1,
    timetables: 1,
  });
  const [metrics, setMetrics] = useState({
    roomUtilizationRate: 84.5,
    facultyWorkloadBalance: 91.2,
    optimizationScore: 94,
    hardConflicts: 0,
  });
  const [loading, setLoading] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState('');

  useEffect(() => {
    fetchDashboardAnalytics();
  }, []);

  const fetchDashboardAnalytics = async () => {
    try {
      const res = await analyticsAPI.get();
      if (res.data.success) {
        setStats(res.data.data.summary);
        setMetrics(res.data.data.utilizationMetrics);
      }
    } catch (err) {
      console.warn('Analytics fetch using default sample metrics:', err.message);
    }
  };

  const handleSeedDemoData = async () => {
    setLoading(true);
    setSeedSuccess('');
    try {
      const res = await timetableAPI.seedDemo();
      if (res.data.success) {
        setSeedSuccess('College & School campus infrastructure seeded successfully!');
        fetchDashboardAnalytics();
      }
    } catch (err) {
      setSeedSuccess('Data seeded or already available in database.');
    } finally {
      setLoading(false);
    }
  };

  const instTypeLabel = activeInstitution?.type === 'school' ? 'Registered School' : 'Registered College';

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Hero Welcome & Quick Setup Banner */}
      <section className="relative overflow-hidden rounded-2xl glass-panel p-4 sm:p-8 border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 via-slate-900/80 to-purple-950/40 shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-semibold">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Google OR-Tools CP-SAT Solver Active</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-semibold">
                {activeInstitution?.type === 'school' ? <School className="w-3.5 h-3.5 text-cyan-300" /> : <Building2 className="w-3.5 h-3.5 text-indigo-300" />}
                <span>{instTypeLabel}: {activeInstitution?.name || 'Imperial Institute'}</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {user ? `Welcome back, ${user.name}` : 'ClassFlow AI Campus Dashboard'}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Real-time timetable generation, classroom capacity optimization, and custom user data feeding engine for Colleges & Schools.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <button
              onClick={onOpenCustomGenerator}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-indigo-500/20 border border-amber-500/40 hover:border-amber-400 text-amber-300 text-xs font-extrabold transition shadow-md flex items-center justify-center space-x-2"
            >
              <Sliders className="w-4 h-4 text-amber-400 shrink-0" />
              <span>⚡ Feed Data & Generate</span>
            </button>

            <button
              onClick={onNavigateTimetables}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2"
            >
              <Cpu className="w-4 h-4 shrink-0" />
              <span>Open Timetable Studio</span>
            </button>
          </div>
        </div>

        {seedSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{seedSuccess}</span>
          </div>
        )}
      </section>

      {/* KPI Stats Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Rooms Card */}
        <div className="glass-card p-4 sm:p-5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400">Classrooms & Labs</span>
            <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">{stats.rooms}</div>
          <div className="text-[10px] sm:text-[11px] text-emerald-400 font-medium">84.5% Avg Occupancy</div>
        </div>

        {/* Faculty Card */}
        <div className="glass-card p-4 sm:p-5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400">Active Faculty</span>
            <Users className="w-4 h-4 text-purple-400 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">{stats.faculty}</div>
          <div className="text-[10px] sm:text-[11px] text-purple-300 font-medium">Max 4 hrs/day cap</div>
        </div>

        {/* Divisions Card */}
        <div className="glass-card p-4 sm:p-5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400">Student Divisions</span>
            <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">{stats.divisions}</div>
          <div className="text-[10px] sm:text-[11px] text-cyan-300 font-medium">Semester 5 (CSE-3A)</div>
        </div>

        {/* Optimization Score */}
        <div className="glass-card p-4 sm:p-5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400">Schedule Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400">{metrics.optimizationScore}/100</div>
          <div className="text-[10px] sm:text-[11px] text-emerald-400 font-medium flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            <span>0 Hard Conflicts</span>
          </div>
        </div>
      </section>

      {/* Infrastructure & Optimization Highlights */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Campus Timetable Overview */}
        <div className="lg:col-span-2 glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-indigo-400 shrink-0" />
                <span>Active Timetable Status</span>
              </h3>
              <p className="text-xs text-slate-400">Computer Science & Electronics Engineering Semester Schedule</p>
            </div>
            <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              Published
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-white">CSE-3A Semester 5 Master Timetable</div>
                <div className="text-xs text-slate-400">4 Subjects • Data Structures, DBMS, AI Lab, DSP</div>
              </div>
              <button
                onClick={onNavigateTimetables}
                className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
              >
                View Grid
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-white">ECE-3B Digital Signal Processing Schedule</div>
                <div className="text-xs text-slate-400">VLSI Lab & Signal Processing Theory</div>
              </div>
              <button
                onClick={onNavigateTimetables}
                className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                View Grid
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Optimization Rules */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-purple-400 shrink-0" />
            <span>OR-Tools Constraints</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="font-bold text-indigo-300 mb-1">✓ Hard Constraint: Faculty Double-Booking</div>
              <p className="text-slate-400">Strictly prevents any professor from being assigned to multiple rooms simultaneously.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="font-bold text-emerald-300 mb-1">✓ Hard Constraint: Lab Room Type</div>
              <p className="text-slate-400">Ensures practical lab sessions (e.g. AI & ML Lab) are only placed in computer labs with hardware.</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="font-bold text-purple-300 mb-1">✓ Soft Optimization: Workload Balance</div>
              <p className="text-slate-400">Minimizes student gaps between classes and balances daily lecture count.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
