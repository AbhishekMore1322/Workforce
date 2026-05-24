import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getRole } from '../../utils/tokenStorage';

import {
  getActiveTrainingPrograms,
  enrollInTrainingProgram,
  getTrainingProgramById,
} from '../../api/jobSeekerApi';
import JobSeekerLayout from './components/JobSeekerLayout';
import ProgramCard from './components/ProgramCard';
import ProgramDetailsModal from './components/ProgramDetailsModal';
import EmptyState from './components/EmptyState';

const JOB_SEEKER_ROLE = 'JOB_SEEKER';

const TrainingPrograms = () => {
  const role = getRole();
  const navigate = useNavigate();

  if (role !== JOB_SEEKER_ROLE) return <Navigate to="/login" replace />;

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrollingId, setEnrollingId] = useState(null);
  const [detailsProgram, setDetailsProgram] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getActiveTrainingPrograms();
        setPrograms(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e?.message || 'Failed to load training programs');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const activePrograms = useMemo(
    () => programs.filter((p) => String(p?.status || '').toUpperCase() === 'ACTIVE'),
    [programs]
  );

  const handleEnroll = async (program) => {
    const programId = program?.programID || program?.programId || program?.id;
    if (!programId) return;
    setEnrollingId(programId);
    setError('');
    try {
      await enrollInTrainingProgram(programId);
      navigate('/dashboard/jobseeker/enrollments');
    } catch (e) {
      setError(e?.message || 'Enrollment failed');
    } finally {
      setEnrollingId(null);
    }
  };

  const handleViewDetails = async (program) => {
    const programId = program?.programId || program?.id || program?.programID;
    if (!programId) return;
    setDetailsOpen(true);
    setDetailsProgram(null);
    setDetailsLoading(true);
    setError('');
    try {
      const data = await getTrainingProgramById(programId);
      setDetailsProgram(data?.program || data?.data || data || program);
    } catch (e) {
      setError(e?.message || 'Failed to load program details');
      setDetailsOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <JobSeekerLayout pageTitle="Training Programs">
      <div className="card shadow-sm rounded-3 border-0">
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
            <div>
              <h5 className="fw-bold mb-1">Training Programs</h5>
              <div className="text-muted small">Discover ACTIVE programs and enroll directly</div>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/dashboard')}>
                <i className="bi bi-arrow-left me-1" />Back
              </button>
              <button className="btn btn-outline-primary btn-sm" onClick={() => navigate('/dashboard/jobseeker/enrollments')}>
                <i className="bi bi-journal-check me-1" />My Enrollments
              </button>
            </div>
          </div>

          {error && <div className="alert alert-warning">{error}</div>}

          {loading ? (
            <div className="alert alert-secondary">Loading programs...</div>
          ) : activePrograms.length === 0 ? (
            <EmptyState title="No ACTIVE programs" message="Check back later for new training opportunities." />
          ) : (
            <div className="row g-3">
              {activePrograms.map((p) => {
                const programId = p?.programId || p?.id || p?.programID;
                return (
                  <ProgramCard
                    key={programId}
                    program={p}
                    onViewDetails={() => handleViewDetails(p)}
                    onEnroll={() => handleEnroll(p)}
                    disabled={enrollingId === programId}
                  />
                );
              })}
            </div>
          )}

          <div className="mt-3 small text-muted">
            Note: Enrollment status is controlled by the backend; job seekers can only enroll.
          </div>
        </div>
      </div>

      {detailsOpen && (
        <ProgramDetailsModal
          program={detailsProgram}
          loading={detailsLoading}
          onClose={() => { setDetailsOpen(false); setDetailsProgram(null); }}
        />
      )}
    </JobSeekerLayout>
  );
};

export default TrainingPrograms;
