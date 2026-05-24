import React from 'react';
import StatusBadge from './StatusBadge';

const formatDate = (d) => (d ? String(d).slice(0, 10) : '-');

const JobCard = ({ job, onViewApplications, onClose }) => {
  if (!job) return null;

  const { title, location, status, createdAt } = job;

  return (
    <div className="col-md-4">
      <div className="card h-100 shadow-sm border-0" style={{ borderRadius: 14 }}>
        <div className="card-body d-flex flex-column">
       
          
          <div className="d-flex align-items-start justify-content-between">
            <h5 className="mb-1">{title}</h5>
            <StatusBadge status={status} />
          </div>

          <div className="text-muted small mb-2">{location}</div>
          <div className="text-muted small mb-3">
            Posted: {formatDate(createdAt)}
          </div>

         
          <div className="mt-auto d-flex gap-2">
            <button
              className="btn btn-sm btn-primary flex-fill"
              onClick={onViewApplications}
            >
              View Applications
            </button>
          </div>

          <div className="mt-2 d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-danger flex-fill"
              onClick={onClose}
              disabled={status === 'CLOSED'}
              title={status === 'CLOSED' ? 'Job already closed' : 'Close job'}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;