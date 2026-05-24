import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerEmployer } from '../../api/employerApi';
import { getToken } from '../../utils/tokenStorage';

const SignupEmployer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    contactInfo: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend validation
    if (!formData.name || formData.name.trim() === '') {
      setError('Company name is required');
      return;
    }
    if (!formData.industry || formData.industry.trim() === '') {
      setError('Industry is required');
      return;
    }
    if (!formData.contactInfo || formData.contactInfo.trim() === '') {
      setError('Contact email is required');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contactInfo)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const token = getToken();
      if (!token) throw new Error('Authentication token not found. Please signup again.');
      
      const response = await registerEmployer({
        name: formData.name,
        industry: formData.industry,
        contactInfo: formData.contactInfo,
      });

      if (!response) {
        throw new Error('Server returned no response');
      }

      // Navigate to dashboard or login
      navigate('/dashboard/employer');
      
    } catch (err) {
      console.error('Employer registration error:', err);
      setError(err.message || 'Failed to complete employer profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 text-start">
      <div className="text-center mb-4">
        <h4 className="fw-bold text-dark">Company Profile</h4>
        <p className="text-muted small">Finalize your organization's details</p>
      </div>

      {error && (
        <div className="alert alert-danger py-2 small d-flex align-items-center shadow-sm">
          <i className="fas fa-exclamation-circle me-2"></i>{error}
        </div>
      )}

      <form onSubmit={handleSignup}>
        <div className="mb-3">
          <label className="form-label small fw-bold text-secondary text-uppercase">Company Name *</label>
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-light border-end-0"><i className="fas fa-building text-muted"></i></span>
            <input
              type="text"
              name="name"
              className="form-control border-start-0 bg-light"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Biztran Solutions"
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label small fw-bold text-secondary text-uppercase">Industry *</label>
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-light border-end-0"><i className="fas fa-industry text-muted"></i></span>
            <input
              type="text"
              name="industry"
              className="form-control border-start-0 bg-light"
              value={formData.industry}
              onChange={handleChange}
              placeholder="e.g., IT Services"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label small fw-bold text-secondary text-uppercase">Contact Email *</label>
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-light border-end-0"><i className="fas fa-envelope text-muted"></i></span>
            <input
              type="email"
              name="contactInfo"
              className="form-control border-start-0 bg-light"
              value={formData.contactInfo}
              onChange={handleChange}
              placeholder="hr@company.com"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn w-100 py-2 fw-bold text-white shadow"
          style={{ backgroundColor: '#00796b' }}
          disabled={loading}
        >
          {loading ? (
            <><span className="spinner-border spinner-border-sm me-2"></span>Processing...</>
          ) : 'Complete Profile & Continue'}
        </button>
      </form>

      <div className="text-center mt-3 small text-muted">
        <i className="fas fa-info-circle me-1"></i>
        You will be asked to log in again to activate your profile.
      </div>
    </div>
  );
};

export default SignupEmployer;