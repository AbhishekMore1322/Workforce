import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRole } from '../../utils/tokenStorage';
import { requireProgramManagerRole } from './roleGuard';
import { updateTrainingProgramStatus } from '../../api/programManagerApi';
import AppLayout from '../../components/AppLayout';
import StatusBadge from './components/StatusBadge';

const formatDate = (d) => (d ? String(d).slice(0, 10) : '-');

const InfoRow = ({ icon, label, value, color = '#00897b' }) => (
  <div className="d-flex align-items-start gap-3 p-3 rounded-3 mb-2" style={{ background: '#f8fffe', border: '1px solid #e0f0ed' }}>
    <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
      style={{ width: 36, height: 36, background: color + '18', color }}>
      <i className={`fas ${icon}`} />
    </div>
    <div>
      <div className="text-muted" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{label}</div>
      <div className="fw-bold" style={{ color: '#0d1f1c' }}>{value || '—'}</div>
    </div>
  </div>
);

const ProgramDetails = () => {
  const role = getRole();
  const navigate = useNavigate();
  const { state } = useLocation();
  const program = state?.program;
  const [msg, setMsg] = useState('');
  const [isErr, setIsErr] = useState(false);

  if (!requireProgramManagerRole(role)) { navigate('/login', { replace: true }); return null; }

  if (!program) return (
    <AppLayout pageTitle="Program Details">
      <div className="alert alert-warning">No program data available.</div>
    </AppLayout>
  );

  const isActive = String(program.status || '').toUpperCase() === 'ACTIVE';

  const handleDeactivate = async () => {
    if (!window.confirm('Deactivate this program?\n\nEnrollments and reports remain available.')) return;
    const id = program.programID ?? program.programId ?? program.id;
    if (!id) { setIsErr(true); setMsg('Cannot deactivate: program ID missing.'); return; }
    try {
      await updateTrainingProgramStatus(id);
      navigate('/dashboard/program-manager/programs', { replace: true });
    } catch (err) {
      setIsErr(true);
      setMsg(err?.message || 'Failed to deactivate program.');
    }
  };

  return (
    <AppLayout pageTitle="Program Details">
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Header card */}
        <div className="card border-0 shadow-sm mb-4 overflow-hidden" style={{ borderRadius: 16 }}>
          <div style={{ height: 6, background: 'linear-gradient(90deg, #00897b, #22c55e)' }} />
          <div className="card-body p-4">
            <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">
              <div>
                <h4 className="fw-bold mb-1" style={{ fontFamily: "'Syne', sans-serif", color: '#0d1f1c' }}>{program.title}</h4>
                <StatusBadge status={program.status} />
              </div>
              <div className="d-flex gap-2 flex-wrap">
                <button className="btn btn-sm fw-semibold"
                  style={{ background: '#00897b', color: '#fff', borderRadius: 10 }}
                  onClick={() => navigate('/dashboard/program-manager/program-enrollments', { state: { program } })}>
                  <i className="fas fa-users me-1" /> Enrollments
                </button>
                <button className="btn btn-sm btn-outline-secondary" style={{ borderRadius: 10 }}
                  onClick={() => navigate('/dashboard/program-manager/reports')}>
                  <i className="fas fa-chart-bar me-1" /> Reports
                </button>
              </div>
            </div>
          </div>
        </div>

        {msg && <div className={`alert ${isErr ? 'alert-danger' : 'alert-success'} mb-4`}>{msg}</div>}

        {/* Info rows */}
        <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 16 }}>
          <div className="fw-bold mb-3" style={{ fontFamily: "'Syne', sans-serif", color: '#0d1f1c' }}>Program Information</div>
          <InfoRow icon="fa-calendar-alt"   label="Start Date"   value={formatDate(program.startDate)} color="#00897b" />
          <InfoRow icon="fa-calendar-check" label="End Date"     value={formatDate(program.endDate)}   color="#22c55e" />
          <InfoRow icon="fa-hashtag"        label="Program ID"   value={`#${program.programID ?? program.id ?? '—'}`} color="#0ea5e9" />
          {program.description && (
            <div className="mt-3 p-3 rounded-3" style={{ background: '#f4f5fb', border: '1px solid #e8eaf0' }}>
              <div className="text-muted" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 6 }}>Description</div>
              <div style={{ fontSize: '0.9rem', color: '#4b5563', lineHeight: 1.7 }}>{program.description}</div>
            </div>
          )}
        </div>

        {/* Deactivate */}
        {isActive && (
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 16, border: '1px solid #fee2e2' }}>
            <div className="fw-bold mb-1" style={{ color: '#dc2626' }}>Danger Zone</div>
            <div className="text-muted small mb-3">Deactivating this program will stop new enrollments. Existing data is preserved.</div>
            <button className="btn btn-sm btn-outline-danger" style={{ borderRadius: 10 }} onClick={handleDeactivate}>
              <i className="fas fa-power-off me-1" /> Deactivate Program
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ProgramDetails;
