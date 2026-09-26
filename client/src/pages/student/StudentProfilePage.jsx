import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import {
  User,
  GraduationCap,
  Upload,
  FileText,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Award,
  BookOpen,
  Briefcase,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export const StudentProfilePage = () => {
  const { user, profile, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    department: 'Engineering & Technology',
    branch: 'Computer Science & Engineering',
    graduationYear: 2025,
    cgpa: 8.0,
    tenthPercentage: 85,
    twelfthPercentage: 85,
    diplomaPercentage: 0,
    backlogs: 0,
    skills: [],
    projects: [],
    certifications: [],
    internships: [],
  });

  const [newSkill, setNewSkill] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && profile) {
      setFormData({
        name: user.name || '',
        phone: profile.phone || '',
        department: profile.department || 'Engineering & Technology',
        branch: profile.branch || 'Computer Science & Engineering',
        graduationYear: profile.graduationYear || 2025,
        cgpa: profile.cgpa || 8.0,
        tenthPercentage: profile.tenthPercentage || 85,
        twelfthPercentage: profile.twelfthPercentage || 85,
        diplomaPercentage: profile.diplomaPercentage || 0,
        backlogs: profile.backlogs || 0,
        skills: profile.skills || [],
        projects: profile.projects || [],
        certifications: profile.certifications || [],
        internships: profile.internships || [],
      });
    }
  }, [user, profile]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setError(null);
      setMessage(null);

      const res = await api.put('/students/profile', formData);
      if (res.data.success) {
        setMessage('Profile updated successfully!');
        await refreshUser();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('resume', file);

    try {
      setIsUploadingResume(true);
      setError(null);
      const res = await api.post('/students/resume', data);
      if (res.data.success) {
        setMessage('Resume uploaded successfully!');
        await refreshUser();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Resume upload failed.');
    } finally {
      setIsUploadingResume(false);
    }
  };

  const completionPercentage = profile?.profileCompletion || 85;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        {/* Header & Completion Meter */}
        <div className="p-8 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Student Placement Profile
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Keep your profile up to date for accurate automatic eligibility calculations.
            </p>
          </div>

          <div className="w-full md:w-80 p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>Profile Completion</span>
              <span className="text-brand-600 dark:text-brand-400">{completionPercentage}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {message && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-8">
          {/* Section 1: Resume Upload */}
          <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-500" /> Resume & Documents
            </h3>

            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-center space-y-3">
              <Upload className="w-8 h-8 text-brand-500 mx-auto" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {profile?.resumeOriginalName ? `Uploaded: ${profile.resumeOriginalName}` : 'Upload Official Resume (PDF / DOCX)'}
                </p>
                <p className="text-[11px] text-slate-400">Max file size 10MB</p>
              </div>

              {profile?.resume && (
                <div className="pt-2">
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-xs border border-brand-500/20"
                  >
                    <FileText className="w-3.5 h-3.5" /> Download / View Current Resume
                  </a>
                </div>
              )}

              <div>
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow transition-all">
                  {isUploadingResume ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" /> Select & Upload New Resume
                    </>
                  )}
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Personal & Academic Credentials */}
          <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-6">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-500" /> Personal & Academic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl text-xs glass-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 91234 56789"
                  className="w-full px-4 py-2.5 rounded-xl text-xs glass-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Branch</label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl text-xs glass-input"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                  <option value="Electrical & Electronics Engineering">Electrical & Electronics Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Graduation Year</label>
                <input
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl text-xs glass-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Current CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 rounded-xl text-xs glass-input font-bold text-brand-600 dark:text-brand-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Active Backlogs</label>
                <input
                  type="number"
                  min="0"
                  name="backlogs"
                  value={formData.backlogs}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 rounded-xl text-xs glass-input font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">10th Score (%)</label>
                <input
                  type="number"
                  name="tenthPercentage"
                  value={formData.tenthPercentage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 rounded-xl text-xs glass-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">12th Score (%)</label>
                <input
                  type="number"
                  name="twelfthPercentage"
                  value={formData.twelfthPercentage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 rounded-xl text-xs glass-input"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Technical Skills */}
          <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-500" /> Technical Skills & Competencies
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                placeholder="Add a skill (e.g. React, Python, Data Structures)..."
                className="flex-1 px-4 py-2.5 rounded-xl text-xs glass-input"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-1 shadow"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {formData.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-500 transition-colors"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Save Action */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-xs shadow-xl shadow-brand-500/25 flex items-center gap-2 transition-all transform hover:scale-105"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Profile Details
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default StudentProfilePage;
