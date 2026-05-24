import React from 'react';

const EmptyState = ({ message, icon }) => {
  return (
    <div className="text-center py-5">
      {icon ? (
        <div className="d-flex justify-content-center mb-3">
          <i className={icon} style={{ color: '#00796b' }} />
        </div>
      ) : null}
      <p className="text-muted mb-0">{message}</p>
    </div>
  );
};

export default EmptyState;

