import React from 'react';

const DashboardFooter = () => {
  return (
    <footer className="workforce-dashboard-footer">
      <div className="container">
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between py-4 gap-3">
          <div className="d-flex align-items-center gap-3">
           <img
              src="/logo.jpg"
              alt="Workforce Logo"
              style={{ height: 40, borderRadius: '200%' }}
            />
            <div>
              <div className="fw-bold">WORKFORCE Employment Services</div>
              <div className="small text-white-50">
                Workforce placement, skills development, and compliance—made simple.
              </div>
            </div>
          </div>

          <div className="text-md-end small text-white-50">
            <div>© {new Date().getFullYear()} WorkForce Employment Services. All rights reserved.</div>
            <div className="mt-1">Built for multi-role dashboards (Job Seeker, Employer, Admin & more).</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;

