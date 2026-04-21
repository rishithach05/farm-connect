"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const COUPONS = { 'FARM10': 10, 'FRESH20': 20, 'HARVEST15': 15 };

export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const statusColor = {
    'Placed': '#f59e0b',
    'Accepted': '#3b82f6',
    'Packed': '#8b5cf6',
    'Out for Delivery': '#f97316',
    'Delivered': '#10b981',
  };

  const statusIcon = {
    'Placed': '📋',
    'Accepted': '👨‍🌾',
    'Packed': '📦',
    'Out for Delivery': '🚚',
    'Delivered': '✅',
  };

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error);
        else setOrders(d.orders || []);
        setLoading(false);
      })
      .catch(() => { setError('Failed to load orders'); setLoading(false); });
  }, []);

  if (loading) return (
    <div style={{ maxWidth: 800, margin: '120px auto', padding: '0 1.5rem' }}>
      {[1,2,3].map(i => (
        <div key={i} style={{ height: 120, background: 'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)', borderRadius: 16, marginBottom: '1.5rem', animation: 'shimmer 1.5s infinite' }}></div>
      ))}
      <style dangerouslySetInnerHTML={{ __html: `@keyframes shimmer{0%{background-position:-468px 0}100%{background-position:468px 0}}` }} />
    </div>
  );

  if (error) return (
    <div style={{ maxWidth: 500, margin: '10rem auto', textAlign: 'center', padding: '3rem', background: 'white', borderRadius: 20, boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔐</div>
      <h2 style={{ color: '#0f172a', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 800 }}>Please Login First</h2>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>You need to be logged in to view your order history.</p>
      <button onClick={() => router.push('/login')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.9rem 2rem', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>Login to Continue</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: '100px auto 4rem', padding: '0 1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .order-card { background: white; border-radius: 16px; padding: 1.75rem; border: 1px solid #e2e8f0; margin-bottom: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); transition: transform 0.2s, box-shadow 0.2s; }
        .order-card:hover { transform: translateY(-4px); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); }
        .status-badge { padding: 0.35rem 0.85rem; border-radius: 100px; font-size: 0.8rem; font-weight: 700; }
        .item-pill { background: #f8fafc; padding: 0.5rem 0.85rem; border-radius: 8px; font-size: 0.9rem; color: #475569; border: 1px solid #e2e8f0; display: inline-flex; align-items: center; gap: 0.5rem; }
      `}} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.25rem' }}>My Orders</h1>
          <p style={{ color: '#64748b' }}>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>
        <button onClick={() => router.push('/marketplace')} style={{ background: '#ecfdf5', color: '#047857', border: '2px solid #a7f3d0', padding: '0.75rem 1.5rem', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>
          🛍️ Continue Shopping
        </button>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'white', borderRadius: 24, border: '2px dashed #cbd5e1' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>📦</div>
          <h3 style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>No orders yet!</h3>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>Start shopping fresh produce directly from local farmers.</p>
          <button onClick={() => router.push('/marketplace')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.9rem 2rem', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
            Browse Marketplace 🌾
          </button>
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="order-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span className="status-badge" style={{ background: `${statusColor[order.status]}20`, color: statusColor[order.status] }}>
                  {statusIcon[order.status]} {order.status}
                </span>
                <button
                  onClick={() => router.push(`/orders/tracking?id=${order.id}`)}
                  style={{ background: '#0f172a', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  Track →
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {order.items.map(item => (
                <div key={item.id} className="item-pill" style={{ padding: '0.4rem 0.75rem 0.4rem 0.4rem', border: '1px solid #e2e8f0', background: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: '10px' }}>
                  <img 
                    src={item.product?.image || `https://placehold.co/32x32/dcfce7/166534?text=${encodeURIComponent(item.product?.name?.charAt(0) || 'P')}`} 
                    alt={item.product?.name} 
                    style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }} 
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/32x32/dcfce7/166534?text=${encodeURIComponent(item.product?.name?.charAt(0) || 'P')}`; }} 
                  />
                  <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>
                    {item.product?.name} <span style={{ color: '#64748b', fontWeight: 500 }}>×{item.quantity}</span>
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', alignItems: 'center' }}>
              <span style={{ color: '#64748b', fontWeight: 500 }}>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
              <span style={{ fontWeight: 900, fontSize: '1.3rem', color: '#047857' }}>₹{order.total.toFixed(2)}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
