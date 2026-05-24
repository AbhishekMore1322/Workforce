import React from 'react';

const CandidateRow = ({ name = '-', email = '-' }) => {
  return (
    <div className="d-flex align-items-start justify-content-between gap-3">
      <div>
        <div className="fw-bold">{name}</div>
        <div className="text-muted small">{email}</div>
      </div>
    </div>
  );
};

export default CandidateRow;