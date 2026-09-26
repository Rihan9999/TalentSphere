import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import {
  Search,
  Filter,
  FileText,
  Eye,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Award,
  CheckCircle2,
  X,
  Phone,
  Mail,
  UserCheck,
} from 'lucide-react';

export const StaffStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('');
  const [minCgpa, setMinCgpa] = useState('');
  const [maxBacklogs, setMaxBacklogs] = useState('');
  const [placementStatus, setPlacementStatus] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const params = {
        page,
        limit: 10,
        search,
        branch,
        minCgpa,
        maxBacklogs,
        placementStatus,
      };

      const res = await api.get('/staff/students', { params });
      if (res.data.success) {
        setStudents(res.data.students);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Failed to fetch student directory:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, branch, placementStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchStudents();
  };

  const handleViewDetail = async (studentId) => {
    try {
      const res = await api.get(`/staff/students/${studentId}`);
      if (res.data.success) {
        setSelectedStudent(res.data);
        setIsDetailOpen(true);
      }
    } catch (err) {
      console.error('Failed to fetch student profile details:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Student Placement Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search, filter, inspect academic credentials, and verify student resumes.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 sm:p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-4">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, roll no, email, or skill..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs glass-input"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                value={branch}
                onChange={(e) => {
                  setBranch(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2.5 rounded-xl text-xs glass-input"
              >
                <option value="">All Branches</option>
                <option value="Computer Science & Engineering">CSE</option>
                <option value="Information Technology">IT</option>
                <option value="Electronics & Communication Engineering">ECE</option>
                <option value="Electrical & Electronics Engineering">EEE</option>
                <option value="Mechanical Engineering">Mechanical</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <input
                type="number"
                step="0.1"
                placeholder="Min CGPA"
                value={minCgpa}
                onChange={(e) => setMinCgpa(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-xs glass-input"
              />
            </div>

            <div className="sm:col-span-2">
              <select
                value={placementStatus}
                onChange={(e) => {
                  setPlacementStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2.5 rounded-xl text-xs glass-input"
              >
                <option value="">All Statuses</option>
                <option value="Unplaced">Unplaced</option>
                <option value="Registered">Registered</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Placed">Placed</option>
              </select>
            </div>

            <div className="sm:col-span-1">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow flex items-center justify-center"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Directory Table */}
        <div className="glass-card rounded-3xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Student ID</th>
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Branch</th>
                  <th className="px-6 py-4">CGPA</th>
                  <th className="px-6 py-4">Backlogs</th>
                  <th className="px-6 py-4">Graduation</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs font-medium">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      No student records found matching your filters.
                    </td>
                  </tr>
                ) : (
                  students.map((s) => (
                    <tr
                      key={s._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 font-bold text-brand-600 dark:text-brand-400">{s.studentId}</td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        {s.userId?.name || 'Student'}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {s.branch?.split(' ')[0]}
                      </td>
                      <td className="px-6 py-4 font-extrabold text-slate-900 dark:text-white">
                        {s.cgpa?.toFixed(1)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${s.backlogs > 0 ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                          {s.backlogs}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{s.graduationYear}</td>
                      <td className="px-6 py-4">
                        <Badge status={s.placementStatus} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewDetail(s._id)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-500/10 hover:text-brand-500 transition-colors"
                            title="Inspect Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {s.resume && (
                            <a
                              href={s.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-500/10 hover:text-brand-500 transition-colors"
                              title="Download Resume"
                            >
                              <FileText className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Showing Page <span className="font-bold text-slate-900 dark:text-white">{page}</span> of {totalPages} ({total} Students)
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Inspection Modal */}
        {selectedStudent && (
          <Modal
            isOpen={isDetailOpen}
            onClose={() => setIsDetailOpen(false)}
            title={`Student Profile — ${selectedStudent.student?.userId?.name}`}
            subtitle={`Roll No: ${selectedStudent.student?.studentId} • ${selectedStudent.student?.branch}`}
          >
            <div className="space-y-6 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60">
                <div>
                  <span className="text-slate-400 block">CGPA</span>
                  <span className="text-base font-extrabold text-brand-600 dark:text-brand-400">
                    {selectedStudent.student?.cgpa}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Active Backlogs</span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                    {selectedStudent.student?.backlogs}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">10th %</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedStudent.student?.tenthPercentage}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">12th %</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedStudent.student?.twelfthPercentage}%
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Technical Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStudent.student?.skills?.map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-600 font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {selectedStudent.student?.resume && (
                <div className="pt-2">
                  <a
                    href={selectedStudent.student.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" /> Download Official Resume
                  </a>
                </div>
              )}
            </div>
          </Modal>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default StaffStudentsPage;
