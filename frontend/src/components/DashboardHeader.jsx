import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationsDropdown from './NotificationsDropdown';
import { clearAuthData, getRole, getUsername } from '../utils/tokenStorage';
import './AppLayout.css';

const ROLE_META = {
  JOB_SEEKER:      { label: 'Job Seeker',     color: '#c084fc' },
  EMPLOYER:        { label: 'Employer',        color: '#34d399' },
  ADMIN:           { label: 'Administrator',   color: '#f87171' },
  OFFICER:         { label: 'Officer',         color: '#60a5fa' },
  PROGRAM_MANAGER: { label: 'Program Manager', color: '#fbbf24' },
  AUDITOR:         { label: 'Auditor',         color: '#f472b6' },
};

const ROLE_LABELS = {
  JOB_SEEKER:      'Job Seeker Dashboard',
  EMPLOYER:        'Employer Dashboard',
  ADMIN:           'Admin Dashboard',
  PROGRAM_MANAGER: 'Program Manager Dashboard',
  OFFICER:         'Officer Dashboard',
  AUDITOR:         'Auditor Dashboard',
};

const DashboardHeader = () => {
  const navigate = useNavigate();
  const role     = getRole();
  const username = getUsername();
  const meta     = ROLE_META[role] || { label: 'User', color: '#c084fc' };
  const label    = ROLE_LABELS[role] || 'Dashboard';

  const handleLogout = () => { clearAuthData(); navigate('/login'); };

  return (
    <header className="wf-topbar" style={{ marginLeft: 0 }}>
      <div className="wf-topbar__left">
        <div className="wf-topbar__page-title">{label}</div>
      </div>
      <div className="wf-topbar__right">
        <button
          className="btn btn-link p-0 text-decoration-none"
          style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#6b7280' }}
          onClick={() => navigate('/about')}
        >About</button>
        <button
          className="btn btn-link p-0 text-decoration-none"
          style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#6b7280' }}
          onClick={() => navigate('/contact')}
        >Contact</button>
        <div className="wf-topbar__divider" />
        <NotificationsDropdown />
        <div className="wf-topbar__divider" />
        <div className="wf-topbar__profile">
          <div
            className="wf-topbar__avatar"
            style={{ background: `linear-gradient(135deg, ${meta.color} 0%, #7c3aed 100%)` }}
          >
            {username ? username[0].toUpperCase() : 'U'}
          </div>
          <div className="d-none d-md-block">
            <div className="wf-topbar__uname">{username}</div>
            <div className="wf-topbar__urole" style={{ color: meta.color }}>{meta.label}</div>
          </div>
        </div>
        <div className="wf-topbar__divider" />
        <button className="wf-logout-btn" style={{ width: 'auto', padding: '0.45rem 0.9rem' }} onClick={handleLogout}>
          <i className="bi bi-power" />
          <span className="d-none d-sm-inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
