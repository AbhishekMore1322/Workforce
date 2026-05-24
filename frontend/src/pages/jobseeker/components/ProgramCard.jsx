import React from 'react';
import StatusBadge from './StatusBadge';

const formatDate = (d) => (d ? String(d).slice(0, 10) : '-');

const ProgramCard = ({ program, onViewDetails, onEnroll, disabled }) => {
  const title = program?.title || program?.programTitle || program?.name || '-';
  return (
    <div className="col-md-4">
      <div className="card h-100 shadow-sm rounded-3 border-0">
        <div className="card-body d-flex flex-column p-3">
          <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
            <h6 className="fw-bold mb-0">{title}</h6>
            <StatusBadge status={program?.status} />
          </div>
          <div className="text-muted small mb-2">
            <i className="bi bi-calendar-range me-1" />
            {formatDate(program?.startDate)} → {formatDate(program?.endDate)}
          </div>
          <p className="text-muted small flex-grow-1 mb-3" style={{ minHeight: 44 }}>
            {program?.description || 'No description provided.'}
          </p>
          <div className="d-flex gap-2 mt-auto">
            <button className="btn btn-sm btn-outline-primary flex-fill" onClick={onViewDetails}>
              <i className="bi bi-eye me-1" />Details
            </button>
            <button
              className="btn btn-sm btn-primary flex-fill"
              onClick={onEnroll}
              disabled={disabled}
            >
              {disabled ? <span className="spinner-border spinner-border-sm" /> : <><i className="bi bi-plus-circle me-1" />Enroll</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
