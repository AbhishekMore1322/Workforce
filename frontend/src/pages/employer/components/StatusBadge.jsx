import React from 'react';

const STATUS_MAP = {

  SUBMITTED: { label: 'Submitted', className: 'bg-secondary' },
  APPROVED: { label: 'Approved', className: 'bg-primary' },
  REJECTED: { label: 'Rejected', className: 'bg-danger' },
  WITHDRAWN: { label: 'Withdrawn', className: 'bg-dark' },


  SCHEDULED: { label: 'Scheduled', className: 'bg-info text-dark' },
  COMPLETED: { label: 'Completed', className: 'bg-success' },
  CANCELLED: { label: 'Cancelled', className: 'bg-secondary' },

  SHORTLISTED: { label: 'Shortlisted', className: 'bg-success' },


  CREATED: { label: 'Created', className: 'bg-primary' },
  CONFIRMED: { label: 'Confirmed', className: 'bg-success' },
};

const StatusBadge = ({ status }) => {
  const key = status ? String(status).toUpperCase() : '';
  const entry = STATUS_MAP[key] || {
    label: key || '-',
    className: 'bg-light text-dark border',
  };

  return (
    <span
      className={`badge ${entry.className}`}
      style={{ fontWeight: 600 }}
    >
      {entry.label}
    </span>
  );
};

export default StatusBadge;