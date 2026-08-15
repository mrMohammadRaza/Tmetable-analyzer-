import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import DashboardView from './components/DashboardView';
import TimetableGrid from './components/TimetableGrid';
import EntityManagement from './components/EntityManagement';
import CopilotDrawer from './components/CopilotDrawer';
import { authAPI } from './services/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'timetable', 'entities'
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  useEffect(() => {
    // Check existing JWT session
    const token = localStorage.getItem('classflow_token');
    if (token) {
      authAPI
        .getMe()
        .then((res) => {
          if (res.data.success) {
            setUser(res.data.user);
          }
        })
        .catch(() => {
          localStorage.removeItem('classflow_token');
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('classflow_token');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onToggleCopilot={() => setIsCopilotOpen(!isCopilotOpen)}
        isCopilotOpen={isCopilotOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main App Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            user={user}
            onNavigateTimetables={() => setActiveTab('timetable')}
            onOpenSeed={() => setActiveTab('entities')}
          />
        )}

        {activeTab === 'timetable' && <TimetableGrid user={user} />}

        {activeTab === 'entities' && <EntityManagement user={user} />}
      </main>

      {/* ClassFlow Copilot AI Sidebar */}
      <CopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(userData) => setUser(userData)}
      />

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800 py-4 px-6 text-center text-xs text-slate-500 mt-auto">
        ClassFlow AI © 2026 — Smart College Timetable Generator & Classroom Management System
      </footer>
    </div>
  );
}
