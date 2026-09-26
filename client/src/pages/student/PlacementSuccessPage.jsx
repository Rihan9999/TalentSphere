import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import ConfettiCelebration from '../../components/common/ConfettiCelebration';
import { Award, CheckCircle2, Download, Building2, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PlacementSuccessPage = () => {
  const { user, profile } = useAuth();

  const companyName = profile?.placedCompany?.name || 'Tata Consultancy Services';
  const roleTitle = profile?.placementRole || 'Software Engineer - Digital Practice';
  const packageAmount = profile?.placedPackage || 7.5;
  const selectionDate = profile?.placementDate
    ? new Date(profile.placementDate).toLocaleDateString()
    : new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      <Navbar />
      <ConfettiCelebration />

      <main className="max-w-3xl mx-auto px-4 py-12 w-full flex-1 flex flex-col justify-center">
        <div className="p-8 sm:p-12 rounded-3xl glass-card border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 via-slate-900/60 to-slate-950/80 shadow-2xl text-center space-y-8 relative overflow-hidden">
          {/* Subtle Glow backdrop */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Animated Animated Checkmark Icon */}
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-3">
            <span className="px-4 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest">
              OFFICIAL SELECTION CONFIRMED
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Congratulations, {user?.name}! 🎉
            </h1>
            <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed font-medium">
              You have been successfully selected during the campus recruitment drive. We are thrilled to celebrate your milestone achievement!
            </p>
          </div>

          {/* Offer Details Card */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-left space-y-4 max-w-md mx-auto backdrop-blur-md">
            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Selected Company</p>
                <p className="text-base font-extrabold text-white">{companyName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-400 font-medium">Designation / Role</p>
                <p className="font-bold text-white mt-0.5">{roleTitle}</p>
              </div>

              <div>
                <p className="text-slate-400 font-medium">Annual Compensation</p>
                <p className="font-extrabold text-emerald-400 text-sm mt-0.5">₹{packageAmount} LPA</p>
              </div>

              <div>
                <p className="text-slate-400 font-medium">Selection Date</p>
                <p className="font-bold text-white mt-0.5">{selectionDate}</p>
              </div>

              <div>
                <p className="text-slate-400 font-medium">Status</p>
                <p className="font-bold text-emerald-400 mt-0.5">Offer Letter Issued</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/student/dashboard"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all transform hover:scale-105"
            >
              Back to Dashboard
            </Link>

            <button
              onClick={() => alert('Offer Letter download simulation initiated. Official PDF generated.')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10 flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" /> Download Offer Letter
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PlacementSuccessPage;
