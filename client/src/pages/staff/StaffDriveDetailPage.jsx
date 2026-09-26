import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Badge from '../../components/common/Badge';
import ShareStudentDataModal from '../../components/modals/ShareStudentDataModal';
import {
  Briefcase,
  Building2,
  Users,
  Send,
  CheckSquare,
  Square,
  FileText,
  AlertCircle,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  ChevronLeft,
  Share2,
  History,
} from 'lucide-react';

export const StaffDriveDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [drive, setDrive] = useState(null);
  const [stats, setStats] = useState(null);
  const [eligibleStudents, setEligibleStudents] = useState([]);
  const [ineligibleStudents, setIneligibleStudents] = useState([]);
  const [sharesHistory, setSharesHistory] = useState([]);

  const [activeTab, setActiveTab] = useState('eligible'); // 'eligible', 'ineligible', 'shares'
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDriveDetails = async () => {
    try {
      setIsLoading(true);
      const [driveRes, eligibleRes, sharesRes] = await Promise.all([
        api.get(`/drives/${id}`),
        api.get(`/staff/drives/${id}/eligible-students`),
        api.get(`/staff/drives/${id}/shares`),
      ]);

      if (driveRes.data.success) {
        setDrive(driveRes.data.drive);
        setStats(driveRes.data.stats);
      }

      if (eligibleRes.data.success) {
        setEligibleStudents(eligibleRes.data.eligibleStudents);
        setIneligibleStudents(eligibleRes.data.ineligibleStudents);
      }

      if (sharesRes.data.success) {
        setSharesHistory(sharesRes.data.shares);
      }
    } catch (err) {
      console.error('Failed to load drive detail workflow:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDriveDetails();
  }, [id]);

  const handleSelectAllEligible = () => {
    if (selectedStudentIds.length === eligibleStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(eligibleStudents.map((s) => s._id));
    }
  };

  const handleToggleStudent = (studentId) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId) ? prev.filter((i) => i !== studentId) : [...prev, studentId]
    );
  };

  const selectedStudentObjects = eligibleStudents.filter((s) => selectedStudentIds.includes(s._id));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        {/* Back Link */}
        <button
          onClick={() => navigate('/staff/drives')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to All Drives
        </button>

        {/* Drive Overview Banner */}
        {drive && (
          <div className="p-8 rounded-3xl glass-card border border-brand-500/20 bg-gradient-to-r from-brand-950/20 via-purple-950/10 to-slate-900/40 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-500 to-purple-600 flex items-center justify-center font-bold text-white text-xl shadow-lg">
                  {drive.companyId?.logo ? (
                    <img src={drive.companyId.logo} alt={drive.companyId.name} className="w-10 h-10 object-contain" />
                  ) : (
                    drive.companyId?.name?.charAt(0) || 'C'
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                      {drive.companyId?.name}
                    </span>
                    <Badge status={drive.status} />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {drive.jobTitle}
                  </h1>
                </div>
              </div>

              <div className="text-right space-y-1">
                <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">{drive.ctcFormatted}</p>
                <p className="text-xs text-slate-500">Vacancies: {drive.vacancies || 10}</p>
              </div>
            </div>

            {/* Drive Eligibility Rules Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Min CGPA Requirement</span>
                <span className="font-extrabold text-slate-900 dark:text-white">≥ {drive.eligibility?.minCgpa}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Max Backlogs Allowed</span>
                <span className="font-extrabold text-slate-900 dark:text-white">≤ {drive.eligibility?.maxBacklogs ?? 0}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Application Deadline</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{new Date(drive.applicationDeadline).toLocaleDateString()}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Automated Eligible Students</span>
                <span className="font-extrabold text-emerald-500 text-sm">{eligibleStudents.length} Candidates</span>
              </div>
            </div>
          </div>
        )}

        {/* CORE DATA SHARING WORKFLOW TOOLBAR */}
        <div className="p-6 rounded-3xl glass-card border border-brand-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Drive Student Data Sharing Engine
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select candidates below to send their placement data to {drive?.companyId?.name}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsShareModalOpen(true)}
            disabled={selectedStudentIds.length === 0}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 transition-all transform hover:scale-105 disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
            <span>Send {selectedStudentIds.length} Student Data to {drive?.companyId?.name || 'Company'}</span>
          </button>
        </div>

        {/* Tabs: Eligible Candidates vs Ineligible vs Share History */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('eligible')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                activeTab === 'eligible'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Eligible Students ({eligibleStudents.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('ineligible')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                activeTab === 'ineligible'
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span>Ineligible Students ({ineligibleStudents.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('shares')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                activeTab === 'shares'
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Sent Batches History ({sharesHistory.length})</span>
            </button>
          </div>

          {/* TAB 1: ELIGIBLE STUDENTS SELECTION TABLE */}
          {activeTab === 'eligible' && (
            <div className="glass-card rounded-3xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs">
                <button
                  onClick={handleSelectAllEligible}
                  className="font-bold text-brand-600 dark:text-brand-400 flex items-center gap-2 hover:underline"
                >
                  {selectedStudentIds.length === eligibleStudents.length ? (
                    <CheckSquare className="w-4 h-4 text-brand-500" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                  <span>Select All {eligibleStudents.length} Eligible Candidates</span>
                </button>

                <span className="font-semibold text-slate-500">
                  {selectedStudentIds.length} candidate(s) checked
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 uppercase font-extrabold text-[10px] text-slate-400">
                      <th className="p-4 w-10">Select</th>
                      <th className="p-4">Student ID</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Branch</th>
                      <th className="p-4">CGPA</th>
                      <th className="p-4">Backlogs</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Shared Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 font-medium">
                    {eligibleStudents.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-500">
                          No eligible students found for this drive criteria.
                        </td>
                      </tr>
                    ) : (
                      eligibleStudents.map((s) => {
                        const isChecked = selectedStudentIds.includes(s._id);
                        return (
                          <tr
                            key={s._id}
                            onClick={() => handleToggleStudent(s._id)}
                            className={`cursor-pointer transition-colors ${
                              isChecked
                                ? 'bg-brand-500/10 dark:bg-brand-950/20'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                            }`}
                          >
                            <td className="p-4">
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4 text-brand-500" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-400" />
                              )}
                            </td>
                            <td className="p-4 font-bold text-brand-600 dark:text-brand-400">{s.studentId}</td>
                            <td className="p-4 font-bold text-slate-900 dark:text-white">{s.name}</td>
                            <td className="p-4 text-slate-600 dark:text-slate-300">{s.branch?.split(' ')[0]}</td>
                            <td className="p-4 font-extrabold">{s.cgpa}</td>
                            <td className="p-4">{s.backlogs}</td>
                            <td className="p-4">
                              <Badge status={s.placementStatus} />
                            </td>
                            <td className="p-4">
                              {s.isSharedWithRecruiter ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-500 border border-purple-500/20">
                                  Already Sent
                                </span>
                              ) : (
                                <span className="text-slate-400">Not Sent Yet</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: INELIGIBLE STUDENTS TABLE WITH EXACT REASON */}
          {activeTab === 'ineligible' && (
            <div className="glass-card rounded-3xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-xl p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 uppercase font-extrabold text-[10px] text-slate-400">
                      <th className="p-4">Student ID</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Branch</th>
                      <th className="p-4">CGPA</th>
                      <th className="p-4">Backlogs</th>
                      <th className="p-4">Exact Reason for Ineligibility</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 font-medium">
                    {ineligibleStudents.map((s) => (
                      <tr key={s._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-4 font-bold text-slate-500">{s.studentId}</td>
                        <td className="p-4 font-bold text-slate-900 dark:text-white">{s.name}</td>
                        <td className="p-4">{s.branch?.split(' ')[0]}</td>
                        <td className="p-4">{s.cgpa}</td>
                        <td className="p-4 text-rose-500 font-bold">{s.backlogs}</td>
                        <td className="p-4 text-rose-600 dark:text-rose-400 font-semibold">
                          ❌ {s.eligibilityReasons?.join(' ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: DATA SHARES HISTORY */}
          {activeTab === 'shares' && (
            <div className="space-y-4">
              {sharesHistory.map((share) => (
                <div
                  key={share._id}
                  className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                        {share.batchName} ({share.studentIds?.length} Candidates)
                      </h4>
                      <p className="text-slate-500">
                        Sent on {new Date(share.sharedAt).toLocaleString()} by {share.sharedByStaffId?.name}
                      </p>
                    </div>
                    <Badge status={share.status} />
                  </div>
                  {share.notes && <p className="text-slate-600 dark:text-slate-300 italic">"{share.notes}"</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MODAL WORKFLOW TRIGGER */}
        <ShareStudentDataModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          drive={drive}
          selectedStudents={selectedStudentObjects}
          onSuccess={fetchDriveDetails}
        />
      </main>

      <Footer />
    </div>
  );
};

export default StaffDriveDetailPage;
