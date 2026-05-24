import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRole } from '../../utils/tokenStorage';
import { getTrainingPrograms } from '../../api/programManagerApi';
import { requireProgramManagerRole } from './roleGuard';
import AppLayout from '../../components/AppLayout';
import ProgramCard from './components/ProgramCard';

const TrainingPrograms = () => {
  const role = getRole();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!requireProgramManagerRole(role)) { navigate('/login', { replace: true }); return; }
    (async () => {
      try {
        setLoading(true);
        const data = await getTrainingPrograms();
        setPrograms(Array.isArray(data) ? data : []);
      } catch { setPrograms([]); }
      finally { setLoading(false); }
    })();
  }, [navigate, role]);

  const active   = programs.filter(p => String(p.status || '').toUpperCase() === 'ACTIVE').length;
  const inactive = programs.length - active;

  return (
    <AppLayout pageTitle="Training Programs">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-0" style={{ fontFamily: "'Syne', sans-serif", color: '#0d1f1c' }}>Training Programs</h4>
          <div className="text-muted small">View program details and manage enrollment progress.</div>
        </div>
        <button className="btn btn-sm fw-semibold text-white"
          style={{ background: '#00897b', borderRadius: 10 }}
          onClick={() => navigate('/dashboard/program-manager/create')}>
          <i className="fas fa-plus me-1" /> Create Program
        </button>
      </div>

      {/* Summary strip */}
      {!loading && programs.length > 0 && (
        <div className="row g-3 mb-4">
          {[
            { label: 'Total',    value: programs.length, color: '#00897b', icon: 'fa-book' },
            { label: 'Active',   value: active,          color: '#22c55e', icon: 'fa-play-circle' },
            { label: 'Inactive', value: inactive,        color: '#64748b', icon: 'fa-pause-circle' },
          ].map(({ label, value, color, icon }) => (
            <div key={label} className="col-4">
              <div className="card border-0 shadow-sm p-3 text-center" style={{ borderRadius: 14, borderTop: `3px solid ${color}` }}>
                <i className={`fas ${icon} mb-1`} style={{ color, fontSize: '1.1rem' }} />
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0d1f1c', fontFamily: "'Syne', sans-serif" }}>{value}</div>
                <div className="text-muted" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Program cards */}
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border" style={{ color: '#00897b' }} /></div>
      ) : programs.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="fas fa-book fa-3x mb-3 d-block" style={{ color: '#b2dfdb' }} />
          <div className="fw-bold">No training programs found.</div>
          <button className="btn btn-sm mt-3 text-white" style={{ background: '#00897b', borderRadius: 10 }}
            onClick={() => navigate('/dashboard/program-manager/create')}>
            Create your first program
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {programs.map((p) => (
            <ProgramCard
              key={p.programID || p.programId || p.id}
              program={p}
              onViewDetails={() => navigate('/dashboard/program-manager/program-details', { state: { program: p } })}
              onViewEnrollments={() => navigate('/dashboard/program-manager/program-enrollments', { state: { program: p } })}
            />
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default TrainingPrograms;
