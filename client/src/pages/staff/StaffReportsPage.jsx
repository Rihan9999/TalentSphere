import React, { useState } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { FileSpreadsheet, Download, FileText, CheckCircle2 } from 'lucide-react';

export const StaffReportsPage = () => {
  const [downloading, setDownloading] = useState(null);

  const handleDownloadReport = (reportType, format) => {
    setDownloading(`${reportType}-${format}`);
    const token = localStorage.getItem('talentsphere_token') || localStorage.getItem('campushire_token');
    const url = `/api/reports/students?format=${format}`;

    // Direct download trigger
    window.open(url, '_blank');
    setTimeout(() => setDownloading(null), 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Placement Reports & Data Export Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Export official institutional reports formatted in CSV and Excel spreadsheets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Student Directory Export */}
          <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Full Student Directory Export
                </h3>
                <p className="text-xs text-slate-500">Includes CGPA, backlogs, branch, skills, and placement status.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleDownloadReport('students', 'csv')}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>

              <button
                onClick={() => handleDownloadReport('students', 'excel')}
                className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow flex items-center justify-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" /> Export Excel (.xlsx)
              </button>
            </div>
          </div>

          {/* Card 2: Placement Statistics & Selections */}
          <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Placed Students & Salary Package Report
                </h3>
                <p className="text-xs text-slate-500">Includes company names, CTC LPA, selection dates, and roles.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleDownloadReport('placed', 'csv')}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>

              <button
                onClick={() => handleDownloadReport('placed', 'excel')}
                className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow flex items-center justify-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" /> Export Excel (.xlsx)
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StaffReportsPage;
