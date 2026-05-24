import React from 'react';
import StatusBadge from './StatusBadge'; 

const formatDate = (date) =>
  date ? String(date).slice(0, 10) : '--';

const PlacementCard = ({ placement }) => {
  if (!placement) return null;

  const {
    placementID,
    position,
    startDate,
    status,
  } = placement;

  return (
    <div className="col-md-6">
      <div
        className="card shadow-sm border-0 h-100"
        style={{ borderRadius: 14 }}
      >
        <div className="card-body">
         
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h5 className="mb-1">
                {position || '--'}
              </h5>
              <div className="text-muted small">
                Placement ID: {placementID}
              </div>
            </div>

            <span className="badge bg-success">
              {status || '--'}
            </span>
          </div>

        
          <div className="mt-3 text-muted small">
            <div>
              <strong>Joining Date:</strong>{' '}
              {formatDate(startDate)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementCard;
