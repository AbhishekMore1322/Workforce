import React from 'react';

const JobPostingCard = ({ job, onApply, isApplying, isApplied }) => {
  const title = job?.title || job?.jobTitle || job?.name || 'Job Posting';
  const location = job?.location || job?.jobLocation || job?.city || '';
  const employer = job?.employerName || job?.company || job?.employer || '';
  const description = job?.description || job?.details || '';

  return (
    <div className="card h-100 shadow-sm rounded-3 border-0">
      <div className="card-body d-flex flex-column p-3">
        <div className="mb-2">
          <h6 className="fw-bold text-primary mb-1">{title}</h6>
          {employer && <div className="text-muted small"><i className="bi bi-building me-1" />{employer}</div>}
          {location && <div className="text-muted small"><i className="bi bi-geo-alt me-1" />{location}</div>}
        </div>
        <p className="text-muted small flex-grow-1 mb-3">
          {description
            ? `${String(description).slice(0, 160)}${String(description).length > 160 ? '…' : ''}`
            : 'No description provided.'}
        </p>
        <div className="mt-auto">
          {isApplied ? (
            <button className="btn btn-secondary w-100 btn-sm" disabled>
              <i className="bi bi-check-circle me-1" />Applied
            </button>
          ) : (
            <button
              className="btn btn-primary w-100 btn-sm"
              onClick={() => onApply(job)}
              disabled={isApplying}
            >
              {isApplying
                ? <><span className="spinner-border spinner-border-sm me-2" />Applying…</>
                : <><i className="bi bi-send me-1" />Apply</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobPostingCard;
