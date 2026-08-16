import React, { useState } from 'react';
import { Calendar, User, LogOut, Sparkles, Menu, X, LayoutDashboard, Grid, Layers } from 'lucide-react';

export default function Navbar({ user, onOpenAuth, onLogout, onToggleCopilot, isCopilotOpen, activeTab, setActiveTab }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="glass-panel sticky top-0 z-40 px-4 sm:px-6 py-3 border-b border-slate-800 bg-[#0b0f19]/90 backdrop-blur-md">
      <div className="flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3 sm:space-x-6">
          <div className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer" onClick={() => handleTabClick('dashboard')}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <h1 className="text-base sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                  ClassFlow AI
                </h1>
                <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v1.0
                </span>
              </div>
              <p className="hidden xs:block text-[10px] sm:text-[11px] text-slate-400 font-medium">Smart College Timetable Scheduler</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => handleTabClick('dashboard')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleTabClick('timetable')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'timetable'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Timetables
            </button>
            <button
              onClick={() => handleTabClick('entities')}
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
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* ClassFlow Copilot Toggle Button */}
          <button
            onClick={onToggleCopilot}
            className={`flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl border text-[11px] sm:text-xs font-bold transition-all shadow-md ${
              isCopilotOpen
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400/50 shadow-purple-500/30'
                : 'bg-slate-900/80 border-purple-500/30 text-purple-300 hover:border-purple-400 hover:bg-purple-950/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300 animate-pulse shrink-0" />
            <span className="hidden xs:inline">Copilot</span>
            <span className="xs:hidden">AI</span>
          </button>

          {user ? (
            <div className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-3 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-white leading-tight">{user.name}</div>
                <div className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">{user.role}</div>
              </div>
              <button
                onClick={onLogout}
                title="Logout"
                className="p-1.5 sm:p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/30"
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-slate-800/80 space-y-2 animate-fadeIn">
          {user && (
            <div className="px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">{user.name}</div>
                <div className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">{user.role}</div>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center space-x-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}

          <button
            onClick={() => handleTabClick('dashboard')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-indigo-400" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => handleTabClick('timetable')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'timetable'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <Grid className="w-4 h-4 text-purple-400" />
            <span>Timetable Studio</span>
          </button>

          <button
            onClick={() => handleTabClick('entities')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'entities'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Infrastructure & Entities</span>
          </button>
        </div>
      )}

    </header>
  );
}
