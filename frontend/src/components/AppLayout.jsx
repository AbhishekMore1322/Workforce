import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearAuthData, getUsername, getRole } from '../utils/tokenStorage';
import NotificationsDropdown from './NotificationsDropdown';
import './AppLayout.css';

const NAV_CONFIG = {
  JOB_SEEKER: [
    { label: 'Dashboard',         icon: 'bi-grid-1x2-fill',      path: '/dashboard' },
    { label: 'My Applications',   icon: 'bi-briefcase-fill',      path: '/dashboard/jobseeker/applications' },
    { label: 'My Enrollments',    icon: 'bi-journal-check',       path: '/dashboard/jobseeker/enrollments' },
    { label: 'Training Programs', icon: 'bi-mortarboard-fill',    path: '/dashboard/jobseeker/training-programs' },
    { label: 'My Profile',        icon: 'bi-person-bounding-box', path: '/dashboard/jobseeker/profile' },
    { label: 'Documents',         icon: 'bi-file-earmark-fill',   path: '/dashboard/jobseeker/documents' },
  ],
  EMPLOYER: [
    { label: 'Dashboard',    icon: 'bi-grid-1x2-fill',     path: '/dashboard/employer' },
    { label: 'Job Listings', icon: 'bi-briefcase-fill',    path: '/dashboard/employer/jobs' },
    { label: 'Interviews',   icon: 'bi-camera-video-fill', path: '/dashboard/employer/interviews' },
    { label: 'Placements',   icon: 'bi-award-fill',        path: '/dashboard/employer/placements' },
    { label: 'Profile',      icon: 'bi-building-fill',     path: '/dashboard/employer/profile' },
  ],
  ADMIN: [
    { label: 'Dashboard',   icon: 'bi-grid-1x2-fill',    path: '/dashboard' },
    { label: 'Job Seekers', icon: 'bi-people-fill',      path: '/dashboard/admin/jobseekers' },
    { label: 'Employers',   icon: 'bi-building-fill',    path: '/dashboard/admin/employers' },
    { label: 'Programs',    icon: 'bi-mortarboard-fill', path: '/dashboard/admin/programs' },
    { label: 'Placements',  icon: 'bi-award-fill',       path: '/dashboard/admin/placements' },
    { label: 'Reports',     icon: 'bi-bar-chart-fill',   path: '/dashboard/admin/reports' },
  ],
  OFFICER: [
    { label: 'Dashboard',    icon: 'bi-grid-1x2-fill',    path: '/dashboard/officer' },
    { label: 'Job Seekers',  icon: 'bi-people-fill',      path: '/dashboard/officer/jobseekers' },
    { label: 'Employers',    icon: 'bi-building-fill',    path: '/dashboard/officer/employers' },
    { label: 'Applications', icon: 'bi-inbox-fill',       path: '/dashboard/officer/applications' },
    { label: 'Placements',   icon: 'bi-award-fill',       path: '/dashboard/officer/placements' },
    { label: 'Compliance',   icon: 'bi-shield-fill-check',path: '/dashboard/officer/compliance' },
  ],
  PROGRAM_MANAGER: [
    { label: 'Dashboard',   icon: 'bi-grid-1x2-fill',    path: '/dashboard/program-manager' },
    { label: 'Programs',    icon: 'bi-mortarboard-fill', path: '/dashboard/program-manager/programs' },
    { label: 'Create',      icon: 'bi-plus-circle-fill', path: '/dashboard/program-manager/create' },
    { label: 'Reports',     icon: 'bi-bar-chart-fill',   path: '/dashboard/program-manager/reports' },
  ],
  AUDITOR: [
    { label: 'Dashboard', icon: 'bi-grid-1x2-fill',          path: '/dashboard' },
    { label: 'Audits',    icon: 'bi-clipboard2-check-fill',  path: '/dashboard' },
    { label: 'Reports',   icon: 'bi-bar-chart-fill',         path: '/dashboard' },
  ],
};

