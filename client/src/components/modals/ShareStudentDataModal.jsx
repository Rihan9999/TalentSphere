import React, { useState } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';
import { Send, ShieldCheck, AlertTriangle, CheckCircle2, Loader2, Users } from 'lucide-react';

export const ShareStudentDataModal = ({
  isOpen,
  onClose,
  drive,
  selectedStudents = [],
  onSuccess,
}) => {
  const [batchName, setBatchName] = useState(`Shortlisted Batch ${new Date().toLocaleDateString()}`);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleShare = async () => {
    if (!drive || selectedStudents.length === 0) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const res = await api.post(`/staff/drives/${drive._id}/share-students`, {
        studentIds: selectedStudents.map((s) => s._id),
        batchName,
        notes,
      });

      if (res.data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onSuccess && onSuccess(res.data);
          onClose();
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to share student data with recruiter.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!drive) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Send Drive-Specific Student Data to Company"
      subtitle={`Share selected candidate profiles with ${drive.companyId?.name || 'Recruiter'} for ${drive.jobTitle}`}
    >
      {isSuccess ? (
        <div className="py-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h4 className="text-xl font-bold text-slate-900 dark:text-white">
            Student Data Successfully Sent! 🎉
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {selectedStudents.length} candidate profile(s) have been securely delivered to {drive.companyId?.name}.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Selected Candidates</p>
                <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {selectedStudents.length} Verified Student Profile(s)
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full border border-brand-500/20">
                {drive.companyId?.name}
              </span>
            </div>
          </div>

          {/* Scoping Security Notice */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
              <span className="font-bold">Drive Scoping Enforced:</span> The recruiter will ONLY receive access to these {selectedStudents.length} student profile(s) and their resumes specifically for the{' '}
              <span className="font-semibold">{drive.jobTitle}</span> placement drive. No full college database access is granted.
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Batch Name / Reference
              </label>
              <input
                type="text"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-xs glass-input"
                placeholder="e.g. CSE Top Performers Batch 1"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Notes for Recruiter (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl text-xs glass-input"
                placeholder="Add special instructions or highlights for the recruiter..."
              />
            </div>
          </div>

          {/* Selected Candidates Preview List */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Candidates Preview ({selectedStudents.length})
            </label>
            <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              {selectedStudents.map((s) => (
                <div
                  key={s._id}
                  className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800/80 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{s.name}</span>
                    <span className="text-slate-400">({s.studentId})</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <span>{s.branch?.split(' ')[0]}</span>
                    <span className="font-semibold text-brand-600 dark:text-brand-400">CGPA {s.cgpa}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs font-semibold text-rose-500 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
              {error}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleShare}
              disabled={isSubmitting || selectedStudents.length === 0}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white shadow-lg shadow-brand-500/25 flex items-center gap-2 transition-all transform hover:scale-105 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending Profiles...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send {selectedStudents.length} Students to {drive.companyId?.name}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ShareStudentDataModal;
