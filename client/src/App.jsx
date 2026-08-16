import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import DashboardView from './components/DashboardView';
import TimetableGrid from './components/TimetableGrid';
import EntityManagement from './components/EntityManagement';
import CopilotDrawer from './components/CopilotDrawer';
import LoginPage from './components/LoginPage';
import CustomDataGenerator from './components/CustomDataGenerator';
import { authAPI } from './services/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'timetable', 'entities'
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Multi-Tenant Registered Institutions State
  const [institutionsList, setInstitutionsList] = useState([
    { id: 'inst_1', name: 'Imperial Institute of Technology', type: 'college' },
    { id: 'inst_2', name: 'St. Xavier Senior Secondary School', type: 'school' },
  ]);
  const [activeInstitution, setActiveInstitution] = useState(institutionsList[0]);

  // Custom Data Feeding Generator State
  const [isCustomGeneratorOpen, setIsCustomGeneratorOpen] = useState(false);
  const [customTimetable, setCustomTimetable] = useState(null);

  useEffect(() => {
    // 1. Check saved user object in local storage for instant state restoration
    const savedUserStr = localStorage.getItem('classflow_user');
    if (savedUserStr) {
      try {
        const savedUser = JSON.parse(savedUserStr);
        if (savedUser && savedUser.name) {
          setUser(savedUser);
          return;
        }
      } catch (e) {
        console.warn('Failed to parse saved user from localStorage');
      }
    }

    // 2. Fallback check for JWT token session
    const token = localStorage.getItem('classflow_token');
    if (token) {
      authAPI
        .getMe()
        .then((res) => {
          if (res.data && res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('classflow_user', JSON.stringify(res.data.user));
          }
        })
        .catch(() => {
          localStorage.removeItem('classflow_token');
          localStorage.removeItem('classflow_user');
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('classflow_token');
    localStorage.removeItem('classflow_user');
    setUser(null);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('classflow_user', JSON.stringify(userData));
  };

  const handleCustomGenerated = (generatedTT) => {
    setCustomTimetable(generatedTT);
    setActiveTab('timetable');
    setIsCustomGeneratorOpen(false);
  };

  // Render the professional full-page Login Screen first if unauthenticated
  if (!user) {
    return <LoginPage onAuthSuccess={handleAuthSuccess} />;
  }

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
        activeInstitution={activeInstitution}
        setActiveInstitution={setActiveInstitution}
        institutionsList={institutionsList}
        onOpenCustomGenerator={() => setIsCustomGeneratorOpen(true)}
      />

      {/* Main App Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            user={user}
            onNavigateTimetables={() => setActiveTab('timetable')}
            onOpenSeed={() => setActiveTab('entities')}
            activeInstitution={activeInstitution}
            onOpenCustomGenerator={() => setIsCustomGeneratorOpen(true)}
          />
        )}

        {activeTab === 'timetable' && (
          <TimetableGrid 
            user={user} 
            activeInstitution={activeInstitution}
            customTimetable={customTimetable}
            onOpenCustomGenerator={() => setIsCustomGeneratorOpen(true)}
          />
        )}

        {activeTab === 'entities' && (
          <EntityManagement 
            user={user} 
            activeInstitution={activeInstitution}
          />
        )}
      </main>

      {/* ClassFlow Copilot AI Sidebar */}
      <CopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />

      {/* Custom Data Feed & Generator Modal */}
      <CustomDataGenerator
        isOpen={isCustomGeneratorOpen}
        onClose={() => setIsCustomGeneratorOpen(false)}
        activeInstitution={activeInstitution}
        onGenerated={handleCustomGenerated}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800 py-4 px-6 text-center text-xs text-slate-500 mt-auto">
        ClassFlow AI © 2026 — Smart College & School Timetable Generator & Management System
      </footer>
    </div>
  );
}
