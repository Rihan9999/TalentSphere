import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/EmptyState';
import {
  Briefcase,
  CheckCircle2,
  Calendar,
  Award,
  ArrowUpRight,
  Sparkles,
  FileCheck,
  Building2,
  Clock,
  MapPin,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [drivesRes, appsRes, interviewsRes] = await Promise.all([
          api.get('/students/drives'),
          api.get('/students/applications'),
          api.get('/students/interviews'),
        ]);

        if (drivesRes.data.success) setDrives(drivesRes.data.drives);
        if (appsRes.data.success) setApplications(appsRes.data.applications);
        if (interviewsRes.data.success) setInterviews(interviewsRes.data.interviews);
      } catch (err) {
        console.error('Failed to load student dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const eligibleDrivesCount = drives.filter((d) => d.isEligible).length;
  const appliedCount = applications.length;
  const shortlistedCount = applications.filter((a) => ['SHORTLISTED', 'INTERVIEW', 'SELECTED'].includes(a.status)).length;
  const interviewCount = interviews.filter((i) => i.status === 'SCHEDULED').length;
  const isPlaced = profile?.placementStatus === 'Placed';

  const completionPercentage = profile?.profileCompletion || 85;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        {/* Welcome Header & Profile Completion Bar */}
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-brand-500/20 bg-gradient-to-r from-brand-950/20 via-purple-950/10 to-slate-900/40 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-bold text-brand-600 dark:text-brand-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Student Placement Portal</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Welcome back, {user?.name || 'Student'} 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {profile?.branch || 'Engineering Student'} • Roll No: {profile?.studentId || 'CS2025001'} • CGPA: {profile?.cgpa || '8.0'}
              </p>
            </div>

            {/* Profile Completion Widget */}
            <div className="w-full md:w-72 p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 backdrop-blur-md">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Profile Completion</span>
                <span className="font-extrabold text-brand-600 dark:text-brand-400">{completionPercentage}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400">
                {completionPercentage < 100 ? 'Upload resume & add projects to reach 100%' : '✅ Complete Profile!'}
              </p>
            </div>
          </div>
        </div>

        {/* Placed Celebration Banner if Placed */}
        {isPlaced && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-slate-900/60 border border-emerald-500/30 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-2xl">
                🎉
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">Congratulations! You are Placed!</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Selected at <span className="font-bold text-emerald-400">{profile?.placedCompany?.name || 'Company'}</span> as {profile?.placementRole || 'Software Engineer'} ({profile?.placedPackage ? `₹${profile.placedPackage} LPA` : 'Offer Accepted'}).
                </p>
              </div>
            </div>
            <Link
              to="/student/selection-celebration"
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all"
            >
              View Offer Details
            </Link>
          </div>
        )}

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          <StatCard
            title="Eligible Drives"
            value={eligibleDrivesCount}
            icon={Briefcase}
            color="brand"
            onClick={() => navigate('/student/drives')}
          />
          <StatCard
            title="Applied Drives"
            value={appliedCount}
            icon={FileCheck}
            color="blue"
            onClick={() => navigate('/student/applications')}
          />
          <StatCard
            title="Shortlisted"
            value={shortlistedCount}
            icon={CheckCircle2}
            color="purple"
            onClick={() => navigate('/student/applications')}
          />
          <StatCard
            title="Interviews"
            value={interviewCount}
            icon={Calendar}
            color="amber"
            onClick={() => navigate('/student/interviews')}
          />
          <StatCard
            title="Placement Status"
            value={profile?.placementStatus || 'Unplaced'}
            icon={Award}
            color={isPlaced ? 'emerald' : 'rose'}
          />
        </div>

        {/* Two-Column Section: Active Drives & Next Interview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recommended Placement Drives Column */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Recommended Placement Drives
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Drives matching your academic qualifications and branch
                </p>
              </div>
              <Link
                to="/student/drives"
                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                <span>View All ({drives.length})</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {drives.slice(0, 3).map((drive) => (
                <div
                  key={drive._id}
                  className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/40 transition-all duration-300 space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500/10 to-purple-500/10 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-brand-600 font-bold">
                        {drive.companyId?.logo ? (
                          <img src={drive.companyId.logo} alt={drive.companyId.name} className="w-8 h-8 object-contain" />
                        ) : (
                          drive.companyId?.name?.charAt(0) || 'C'
                        )}
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                          {drive.jobTitle}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {drive.companyId?.name} • <span className="text-brand-600 dark:text-brand-400 font-bold">{drive.ctcFormatted}</span>
                        </p>
                      </div>
                    </div>

                    {/* Eligibility Badge */}
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

                  {!drive.isEligible && drive.eligibilityReasons?.length > 0 && (
                    <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/15 text-xs text-rose-600 dark:text-rose-400">
                      <span className="font-bold">❌ Reason: </span>
                      {drive.eligibilityReasons[0]}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-4 text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {drive.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> Drive: {new Date(drive.driveDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/student/drives`)}
                        className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-all"
                      >
                        {drive.hasApplied ? 'View Status' : 'View Details & Apply'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar: Upcoming Interview & Application Activity */}
          <div className="lg:col-span-4 space-y-6">
            {/* Scheduled Interview Card */}
            <div className="p-6 rounded-3xl glass-card border border-amber-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-500" /> Next Interview
                </h4>
                <span className="px-2.5 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20">
                  SCHEDULED
                </span>
              </div>

              {interviews.length > 0 ? (
                <div className="space-y-3 pt-2">
                  <p className="text-base font-extrabold text-slate-900 dark:text-white">
                    {interviews[0].companyId?.name} - {interviews[0].round}
                  </p>
                  <p className="text-xs text-slate-500">
                    📅 {new Date(interviews[0].date).toLocaleDateString()} at {interviews[0].time}
                  </p>
                  {interviews[0].meetingLink && (
                    <a
                      href={interviews[0].meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition-all"
                    >
                      <span>Join Video Call</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-4">No upcoming interviews scheduled yet.</p>
              )}
            </div>

            {/* Application Progress Summary */}
            <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-4">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Application Journey Tracker
              </h4>

              <div className="space-y-3">
                {applications.slice(0, 3).map((app) => (
                  <div
                    key={app._id}
                    className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{app.driveId?.companyId?.name || 'Company'}</p>
                      <p className="text-[11px] text-slate-500">{app.driveId?.jobTitle}</p>
                    </div>
                    <Badge status={app.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudentDashboard;
