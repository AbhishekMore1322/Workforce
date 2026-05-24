import React from 'react';

const colors = {
  ACTIVE: 'primary',
  ENROLLED: 'primary',
  COMPLETED: 'success',
  CANCELLED: 'danger',
  INACTIVE: 'secondary',
};

const StatusBadge = ({ status }) => {
  const key = String(status).toUpperCase();
  const color = colors[key] || 'secondary';

  return (
    <span className={`badge bg-${color} px-3 py-2 rounded-pill`}>
      {key}
    </span>
  );
};

export default StatusBadge;