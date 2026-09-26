import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import { Users, Building2, Briefcase, ShieldCheck, UserPlus, ArrowRight, Activity } from 'lucide-react';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/admin/dashboard');
        if (res.data.success) {
          setStats(res.data.stats);
          setRecentLogs(res.data.recentLogs);
        }
      } catch (err) {
        console.error('Failed to fetch admin dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Admin Management Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Platform Administration
            </h1>
          </div>

          <button
            onClick={() => navigate('/admin/users')}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> Manage System Users
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            subtitle={`${stats?.students || 0} Students • ${stats?.staff || 0} Staff`}
            icon={Users}
            color="brand"
            onClick={() => navigate('/admin/users')}
          />
          <StatCard
            title="Partner Companies"
            value={stats?.companies || 0}
            subtitle={`${stats?.recruiters || 0} Recruiters Onboarded`}
            icon={Building2}
            color="purple"
          />
          <StatCard
            title="Placement Drives"
            value={stats?.totalDrives || 0}
            trend={`${stats?.activeDrives || 0} Currently Active`}
            icon={Briefcase}
            color="blue"
          />
          <StatCard
            title="Audit Trail Logs"
            value={stats?.auditLogsCount || 0}
            subtitle="Platform Security Tracked"
            icon={Activity}
            color="rose"
            onClick={() => navigate('/staff/audit-logs')}
          />
        </div>

        {/* Recent Platform Security Logs */}
        <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Recent Security Audit Trail</h3>
            <button
              onClick={() => navigate('/staff/audit-logs')}
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              View Full Trail
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {recentLogs.map((log) => (
              <div key={log._id} className="py-3 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-900 dark:text-white">
                    {log.userName} • <span className="text-brand-600 dark:text-brand-400">{log.action}</span>
                  </p>
                  <p className="text-slate-500">{log.details}</p>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
