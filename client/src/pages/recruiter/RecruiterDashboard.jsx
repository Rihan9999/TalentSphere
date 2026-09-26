import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import { Building2, Briefcase, Users, CheckCircle2, Calendar, ShieldCheck, ChevronRight } from 'lucide-react';

export const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/recruiter/dashboard');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch recruiter dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const company = data?.company;
  const metrics = data?.metrics;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        {/* Header */}
        <div className="p-8 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center font-bold text-white text-xl shadow-lg">
              {company?.logo ? <img src={company.logo} alt={company.name} className="w-10 h-10 object-contain" /> : company?.name?.charAt(0) || 'C'}
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-bold text-brand-600 dark:text-brand-400 mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Recruiter Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {company?.name || 'Recruiter Workspace'}
              </h1>
            </div>
          </div>

          <div className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
            🔒 Scoped Access: Student profiles explicitly shared for your company's drives
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          <StatCard
            title="Received Profiles"
            value={metrics?.receivedStudents || 0}
            subtitle="Shared by Placement Cell"
            icon={Users}
            color="brand"
            onClick={() => navigate('/recruiter/drives')}
          />
          <StatCard
            title="Active Drives"
            value={metrics?.activeDrives || 0}
            icon={Briefcase}
            color="blue"
            onClick={() => navigate('/recruiter/drives')}
          />
          <StatCard
            title="Shortlisted"
            value={metrics?.shortlisted || 0}
            icon={CheckCircle2}
            color="purple"
          />
          <StatCard
            title="Interviews"
            value={metrics?.interviews || 0}
            icon={Calendar}
            color="amber"
          />
          <StatCard
            title="Selected"
            value={metrics?.selected || 0}
            icon={CheckCircle2}
            color="emerald"
          />
        </div>

        {/* Drives List for Recruiter */}
        <div className="space-y-4">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Assigned Placement Drives & Candidate Profiles
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data?.drives?.map((drive) => (
              <div
                key={drive._id}
                className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-4 hover:shadow-2xl transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">{drive.jobTitle}</h4>
                    <p className="text-xs text-brand-600 dark:text-brand-400 font-bold">{drive.ctcFormatted}</p>
                  </div>
                  <Badge status={drive.status} />
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs flex justify-between">
                  <span>Candidate Profiles Received:</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{drive.sharedStudentsCount || 0} Profiles</span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => navigate(`/recruiter/drives/${drive._id}/students`)}
                    className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>View Shared Candidate Profiles</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RecruiterDashboard;
