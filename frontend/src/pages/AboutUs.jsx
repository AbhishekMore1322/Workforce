import React from 'react';
import{ useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card border-0 shadow-sm p-4 p-md-5 mb-4">
            <div className="d-flex align-items-start gap-3">
             

              <div>
                <h1 className="fw-bold mb-1" style={{ color: '#00796b' }}>
                  About Workforce
                </h1>
                <p className="text-muted mb-0">
                  Workforce Employment Services is a role‑based placement management
                  platform designed to streamline recruitment, training, and
                  verification workflows in a structured and transparent manner.
                </p>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm p-4 p-md-5 mb-4">
            <h4 className="fw-bold mb-3">What the Application Does</h4>
            <p className="text-muted">
              Workforce acts as a centralized platform connecting job seekers,
              employers, and administrative authorities. Each user interacts
              through a dedicated dashboard aligned with their role.
            </p>
            <ul className="text-muted">
              <li>Centralized job posting and application tracking</li>
              <li>Employer verification and governance controls</li>
              <li>Training programs and enrollment management</li>
              <li>Transparent placement and reporting workflows</li>
            </ul>
          </div>

          <div className="card border-0 shadow-sm p-4 p-md-5 mb-4">
            <h4 className="fw-bold mb-3">
              <i className="fas fa-user-check me-2" style={{ color: '#00796b' }}></i>
              Job Seeker Journey
            </h4>
            <p className="text-muted">
              Job seekers use Workforce as a guided platform to discover
              opportunities and track their placement lifecycle.
            </p>
            <ul className="text-muted">
              <li>Register and maintain profile details</li>
              <li>Apply for available job postings</li>
              <li>Track application and placement status</li>
              <li>Enroll in training programs when eligible</li>
              <li>Receive system notifications and updates</li>
            </ul>
          </div>

          <div className="card border-0 shadow-sm p-4 p-md-5 mb-4">
            <h4 className="fw-bold mb-3">
              <i className="fas fa-building me-2" style={{ color: '#00796b' }}></i>
              Employer Workflow
            </h4>
            <p className="text-muted">
              Employers leverage Workforce to post jobs and manage candidate
              pipelines in a verified environment.
            </p>
            <ul className="text-muted">
              <li>Register organization details</li>
              <li>Await verification by administrators</li>
              <li>Post and manage job openings</li>
              <li>Review and shortlist applicants</li>
              <li>Coordinate placements transparently</li>
            </ul>
          </div>

          <div className="card border-0 shadow-sm p-4 p-md-5 mb-4">
            <h4 className="fw-bold mb-3">
              <i className="fas fa-shield-alt me-2" style={{ color: '#00796b' }}></i>
              Governance & Oversight
            </h4>
            <p className="text-muted">
              Administrative roles ensure compliance, verification, and proper
              system governance without interfering in business workflows.
            </p>
            <ul className="text-muted">
              <li>Employer verification (Approve / Reject)</li>
              <li>Training and enrollment oversight</li>
              <li>Placement monitoring and reporting</li>
              <li>Role‑based access enforcement</li>
            </ul>
          </div>

          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mt-4">
            <div>
              <div className="fw-bold">Application Version</div>
              <div className="text-muted">1.0.0 (Demo)</div>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-jade px-4"
                style={{ backgroundColor: '#00796b', color: '#fff' }}
                onClick={() => navigate('/contact')}
              >
                Contact Us
              </button>
              <button
                className="btn btn-outline-secondary px-4"
                onClick={() => navigate('/dashboard')}
              >
                Return to Dashboard
              </button>
            </div>
          </div>

          <div className="text-center mt-4 text-secondary small">
            © 2026 Workforce Employment Services. All rights reserved.
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutUs;
