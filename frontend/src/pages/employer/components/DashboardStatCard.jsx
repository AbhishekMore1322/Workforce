import React from 'react';

const DashboardStatCard = ({ title, value, icon }) => {
  return (
    <div className="card border-0 shadow-sm p-4 bg-white h-100" style={{ borderRadius: 16 }}>
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <div className="text-muted small">{title}</div>
          <div className="fw-bold fs-4" style={{ color: '#00796b' }}>{value}</div>
        </div>
        <div
          className="rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: 44, height: 44, background: '#e7f3f0', color: '#00796b' }}
          aria-hidden="true"
        >
          <i className={`fas ${icon}`} />
        </div>
      </div>
    </div>
  );
};

export default DashboardStatCard;

