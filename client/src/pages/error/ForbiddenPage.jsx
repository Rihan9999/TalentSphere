import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      <Navbar />

      <main className="max-w-md mx-auto px-4 py-16 text-center space-y-6 flex-1 flex flex-col justify-center">
        <div className="w-20 h-20 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/20 shadow-xl">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            403 — Access Restricted
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            You don't have permission to access this page or resource. Scoped authorization rules apply.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl glass-card text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>

          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow flex items-center gap-2"
          >
            <Home className="w-4 h-4" /> Dashboard
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForbiddenPage;
