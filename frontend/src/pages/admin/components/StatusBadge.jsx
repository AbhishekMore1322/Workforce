import React from 'react';

const STATUS_STYLES = {
  ACTIVE: { bg: 'success', text: 'white' },
  INACTIVE: { bg: 'secondary', text: 'white' },
  PENDING: { bg: 'warning', text: 'dark' },
  CREATED: { bg: 'info', text: 'white' },
  COMPLETED: { bg: 'primary', text: 'white' },
};

const StatusBadge = ({ status }) => {
  const normalized = (status || '').toString().toUpperCase();
  const style = STATUS_STYLES[normalized] || { bg: 'light', text: 'dark', border: 'border' };

  const className = `badge bg-${style.bg} text-${style.text || 'dark'}`;
  return <span className={className}>{normalized || 'UNKNOWN'}</span>;
};

export default StatusBadge;

