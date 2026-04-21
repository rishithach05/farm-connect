"use client";

import { useState } from 'react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
    phone: '',
    location: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      
      // Redirect based on role
      if (data.user.role === 'FARMER') {
        window.location.href = '/farmer/dashboard';
      } else if (data.user.role === 'DELIVERY_PARTNER') {
        window.location.href = '/delivery/dashboard';
      } else {
        window.location.href = '/marketplace';
      }
    } catch (err) {
      setError('An error occurred during registration');
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
          max-width: 500px;
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
          margin-bottom: 1.25rem;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .form-label {
          display: block;
          font-weight: 500;
          color: var(--neutral-700);
          margin-bottom: 0.5rem;
        }
        .form-input, .form-select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid var(--neutral-300);
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }
        .form-input:focus, .form-select:focus {
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
          margin-top: 0.5rem;
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
      `}</style>
      <div className="auth-container">
        <div className="auth-card fade-in visible">
          <div className="auth-header">
            <div className="logo-icon" style={{ margin: '0 auto 1rem', width: '50px', height: '50px', fontSize: '1.5rem' }}>🌾</div>
            <h1>Join Farm Connect</h1>
            <p>Create your account below</p>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" className="form-input" name="password" value={formData.password} onChange={handleChange} required />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">I want to register as a:</label>
              <select className="form-select" name="role" value={formData.role} onChange={handleChange}>
                <option value="CUSTOMER">Customer (Buy fresh produce)</option>
                <option value="FARMER">Farmer (Sell my harvest)</option>
                <option value="DELIVERY_PARTNER">Delivery Partner (Deliver orders)</option>
              </select>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.9rem' }}>City / Location</label>
                <input type="text" className="form-input" name="location" value={formData.location} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.9rem' }}>Phone (Optional)</label>
                <input type="tel" className="form-input" name="phone" value={formData.phone} onChange={handleChange} />
              </div>
            </div>

            <button type="submit" className="submit-btn">Create Account</button>
          </form>
          
          <div className="auth-footer">
            Already have an account? <a href="/login">Login here</a>
          </div>
        </div>
      </div>
    </>
  );
}
