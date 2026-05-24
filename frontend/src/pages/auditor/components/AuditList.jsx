import React from 'react';
import EmptyState from './EmptyState';
import AuditCard from './AuditCard';

const AuditList = ({ audits }) => {
  if (!audits || audits.length === 0) {
    return (
      <EmptyState
        icon="fas fa-clipboard-list fa-2x"
        message="No audits recorded yet. Review system reports to record observations."
      />
    );
  }

  return (
    <div className="row g-4">
      {audits.map((audit) => (
        <div key={audit?._id || audit?.id} className="col-12">
          <AuditCard audit={audit} />
        </div>
      ))}
    </div>
  );
};

export default AuditList;

