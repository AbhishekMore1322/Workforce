import React from 'react';
import StatusBadge from './StatusBadge';

const fmt = (d) => (d ? String(d).slice(0, 10) : '—');

const EnrollmentCard = ({ enrollment }) => {
  if (!enrollment) return null;
  const { enrollmentID, programID, completionDate, status } = enrollment;

  return (
    <div className="col-md-6">
      <div className="wf-page-card h-100" style={{ marginBottom: 0 }}>
        <div className="wf-page-card__body">
          <div className="d-flex align-items-start justify-content-between gap-2 mb-3">
            <div
              style={{
                width: 44, height: 44, borderRadius: 12,
                background: '#f5f3ff', color: '#7c3aed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', flexShrink: 0,
              }}
            >
              <i className="bi bi-mortarboard-fill" />
            </div>
            <StatusBadge status={status} />
          </div>

          <div
            style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: '0.95rem', color: '#0f0e17', letterSpacing: '-0.02em',
              marginBottom: '0.25rem',
            }}
          >
            Program #{programID ?? '—'}
          </div>

          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.75rem', color: '#a0a8b8', marginBottom: '0.75rem' }}>
            Enrollment ID: {enrollmentID}
          </div>

          <div
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem', color: '#6b7280',
            }}
          >
            <i className="bi bi-calendar3" style={{ color: '#7c3aed' }} />
            Completion: {fmt(completionDate)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentCard;
