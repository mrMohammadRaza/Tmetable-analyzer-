import React, { useState } from 'react';
import { X, Lock, Mail, User, Building, Shield, ArrowRight } from 'lucide-react';
import { authAPI } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: 'admin@college.edu',
    password: 'Password@123',
    role: 'admin',
    organizationName: 'Imperial Institute of Technology',
    organizationCode: 'IIT-MAIN',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let res;
      if (isLogin) {
        res = await authAPI.login({ email: formData.email, password: formData.password });
      } else {
        res = await authAPI.register(formData);
      }

      if (res.data.success) {
        localStorage.setItem('classflow_token', res.data.token);
        onAuthSuccess(res.data.user);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role) => {
    setError('');
    setLoading(true);
    try {
      const demoEmail = `${role}@college.edu`;
      const res = await authAPI.register({
        name: `Demo ${role.toUpperCase()} User`,
        email: demoEmail,
        password: 'Password@123',
        role: role,
        organizationName: 'Imperial Institute of Technology',
        organizationCode: 'IIT-MAIN',
      });
      if (res.data.success) {
        localStorage.setItem('classflow_token', res.data.token);
        onAuthSuccess(res.data.user);
        onClose();
      }
    } catch (err) {
      // If already registered, perform login
      try {
        const res = await authAPI.login({ email: `${role}@college.edu`, password: 'Password@123' });
        if (res.data.success) {
          localStorage.setItem('classflow_token', res.data.token);
          onAuthSuccess(res.data.user);
          onClose();
        }
      } catch (loginErr) {
        setError('Quick login failed: ' + (loginErr.response?.data?.message || loginErr.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative max-w-md w-full glass-panel border border-slate-700/60 rounded-2xl p-6 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {isLogin ? 'Welcome Back to ClassFlow' : 'Create ClassFlow Account'}
          </h2>
          <p className="text-xs text-slate-400">
            {isLogin ? 'Sign in to manage classroom schedules and OR-Tools optimization' : 'Setup your organization and admin profile'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    placeholder="Dr. Alan Turing"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">College / Organization Name</label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    placeholder="Imperial Institute of Technology"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                placeholder="admin@college.edu"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Account Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="admin">Administrator</option>
                <option value="faculty">Faculty Member</option>
                <option value="student">Student</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Login Preset Buttons */}
        <div className="pt-3 border-t border-slate-800 space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 block text-center">Or test with 1-Click Demo Profiles:</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('admin')}
              className="px-2 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-300 text-[11px] font-bold text-center transition"
            >
              👑 Admin
            </button>
            <button
              onClick={() => handleQuickDemoLogin('faculty')}
              className="px-2 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 text-purple-300 text-[11px] font-bold text-center transition"
            >
              🎓 Faculty
            </button>
            <button
              onClick={() => handleQuickDemoLogin('student')}
              className="px-2 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 text-[11px] font-bold text-center transition"
            >
              🎒 Student
            </button>
          </div>
        </div>

        {/* Switch Mode */}
        <div className="text-center text-xs text-slate-400">
          {isLogin ? "Don't have an organization account? " : 'Already registered? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-400 font-bold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
