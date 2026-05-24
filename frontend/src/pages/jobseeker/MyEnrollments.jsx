import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getRole } from '../../utils/tokenStorage';
import { getMyEnrollments } from '../../api/jobSeekerApi';
import JobSeekerLayout from './components/JobSeekerLayout';
import EnrollmentCard from './components/EnrollmentCard';
import EmptyState from './components/EmptyState';

const JOB_SEEKER_ROLE = 'JOB_SEEKER';

const MyEnrollments = () => {
  const role = getRole();
  const navigate = useNavigate();

  if (role !== JOB_SEEKER_ROLE) return <Navigate to="/login" replace />;

  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEnrollments = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getMyEnrollments();
        const data = Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : [];
        console.log('MyEnrollments API data:', data);
        setEnrollments(data);
      } catch (e) {
        console.error('Failed to load enrollments', e);
        setError(e?.message || 'Failed to load enrollments');
      } finally {
        setLoading(false);
      }
    };
    loadEnrollments();
  }, []);

  return (
    <JobSeekerLayout pageTitle="My Enrollments">
      <div className="card shadow-sm rounded-3 border-0">
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
            <div>
              <h5 className="fw-bold mb-1">My Enrollments</h5>
              <div className="text-muted small">Read-only program progress statuses</div>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/dashboard')}>
                <i className="bi bi-arrow-left me-1" />Back
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/dashboard/jobseeker/training-programs')}>
                <i className="bi bi-mortarboard me-1" />Browse Programs
              </button>
            </div>
          </div>

          {error && <div className="alert alert-warning">{error}</div>}

          {loading ? (
            <div className="alert alert-secondary">Loading enrollments...</div>
          ) : enrollments.length === 0 ? (
            <EmptyState
              title="No enrollments yet"
              message="Enroll in an ACTIVE training program to see your progress here."
              action={
                <button className="btn btn-primary" onClick={() => navigate('/dashboard/jobseeker/training-programs')}>
                  Enroll now
                </button>
              }
            />
          ) : (
            <div className="row g-4">
              {enrollments.map((enrollment, idx) => (
                <EnrollmentCard
                  key={enrollment?.enrollmentID || idx}
                  enrollment={enrollment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </JobSeekerLayout>
  );
};

export default MyEnrollments;
