import React, { useState } from 'react';
import { X, Lock, Mail, User, Building, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { authAPI } from '../services/api';
import { auth, googleProvider } from '../config/firebase';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification 
} from 'firebase/auth';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [useFirebase, setUseFirebase] = useState(true); // Default real Firebase Auth
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    organizationName: 'Imperial Institute of Technology',
    organizationCode: 'IIT-MAIN',
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.email || !formData.password) {
      setError('Please provide valid email and password');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      if (useFirebase) {
        // Real Firebase Authentication Flow
        if (isLogin) {
          const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
          const idToken = await userCredential.user.getIdToken(true);
          localStorage.setItem('classflow_token', idToken);

          const authenticatedUser = {
            id: userCredential.user.uid,
            name: userCredential.user.displayName || formData.email.split('@')[0],
            email: userCredential.user.email,
            role: 'admin',
            emailVerified: userCredential.user.emailVerified,
          };

          setSuccessMsg('Authentication verified successfully via Firebase!');
          setTimeout(() => {
            onAuthSuccess(authenticatedUser);
            onClose();
          }, 800);
        } else {
          const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
          await sendEmailVerification(userCredential.user);
          const idToken = await userCredential.user.getIdToken(true);
          localStorage.setItem('classflow_token', idToken);

          const newUser = {
            id: userCredential.user.uid,
            name: formData.name || formData.email.split('@')[0],
            email: userCredential.user.email,
            role: formData.role || 'admin',
            emailVerified: false,
          };

          setSuccessMsg('Account created & verification email sent! Logging in...');
          setTimeout(() => {
            onAuthSuccess(newUser);
            onClose();
          }, 1200);
        }
      } else {
        // Real Express REST API + MongoDB JWT Authentication Flow
        let res;
        if (isLogin) {
          res = await authAPI.login({
            email: formData.email,
            password: formData.password,
          });
        } else {
          res = await authAPI.register(formData);
        }

        if (res.data && res.data.success) {
          localStorage.setItem('classflow_token', res.data.token);
          setSuccessMsg('Verified & authenticated successfully!');
          setTimeout(() => {
            onAuthSuccess(res.data.user);
            onClose();
          }, 800);
        }
      }
    } catch (err) {
      console.error('[Auth Failure]', err);
      let msg = err.message;
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password. Please check your credentials.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email address already exists.';
      } else if (err.response?.data?.message) {
        msg = err.response.data.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleFirebaseSignIn = async () => {
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken(true);
      localStorage.setItem('classflow_token', idToken);

      const firebaseUserData = {
        id: result.user.uid,
        name: result.user.displayName || result.user.email.split('@')[0],
        email: result.user.email,
        role: 'admin',
        avatar: result.user.photoURL,
        emailVerified: result.user.emailVerified,
      };

      setSuccessMsg('Google Identity Verified via Firebase!');
      setTimeout(() => {
        onAuthSuccess(firebaseUserData);
        onClose();
      }, 800);
    } catch (err) {
      setError('Google Sign-In verification error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Real Quick Test Credentials preset filler
  const handleFillTestCredentials = (role) => {
    setError('');
    setSuccessMsg('');
    setFormData({
      name: `Dr. ${role.toUpperCase()} User`,
      email: `${role}@college.edu`,
      password: 'Password@123',
      role: role,
      organizationName: 'Imperial Institute of Technology',
      organizationCode: 'IIT-MAIN',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative max-w-md w-full glass-panel border border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-5 bg-[#0f172a]/95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {isLogin ? 'Verified Account Login' : 'Register New User'}
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Real Authentication & Identity Verification for ClassFlow AI
          </p>
        </div>

        {/* Auth Provider Selector */}
        <div className="flex items-center space-x-2 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setUseFirebase(true)}
            className={`flex-1 py-1.5 rounded-lg transition ${
              useFirebase ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🔥 Firebase Auth
          </button>
          <button
            type="button"
            onClick={() => setUseFirebase(false)}
            className={`flex-1 py-1.5 rounded-lg transition ${
              !useFirebase ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🔑 Express JWT API
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-semibold">
            ⚠️ {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Google Firebase Identity Provider */}
        <button
          type="button"
          onClick={handleGoogleFirebaseSignIn}
          className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-indigo-500 hover:bg-slate-800 text-white font-semibold text-xs transition flex items-center justify-center space-x-2 shadow-md"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.13C3.26 21.3 7.35 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.6H1.27C.46 8.23 0 10.06 0 12s.46 3.77 1.27 5.4l4.01-3.13z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.7 1.27 6.6l4.01 3.13c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Verify & Sign In with Google</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full"></div>
          <span className="bg-[#0f172a] px-3 text-[11px] text-slate-500 font-semibold uppercase">Or Email & Password</span>
        </div>

        {/* Real Email & Password Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
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
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    placeholder="Dr. Alan Turing"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">College / Organization</label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
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
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
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
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Role Permission</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
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
            <span>{loading ? 'Verifying & Authenticating...' : isLogin ? 'Verify & Sign In' : 'Register & Verify Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Fill Test Credentials Helper */}
        <div className="pt-2 border-t border-slate-800 space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 block text-center">Fill Role Test Credentials:</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleFillTestCredentials('admin')}
              className="py-1.5 px-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-300 text-[11px] font-bold text-center transition"
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => handleFillTestCredentials('faculty')}
              className="py-1.5 px-2 rounded-lg bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 text-purple-300 text-[11px] font-bold text-center transition"
            >
              🎓 Faculty
            </button>
            <button
              type="button"
              onClick={() => handleFillTestCredentials('student')}
              className="py-1.5 px-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 text-[11px] font-bold text-center transition"
            >
              🎒 Student
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400 pt-1">
          {isLogin ? "Need a new college account? " : 'Already registered? '}
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
