import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getRole } from '../../utils/tokenStorage';

import DashboardHeader from '../../components/DashboardHeader';
import DashboardFooter from '../../components/DashboardFooter';
import EmptyState from './components/EmptyState';
import JobCard from './components/JobCard';

import { getAllJobPostings, updateJobStatus } from '../../api/employerApi';

const JobListings = () => {
  const role = getRole();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadJobs = async () => {
    const toArray = (v) => (Array.isArray(v) ? v : []);

    try {
      setLoading(true);
      setError('');

      const employerId = localStorage.getItem('workforce_employerId');
      if (!employerId) {
        throw new Error('Employer identity missing. Please login again.');
      }

      const allJobs = await getAllJobPostings();
      const myJobs = toArray(allJobs).filter(
        (job) => String(job.employerID) === String(employerId)
      );

      setJobs(myJobs);
    } catch (e) {
      console.error(e);
      setError(e.message || 'Failed to load jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === 'EMPLOYER') {
      loadJobs();
    }
  }, [role]);

  if (role !== 'EMPLOYER') {
    return <Navigate to="/login" replace />;
  }

  const handleCloseJob = async (job) => {
    const jobId = job.jobID;
    if (!jobId) return;

    if (job.status === 'CLOSED') return;

    const ok = window.confirm('Close this job posting?');
    if (!ok) return;

    try {
      await updateJobStatus(jobId, 'CLOSED');
      await loadJobs();
    } catch (e) {
      setError(e.message || 'Failed to close job');
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <DashboardHeader />

      <div className="container py-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 className="fw-bold" style={{ color: '#00796b' }}>
              Job Listings
            </h3>
            <p className="text-muted mb-0">
              Manage your job postings and review applications.
            </p>
          </div>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate('/dashboard/employer')}
          >
            Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small mb-3">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        {loading ? (
          <EmptyState
            title="Loading jobs"
            description="Fetching your job postings..."
            icon="fa-spinner"
          />
        ) : jobs.length === 0 ? (
          <EmptyState
            title="No jobs posted yet"
            description="Create your first job to receive applications."
            icon="fa-briefcase"
          />
        ) : (
          <div className="row g-4">
            {jobs.map((job) => (
              <JobCard
                key={job.jobID}
                job={job}
                onViewApplications={() =>
                  navigate(
                    `/dashboard/employer/jobs/${job.jobID}/applications`
                  )
                }
                onClose={() => handleCloseJob(job)}
              />
            ))}
          </div>
        )}
      </div>

      <DashboardFooter />
    </div>
  );
};

export default JobListings;