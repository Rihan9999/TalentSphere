import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import StatCard from '../../components/common/StatCard';
import BranchPlacementChart from '../../components/charts/BranchPlacementChart';
import CompanySelectionChart from '../../components/charts/CompanySelectionChart';
import MonthlyTrendsChart from '../../components/charts/MonthlyTrendsChart';
import {
  Users,
  Building2,
  Briefcase,
  Award,
  TrendingUp,
  FileSpreadsheet,
  Share2,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const StaffDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStaffDashboard = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/staff/dashboard');
        if (res.data.success) {
          setStats(res.data.stats);
          setCharts(res.data.charts);
        }
      } catch (err) {
        console.error('Failed to fetch staff dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        {/* Header Bar & Quick Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-600 dark:text-purple-400 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Training & Placement Officer Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Placement Cell Overview
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/staff/drives')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20 flex items-center gap-1.5 transition-all transform hover:scale-105"
            >
              <Plus className="w-4 h-4" /> Create Placement Drive
            </button>

            <button
              onClick={() => navigate('/staff/reports')}
              className="px-4 py-2.5 rounded-xl glass-card hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Export Reports
            </button>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Total Students"
            value={stats?.totalStudents || 0}
            subtitle={`${stats?.registeredCount || 0} Registered`}
            icon={Users}
            color="brand"
            onClick={() => navigate('/staff/students')}
          />
          <StatCard
            title="Students Placed"
            value={stats?.placedStudents || 0}
            trend={`${stats?.placementPercentage || 0}% Placement Rate`}
            icon={Award}
            color="emerald"
          />
          <StatCard
            title="Active Drives"
            value={stats?.activeDrives || 0}
            subtitle={`${stats?.totalCompanies || 0} Partner Companies`}
            icon={Briefcase}
            color="blue"
            onClick={() => navigate('/staff/drives')}
          />
          <StatCard
            title="Average Package"
            value={stats?.averagePackage || '0 LPA'}
            trend={`Highest: ${stats?.highestPackage || '0 LPA'}`}
            icon={TrendingUp}
            color="purple"
          />
        </div>

        {/* Interactive Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Branch-wise Placement Rate */}
          <div className="lg:col-span-7 p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Branch-Wise Placement Performance
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Percentage of students placed across engineering departments
              </p>
            </div>
            <BranchPlacementChart data={charts?.branchStats || []} />
          </div>

          {/* Company Selections */}
          <div className="lg:col-span-5 p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Top Hiring Companies
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Selection breakdown by recruiter company
              </p>
            </div>
            <CompanySelectionChart data={charts?.companyStats || []} />
          </div>
        </div>

        {/* Monthly Activity Trends */}
        <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Placement Season Growth & Monthly Trends
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparative analysis of active placement drives and student hires over time
            </p>
          </div>
          <MonthlyTrendsChart data={charts?.monthlyTrends || []} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StaffDashboard;
