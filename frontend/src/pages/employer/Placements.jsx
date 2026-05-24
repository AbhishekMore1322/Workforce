import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getRole } from '../../utils/tokenStorage';

import DashboardHeader from '../../components/DashboardHeader';
import DashboardFooter from '../../components/DashboardFooter';
import EmptyState from './components/EmptyState';
import PlacementCard from './components/PlacementCard';

import { getAllPlacements } from '../../api/employerApi';

const Placements = () => {
  const role = getRole();
  const navigate = useNavigate();

  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPlacements = async () => {
    try {
      setLoading(true);
      setError('');

      const employerID = localStorage.getItem('workforce_employerId');
      if (!employerID) {
        throw new Error('Employer identity missing. Please login again.');
      }

      const data = await getAllPlacements();
      const toArray = (v) => (Array.isArray(v) ? v : []);

      const myPlacements = toArray(data).filter(
        (p) => String(p.employerID) === String(employerID)
      );

      setPlacements(myPlacements);
    } catch (e) {
      console.error(e);
      setPlacements([]);
      setError(e.message || 'Failed to load placements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === 'EMPLOYER') {
      loadPlacements();
    }
  }, [role]);

  if (role !== 'EMPLOYER') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="bg-light min-vh-100">
      <DashboardHeader />

      <div className="container py-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 className="fw-bold" style={{ color: '#00796b' }}>
              Placements
            </h3>
            <p className="text-muted mb-0">
              Confirmed hiring outcomes for your job postings.
            </p>
          </div>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate('/dashboard/employer/jobs')}
          >
            Back to Jobs
          </button>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small mb-3">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        {loading ? (
          <EmptyState
            title="Loading placements"
            description="Fetching placement records..."
            icon="fa-spinner"
          />
        ) : placements.length === 0 ? (
          <EmptyState
            title="No placements yet"
            description="Once candidates are hired, placement records will appear here."
            icon="fa-handshake"
          />
        ) : (
          <div className="row g-4">
            {placements.map((placement) => (
              <PlacementCard
                key={placement.placementID}
                placement={placement}
              />
            ))}
          </div>
        )}
      </div>

      <DashboardFooter />
    </div>
  );
};

export default Placements;
