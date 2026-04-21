"use client";

import { useState } from 'react';

export default function DeliveryClient({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);

  const handleAction = async (orderId, action, status) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, status })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Action failed');
        return;
      }
      // Update local state
      setOrders(orders.map(o => o.id === orderId ? { ...o, ...data.order } : o));
    } catch (err) {
      alert('Network error');
    }
  };

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
        <div style={{ fontSize: '3rem', marginbottom: '1rem' }}>📭</div>
        <h3 style={{ color: '#64748b' }}>No pending deliveries at the moment.</h3>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
      {orders.map(order => (
        <div className="order-card" key={order.id}>
          <div className="c-header">
            <div className="o-id">Order #{order.id.split('-')[0]}</div>
            <div className="o-status">{order.status}</div>
          </div>
          
          <div className="route-info">
            <div className="route-stops">
               <div className="stop">
                 <div className="stop-label">Pickup From Farm</div>
                 <div className="stop-detail">{order.items[0]?.product?.farmer?.location || 'Local Farm'}</div>
               </div>
               <div className="stop" style={{ marginBottom: 0 }}>
                 <div className="stop-label">Deliver To Customer</div>
                 <div className="stop-detail">{order.customer.name}</div>
                 <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.2rem' }}>📞 {order.customer.phone || 'N/A'}</div>
               </div>
            </div>
          </div>

          <div className="items-list">
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase' }}>Items ({order.items.length})</span>
            <div style={{ marginTop: '0.5rem', fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>
              {order.items.map(item => item.quantity + 'x ' + item.product.name).join(', ')}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
            <span style={{ color: '#64748b', fontWeight: 600 }}>Delivery Fee</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>+₹{order.deliveryFee}</span>
          </div>

          <div className="actions">
            {order.status === 'Placed' || order.status === 'Accepted' ? (
               <>
                 <button className="btn btn-reject">Reject</button>
                 <button className="btn btn-accept" onClick={() => handleAction(order.id, 'accept')}>Accept Delivery</button>
               </>
            ) : order.status === 'Delivered' ? (
               <div style={{ color: '#10b981', fontWeight: 'bold' }}>Delivery Complete ✓</div>
            ) : (
               <button className="btn btn-update" onClick={() => {
                 const next = order.status === 'Packed' ? 'Out for Delivery' : 'Delivered';
                 handleAction(order.id, 'update_status', next);
               }}>
                 Mark as {order.status === 'Packed' ? 'Out for Delivery' : 'Delivered'}
               </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
