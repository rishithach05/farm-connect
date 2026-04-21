"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function OrderTracking() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [simulatedStatus, setSimulatedStatus] = useState('Placed');

  const fetchOrder = async () => {
    if (!orderId) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrder(data.order);
    } catch (err) {
      setError('Order not found or access denied.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // No auto-refresh from DB needed for demo, we use simulated progression next
  }, [orderId]);

  useEffect(() => {
    if (order) {
      // Simulate live status updates for Wow factor demo
      const timer1 = setTimeout(() => setSimulatedStatus('Packed'), 3000);
      const timer2 = setTimeout(() => setSimulatedStatus('Out for Delivery'), 6000);
      const timer3 = setTimeout(() => setSimulatedStatus('Delivered'), 10000);
      
      return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); };
    }
  }, [order]);

  if (loading) return <div style={{textAlign: 'center', padding: '5rem', color: 'var(--neutral-500)'}}>Locating your fresh produce tracking info...</div>;
  if (error || !order) return <div style={{textAlign: 'center', padding: '5rem', color: '#dc2626'}}>{error}</div>;

  const steps = ['Placed', 'Packed', 'Out for Delivery', 'Delivered'];
  const currentStepIndex = steps.indexOf(simulatedStatus);
  
  // Calculate simulated ETA via minutes
  const etaMins = order.eta || Math.floor(Math.random() * 20) + 20;

  return (
    <div className="tracking-wrapper">
      <style dangerouslySetInnerHTML={{ __html: `
        .tracking-wrapper { padding: 2rem; max-width: 800px; margin: 3rem auto; font-family: 'Inter', sans-serif; background: white; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .tracking-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px dashed var(--neutral-200); padding-bottom: 1.5rem; margin-bottom: 2.5rem; }
        .order-id { font-size: 1.8rem; font-weight: 800; color: var(--neutral-900); }
        .order-eta { font-size: 1.1rem; color: #047857; font-weight: 700; background: #dcfce7; padding: 0.75rem 1.25rem; border-radius: 12px; border: 1px solid #a7f3d0; box-shadow: 0 4px 6px rgba(4,120,87,0.1); }
        
        .timeline-container { position: relative; margin: 4rem 0 3rem; width: 100%; display: flex; justify-content: space-between; align-items: center; }
        .timeline-line-bg { position: absolute; top: 16px; left: 0; right: 0; height: 6px; background: #f1f5f9; border-radius: 10px; z-index: 1; }
        .timeline-line-fill { position: absolute; top: 16px; left: 0; height: 6px; background: linear-gradient(90deg, #10b981, #059669); border-radius: 10px; z-index: 2; transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); width: ${(currentStepIndex / (steps.length - 1)) * 100}%; box-shadow: 0 2px 10px rgba(16,185,129,0.4); }
        
        .timeline-step { display: flex; flex-direction: column; align-items: center; position: relative; z-index: 3; width: 100px; }
        .step-bubble { width: 38px; height: 38px; border-radius: 50%; background: white; border: 4px solid #e2e8f0; display: flex; align-items: center; justify-content: center; font-weight: bold; color: transparent; transition: all 0.5s ease; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
        .timeline-step.completed .step-bubble { border-color: #10b981; background: #10b981; color: white; transform: scale(1.1); }
        .timeline-step.active .step-bubble { border-color: #059669; background: white; border-width: 6px; transform: scale(1.2); box-shadow: 0 0 0 5px rgba(16,185,129,0.2); animation: pulse-ring 2s infinite; }
        .step-label { margin-top: 1rem; font-size: 0.85rem; font-weight: 700; color: #64748b; text-align: center; text-transform: uppercase; letter-spacing: 0.05em; transition: color 0.3s; }
        .timeline-step.active .step-label { color: #0f172a; }
        .timeline-step.completed .step-label { color: #334155; }
        
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
          70% { box-shadow: 0 0 0 10px rgba(16,185,129,0); }
          100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
        }

        .status-hero { text-align: center; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 2rem; border-radius: 16px; border: 1px solid #e2e8f0; margin-bottom: 3rem; }
        .status-hero h2 { font-size: 1.5rem; color: #0f172a; margin-bottom: 0.5rem; }
        .status-hero p { color: #64748b; font-weight: 500; font-size: 0.95rem; }

        .item-list { border-top: 2px solid var(--neutral-100); padding-top: 1.5rem; }
        .item-row { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--neutral-50); border-radius: 12px; margin-bottom: 1rem; transition: transform 0.2s; }
        .item-row:hover { transform: translateX(5px); background: #f8fafc; border-left: 4px solid var(--primary-green); }
        .item-name { font-weight: 700; color: var(--neutral-800); font-size: 1.1rem; }
        .item-qty { font-size: 0.9rem; color: var(--neutral-500); font-weight: 500; }
        .item-price { font-weight: 800; color: var(--primary-dark); font-size: 1.2rem; }

        .live-pulse { display: inline-block; width: 10px; height: 10px; background: #ef4444; border-radius: 50%; margin-right: 8px; animation: pulse-live 1.5s infinite; }
        @keyframes pulse-live { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
        
        @media (max-width: 768px) {
          .tracking-header { flex-direction: column; gap: 1rem; align-items: flex-start; text-align: left; }
          .timeline-container { flex-direction: column; align-items: flex-start; gap: 2rem; margin: 2rem 0; padding-left: 2rem; }
          .timeline-line-bg { width: 4px; height: 100%; top: 0; left: 17px; }
          .timeline-line-fill { width: 4px; height: ${(currentStepIndex / (steps.length - 1)) * 100}%; top: 0; left: 17px; }
          .timeline-step { flex-direction: row; gap: 1.5rem; width: 100%; }
          .step-label { margin-top: 0; font-size: 1rem; }
        }
      `}} />

      <div className="tracking-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', color: '#64748b', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            <span className="live-pulse"></span> Live Auto-Updates Active
          </div>
          <div className="order-id">Order #{order.id}</div>
        </div>
        <div className="order-eta" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
          <div>⏱️ ETA: {etaMins} mins</div>
          {simulatedStatus !== 'Delivered' && <div style={{ fontSize: '0.8rem', color: '#059669' }}>Arriving in {etaMins} mins</div>}
        </div>
      </div>

      {/* Delivery Agent Info Card */}
      <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}>
            {order.deliveryType === 'partner' ? '🛵' : '🚜'}
          </div>
          <div>
            <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '1.1rem' }}>
              {order.deliveryType === 'partner' ? order.agentName || 'Assigning Agent...' : 'Farmer Self Delivery'}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              {order.deliveryType === 'partner' ? `${order.agentVehicle || 'Vehicle'} • +91 ${order.agentPhone || 'XXXXX'}` : 'Farmer will bring it personally'}
            </div>
          </div>
        </div>
        <div style={{ background: '#10b981', color: 'white', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem' }}>
          {order.deliveryType === 'partner' ? 'Delivery Partner' : 'Direct from Farm'}
        </div>
      </div>

      <div className="status-hero">
        {simulatedStatus === 'Placed' && <h2>🎉 Order Placed Successfully!</h2>}
        {simulatedStatus === 'Packed' && <h2>📦 Your produce is securely packed!</h2>}
        {simulatedStatus === 'Out for Delivery' && <h2>🚚 Driver is on the way!</h2>}
        {simulatedStatus === 'Delivered' && <h2>🎉 Successfully Delivered! Enjoy your fresh produce!</h2>}
        <p>Status automatically updates as the delivery progresses.</p>
      </div>

      <div className="timeline-container">
        <div className="timeline-line-bg"></div>
        <div className="timeline-line-fill"></div>
        {steps.map((step, idx) => (
          <div key={step} className={`timeline-step ${idx < currentStepIndex ? 'completed' : idx === currentStepIndex ? 'active' : ''}`}>
            <div className="step-bubble">{idx <= currentStepIndex ? '✓' : ''}</div>
            <div className="step-label">{step}</div>
          </div>
        ))}
      </div>

      {/* Simulated Live Map Tracking */}
      <div style={{ height: '250px', background: '#e2e8f0', borderRadius: '16px', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.5, backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%2394a3b8\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div style={{ background: 'white', padding: '1rem 2rem', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 10, display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className="live-pulse"></span>
          <span style={{ fontWeight: 700, color: '#334155' }}>Live GPS Tracking Simulated</span>
        </div>
      </div>

      <div className="item-list">
        <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: '#0f172a', fontWeight: 800 }}>Order Summary</h3>
        {order.items.map((item, i) => (
          <div key={i} className="item-row">
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ background: '#f8fafc', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🌾</div>
              <div>
                <div className="item-name">{item.product.name}</div>
                <div className="item-qty">Qty: {item.quantity} {item.product.unit}</div>
              </div>
            </div>
            <div className="item-price">₹{(item.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px dashed #cbd5e1', paddingTop: '1.5rem', marginTop: '1rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px' }}>
        <span style={{ fontSize: '1.25rem', color: '#64748b', fontWeight: 700 }}>Final Amount Paid:</span>
        <span style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>₹{order.total.toFixed(2)}</span>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '3rem' }}>
        <button onClick={() => alert('Downloading Mock PDF Receipt...')} style={{ background: 'white', color: '#0f172a', fontWeight: 700, padding: '1rem 2rem', borderRadius: '30px', border: '2px solid #e2e8f0', cursor: 'pointer', transition: '0.2s' }} onMouseOver={e => e.target.style.background = '#f8fafc'} onMouseOut={e => e.target.style.background = 'white'}>
          📥 Download Receipt (PDF)
        </button>
        <a href="/marketplace" style={{ color: '#059669', fontWeight: 700, textDecoration: 'none', background: '#ecfdf5', padding: '1rem 2rem', borderRadius: '30px', transition: 'background 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onMouseOver={(e) => e.target.style.background = '#d1fae5'} onMouseOut={(e) => e.target.style.background = '#ecfdf5'}>← Continue Shopping</a>
      </div>
    </div>
  );
}
