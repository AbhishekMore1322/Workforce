import React from 'react';
import StatusBadge from './StatusBadge';

const formatDate = (d) => (d ? String(d).slice(0, 10) : '-');

const ProgramCard = ({ program, onViewDetails, onViewEnrollments }) => {
  const title    = program?.title || '-';
  const isActive = String(program?.status || '').toUpperCase() === 'ACTIVE';

  return (
    <div className="col-md-4">
      <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: 16, overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,137,123,0.13)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = ''; }}>
        <div style={{ height: 4, background: isActive ? 'linear-gradient(90deg, #00897b, #22c55e)' : '#e2e8f0' }} />
        <div className="card-body d-flex flex-column p-4">
          <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
            <h6 className="fw-bold mb-0" style={{ fontFamily: "'Syne', sans-serif", color: '#0d1f1c' }}>{title}</h6>
            <StatusBadge status={program?.status} />
          </div>
          <div className="d-flex align-items-center gap-2 text-muted small mb-3">
            <i className="fas fa-calendar-alt" style={{ color: '#00897b' }} />
            <span>{formatDate(program?.startDate)} → {formatDate(program?.endDate)}</span>
          </div>
          {program?.description && (
            <p className="text-muted small flex-grow-1 mb-3" style={{ lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {program.description}
            </p>
          )}
          <div className="d-flex gap-2 mt-auto">
            <button className="btn btn-sm fw-semibold flex-fill text-white"
              style={{ background: '#00897b', borderRadius: 10 }} onClick={onViewDetails}>
              <i className="fas fa-eye me-1" /> Details
            </button>
            <button className="btn btn-sm btn-outline-secondary fw-semibold flex-fill"
              style={{ borderRadius: 10 }} onClick={onViewEnrollments}>
              <i className="fas fa-users me-1" /> Enrollments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
