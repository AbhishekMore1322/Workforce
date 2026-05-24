import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import '../../components/AppLayout.css';

const NAV_LINKS = [
  { to: '/dashboard/admin',            label: 'Overview',    end: true },
  { to: '/dashboard/admin/jobseekers', label: 'Job Seekers' },
  { to: '/dashboard/admin/employers',  label: 'Employers'   },
  { to: '/dashboard/admin/programs',   label: 'Programs'    },
  { to: '/dashboard/admin/placements', label: 'Placements'  },
  { to: '/dashboard/admin/reports',    label: 'Reports'     },
];

const AdminDashboard = () => (
  <AppLayout pageTitle="Admin Dashboard">
    <div className="card border-0 shadow-sm p-3 mb-4">
      <div className="d-flex flex-wrap gap-2">
        {NAV_LINKS.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `btn btn-outline-dark btn-sm${isActive ? '' : ''}`
            }
            style={({ isActive }) => ({ opacity: isActive ? 1 : 0.75 })}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </div>
    <Outlet />
  </AppLayout>
);

export default AdminDashboard;
