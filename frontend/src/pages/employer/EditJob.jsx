import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { getRole } from '../../utils/tokenStorage';

import DashboardHeader from '../../components/DashboardHeader';
import DashboardFooter from '../../components/DashboardFooter';
import EmptyState from './components/EmptyState';

import {
  getJobPostingById,
  updateJobPosting,
} from '../../api/employerApi';

const EditJob = () => {
  const role = getRole();
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [form, setForm] = useState({
    title: '',
    description: '',
    skills: '',
    location: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');


  if (role !== 'EMPLOYER') {
    return <Navigate to="/login" replace />;
  }
  if (!jobId) {
    return (
      <EmptyState
        title="Job not found"
        description="Missing job identifier."
        icon="fa-briefcase"
      />
    );
  }

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        setError('');

        const job = await getJobPostingById(jobId);

        setForm({
          title: job?.title || '',
          description: job?.description || '',
          location: job?.location || '',
          skills: job?.requirementsJSON
            ? JSON.parse(job.requirementsJSON).join(', ')
            : '',
        });
      } catch (e) {
        console.error(e);
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [jobId]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const employerID = localStorage.getItem('workforce_employerId');
      if (!employerID) {
        throw new Error('Employer identity missing. Please login again.');
      }

      const payload = {
        employerID: Number(employerID),
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        requirementsJSON: form.skills
          ? JSON.stringify(
              form.skills.split(',').map((s) => s.trim())
            )
          : null,
      };

      await updateJobPosting(jobId, payload);

      navigate('/dashboard/employer/jobs');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update job');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <DashboardHeader />

      <div className="container py-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 className="fw-bold" style={{ color: '#00796b' }}>
              Edit Job
            </h3>
            <p className="text-muted mb-0">
              Update the details of your job posting.
            </p>
          </div>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate('/dashboard/employer/jobs')}
          >
            Back
          </button>
        </div>

        {loading ? (
          <EmptyState
            title="Loading job"
            description="Fetching job details..."
            icon="fa-spinner"
          />
        ) : (
          <div
            className="card border-0 shadow-sm p-4 bg-white"
            style={{ borderRadius: 16 }}
          >
            {error && (
              <div className="alert alert-danger py-2 small mb-3">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={onSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary text-uppercase">
                    Job Title
                  </label>
                  <input
                    className="form-control"
                    name="title"
                    value={form.title}
                    onChange={onChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary text-uppercase">
                    Location
                  </label>
                  <input
                    className="form-control"
                    name="location"
                    value={form.location}
                    onChange={onChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary text-uppercase">
                    Required Skills
                  </label>
                  <input
                    className="form-control"
                    name="skills"
                    placeholder="Java, Spring Boot, SQL"
                    value={form.skills}
                    onChange={onChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-bold text-secondary text-uppercase">
                    Job Description
                  </label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows={5}
                    value={form.description}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div className="d-flex gap-2 mt-4">
                <button
                  className="btn btn-primary flex-fill"
                  disabled={saving}
                  type="submit"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => navigate('/dashboard/employer/jobs')}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <DashboardFooter />
    </div>
  );
};

export default EditJob;