const ROLE_META = {
  JOB_SEEKER:      { label: 'Job Seeker',     color: '#c084fc', bg: 'rgba(192,132,252,0.15)', emoji: '🚀' },
  EMPLOYER:        { label: 'Employer',        color: '#34d399', bg: 'rgba(52,211,153,0.15)',  emoji: '🏢' },
  ADMIN:           { label: 'Administrator',   color: '#f87171', bg: 'rgba(248,113,113,0.15)', emoji: '⚡' },
  OFFICER:         { label: 'Officer',         color: '#60a5fa', bg: 'rgba(96,165,250,0.15)',  emoji: '🛡️' },
  PROGRAM_MANAGER: { label: 'Program Manager', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)',  emoji: '🎓' },
  AUDITOR:         { label: 'Auditor',         color: '#f472b6', bg: 'rgba(244,114,182,0.15)', emoji: '🔍' },
};

const AppLayout = ({ children, pageTitle }) => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const username  = getUsername();
  const role      = getRole();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = NAV_CONFIG[role] || [];
  const meta     = ROLE_META[role] || { label: 'User', color: '#c084fc', bg: 'rgba(192,132,252,0.15)', emoji: '👤' };
  const handleLogout = () => { clearAuthData(); navigate('/login'); };

  const isActive = (item) => {
    const current = location.pathname;
    if (current === item.path) return true;
    const isDashboardItem = item.label === 'Dashboard';
    if (isDashboardItem) return false;
    return current.startsWith(item.path + '/');
  };

  return (
    <div className="wf-shell">
      <aside className={`wf-sidebar ${collapsed ? 'wf-sidebar--collapsed' : ''}`}>
        <div className="wf-sidebar__brand">
          {!collapsed && (
            <>
              <img src="/logo.jpg" alt="WorkForce" style={{ height: 36, borderRadius: 8, objectFit: 'contain' }} />
              <div className="wf-sidebar__brand-text">
                <span className="wf-sidebar__brand-name">WorkForce</span>
                <span className="wf-sidebar__brand-tagline">Employment Hub</span>
              </div>
            </>
          )}
          <button className="wf-collapse-btn" onClick={() => setCollapsed(!collapsed)} title="Toggle sidebar">
            <i className={`bi ${collapsed ? 'bi-chevron-double-right' : 'bi-chevron-double-left'}`} />
          </button>
        </div>
        {!collapsed && (
          <div className="wf-sidebar__user-card" style={{ borderColor: meta.color + '33' }}>
            <div className="wf-sidebar__user-avatar" style={{ background: meta.bg, color: meta.color }}>
              {username ? username[0].toUpperCase() : 'U'}
            </div>
            <div className="wf-sidebar__user-info">
              <div className="wf-sidebar__user-name">{username || 'User'}</div>
              <div className="wf-sidebar__user-role" style={{ color: meta.color }}>
                {meta.emoji} {meta.label}
              </div>
            </div>
          </div>
        )}
        {!collapsed && <div className="wf-sidebar__section-label">NAVIGATION</div>}

        <nav className="wf-sidebar__nav">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <button
                key={item.label}
                className={`wf-nav-item ${active ? 'wf-nav-item--active' : ''}`}
                onClick={() => navigate(item.path)}
                title={collapsed ? item.label : undefined}
              >
                <span className="wf-nav-item__icon-wrap">
                  <i className={`bi ${item.icon}`} />
                </span>
                {!collapsed && <span className="wf-nav-item__label">{item.label}</span>}
                {!collapsed && active && <span className="wf-nav-item__pip" />}
              </button>
            );
          })}
        </nav>

        <div className="wf-sidebar__footer">
          <button className="wf-logout-btn" onClick={handleLogout} title="Sign out">
            <i className="bi bi-power" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>

      </aside>

      
      <div className={`wf-main ${collapsed ? 'wf-main--collapsed' : ''}`}>
        <header className="wf-topbar">
          <div className="wf-topbar__left">
            <div className="wf-topbar__page-title">{pageTitle || 'Dashboard'}</div>
          </div>
          <div className="wf-topbar__right">
            <div className="wf-topbar__notif">
              <NotificationsDropdown />
            </div>
            <div className="wf-topbar__divider" />
            <div className="wf-topbar__profile">
              <div className="wf-topbar__avatar" style={{ background: `linear-gradient(135deg, ${meta.color} 0%, #6c47ff 100%)` }}>
                {username ? username[0].toUpperCase() : 'U'}
              </div>
              <div className="d-none d-md-block">
                <div className="wf-topbar__uname">{username}</div>
                <div className="wf-topbar__urole" style={{ color: meta.color }}>{meta.label}</div>
              </div>
            </div>
          </div>
        </header>
        <main className="wf-content">
          {children}
        </main>

      </div>
    </div>
  );
};

export default AppLayout;
