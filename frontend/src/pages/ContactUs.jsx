import React from 'react';
import { useNavigate } from 'react-router-dom';

const ContactUs = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-9">

      
          <div className="card border-0 shadow-sm p-4 p-md-5 mb-4">
            <div className="d-flex align-items-start gap-3">
              <div
                className="p-3 rounded"
                style={{ backgroundColor: '#e0f2f1', color: '#00796b' }}
              >
                <i className="fas fa-envelope fa-2x"></i>
              </div>

              <div>
                <h1 className="fw-bold mb-1" style={{ color: '#00796b' }}>
                  Contact Workforce
                </h1>
                <p className="text-muted mb-0">
                  Reach out to our support team for assistance, queries, or collaboration.
                </p>
              </div>
            </div>
          </div>

          
          <div className="card border-0 shadow-sm p-4 p-md-5 mb-4">
            <h4 className="fw-bold mb-3">
              <i className="fas fa-at me-2" style={{ color: '#00796b' }}></i>
              Mail Us
            </h4>

            <p className="text-muted mb-3">
              For support, access‑related issues, or general inquiries, please contact us
              via email. Our team will respond during standard business hours.
            </p>

            <div
              className="p-3 rounded"
              style={{ backgroundColor: '#f8f9fa' }}
            >
              <div className="fw-bold text-dark">Support Email</div>
              <div className="text-muted">
                support@workforce.com
              </div>
            </div>
          </div>

      
          <div className="card border-0 shadow-sm p-3 mb-4">
            <div className="d-flex align-items-start gap-2">
              <i className="fas fa-circle-info mt-1" style={{ color: '#00796b' }}></i>
              <div className="text-muted">
                Please include your registered email and role (Job Seeker / Employer /
                Admin) when contacting support to help us assist you faster.
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              className="btn btn-outline-secondary px-4"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactUs;