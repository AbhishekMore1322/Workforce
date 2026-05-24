import React from 'react';
import StatusBadge from './StatusBadge';

const formatDate = (d) => (d ? String(d).slice(0, 10) : '-');

const ApplicationCard = ({ application }) => {
  if (!application) return null;
  return (
    <div className="col-12">
      <div className="card shadow-sm rounded-3 border-0 mb-2">
        <div className="card-body py-3 px-4">
          <div className="row align-items-center">
            <div className="col-md-4">
              <div className="fw-bold">{application.jobTitle || '-'}</div>
              <div className="text-muted small">{application.employerName || '-'}</div>
            </div>
            <div className="col-md-3 text-muted small">
              <i className="bi bi-calendar3 me-1" />
              Applied: {formatDate(application.appliedDate)}
            </div>
            <div className="col-md-3 text-muted small">
              {application.location && (
                <><i className="bi bi-geo-alt me-1" />{application.location}</>
              )}
            </div>
            <div className="col-md-2 text-md-end mt-2 mt-md-0">
              <StatusBadge status={application.status} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
