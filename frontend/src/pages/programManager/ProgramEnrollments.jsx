import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRole } from '../../utils/tokenStorage';
import { getEnrollmentsByProgram, updateEnrollmentStatus } from '../../api/programManagerApi';
import { requireProgramManagerRole } from './roleGuard';
import AppLayout from '../../components/AppLayout';
import EnrollmentTable from './components/EnrollmentTable';

const ProgramEnrollments = () => {
  const role = getRole();
  const navigate = useNavigate();
  const { state } = useLocation();
  const program = state?.program;
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!requireProgramManagerRole(role)) { navigate('/login', { replace: true }); return; }
    (async () => {
      try {
        setLoading(true);
        setError('');
        const id = program?.programID || program?.programId || program?.id;
        if (!id) { setEnrollments([]); return; }
        const data = await getEnrollmentsByProgram(id);
        setEnrollments(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e?.message || 'Failed to load enrollments.');
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, program, role]);

  const changeStatus = async (enrollmentId, status) => {
    setUpdatingId(enrollmentId);
    try {
      const updated = await updateEnrollmentStatus(enrollmentId, status);
      setEnrollments(prev => prev.map(e => {
        const id = e.enrollmentID || e.id;
        const uid = updated?.enrollmentID || updated?.id;
        return id === uid ? updated : e;
      }));
    } catch (e) {
      setError(e?.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const completed = enrollments.filter(e => String(e.status || '').toUpperCase() === 'COMPLETED').length;
  const active    = enrollments.filter(e => String(e.status || '').toUpperCase() === 'ENROLLED').length;

  return (
    <AppLayout pageTitle="Program Enrollments">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-0" style={{ fontFamily: "'Syne', sans-serif", color: '#0d1f1c' }}>Program Enrollments</h4>
          <div className="text-muted small">Manage enrollment progress for this training program.</div>
        </div>
        <button className="btn btn-sm btn-outline-secondary" style={{ borderRadius: 10 }}
          onClick={() => navigate('/dashboard/program-manager/programs')}>
          <i className="fas fa-arrow-left me-1" /> Back to Programs
        </button>
      </div>

      {/* Program info strip */}
      <div className="card border-0 shadow-sm p-3 mb-4 d-flex flex-row align-items-center gap-3" style={{ borderRadius: 14 }}>
        <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
          style={{ width: 42, height: 42, background: '#e0f2f1', color: '#00897b', fontSize: '1.1rem' }}>
          <i className="fas fa-graduation-cap" />
        </div>
        <div className="flex-grow-1">
          <div className="fw-bold" style={{ color: '#0d1f1c' }}>{program?.title || 'Training Program'}</div>
          <div className="text-muted small">{enrollments.length} total · {active} active · {completed} completed</div>
        </div>
      </div>

      {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

      <div className="card border-0 shadow-sm" style={{ borderRadius: 16, overflow: 'hidden' }}>
        <div className="px-4 py-3" style={{ borderBottom: '1px solid #f0f4f2', background: '#fafcfb' }}>
          <h6 className="fw-bold mb-0" style={{ fontFamily: "'Syne', sans-serif" }}>
            <i className="fas fa-users me-2" style={{ color: '#00897b' }} />Enrolled Participants
          </h6>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border" style={{ color: '#00897b' }} /></div>
          ) : enrollments.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="fas fa-users fa-2x mb-2 d-block" style={{ color: '#b2dfdb' }} />
              No enrollments found for this program.
            </div>
          ) : (
            <EnrollmentTable enrollments={enrollments} updatingId={updatingId} onStatusChange={changeStatus} />
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default ProgramEnrollments;
