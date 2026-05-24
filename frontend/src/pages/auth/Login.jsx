import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login } from '../../api/authApi';
import { saveAuthData } from '../../utils/tokenStorage';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const successMsg = location.state?.message || '';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await login(username, password);
      saveAuthData(response);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-heading">Welcome back</h2>
      <p className="auth-subheading">Sign in to your WorkForce account</p>

      {successMsg && (
        <div className="alert alert-success d-flex align-items-center gap-2 py-2 mb-3 rounded-3 small">
          <i className="bi bi-check-circle-fill" />{successMsg}
        </div>
      )}

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-3 rounded-3 small">
          <i className="bi bi-exclamation-circle-fill" />{error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="auth-label">Username</label>
          <div className="input-group auth-input-group">
            <span className="input-group-text">
              <i className="bi bi-person" />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <label className="auth-label mb-0">Password</label>
            <Link to="/forgot-password" className="auth-link" style={{ fontSize: '0.78rem' }}>
              Forgot password?
            </Link>
          </div>
          <div className="input-group auth-input-group mt-1">
            <span className="input-group-text">
              <i className="bi bi-lock" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading
            ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</>
            : <><i className="bi bi-box-arrow-in-right me-2" />Sign In</>}
        </button>
      </form>

      <div className="auth-divider" />

      <div className="text-center small">
        <span className="text-muted">Don't have an account? </span>
        <Link to="/signup" className="auth-link">Create one free</Link>
      </div>
    </div>
  );
};

export default Login;
