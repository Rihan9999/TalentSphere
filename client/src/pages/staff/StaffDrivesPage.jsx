import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Badge from '../../components/common/Badge';
import CreateDriveModal from '../../components/modals/CreateDriveModal';
import { Briefcase, Plus, Search, ChevronRight, Share2, Calendar, MapPin, Users } from 'lucide-react';

export const StaffDrivesPage = () => {
  const navigate = useNavigate();
  const [drives, setDrives] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDrives = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/drives');
      if (res.data.success) {
        setDrives(res.data.drives);
      }
    } catch (err) {
      console.error('Failed to fetch drives:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const filteredDrives = drives.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.companyId?.name.toLowerCase().includes(search.toLowerCase()) ||
      d.jobTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Placement Drives Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Create placement drives, set eligibility parameters, and execute candidate data sharing workflows.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-xl shadow-brand-500/25 flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <Plus className="w-4 h-4" /> Create Placement Drive
          </button>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search placement drives..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs glass-input"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDrives.map((drive) => (
            <div
              key={drive._id}
              className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between space-y-6 hover:shadow-2xl transition-all duration-300"
            >
              <div className="space-y-4">
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
                      <p className="text-xs text-slate-500 font-medium">
                        {drive.companyId?.name} • <span className="font-bold text-brand-600 dark:text-brand-400">{drive.ctcFormatted}</span>
                      </p>
                    </div>
                  </div>

                  <Badge status={drive.status} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Min CGPA</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">≥ {drive.eligibility?.minCgpa || 6.0}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Max Backlogs</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">≤ {drive.eligibility?.maxBacklogs ?? 0}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Drive: {new Date(drive.driveDate).toLocaleDateString()}
                </span>

                <button
                  onClick={() => navigate(`/staff/drives/${drive._id}`)}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow flex items-center gap-1.5 transition-all transform hover:scale-105"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Select & Share Candidate Data</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <CreateDriveModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchDrives}
        />
      </main>

      <Footer />
    </div>
  );
};

export default StaffDrivesPage;
