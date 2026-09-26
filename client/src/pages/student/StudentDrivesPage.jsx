import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import EmptyState from '../../components/common/EmptyState';
import {
  Briefcase,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Building2,
  Calendar,
  Check,
  ChevronRight,
  Filter,
  Loader2,
} from 'lucide-react';

export const StudentDrivesPage = () => {
  const [drives, setDrives] = useState([]);
  const [search, setSearch] = useState('');
  const [filterEligibility, setFilterEligibility] = useState('all'); // all, eligible, ineligible
  const [isLoading, setIsLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const fetchDrives = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/students/drives');
      if (res.data.success) {
        setDrives(res.data.drives);
      }
    } catch (err) {
      console.error('Failed to fetch placement drives:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const handleApply = async (driveId) => {
    try {
      setApplyingId(driveId);
      setFeedback(null);
      const res = await api.post(`/students/drives/${driveId}/apply`);
      if (res.data.success) {
        setFeedback({ type: 'success', text: 'Application submitted successfully! Track status in My Applications.' });
        await fetchDrives();
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit application.',
        reasons: err.response?.data?.reasons || [],
      });
    } finally {
      setApplyingId(null);
    }
  };

  const filteredDrives = drives.filter((drive) => {
    const matchesSearch =
      drive.title.toLowerCase().includes(search.toLowerCase()) ||
      drive.companyId?.name.toLowerCase().includes(search.toLowerCase()) ||
      drive.jobTitle.toLowerCase().includes(search.toLowerCase());

    if (filterEligibility === 'eligible') return matchesSearch && drive.isEligible;
    if (filterEligibility === 'ineligible') return matchesSearch && !drive.isEligible;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Placement Drives & Opportunities
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Automated academic eligibility verification calculated instantly against your profile.
            </p>
          </div>
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-2xl text-xs font-semibold border flex flex-col gap-1.5 ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{feedback.text}</span>
            </div>
            {feedback.reasons?.length > 0 && (
              <ul className="list-disc list-inside pl-6 space-y-0.5 opacity-90">
                {feedback.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company, role, or title..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs glass-input"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Eligibility:
            </span>
            <button
              onClick={() => setFilterEligibility('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterEligibility === 'all'
                  ? 'bg-brand-600 text-white shadow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              All Drives ({drives.length})
            </button>

            <button
              onClick={() => setFilterEligibility('eligible')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterEligibility === 'eligible'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Eligible ({drives.filter((d) => d.isEligible).length})
            </button>

            <button
              onClick={() => setFilterEligibility('ineligible')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterEligibility === 'ineligible'
                  ? 'bg-rose-600 text-white shadow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Not Eligible ({drives.filter((d) => !d.isEligible).length})
            </button>
          </div>
        </div>

        {/* Drives Grid */}
        {filteredDrives.length === 0 ? (
          <EmptyState icon="drives" title="No Placement Drives Found" description="Try clearing your search query or filters." />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDrives.map((drive) => (
              <div
                key={drive._id}
                className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between space-y-6 hover:shadow-2xl transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Top Bar: Logo, Company & Eligibility Badge */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500/10 to-purple-500/10 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-brand-600">
                        {drive.companyId?.logo ? (
                          <img src={drive.companyId.logo} alt={drive.companyId.name} className="w-8 h-8 object-contain" />
                        ) : (
                          drive.companyId?.name?.charAt(0) || 'C'
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                          {drive.jobTitle}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {drive.companyId?.name} • <span className="font-bold text-brand-600 dark:text-brand-400">{drive.ctcFormatted}</span>
                        </p>
                      </div>
                    </div>

                    <div>
                      {drive.isEligible ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Eligible
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Not Eligible
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Requirements & Exact Ineligibility Explanation */}
                  {!drive.isEligible && drive.eligibilityReasons?.length > 0 && (
                    <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-1 text-xs text-rose-600 dark:text-rose-400">
                      <p className="font-bold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> ❌ Not Eligible
                      </p>
                      {drive.eligibilityReasons.map((reason, idx) => (
                        <p key={idx} className="pl-4 font-medium">
                          • Reason: {reason}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Criteria Spec Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Min CGPA</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">≥ {drive.eligibility?.minCgpa || 6.0}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Max Backlogs</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">≤ {drive.eligibility?.maxBacklogs ?? 0}</span>
                    </div>

                    <div className="col-span-2">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Eligible Branches</span>
                      <span className="font-semibold text-brand-600 dark:text-brand-400 truncate block">
                        {drive.eligibility?.eligibleBranches?.join(', ') || 'All Branches'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="text-slate-500 space-y-0.5">
                    <p className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> Deadline: {new Date(drive.applicationDeadline).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    {drive.hasApplied ? (
                      <span className="px-4 py-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs border border-purple-500/20 flex items-center gap-1.5">
                        <Check className="w-4 h-4" /> Applied ({drive.applicationStatus})
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApply(drive._id)}
                        disabled={!drive.isEligible || applyingId === drive._id}
                        className="px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white shadow-lg shadow-brand-500/20 disabled:opacity-50 flex items-center gap-1.5 transition-all transform hover:scale-105"
                      >
                        {applyingId === drive._id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                          </>
                        ) : (
                          <>
                            <span>Apply Now</span>
                            <ChevronRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default StudentDrivesPage;
