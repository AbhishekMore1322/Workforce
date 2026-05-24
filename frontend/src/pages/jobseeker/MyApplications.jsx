import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getRole } from '../../utils/tokenStorage';
import { getMyApplications } from '../../api/jobSeekerApi';
import JobSeekerLayout from './components/JobSeekerLayout';
import StatusBadge from './components/StatusBadge';
import EmptyState from './components/EmptyState';

const JOB_SEEKER_ROLE = 'JOB_SEEKER';

const formatDate = (d) => (d ? String(d).slice(0, 10) : '-');

const MyApplications = () => {
  const role = getRole();
  const navigate = useNavigate();

  if (role !== JOB_SEEKER_ROLE) return <Navigate to="/login" replace />;

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getMyApplications();
        setApplications(Array.isArray(data) ? data : []);
      } catch (e) {
        setError('Job applications are not available from the backend right now.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <JobSeekerLayout pageTitle="My Applications">
      <div className="card shadow-sm rounded-3 border-0">
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h5 className="fw-bold mb-1">My Job Applications</h5>
              <div className="text-muted small">Read-only tracking of your applications</div>
            </div>
            <button className="btn btn-outline-primary btn-sm" onClick={() => navigate('/dashboard')}>
              <i className="bi bi-arrow-left me-1" />Back
            </button>
          </div>

          {error && <div className="alert alert-warning">{error}</div>}

          {loading ? (
            <div className="alert alert-secondary">Loading applications...</div>
          ) : applications.length === 0 ? (
            <EmptyState title="No applications yet" message="Apply for jobs to see your outcomes here." />
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Job Title</th>
                    <th>Employer</th>
                    <th>Applied On</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app, idx) => {
                    const s = String(app?.status || '').toUpperCase();
                    let badgeClass = 'bg-secondary';
                    if (s.includes('SHORTLIST') || s.includes('HIRED') || s.includes('PLACED')) badgeClass = 'bg-success';
                    else if (s.includes('REVIEW') || s.includes('PENDING') || s.includes('APPLIED')) badgeClass = 'bg-warning text-dark';
                    else if (s.includes('REJECT') || s.includes('CANCEL')) badgeClass = 'bg-danger';
                    else if (s.includes('INTERVIEW')) badgeClass = 'bg-info text-dark';
                    return (
                      <tr key={app?.id || idx}>
                        <td className="fw-semibold">{app.jobTitle || '-'}</td>
                        <td className="text-muted">{app.employerName || '-'}</td>
                        <td className="text-muted">{formatDate(app.appliedDate)}</td>
                        <td>
                          <span className={`badge ${badgeClass} px-3 py-2 rounded-pill`}>
                            {String(app?.status || 'UNKNOWN').replace(/_/g, ' ')}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </JobSeekerLayout>
  );
};

export default MyApplications;
