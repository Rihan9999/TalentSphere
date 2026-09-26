import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import {
  GraduationCap,
  Briefcase,
  Users,
  Building2,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Share2,
  Award,
  ChevronRight,
  FileCheck,
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Students Registered', value: '10,000+', icon: Users, color: 'text-brand-500' },
    { label: 'Recruiter Companies', value: '250+', icon: Building2, color: 'text-cyan-500' },
    { label: 'Placement Drives', value: '500+', icon: Briefcase, color: 'text-purple-500' },
    { label: 'Placement Tracking Rate', value: '95%', icon: TrendingUp, color: 'text-emerald-500' },
  ];

  const features = [
    {
      title: 'Automated Eligibility System',
      description: 'System automatically calculates candidate eligibility against CGPA, backlogs, branch, and academic criteria with instant failure explanations.',
      icon: Zap,
      gradient: 'from-brand-500/20 to-purple-500/20 text-brand-500',
    },
    {
      title: 'Drive-Specific Data Sharing',
      description: 'College staff selects and forwards verified candidate profiles for specific drives directly to company recruiters without exposing raw databases.',
      icon: Share2,
      gradient: 'from-cyan-500/20 to-blue-500/20 text-cyan-500',
    },
    {
      title: 'Strict Recruiter Access Scoping',
      description: 'Recruiters get dedicated access to ONLY student data officially shared for their assigned placement drive, ensuring complete student privacy.',
      icon: ShieldCheck,
      gradient: 'from-emerald-500/20 to-teal-500/20 text-emerald-500',
    },
    {
      title: 'Real-Time Application Timelines',
      description: 'Students track their application journey step-by-step from Registered to Shortlisted, Technical Interview, and Final Offer Selection.',
      icon: FileCheck,
      gradient: 'from-amber-500/20 to-orange-500/20 text-amber-500',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 font-sans selection:bg-brand-500 selection:text-white transition-colors duration-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Animated Background Gradients & Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-brand-500/15 via-purple-500/10 to-transparent blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 animate-pulse-slow pointer-events-none" />
        <div className="absolute top-40 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 animate-pulse-slow pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-brand-500/30 text-xs font-bold text-brand-600 dark:text-brand-400 shadow-sm">
                <Sparkles className="w-4 h-4 text-brand-500 animate-spin" />
                <span>Next-Generation College Placement Management SaaS</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white">
                Connecting Talent <br />
                <span className="gradient-text">With Opportunity</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                TalentSphere simplifies the complete college placement & recruitment journey for students, institutions and recruiters.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-card hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 transition-all duration-300"
                >
                  <Briefcase className="w-4 h-4 text-brand-500" />
                  <span>Explore Placement Drives</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Instant CGPA & Backlog Calculation
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Role-Based Access Control
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Automated Interview Tracking
                </span>
              </div>
            </motion.div>

            {/* Hero Interactive Graphics Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Floating Glassmorphism Hero Graphic Card */}
                <div className="glass-card rounded-3xl p-6 shadow-2xl border border-slate-200/80 dark:border-slate-800/80 relative z-10 backdrop-blur-xl">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        TCS
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          Software Engineer Drive 2025
                        </h4>
                        <p className="text-xs text-slate-500">Tata Consultancy Services • ₹7.5 LPA</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20">
                      ELIGIBLE
                    </span>
                  </div>

                  <div className="py-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Candidate Match:</span>
                      <span className="font-bold text-brand-600 dark:text-brand-400">98% Fit Rating</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full w-[98%]" />
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Required CGPA:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">≥ 7.5 (Your CGPA: 8.8)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Allowed Backlogs:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">0 (Your Backlogs: 0)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Eligible Branches:</span>
                        <span className="font-semibold text-brand-600 dark:text-brand-400">CSE, IT, ECE</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Apply Now for Drive</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Floating Micro Cards */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-6 -left-6 glass-card p-3.5 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 z-20"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400">Latest Selection</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Placed at Deloitte (₹8.2 LPA)</p>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-6 -right-6 glass-card p-3.5 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 z-20"
                >
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-500 flex items-center justify-center">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400">Staff Data Share</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">95 Candidates Sent to TCS</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Animated Statistics Section */}
      <section className="py-16 border-y border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="text-center space-y-2">
                  <div className={`w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center mx-auto mb-3 ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {stat.value}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Built for Modern <span className="gradient-text">Placement Ecosystems</span>
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Engineered specifically to solve real-world college recruitment bottlenecks with automated eligibility algorithms and secure recruiter data routing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="p-8 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800/80 space-y-4 group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Demo Account Quick Access Card */}
      <section className="py-12 max-w-5xl mx-auto px-4">
        <div className="p-8 rounded-3xl glass-card border border-brand-500/30 bg-gradient-to-tr from-brand-950/40 via-purple-950/20 to-slate-900/60 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 text-[11px] font-extrabold bg-brand-500/20 text-brand-400 rounded-full border border-brand-500/30 uppercase tracking-widest">
              Instant Demonstration Mode
            </span>
            <h3 className="text-2xl font-extrabold text-white">Explore All 4 User Roles Instantly</h3>
            <p className="text-xs text-slate-400">
              Click any demo role to pre-fill credentials and test role-based placement workflows.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/login?role=student')}
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all hover:scale-105"
            >
              <GraduationCap className="w-6 h-6 text-cyan-400 mb-2" />
              <p className="text-xs font-bold text-white">Student Portal</p>
              <p className="text-[10px] text-slate-400 mt-1">student@talentsphere.demo</p>
            </button>

            <button
              onClick={() => navigate('/login?role=staff')}
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all hover:scale-105"
            >
              <Users className="w-6 h-6 text-purple-400 mb-2" />
              <p className="text-xs font-bold text-white">Placement Staff</p>
              <p className="text-[10px] text-slate-400 mt-1">staff@talentsphere.demo</p>
            </button>

            <button
              onClick={() => navigate('/login?role=recruiter')}
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all hover:scale-105"
            >
              <Briefcase className="w-6 h-6 text-amber-400 mb-2" />
              <p className="text-xs font-bold text-white">TCS Recruiter</p>
              <p className="text-[10px] text-slate-400 mt-1">recruiter@talentsphere.demo</p>
            </button>

            <button
              onClick={() => navigate('/login?role=admin')}
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all hover:scale-105"
            >
              <ShieldCheck className="w-6 h-6 text-rose-400 mb-2" />
              <p className="text-xs font-bold text-white">Super Admin</p>
              <p className="text-[10px] text-slate-400 mt-1">admin@talentsphere.demo</p>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
