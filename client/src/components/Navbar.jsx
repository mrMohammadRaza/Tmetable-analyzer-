import React from 'react';
import { Calendar, Cpu, User, LogOut, Sparkles, Bell, ShieldCheck } from 'lucide-react';

export default function Navbar({ user, onOpenAuth, onLogout, onToggleCopilot, isCopilotOpen, activeTab, setActiveTab }) {
  return (
    <header className="glass-panel sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
      {/* Brand Logo & Title */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                ClassFlow AI
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Smart Classroom & OR-Tools Timetable Scheduler</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('timetable')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'timetable'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Timetables
          </button>
          <button
            onClick={() => setActiveTab('entities')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'entities'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Infrastructure
          </button>
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* ClassFlow Copilot Toggle Button */}
        <button
          onClick={onToggleCopilot}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-md ${
            isCopilotOpen
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400/50 shadow-purple-500/30'
              : 'bg-slate-900/80 border-purple-500/30 text-purple-300 hover:border-purple-400 hover:bg-purple-950/30'
          }`}
        >
          <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
          <span>ClassFlow Copilot</span>
        </button>

        {user ? (
          <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-white leading-tight">{user.name}</div>
              <div className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">{user.role}</div>
            </div>
            <button
              onClick={onLogout}
              title="Logout"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/30"
          >
            <User className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
