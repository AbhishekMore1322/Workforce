import React, { useEffect, useState } from 'react';
import {
  getAllJobSeekers,
  getAllEmployers,
  getAllApplications,
  getAllPlacements,
} from '../../api/adminApi';
import AdminStatsCards from './components/AdminStatsCards';

const AdminOverview = () => {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [jobSeekersRaw, employersRaw, applicationsRaw, placementsRaw] =
          await Promise.all([
            getAllJobSeekers(),
            getAllEmployers(),
            getAllApplications(),
            getAllPlacements(),
          ]);

        const norm = (v) => (Array.isArray(v) ? v : v?.items ?? []);
        const up   = (s) => (s || '').toUpperCase();

        const jobSeekers   = norm(jobSeekersRaw);
        const employers    = norm(employersRaw);
        const applications = norm(applicationsRaw);
        const placements   = norm(placementsRaw);

        setCards([
          {
            title: 'Total Job Seekers (Active / Inactive)',
            value: `${jobSeekers.filter(s => up(s.status) === 'ACTIVE').length} / ${jobSeekers.filter(s => up(s.status) === 'INACTIVE').length}`,
            icon: 'fa-users', iconColor: '#00796b',
          },
          {
            title: 'Total Employers (Pending / Active)',
            value: `${employers.filter(e => up(e.status) === 'PENDING').length} / ${employers.filter(e => up(e.status) === 'APPROVED').length}`,
            icon: 'fa-building', iconColor: '#00796b',
          },
          {
            title: 'Total Applications',
            value: applications.length,
            icon: 'fa-file-invoice', iconColor: '#00796b',
          },
          {
            title: 'Total Placements',
            value: placements.length,
            icon: 'fa-briefcase', iconColor: '#00796b',
          },
        ]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <h2 className="fw-bold text-dark">Admin Overview</h2>
        <div className="text-muted small">System Date: {new Date().toLocaleDateString()}</div>
      </div>
      {loading ? (
        <div className="card border-0 shadow-sm p-4 text-center">
          <div className="spinner-border text-jade" role="status" />
          <div className="text-muted mt-2 small">Loading system snapshot...</div>
        </div>
      ) : (
        <AdminStatsCards stats={cards} />
      )}
    </div>
  );
};

export default AdminOverview;
