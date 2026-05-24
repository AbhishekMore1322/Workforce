import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerJobSeeker } from '../../api/jobSeekerApi';
import { getToken, saveAuthData } from '../../utils/tokenStorage';

const SignupJobSeeker = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    address: '',
    contactInfo: '',
    skillsJSON: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend validation
    if (!formData.name || formData.name.trim() === '') {
      setError('Full name is required');
      return;
    }
    if (!formData.dob) {
      setError('Date of birth is required');
      return;
    }
    if (!formData.gender) {
      setError('Gender is required');
      return;
    }
    if (!formData.address || formData.address.trim() === '') {
      setError('Address is required');
      return;
    }
    if (!formData.contactInfo || formData.contactInfo.trim() === '') {
      setError('Contact email is required');
      return;
    }
    if (!formData.skillsJSON || formData.skillsJSON.trim() === '') {
      setError('Skills are required');
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
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      // ✅ REAL API CALL
      const response = await registerJobSeeker(formData);

      if (!response) {
        throw new Error('Server returned no response');
      }

      if (!response?.seekerID && !response?.jobSeekerId && !response?.id) {
        throw new Error('Invalid response from server - missing seeker ID');
      }

      const jobSeekerId = response.seekerID || response.jobSeekerId || response.id;

      // ✅ Save real auth data
      saveAuthData({
        token,
        role: 'JOB_SEEKER',
        jobSeekerId,
      });

      // ✅ Registration complete → go to dashboard
      navigate('/dashboard/jobseeker');

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to complete profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="card shadow border-0 p-5 rounded-4">
            <h3 className="fw-bold text-center mb-3">
              Complete Job Seeker Profile
            </h3>

            {error && (
              <div className="alert alert-danger small">{error}</div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Full Name *</label>
                <input
                  className="form-control"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Date of Birth *</label>
                <input
                  className="form-control"
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Gender *</label>
                <select
                  className="form-select"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address *</label>
                <input
                  className="form-control"
                  name="contactInfo"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.contactInfo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Address *</label>
                <textarea
                  className="form-control"
                  rows={2}
                  name="address"
                  placeholder="123 Main Street, City, Country"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Skills *</label>
                <textarea
                  className="form-control"
                  rows={3}
                  name="skillsJSON"
                  placeholder='Enter skills as comma-separated (e.g., "JavaScript, Python, React") or as JSON (e.g., ["JavaScript","Python"])'
                  value={formData.skillsJSON}
                  onChange={handleChange}
                  required
                />
                <small className="text-muted d-block mt-1">Format: comma-separated or valid JSON array</small>
              </div>

              <button
                className="btn btn-primary w-100 fw-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Registering...
                  </>
                ) : 'Complete Profile'}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupJobSeeker;