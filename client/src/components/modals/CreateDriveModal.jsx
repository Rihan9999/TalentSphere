import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';
import { Plus, Loader2 } from 'lucide-react';

export const CreateDriveModal = ({ isOpen, onClose, onSuccess }) => {
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    companyId: '',
    jobTitle: 'Software Engineer',
    jobDescription: '',
    ctc: 7.5,
    ctcBreakup: '',
    location: 'Bangalore / Hyderabad / Pune',
    driveDate: '',
    applicationDeadline: '',
    vacancies: 15,
    minCgpa: 7.5,
    maxBacklogs: 0,
    minTenthPercentage: 70,
    minTwelfthPercentage: 70,
    eligibleBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication Engineering'],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get('/admin/users'); // Or staff endpoints
        const compRes = await api.get('/drives');
      } catch (err) {
        // Fallback fetch companies
      }
    };
    // Fetch companies for dropdown
    api.get('/staff/dashboard').then(() => {
      api.get('/admin/users').catch(() => {});
    });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);

      const payload = {
        title: formData.title || `${formData.jobTitle} Campus Drive 2025`,
        companyId: formData.companyId,
        jobTitle: formData.jobTitle,
        jobDescription: formData.jobDescription || 'Full stack application engineering and digital solutions role.',
        ctc: Number(formData.ctc),
        ctcBreakup: formData.ctcBreakup,
        location: formData.location,
        driveDate: formData.driveDate || new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
        applicationDeadline: formData.applicationDeadline || new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
        vacancies: Number(formData.vacancies),
        eligibility: {
          minCgpa: Number(formData.minCgpa),
          maxBacklogs: Number(formData.maxBacklogs),
          minTenthPercentage: Number(formData.minTenthPercentage),
          minTwelfthPercentage: Number(formData.minTwelfthPercentage),
          eligibleBranches: formData.eligibleBranches,
        },
      };

      const res = await api.post('/drives', payload);
      if (res.data.success) {
        onSuccess && onSuccess(res.data.drive);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create drive.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Placement Drive" subtitle="Define recruitment requirements and eligibility criteria">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && <p className="p-3 rounded-xl bg-rose-500/10 text-rose-500 font-semibold">{error}</p>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1">Company</label>
            <input
              type="text"
              name="companyId"
              placeholder="Select or enter Company ID / Name"
              value={formData.companyId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-xl glass-input"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Job Title / Role</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-xl glass-input"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block font-bold mb-1">CTC (LPA)</label>
            <input
              type="number"
              step="0.1"
              name="ctc"
              value={formData.ctc}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-xl glass-input"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Min CGPA Requirement</label>
            <input
              type="number"
              step="0.1"
              name="minCgpa"
              value={formData.minCgpa}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-xl glass-input"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Max Backlogs Allowed</label>
            <input
              type="number"
              name="maxBacklogs"
              value={formData.maxBacklogs}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-xl glass-input"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1">Drive Date</label>
            <input
              type="date"
              name="driveDate"
              value={formData.driveDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-xl glass-input"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Application Deadline</label>
            <input
              type="date"
              name="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-xl glass-input"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl font-bold text-slate-500">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl font-bold bg-brand-600 hover:bg-brand-500 text-white shadow"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Placement Drive'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateDriveModal;
