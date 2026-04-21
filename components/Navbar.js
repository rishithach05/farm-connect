"use client";

import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const updateCart = () => {
      const saved = sessionStorage.getItem('farm_connect_cart');
      if (saved) {
        const cart = JSON.parse(saved);
        setCartCount(cart.reduce((s, i) => s + i.quantity, 0));
      }
    };
    updateCart();
    window.addEventListener('storage', updateCart);
    const interval = setInterval(updateCart, 1000);
    return () => { window.removeEventListener('storage', updateCart); clearInterval(interval); };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .navbar { position: fixed; top: 0; left: 0; right: 0; background: rgba(255,255,255,0.97); backdrop-filter: blur(10px); border-bottom: 1px solid var(--neutral-200); z-index: 1000; padding: 1rem 2rem; transition: all 0.3s ease; }
        .navbar.scrolled { box-shadow: var(--shadow-md); }
        .nav-container { max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
        .logo { display: flex; align-items: center; gap: 0.75rem; font-size: 1.5rem; font-weight: 700; color: var(--primary-dark); }
        .logo-icon { width: 40px; height: 40px; background: linear-gradient(135deg, var(--primary-green), var(--primary-dark)); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.25rem; }
        .nav-links { display: flex; gap: 2rem; }
        .nav-links a { color: var(--neutral-600); font-weight: 500; position: relative; transition: color 0.3s ease; }
        .nav-links a:hover { color: var(--primary-dark); }
        .nav-links a::after { content: ''; position: absolute; bottom: -5px; left: 0; width: 0; height: 2px; background: var(--primary-green); transition: width 0.3s ease; }
        .nav-links a:hover::after { width: 100%; }
        .nav-actions { display: flex; align-items: center; gap: 1rem; }
        .cart-btn { position: relative; background: var(--neutral-100); border: 1px solid var(--neutral-300); width: 45px; height: 45px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; transition: all 0.3s ease; text-decoration: none; }
        .cart-btn:hover { background: var(--primary-light); border-color: var(--primary-green); }
        .cart-badge { position: absolute; top: -5px; right: -5px; background: #ef4444; color: white; font-size: 0.7rem; font-weight: 700; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .profile-btn { position: relative; cursor: pointer; }
        .profile-avatar { width: 42px; height: 42px; background: linear-gradient(135deg, #10b981, #047857); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.1rem; border: none; cursor: pointer; }
        .profile-dropdown { position: absolute; top: 55px; right: 0; background: white; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); min-width: 200px; overflow: hidden; z-index: 999; }
        .dropdown-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem 1.25rem; color: #475569; font-weight: 600; text-decoration: none; font-size: 0.95rem; transition: background 0.15s; }
        .dropdown-item:hover { background: #f8fafc; color: #0f172a; }
        .dropdown-divider { height: 1px; background: #f1f5f9; margin: 0.25rem 0; }
        @media (max-width: 768px) { .nav-links { display: none; } }
      `}} />
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <a href="/" className="logo">
            <div className="logo-icon">🌾</div>
            Farm Connect
          </a>
          <ul className="nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="/marketplace">Marketplace</a></li>
            <li><a href="/orders">My Orders</a></li>
            <li><a href="/about">About Us</a></li>
          </ul>
          <div className="nav-actions">
            <a href="/wishlist" title="Wishlist" style={{ fontSize: '1.3rem', textDecoration: 'none', color: '#e11d48' }}>❤️</a>
            <a href="/cart" className="cart-btn">
              🛒
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </a>
            <div className="profile-btn" ref={dropdownRef} onClick={() => setShowDropdown(!showDropdown)}>
              <button className="profile-avatar">👤</button>
              {showDropdown && (
                <div className="profile-dropdown">
                  <a href="/profile" className="dropdown-item">👤 Customer Dashboard</a>
                  <a href="/orders" className="dropdown-item">📦 My Orders</a>
                  <a href="/wishlist" className="dropdown-item">❤️ Wishlist</a>
                  <div className="dropdown-divider"></div>
                  <a href="/farmer/dashboard" className="dropdown-item">🌾 Farmer Dashboard</a>
                  <div className="dropdown-divider"></div>
                  <a href="/login" className="dropdown-item">🔑 Login</a>
                  <a href="/register" className="dropdown-item">✨ Sign Up</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
