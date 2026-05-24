import React from 'react';

const STATUS_COLORS = {
  ACTIVE: 'primary',
  ENROLLED: 'primary',
  COMPLETED: 'success',
  SHORTLISTED: 'success',
  HIRED: 'success',
  PLACED: 'success',
  CANCELLED: 'danger',
  REJECTED: 'danger',
  WITHDRAWN: 'danger',
  INACTIVE: 'secondary',
  CLOSED: 'secondary',
  PENDING: 'warning',
  UNDER_REVIEW: 'warning',
  IN_REVIEW: 'warning',
  APPLIED: 'info',
  INTERVIEW_SCHEDULED: 'info',
};

const StatusBadge = ({ status }) => {
  const key = String(status || '').toUpperCase().replace(/\s+/g, '_');
  const color = STATUS_COLORS[key] || 'secondary';
  return (
    <span className={`badge bg-${color} px-3 py-2 rounded-pill`}>
      {String(status || 'UNKNOWN').replace(/_/g, ' ')}
    </span>
  );
};

export default StatusBadge;
