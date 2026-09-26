import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { FileCheck, CheckCircle2, Clock, Building2, MapPin, ChevronRight, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const TIMELINE_STAGES = [
  { key: 'REGISTERED', label: 'Applied' },
  { key: 'ELIGIBILITY_VERIFIED', label: 'Eligibility Verified' },
  { key: 'SHORTLISTED', label: 'Shortlisted' },
  { key: 'INTERVIEW', label: 'Interview' },
  { key: 'SELECTED', label: 'Selected' },
];

export const StudentApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/students/applications');
        if (res.data.success) {
          setApplications(res.data.applications);
        }
      } catch (err) {
        console.error('Failed to fetch applications:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStageIndex = (status) => {
    switch (status) {
      case 'REGISTERED':
        return 0;
      case 'ELIGIBILITY_VERIFIED':
        return 1;
      case 'SHORTLISTED':
        return 2;
      case 'INTERVIEW':
        return 3;
      case 'SELECTED':
        return 4;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Placement Applications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your recruitment status and visual application journey timeline.
          </p>
        </div>

        {applications.length === 0 ? (
          <EmptyState icon="applications" title="No Applications Submitted" description="Explore active placement drives and submit your application." />
        ) : (
          <div className="space-y-6">
            {applications.map((app) => {
              const currentStageIdx = getStageIndex(app.status);
              const isRejected = app.status === 'REJECTED';
              const isSelected = app.status === 'SELECTED';

              return (
                <div
                  key={app._id}
                  className={`p-6 sm:p-8 rounded-3xl glass-card border transition-all duration-300 space-y-6 ${
                    isSelected
                      ? 'border-emerald-500/40 bg-gradient-to-r from-emerald-950/20 to-slate-900/40'
                      : isRejected
                      ? 'border-rose-500/20 opacity-85'
                      : 'border-slate-200/80 dark:border-slate-800/80'
                  }`}
                >
                  {/* Top Bar: Company & Status */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500/10 to-purple-500/10 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-brand-600">
                        {app.driveId?.companyId?.logo ? (
                          <img src={app.driveId.companyId.logo} alt={app.driveId.companyId.name} className="w-8 h-8 object-contain" />
                        ) : (
                          app.driveId?.companyId?.name?.charAt(0) || 'C'
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                          {app.driveId?.jobTitle || 'Software Engineer'}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {app.driveId?.companyId?.name} • <span className="font-bold text-brand-600 dark:text-brand-400">{app.driveId?.ctcFormatted}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge status={app.status} />
                      {isSelected && (
                        <Link
                          to="/student/selection-celebration"
                          className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow flex items-center gap-1"
                        >
                          <Award className="w-3.5 h-3.5" /> Celebration Page
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* VISUAL APPLICATION TIMELINE STAGES */}
                  <div className="pt-4 pb-2">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-4">
                      Application Journey Progress:
                    </p>

                    <div className="relative flex items-center justify-between max-w-3xl mx-auto">
                      {/* Connecting Background Line */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 -z-0" />
                      <div
                        className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 transition-all duration-500 -z-0 ${
                          isRejected ? 'bg-rose-500' : 'bg-gradient-to-r from-brand-500 to-purple-500'
                        }`}
                        style={{ width: `${(currentStageIdx / (TIMELINE_STAGES.length - 1)) * 100}%` }}
                      />

                      {/* Stage Nodes */}
                      {TIMELINE_STAGES.map((stage, idx) => {
                        const isPassed = idx <= currentStageIdx && !isRejected;
                        const isCurrent = idx === currentStageIdx;

                        return (
                          <div key={stage.key} className="relative z-10 flex flex-col items-center group">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                                isRejected && isCurrent
                                  ? 'bg-rose-500 text-white ring-4 ring-rose-500/20'
                                  : isPassed
                                  ? 'bg-gradient-to-tr from-brand-600 to-purple-600 text-white shadow-lg ring-4 ring-brand-500/20 scale-110'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                              }`}
                            >
                              {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                            </div>
                            <span className="text-[11px] font-bold mt-2 text-slate-600 dark:text-slate-300 text-center max-w-[80px]">
                              {stage.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Audit History Notes */}
                  {app.timeline && app.timeline.length > 0 && (
                    <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                      <p className="font-bold text-slate-700 dark:text-slate-300">Latest Timeline Update:</p>
                      <p className="text-slate-600 dark:text-slate-400">
                        "{app.timeline[app.timeline.length - 1].note}" •{' '}
                        <span className="text-slate-400">
                          {new Date(app.timeline[app.timeline.length - 1].date).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default StudentApplicationsPage;
