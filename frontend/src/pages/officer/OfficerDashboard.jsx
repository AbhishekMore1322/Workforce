import React from 'react';
import { Outlet } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import '../../components/AppLayout.css';

const OfficerDashboard = () => (
  <AppLayout pageTitle="Officer Console">
    <div className="container-fluid py-3">
      <div className="card border-0 shadow-sm bg-white">
        <div className="p-4 border-bottom">
          <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
            <div>
              <div className="fw-bold" style={{ color: '#00796b' }}>Operational Workflow</div>
              <div className="text-muted small">Status toggles, notes, verification, and placement tracking.</div>
            </div>
            <span className="badge bg-warning text-dark">
              <i className="fas fa-clock me-1" /> Live Actions
            </span>
          </div>
        </div>
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  </AppLayout>
);

export default OfficerDashboard;
