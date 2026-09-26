import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ScheduleInterviewModal from '../../components/modals/ScheduleInterviewModal';
import EmptyState from '../../components/common/EmptyState';
import {
  Users,
  ShieldCheck,
  FileText,
  CheckCircle2,
  XCircle,
  Calendar,
  Award,
  Eye,
  ChevronLeft,
  Loader2,
  Briefcase,
} from 'lucide-react';

export const RecruiterDriveStudentsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [drive, setDrive] = useState(null);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [interviewStudent, setInterviewStudent] = useState(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchSharedStudents = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/recruiter/drives/${id}/students`);
      if (res.data.success) {
        setDrive(res.data.drive);
        setStudents(res.data.students);
      }
    } catch (err) {
      console.error('Failed to fetch shared candidates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedStudents();
  }, [id]);

  const handleUpdateStatus = async (applicationId, newStatus, offeredCtc) => {
    try {
      setActionLoadingId(applicationId);
      setMessage(null);

      const res = await api.put(`/recruiter/applications/${applicationId}/status`, {
        status: newStatus,
        offeredCtc,
      });

      if (res.data.success) {
        setMessage(`Candidate status updated to ${newStatus}!`);
        await fetchSharedStudents();
      }
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        <button
          onClick={() => navigate('/recruiter/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Recruiter Dashboard
        </button>

        {drive && (
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-brand-500/20 bg-gradient-to-r from-brand-950/20 to-slate-900/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-bold text-brand-600 dark:text-brand-400 mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Drive-Specific Scoped Student Access</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {drive.jobTitle} Candidates
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {drive.companyId?.name} • Offered Package: <span className="font-bold text-brand-600 dark:text-brand-400">{drive.ctcFormatted}</span>
              </p>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-right">
              <p className="text-slate-400 font-semibold">Shared Profiles</p>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">{students.length} Candidates</p>
            </div>
          </div>
        )}

        {message && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {message}
          </div>
        )}

        {students.length === 0 ? (
          <EmptyState
            icon="students"
            title="No Candidate Profiles Received Yet"
            description="The college placement cell has not forwarded student profiles for this drive yet."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {students.map((candidate) => (
              <div
                key={candidate._id}
                className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between space-y-4 shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {candidate.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Roll No: <span className="font-bold text-slate-700 dark:text-slate-300">{candidate.studentId}</span> • {candidate.branch}
                      </p>
                    </div>

                    <Badge status={candidate.applicationStatus} />
                  </div>

                  {/* Key Academic Specs */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">CGPA</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">{candidate.cgpa}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Backlogs</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">{candidate.backlogs}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Graduation</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{candidate.graduationYear}</span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  {candidate.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {candidate.skills.slice(0, 4).map((skill, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Candidate Action Buttons */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedStudent(candidate);
                        setIsProfileOpen(true);
                      }}
                      className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs flex items-center justify-center gap-1 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Profile
                    </button>

                    {candidate.resume && (
                      <a
                        href={candidate.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 font-bold text-xs flex items-center justify-center gap-1 transition-all"
                      >
                        <FileText className="w-3.5 h-3.5" /> Download Resume
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    {/* Shortlist Action */}
                    <button
                      onClick={() => handleUpdateStatus(candidate.applicationId, 'SHORTLISTED')}
                      disabled={actionLoadingId === candidate.applicationId}
                      className="flex-1 py-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-bold text-xs hover:bg-purple-500/20 transition-all flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Shortlist
                    </button>

                    {/* Schedule Interview Action */}
                    <button
                      onClick={() => {
                        setInterviewStudent(candidate);
                        setIsScheduleOpen(true);
                      }}
                      className="flex-1 py-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold text-xs hover:bg-amber-500/20 transition-all flex items-center justify-center gap-1"
                    >
                      <Calendar className="w-3.5 h-3.5" /> Schedule Interview
                    </button>

                    {/* Mark Selected Action */}
                    <button
                      onClick={() => handleUpdateStatus(candidate.applicationId, 'SELECTED', drive.ctc)}
                      disabled={actionLoadingId === candidate.applicationId}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow transition-all flex items-center justify-center gap-1"
                    >
                      <Award className="w-3.5 h-3.5" /> Select
                    </button>

                    {/* Reject Action */}
                    <button
                      onClick={() => handleUpdateStatus(candidate.applicationId, 'REJECTED')}
                      disabled={actionLoadingId === candidate.applicationId}
                      className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all"
                      title="Reject Candidate"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Profile Details Modal */}
        {selectedStudent && (
          <Modal
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            title={`Candidate Profile — ${selectedStudent.name}`}
            subtitle={`Roll No: ${selectedStudent.studentId} • ${selectedStudent.branch}`}
          >
            <div className="space-y-6 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60">
                <div>
                  <span className="text-slate-400 block">CGPA</span>
                  <span className="text-base font-extrabold text-brand-600 dark:text-brand-400">{selectedStudent.cgpa}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Backlogs</span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">{selectedStudent.backlogs}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Projects</h4>
                <div className="space-y-2">
                  {selectedStudent.projects?.map((proj, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-slate-900 dark:text-white">{proj.title}</p>
                      <p className="text-slate-500 mt-1">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedStudent.resume && (
                <div className="pt-2">
                  <a
                    href={selectedStudent.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" /> Download Resume (PDF)
                  </a>
                </div>
              )}
            </div>
          </Modal>
        )}

        {/* Schedule Interview Modal */}
        {interviewStudent && (
          <ScheduleInterviewModal
            isOpen={isScheduleOpen}
            onClose={() => setIsScheduleOpen(false)}
            drive={drive}
            student={interviewStudent}
            onSuccess={fetchSharedStudents}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default RecruiterDriveStudentsPage;
