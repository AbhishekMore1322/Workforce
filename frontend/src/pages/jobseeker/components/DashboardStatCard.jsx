import React from 'react';

const CONFIGS = {
  'fa-id-card':    { bg: '#f5f3ff', color: '#7c3aed', icon: 'bi-person-badge-fill' },
  'fa-file':       { bg: '#fdf4ff', color: '#a855f7', icon: 'bi-file-earmark-check-fill' },
  'fa-book-reader':{ bg: '#fff7ed', color: '#f97316', icon: 'bi-mortarboard-fill' },
  'fa-paper-plane':{ bg: '#eff6ff', color: '#3b82f6', icon: 'bi-send-fill' },
};

const DashboardStatCard = ({ icon, label, value, helper }) => {
  const cfg = CONFIGS[icon] || { bg: '#f5f3ff', color: '#7c3aed', icon: 'bi-star-fill' };
  return (
    <div className="wf-stat h-100">
      <div className="wf-stat__icon" style={{ background: cfg.bg, color: cfg.color }}>
        <i className={`bi ${cfg.icon}`} />
      </div>
      <div className="wf-stat__value" style={{ color: cfg.color }}>{value}</div>
      <div className="wf-stat__label">{label}</div>
      {helper && <div className="wf-stat__helper">{helper}</div>}
    </div>
  );
};

export default DashboardStatCard;
