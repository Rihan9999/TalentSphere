import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Lock, Mail, ArrowRight, ShieldCheck, Users, Briefcase, Key, Loader2, AlertCircle } from 'lucide-react';
import ThemeToggle from '../../components/common/ThemeToggle';

export const LoginPage = () => {
  const { login, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && role) {
      navigate(`/${role}/dashboard`, { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  // Handle URL pre-fill for demo roles (e.g. ?role=student)
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam) {
      handleQuickDemoLogin(roleParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide email and password.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const res = await login(email, password);
      const userRole = res.user?.role;
      if (userRole) {
        navigate(`/${userRole}/dashboard`);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoRole) => {
    const demoCredentials = {
      student: { email: 'student@talentsphere.demo', pass: 'Password@123' },
      staff: { email: 'staff@talentsphere.demo', pass: 'Password@123' },
      recruiter: { email: 'recruiter@talentsphere.demo', pass: 'Password@123' },
      admin: { email: 'admin@talentsphere.demo', pass: 'Password@123' },
    };

    const cred = demoCredentials[demoRole] || demoCredentials.student;
    setEmail(cred.email);
    setPassword(cred.pass);

    try {
      setIsLoading(true);
      setError(null);
      const res = await login(cred.email, cred.pass);
      const userRole = res.user?.role;
      if (userRole) {
        navigate(`/${userRole}/dashboard`);
      }
    } catch (err) {
      setError('Demo login error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] flex flex-col justify-between selection:bg-brand-500 selection:text-white transition-colors duration-200">
      {/* Minimal Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg text-slate-900 dark:text-white">
            Talent<span className="gradient-text">Sphere</span>
          </span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Visual Column */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-8 p-8 relative">
            <div className="absolute top-0 left-0 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <span className="px-3 py-1 text-xs font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-full border border-brand-500/20">
                Placement & Recruitment Management
              </span>
              <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Streamlining Campus Recruitment for <span className="gradient-text">Institutions & Recruiters</span>
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Access automated eligibility calculations, drive-specific student data sharing, real-time interview tracking, and platform analytics.
              </p>
            </div>

            {/* Quick Demo Credentials Panel */}
            <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 relative z-10">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-brand-500" />
                <span>1-Click Quick Demo Login</span>
              </p>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('student')}
                  className="p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 hover:bg-brand-500/10 hover:border-brand-500/30 border border-slate-200 dark:border-slate-700/60 text-left transition-all group"
                >
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white group-hover:text-brand-500">
                    <GraduationCap className="w-4 h-4 text-cyan-500" /> Student
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-1">student@talentsphere.demo</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('staff')}
                  className="p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 hover:bg-brand-500/10 hover:border-brand-500/30 border border-slate-200 dark:border-slate-700/60 text-left transition-all group"
                >
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white group-hover:text-brand-500">
                    <Users className="w-4 h-4 text-purple-500" /> Placement Officer
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-1">staff@talentsphere.demo</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('recruiter')}
                  className="p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 hover:bg-brand-500/10 hover:border-brand-500/30 border border-slate-200 dark:border-slate-700/60 text-left transition-all group"
                >
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white group-hover:text-brand-500">
                    <Briefcase className="w-4 h-4 text-amber-500" /> TCS Recruiter
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-1">recruiter@talentsphere.demo</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin')}
                  className="p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 hover:bg-brand-500/10 hover:border-brand-500/30 border border-slate-200 dark:border-slate-700/60 text-left transition-all group"
                >
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white group-hover:text-brand-500">
                    <ShieldCheck className="w-4 h-4 text-rose-500" /> Super Admin
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-1">admin@talentsphere.demo</p>
                </button>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-6">
            <div className="glass-card p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Sign In to TalentSphere
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Enter your credentials or click a demo account below to proceed.
                </p>
              </div>

              {/* Mobile Quick Demo Pills */}
              <div className="lg:hidden flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => handleQuickDemoLogin('student')}
                  className="px-2.5 py-1 text-[11px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-lg border border-cyan-500/20"
                >
                  Student Demo
                </button>
                <button
                  onClick={() => handleQuickDemoLogin('staff')}
                  className="px-2.5 py-1 text-[11px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg border border-purple-500/20"
                >
                  Staff Demo
                </button>
                <button
                  onClick={() => handleQuickDemoLogin('recruiter')}
                  className="px-2.5 py-1 text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg border border-amber-500/20"
                >
                  Recruiter Demo
                </button>
                <button
                  onClick={() => handleQuickDemoLogin('admin')}
                  className="px-2.5 py-1 text-[11px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg border border-rose-500/20"
                >
                  Admin Demo
                </button>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="e.g. student@talentsphere.demo"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs glass-input font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs glass-input font-medium"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-slate-600 dark:text-slate-400">Remember me</span>
                  </label>

                  <Link
                    to="/forgot-password"
                    className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <span>Sign In to Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-4 text-center border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-500 dark:text-slate-400">New student? </span>
                <Link to="/register" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
                  Create Student Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-400">
        <p>© TalentSphere Platform. Demo Password: <span className="font-bold text-slate-600 dark:text-slate-300">Password@123</span></p>
      </footer>
    </div>
  );
};

export default LoginPage;
