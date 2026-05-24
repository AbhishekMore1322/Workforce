import React from 'react';

const AdminStatsCards = ({ stats }) => {
  return (
    <div className="row g-4 mb-5">
      {stats.map((card) => (
        <div key={card.title} className="col-md-3">
          <div className={`card border-0 shadow-sm p-4 text-center ${card.borderClass || ''}`}>
            <div className="mb-2" style={{ color: card.iconColor || '#00796b' }}>
              <i className={`fas ${card.icon} fa-2x`} />
            </div>
            <h6 className="text-muted">{card.title}</h6>
            <h3 className="fw-bold">{card.value ?? 0}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStatsCards;

