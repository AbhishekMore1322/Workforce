import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup, login } from '../../api/authApi';
import { saveAuthData } from '../../utils/tokenStorage';

const SignupChoice = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'JOB_SEEKER',
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
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const signupResponse = await signup(
        formData.name,
        formData.email,
        formData.username,
        formData.password,
        formData.role
      );
      if (!signupResponse.success) throw new Error('Signup failed');
      const loginResponse = await login(formData.username, formData.password);
      if (!loginResponse || !loginResponse.token) throw new Error('Failed to get auth token');
      saveAuthData(loginResponse);
      if (loginResponse.role === 'JOB_SEEKER') {
        navigate('/signup/jobseeker');
      } else if (loginResponse.role === 'EMPLOYER') {
        navigate('/signup/employer');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2">
      <div className="text-center mb-4">
        <h3 className="fw-bold text-dark">Create Account</h3>
        <p className="text-muted small">Join the WorkForce Ecosystem</p>
      </div>

      {error && (
        <div className="alert alert-danger py-2 small d-flex align-items-center">
          <i className="fas fa-exclamation-circle me-2"></i>{error}
        </div>
      )}

      <form onSubmit={handleSignup}>
        <div className="row g-2 mb-3">
          <div className="col-md-12">
            <label className="form-label small fw-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control form-control-sm bg-light"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-semibold">Email</label>
            <input
              type="email"
              name="email"
              className="form-control form-control-sm bg-light"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-semibold">Username</label>
            <input
              type="text"
              name="username"
              className="form-control form-control-sm bg-light"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
          </div>
        </div>

        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <label className="form-label small fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              className="form-control form-control-sm bg-light"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-semibold">Confirm</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control form-control-sm bg-light"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label small fw-semibold">I am a:</label>
          <select
            name="role"
            className="form-select form-select-sm bg-light"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="JOB_SEEKER">Job Seeker (Individual)</option>
            <option value="EMPLOYER">Employer (Company)</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn w-100 py-2 fw-bold text-white shadow-sm"
          style={{ backgroundColor: '#00796b' }}
          disabled={loading}
        >
          {loading ? (
            <><span className="spinner-border spinner-border-sm me-2"></span>Creating...</>
          ) : 'Create Account & Continue'}
        </button>
      </form>

      <div className="text-center mt-3 small">
        <span className="text-muted">Already have an account?</span>{' '}
        <Link to="/login" className="fw-bold text-decoration-none" style={{ color: '#00796b' }}>Login</Link>
      </div>
    </div>
  );
};

export default SignupChoice;