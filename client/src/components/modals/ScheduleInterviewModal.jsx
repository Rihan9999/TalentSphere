import React, { useState } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';
import { Calendar, Clock, Video, UserCheck, Loader2 } from 'lucide-react';

export const ScheduleInterviewModal = ({ isOpen, onClose, drive, student, onSuccess }) => {
  const [formData, setFormData] = useState({
    round: 'Round 1 - Technical Interview',
    date: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().split('T')[0],
    time: '11:00 AM IST',
    location: 'Virtual Video Conference',
    meetingLink: 'https://meet.google.com/xyz-talentsphere-interview',
    interviewer: 'Recruitment Panel',
    notes: 'Please keep webcam enabled and have code editor ready.',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!drive || !student) return;

    try {
      setIsLoading(true);
      setError(null);

      const payload = {
        studentId: student._id,
        driveId: drive._id,
        companyId: drive.companyId?._id || drive.companyId,
        interviewType: 'Technical',
        round: formData.round,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        meetingLink: formData.meetingLink,
        interviewer: formData.interviewer,
        notes: formData.notes,
      };

      const res = await api.post('/interviews', payload);
      if (res.data.success) {
        onSuccess && onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule interview.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!student) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Schedule Interview — ${student.name}`}
      subtitle={`Candidate ID: ${student.studentId} • Drive: ${drive?.jobTitle}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && <p className="p-3 rounded-xl bg-rose-500/10 text-rose-500 font-semibold">{error}</p>}

        <div>
          <label className="block font-bold mb-1">Interview Round Title</label>
          <input
            type="text"
            name="round"
            value={formData.round}
            onChange={handleChange}
            required
            className="w-full px-3 py-2.5 rounded-xl glass-input"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2.5 rounded-xl glass-input"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Time</label>
            <input
              type="text"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full px-3 py-2.5 rounded-xl glass-input"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold mb-1">Virtual Meeting Link / Location</label>
          <input
            type="text"
            name="meetingLink"
            value={formData.meetingLink}
            onChange={handleChange}
            placeholder="https://meet.google.com/..."
            className="w-full px-3 py-2.5 rounded-xl glass-input"
          />
        </div>

        <div>
          <label className="block font-bold mb-1">Interviewer Name / Panel</label>
          <input
            type="text"
            name="interviewer"
            value={formData.interviewer}
            onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-xl glass-input"
          />
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl font-bold text-slate-500">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Interview Schedule'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ScheduleInterviewModal;
