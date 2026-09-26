import React from 'react';

const statusStyles = {
  // Placement Application Statuses
  REGISTERED: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  ELIGIBILITY_VERIFIED: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
  SHORTLISTED: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  INTERVIEW: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 animate-pulse',
  SELECTED: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-semibold shadow-sm shadow-emerald-500/10',
  REJECTED: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  WAITLISTED: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',

  // Drive Statuses
  OPEN: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  CLOSED: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
  DRAFT: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  COMPLETED: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  CANCELLED: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',

  // Student Placement Status
  Placed: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-semibold',
  Unplaced: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',

  // Role Badges
  student: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  staff: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  recruiter: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  admin: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
};

export const Badge = ({ status, text, className = '' }) => {
  const displayStatus = status || text;
  const style = statusStyles[displayStatus] || 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm transition-all duration-200 ${style} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      {text || displayStatus?.replace('_', ' ')}
    </span>
  );
};

export default Badge;
