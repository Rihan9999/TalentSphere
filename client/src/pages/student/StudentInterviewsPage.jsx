import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { Calendar, Clock, MapPin, Video, UserCheck, ArrowUpRight } from 'lucide-react';

export const StudentInterviewsPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/students/interviews');
        if (res.data.success) {
          setInterviews(res.data.interviews);
        }
      } catch (err) {
        console.error('Failed to fetch interviews:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Interview Schedules & Results
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            View upcoming interview rounds, join virtual meetings, and check recruiter feedback.
          </p>
        </div>

        {interviews.length === 0 ? (
          <EmptyState icon="notifications" title="No Scheduled Interviews" description="When companies shortlist your profile for interviews, schedule details will appear here." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {interviews.map((item) => (
              <div
                key={item._id}
                className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      {item.round || 'Technical Interview'}
                    </span>
                    <Badge status={item.status} />
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    {item.companyId?.name}
                  </h3>

                  <p className="text-xs text-slate-500 font-medium">
                    Drive: {item.driveId?.jobTitle}
                  </p>

                  <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Calendar className="w-4 h-4 text-brand-500" />
                      <span className="font-bold">{new Date(item.date).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Clock className="w-4 h-4 text-brand-500" />
                      <span>{item.time}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <UserCheck className="w-4 h-4 text-brand-500" />
                      <span>Panel: {item.interviewer || 'Recruitment Team'}</span>
                    </div>
                  </div>
                </div>

                {item.meetingLink && (
                  <div className="pt-2">
                    <a
                      href={item.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Video className="w-4 h-4" />
                      <span>Join Online Interview</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default StudentInterviewsPage;
