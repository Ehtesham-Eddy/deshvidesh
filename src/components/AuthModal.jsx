import React, { useState } from 'react';
import { X, User, Lock, ArrowRight } from 'lucide-react';

export default function AuthModal({ onClose, onAuthSuccess }) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Form Validation
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    // Retrieve registered users from local storage
    const users = JSON.parse(localStorage.getItem('deshvidesh_users') || '{}');

    if (isLoginTab) {
      // Login Process
      const user = users[username.toLowerCase()];
      if (user && user.password === password) {
        // Success
        onAuthSuccess({ username: user.username });
        onClose();
      } else {
        setError('Invalid username or password.');
      }
    } else {
      // Registration Process
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      if (users[username.toLowerCase()]) {
        setError('Username is already taken.');
        return;
      }

      // Save new user profile
      users[username.toLowerCase()] = {
        username: username,
        password: password,
        favorites: [],
        collections: [
          { id: 'col_1', name: 'My Bucket List', countries: [] },
          { id: 'col_2', name: 'Europe Summer 2026', countries: [] }
        ]
      };
      
      localStorage.setItem('deshvidesh_users', JSON.stringify(users));
      
      // Auto Login
      onAuthSuccess({ username: username });
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close authentication window">
          <X size={18} />
        </button>

        {/* Tab Controls */}
        <div className="auth-tabs">
          <div 
            className={`auth-tab ${isLoginTab ? 'active' : ''}`}
            onClick={() => {
              setIsLoginTab(true);
              setError('');
            }}
          >
            Sign In
          </div>
          <div 
            className={`auth-tab ${!isLoginTab ? 'active' : ''}`}
            onClick={() => {
              setIsLoginTab(false);
              setError('');
            }}
          >
            Register
          </div>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="auth-username">Username</label>
            <div style={{ position: 'relative' }}>
              <User 
                size={16} 
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--text-muted)' 
                }} 
              />
              <input
                id="auth-username"
                type="text"
                className="form-input"
                placeholder="e.g. explorer_john"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: '38px' }}
                autoFocus
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="auth-password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock 
                size={16} 
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--text-muted)' 
                }} 
              />
              <input
                id="auth-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '38px' }}
              />
            </div>
          </div>

          {/* Confirm Password (Registration only) */}
          {!isLoginTab && (
            <div className="form-group">
              <label className="form-label" htmlFor="auth-confirm">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock 
                  size={16} 
                  style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: 'var(--text-muted)' 
                  }} 
                />
                <input
                  id="auth-confirm"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', height: '46px', marginTop: '12px' }}
          >
            {isLoginTab ? 'Access Account' : 'Create My Account'}
            <ArrowRight size={16} />
          </button>
        </form>

        <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '20px' }}>
          {isLoginTab 
            ? "Don't have an account yet? Switch to Register above." 
            : "Already registered? Switch to Sign In above."}
        </p>
      </div>
    </div>
  );
}
