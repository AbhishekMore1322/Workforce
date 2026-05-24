import React, { useState, useEffect } from 'react';
import { getNotificationsByUser } from '../api/notificationsApi';
import { getUsername, getToken } from '../utils/tokenStorage';

const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);

  const username = getUsername();
  const token = getToken();

  useEffect(() => {
    if (!showDropdown) return;
    fetchNotifications();
  }, [showDropdown]);

  const fetchNotifications = async () => {
  if (!username || !token) {
    setNotifications([]);
    setError('');
    setHasLoaded(true);
    return;
  }

  setLoading(true);
  setError('');

  try {
    const data = await getNotificationsByUser(username, token);
    setNotifications(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    setError('Failed to load notifications');
  } finally {
    setLoading(false);
    setHasLoaded(true);
  }
};

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="position-relative" style={{ display: 'inline-block' }}>
      <button
        className="btn btn-link position-relative text-decoration-none p-2"
        onClick={() => setShowDropdown(!showDropdown)}
        title="Notifications"
        style={{ fontSize: '1.25rem', color: 'inherit' }}
      >
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: '0.65rem', padding: '0.25rem 0.5rem' }}
          >
            {unreadCount}
          </span>
        )}
      </button>

    
      {showDropdown && (
        <div
          className="position-absolute bg-white border shadow-sm rounded mt-2"
          style={{
            right: 0,
            top: '100%',
            zIndex: 1000,
            minWidth: '350px',
            maxHeight: '400px',
            overflowY: 'auto',
          }}
        >
         
          <div
            className="p-3 border-bottom d-flex justify-content-between align-items-center"
            style={{ backgroundColor: '#f8f9fa' }}
          >
            <h6 className="mb-0 fw-bold">Notifications ({notifications.length})</h6>
            <button
              className="btn-close"
              onClick={() => setShowDropdown(false)}
              style={{ fontSize: '0.8rem' }}
            ></button>
          </div>

      
          <div className="p-2">
            {loading && (
              <div className="text-center p-4 text-muted">
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="small mt-2">Loading notifications...</p>
              </div>
            )}

            {hasLoaded && error && !loading && (
              <div className="alert alert-warning m-2 p-2 small mb-0">
                {error}
              </div>
            )}

            {!loading && notifications.length === 0 && !error && (

              <div className="text-center p-4 text-muted">
                <i className="fas fa-inbox fa-2x mb-2 d-block opacity-50"></i>
                <p className="small">No notifications</p>
              </div>
            )}

            {!loading && notifications.length > 0 && (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-2 border-bottom small"
                    style={{
                      backgroundColor: notification.read ? 'white' : '#e8f4f8',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <h6 className="mb-1 fw-semibold text-dark" style={{ fontSize: '0.9rem' }}>
                          {!notification.read && (
                            <span className="badge bg-info me-2" style={{ fontSize: '0.65rem' }}>
                              New
                            </span>
                          )}
                          {notification.title || 'Notification'}
                        </h6>
                        <p className="mb-1 text-muted" style={{ fontSize: '0.85rem' }}>
                          {notification.message || notification.content}
                        </p>
                        <small className="text-muted">
                          {notification.createdAt
                            ? new Date(notification.createdAt).toLocaleDateString()
                            : 'Recently'}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-2 border-top text-center bg-light">
              <button
                className="btn btn-link small text-decoration-none p-0"
                onClick={() => {
                  fetchNotifications();
                }}
                style={{ fontSize: '0.85rem' }}
              >
                <i className="fas fa-sync-alt me-1"></i>Refresh
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
