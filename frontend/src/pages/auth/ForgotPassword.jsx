import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword } from '../../api/authApi';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccess(true);
      setEmail('');
      setTimeout(() => navigate('/reset-password'), 20000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-card text-center py-4">
        <div
          className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10"
          style={{ width: 72, height: 72 }}
        >
          <i className="bi bi-envelope-check-fill text-success" style={{ fontSize: '2rem' }} />
        </div>
        <h2 className="auth-heading text-center">Check your email</h2>
        <p className="text-muted small px-2 mb-4">
          A password reset link has been sent. Follow the instructions to regain access.
        </p>
        <div className="d-flex align-items-center justify-content-center gap-2 text-muted small">
          <span className="spinner-border spinner-border-sm" />
          Redirecting to reset page...
        </div>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <div
        className="mb-4 d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mx-auto"
        style={{ width: 56, height: 56 }}
      >
        <i className="bi bi-key-fill text-primary" style={{ fontSize: '1.4rem' }} />
      </div>

      <h2 className="auth-heading text-center">Forgot password?</h2>
      <p className="auth-subheading text-center">
        Enter your email and we'll send you a reset link.
      </p>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-3 rounded-3 small">
          <i className="bi bi-exclamation-circle-fill" />{error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="auth-label">Email Address</label>
          <div className="input-group auth-input-group">
            <span className="input-group-text">
              <i className="bi bi-envelope" />
            </span>
            <input
              type="email"
              className="form-control"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
        </div>

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading
            ? <><span className="spinner-border spinner-border-sm me-2" />Sending...</>
            : <><i className="bi bi-send me-2" />Send Reset Link</>}
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

export default ForgotPassword;
