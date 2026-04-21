"use client";

import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      
      // Redirect based on role
      if (data.user.role === 'FARMER') {
        window.location.href = '/farmer/dashboard';
      } else {
        window.location.href = '/marketplace';
      }
    } catch (err) {
      setError('An error occurred during login');
    }
  };

  return (
    <>
      <style>{`
        .auth-container {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          padding: 2rem;
        }
        .auth-card {
          background: white;
          padding: 3rem 2.5rem;
          border-radius: 16px;
          box-shadow: var(--shadow-xl);
          width: 100%;
          max-width: 450px;
        }
        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .auth-header h1 {
          font-size: 2rem;
          color: var(--neutral-900);
          margin-bottom: 0.5rem;
        }
        .auth-header p {
          color: var(--neutral-500);
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-label {
          display: block;
          font-weight: 500;
          color: var(--neutral-700);
          margin-bottom: 0.5rem;
        }
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid var(--neutral-300);
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        .form-input:focus {
          outline: none;
          border-color: var(--primary-green);
          box-shadow: 0 0 0 3px var(--primary-light);
        }
        .error-message {
          background: #fee2e2;
          color: #dc2626;
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .submit-btn {
          width: 100%;
          padding: 0.875rem;
          background: linear-gradient(135deg, var(--primary-green), var(--primary-dark));
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .auth-footer {
          margin-top: 2rem;
          text-align: center;
          color: var(--neutral-600);
        }
        .auth-footer a {
          color: var(--primary-dark);
          font-weight: 600;
          text-decoration: none;
        }
        .auth-footer a:hover {
          text-decoration: underline;
        }
      `}</style>
      <div className="auth-container">
        <div className="auth-card fade-in visible">
          <div className="auth-header">
            <div className="logo-icon" style={{ margin: '0 auto 1rem', width: '50px', height: '50px', fontSize: '1.5rem' }}>🌾</div>
            <h1>Welcome Back</h1>
            <p>Login to your Farm Connect account</p>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-btn">Login</button>
          </form>
          
          <div className="auth-footer">
            Don&apos;t have an account? <a href="/register">Sign up here</a>
          </div>
        </div>
      </div>
    </>
  );
}
