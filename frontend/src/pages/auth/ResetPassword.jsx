import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../../api/authApi';

const ResetPassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    token: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.token) {
      setError('Username and OTP are required');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(formData.username, formData.token, formData.newPassword);
      navigate('/login', { state: { message: 'Password reset successful! Please sign in.' } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div
        className="mb-4 d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mx-auto"
        style={{ width: 56, height: 56 }}
      >
        <i className="bi bi-shield-lock-fill text-primary" style={{ fontSize: '1.4rem' }} />
      </div>

      <h2 className="auth-heading text-center">Reset password</h2>
      <p className="auth-subheading text-center">Enter the OTP sent to your email</p>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-3 rounded-3 small">
          <i className="bi bi-exclamation-circle-fill" />{error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="auth-label">Username</label>
          <div className="input-group auth-input-group">
            <span className="input-group-text"><i className="bi bi-person" /></span>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Your username"
              value={formData.username}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="auth-label">OTP Code</label>
          <div className="input-group auth-input-group">
            <span className="input-group-text"><i className="bi bi-123" /></span>
            <input
              type="text"
              name="token"
              className="form-control"
              placeholder="6-digit OTP"
              value={formData.token}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="auth-label">New Password</label>
          <div className="input-group auth-input-group">
            <span className="input-group-text"><i className="bi bi-lock" /></span>
            <input
              type={showPassword ? 'text' : 'password'}
              name="newPassword"
              className="form-control"
              placeholder="Min. 6 characters"
              value={formData.newPassword}
              onChange={handleChange}
              required
              style={{ borderRight: 'none' }}
            />
            <span
              className="input-group-text"
              style={{ borderLeft: 'none', cursor: 'pointer', borderRadius: '0 10px 10px 0' }}
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
            </span>
          </div>
        </div>

        <div className="mb-4">
          <label className="auth-label">Confirm Password</label>
          <div className="input-group auth-input-group">
            <span className="input-group-text"><i className="bi bi-lock-fill" /></span>
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              className="form-control"
              placeholder="Repeat password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading
            ? <><span className="spinner-border spinner-border-sm me-2" />Updating...</>
            : <><i className="bi bi-check-circle me-2" />Reset Password</>}
        </button>
      </form>

      <div className="auth-divider" />

      <div className="text-center">
        <Link to="/login" className="auth-link d-inline-flex align-items-center gap-1">
          <i className="bi bi-arrow-left" />Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
