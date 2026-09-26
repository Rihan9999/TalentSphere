import React from 'react';
import { SearchX, Inbox, Briefcase, Users, BellOff } from 'lucide-react';

const iconsMap = {
  drives: Briefcase,
  applications: Inbox,
  students: Users,
  notifications: BellOff,
  search: SearchX,
};

export const EmptyState = ({
  icon = 'search',
  title = 'No records found',
  description = 'Try adjusting your search filters or check back later.',
  actionLabel,
  onAction,
}) => {
  const IconComponent = iconsMap[icon] || SearchX;

  return (
    <div className="p-12 text-center glass-card rounded-3xl border border-slate-200/80 dark:border-slate-800/80 max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-500/10 to-purple-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-4 text-brand-600 dark:text-brand-400">
        <IconComponent className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
        {title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed max-w-sm mx-auto">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/20 transition-all duration-200 transform hover:scale-105"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
