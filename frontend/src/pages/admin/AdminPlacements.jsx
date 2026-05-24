import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRole } from '../../utils/tokenStorage';
import {
  getAllPlacements,
  updatePlacementStatus,
  deletePlacement,
} from '../../api/adminApi';
import AdminTable from './components/AdminTable';
import StatusBadge from './components/StatusBadge';

const AdminPlacements = () => {
  const navigate = useNavigate();
  const role = getRole();

  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (role !== 'ADMIN') {
      navigate('/login');
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getAllPlacements();
        setPlacements(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || 'Failed to load placements');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate, role]);

const formatStartDate = (value) => {
  if (!value) return '-';


  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) {

      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
      return String(value);
    }

    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch {
    return String(value);
  }
};


  const columns = useMemo(
    () => [
      {
        key: 'placementID',
        label: 'Placement ID',
        render: (r) => r.placementID ?? '-',
      },
      {
        key: 'applicationID',
        label: 'Application ID',
        render: (r) => r.applicationID ?? '-',
      },
      {
        key: 'employerID',
        label: 'Employer ID',
        render: (r) => r.employerID ?? '-',
      },
      {
        key: 'position',
        label: 'Position',
        render: (r) => r.position || '-',
      },
      {
        key: 'startDate',
        label: 'Start Date',
        render: (r) => formatStartDate(r.startDate),
      },
      {
        key: 'status',
        label: 'Status',
        render: (r) => <StatusBadge status={r.status} />,
      },
    ],
    []
  );

  const handleMarkCompleted = async (placement) => {
    const placementId = placement?.placementID;
    if (!placementId) {
      console.error('Missing placementID:', placement);
      return;
    }

    try {
      const updated = await updatePlacementStatus(
        placementId,
        'CONFIRMED'
      );

      setPlacements((prev) =>
        prev.map((p) =>
          p.placementID === placementId ? updated : p
        )
      );
    } catch (e) {
      console.error(e);
      setError(e.message || 'Failed to update placement status');
    }
  };

  const handleDelete = async (placement) => {
    const placementId = placement?.placementID;
    if (!placementId) {
      console.error('Missing placementID:', placement);
      return;
    }

    try {
      await deletePlacement(placementId);
      setPlacements((prev) => prev.filter((p) => p.placementID !== placementId));
    } catch (e) {
      console.error(e);
      setError(e.message || 'Failed to delete placement');
    }
  };

  if (role !== 'ADMIN') return null;

  return (
    <div className="p-5 bg-light min-vh-100">
      <h2 className="fw-bold mb-4">Placement Oversight</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-jade" />
          <div className="small text-muted mt-2">
            Loading placements…
          </div>
        </div>
      ) : (
        <AdminTable
          columns={columns}
          rows={placements}
          emptyText="No placements found."
          renderRowActions={(placement) => {
            const status = (placement.status || '').toUpperCase();

            return (
              <div className="d-flex gap-2">
                {status !== 'CONFIRMED' && (
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleMarkCompleted(placement)}
                    disabled={!placement?.placementID}
                  >
                    Mark Completed
                  </button>
                )}

                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() =>
                    handleDelete(placement)
                  }
                >
                  Delete
                </button>
              </div>
            );
          }}
        />
      )}
    </div>
  );
};

export default AdminPlacements;