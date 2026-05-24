import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRole } from '../../utils/tokenStorage';
import { createTrainingProgram } from '../../api/programManagerApi';
import { requireProgramManagerRole } from './roleGuard';
import AppLayout from '../../components/AppLayout';

const CreateTrainingProgram = () => {
  const role = getRole();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', startDate: '', endDate: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const titleOk = form.title.trim().length >= 3;
  const datesOk = useMemo(() => {
    if (!form.startDate || !form.endDate) return false;
    return new Date(form.endDate) >= new Date(form.startDate);
  }, [form.startDate, form.endDate]);
  const canSubmit = titleOk && datesOk && !submitting;

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requireProgramManagerRole(role)) { navigate('/login', { replace: true }); return; }
    if (!titleOk) return setError('Title must be at least 3 characters.');
    if (!datesOk)  return setError('End date must be on or after start date.');
    setError('');
    try {
      setSubmitting(true);
      await createTrainingProgram({ title: form.title.trim(), description: form.description.trim(), startDate: form.startDate, endDate: form.endDate });
      navigate('/dashboard/program-manager/programs');
    } catch (err) {
      setError(err?.message || 'Failed to create training program.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout pageTitle="Create Program">
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        {/* Header */}
        <div className="mb-4">
          <h4 className="fw-bold mb-1" style={{ fontFamily: "'Syne', sans-serif", color: '#0d1f1c' }}>Create Training Program</h4>
          <div className="text-muted small">New programs are activated automatically upon creation.</div>
        </div>

        <form onSubmit={handleSubmit} className="card border-0 shadow-sm p-4" style={{ borderRadius: 16 }}>
          <div style={{ height: 4, background: 'linear-gradient(90deg, #00897b, #22c55e)', borderRadius: 99, marginBottom: '1.5rem' }} />

          {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

          <div className="mb-3">
            <label className="form-label fw-semibold small">Program Title <span className="text-danger">*</span></label>
            <input name="title" value={form.title} onChange={handleChange}
              className="form-control" placeholder="e.g. Advanced Web Development" required />
            <div className="form-text">Minimum 3 characters.</div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold small">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              className="form-control" rows={4} placeholder="Optional — describe the program objectives and content." />
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold small">Start Date <span className="text-danger">*</span></label>
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="form-control" required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold small">End Date <span className="text-danger">*</span></label>
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="form-control" required />
              {form.startDate && form.endDate && !datesOk && (
                <div className="form-text text-danger">End date must be on or after start date.</div>
              )}
            </div>
          </div>

          <div className="d-flex gap-2">
            <button type="submit" disabled={!canSubmit} className="btn fw-semibold text-white"
              style={{ background: canSubmit ? '#00897b' : '#94b0ac', borderRadius: 10, minWidth: 140 }}>
              {submitting ? <><span className="spinner-border spinner-border-sm me-2" />Creating…</> : 'Create Program'}
            </button>
            <button type="button" className="btn btn-outline-secondary" style={{ borderRadius: 10 }}
              onClick={() => navigate('/dashboard/program-manager/programs')} disabled={submitting}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default CreateTrainingProgram;
