import React, { useMemo } from 'react';
import ReportCard from './ReportCard';

const DOMAIN_CONFIG = {
  APPLICATION: {
    domain: 'Job Applications',
    icon: 'fas fa-file-alt',
    title: 'Job Application Analytics',
  },
  TRAINING: {
    domain: 'Training Programs',
    icon: 'fas fa-chalkboard-teacher',
    title: 'Training Program Analytics',
  },
  PLACEMENT: {
    domain: 'Placements',
    icon: 'fas fa-briefcase',
    title: 'Placement Analytics',
  },
  COMPLIANCE: {
    domain: 'Compliance',
    icon: 'fas fa-file-shield',
    title: 'Compliance Analytics',
  },
};

const ReportsOverview = ({ reports, onCreateAudit }) => {
  const cards = useMemo(() => {
    return [
      {
        key: 'APPLICATION',
        type: 'APPLICATION',
        metrics: reports?.jobApplications,
        ...DOMAIN_CONFIG.APPLICATION,
      },
      {
        key: 'TRAINING',
        type: 'TRAINING',
        metrics: reports?.training,
        ...DOMAIN_CONFIG.TRAINING,
      },
      {
        key: 'PLACEMENT',
        type: 'PLACEMENT',
        metrics: reports?.placements,
        ...DOMAIN_CONFIG.PLACEMENT,
      },
      {
        key: 'COMPLIANCE',
        type: 'COMPLIANCE',
        metrics: reports?.compliance,
        ...DOMAIN_CONFIG.COMPLIANCE,
      },
    ];
  }, [reports]);

  return (
    <div className="row g-4">
      {cards.map((c) => (
        <div key={c.key} className="col-12 col-lg-6">
          <ReportCard
            domain={c.domain}
            icon={c.icon}
            title={c.title}
            status="Data Available"
            metrics={c.metrics}
            actionLabel="Create Audit Based on This Report"
            onAction={() => onCreateAudit(c.type)}
          />
        </div>
      ))}
    </div>
  );
};

export default ReportsOverview;

