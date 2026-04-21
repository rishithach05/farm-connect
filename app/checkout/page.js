"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Checkout() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // V3 Form States
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  
  // UI Overlays
  const [paymentState, setPaymentState] = useState('idle');
  const [completedOrderId, setCompletedOrderId] = useState(null);

  // Coupon State
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMsg, setCouponMsg] = useState('');
  const COUPONS = { 'FARM10': 10, 'FRESH20': 20, 'HARVEST15': 15 };

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon({ code, pct: COUPONS[code] });
      setCouponMsg(`✅ Coupon "${code}" applied! You save ${COUPONS[code]}%`);
    } else {
      setAppliedCoupon(null);
      setCouponMsg(`❌ Invalid coupon code. Try FARM10, FRESH20, or HARVEST15`);
    }
    setTimeout(() => setCouponMsg(''), 4000);
  };

  useEffect(() => {
    const savedCart = sessionStorage.getItem('farm_connect_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      router.push('/marketplace');
    }
  }, []);

  // Automate delivery method: If ANY item needs an agent, we must use a partner.
  // Otherwise, default to Farmer Self Delivery to save the customer money.
  const deliveryMethod = cart.some(item => item.deliveryOption === 'AGENT') ? 'partner' : 'self';

  const subtotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
  const delivery = deliveryMethod === 'partner' ? 40 : 0;
  const discount = appliedCoupon ? (subtotal * appliedCoupon.pct / 100) : 0;
  const total = subtotal - discount + delivery;

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPaymentState('processing');
    setMessage('');
    
    try {
      // Simulate real processing gateway
      await new Promise(r => setTimeout(r, 2000));
      
      // Simulate 10% chance of failure only if Card/UPI
      if (paymentMethod !== 'cod' && Math.random() < 0.1) {
        setPaymentState('failed');
        setMessage('Network timeout with payment gateway. Please try again.');
        setLoading(false);
        return;
      }
      
      const payload = { 
        items: cart, 
        total: subtotal,
        deliveryType: deliveryMethod,
        deliveryFee: delivery
      };
      
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setPaymentState('failed');
        setMessage(data.error || 'Server rejected the order');
        setLoading(false);
        return;
      }
      
      sessionStorage.removeItem('farm_connect_cart');
      setCompletedOrderId(data.orderId);
      setPaymentState('success');
      
      setTimeout(() => {
        router.push(`/orders/tracking?id=${data.orderId}`);
      }, 3000);
      
    } catch (err) {
      setPaymentState('failed');
      setMessage('Failed to connect to checkout services.');
      setLoading(false);
    }
  };

  if (cart.length === 0) return null;

  return (
    <div className="checkout-wrapper">
      <style dangerouslySetInnerHTML={{ __html: `
        .checkout-wrapper { max-width: 1200px; margin: 3rem auto; padding: 0 1.5rem; font-family: 'Inter', sans-serif; }
        .checkout-header { font-size: 2.2rem; margin-bottom: 2rem; color: #0f172a; font-weight: 900; }
        
        .checkout-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 3rem; align-items: start; }
        
        .section-card { background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; margin-bottom: 2rem; }
        .section-title { font-size: 1.3rem; margin-bottom: 1.5rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 1rem; color: #1e293b; font-weight: 800; display: flex; align-items: center; gap: 0.5rem; }
        
        /* Form Inputs */
        .form-row { margin-bottom: 1.5rem; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
        .input-label { display: block; font-weight: 600; color: #475569; margin-bottom: 0.5rem; font-size: 0.95rem; }
        .input-field { width: 100%; padding: 1rem; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 1rem; background: #f8fafc; transition: all 0.2s; }
        .input-field:focus { border-color: #10b981; outline: none; box-shadow: 0 0 0 3px rgba(16,185,129,0.1); background: white; }
        
        /* Payment Methods */
        .payment-options { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }
        .pay-option { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem; border: 2px solid #e2e8f0; border-radius: 12px; cursor: pointer; transition: all 0.2s; background: #f8fafc; }
        .pay-option:hover { border-color: #cbd5e1; background: white; }
        .pay-option.selected { border-color: #10b981; background: #ecfdf5; }
        .pay-label { font-weight: 700; color: #1e293b; font-size: 1.1rem; display: flex; align-items: center; gap: 0.75rem; }
        .pure-radio { accent-color: #10b981; width: 20px; height: 20px; cursor: pointer; }
        
        /* Pay Conditional Details */
        .pay-details-box { background: white; border: 1px solid #cbd5e1; padding: 1.5rem; border-radius: 12px; animation: slideDown 0.3s ease-out; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

        /* Summary Panel */
        .summary-panel { background: #0f172a; color: white; padding: 2rem; border-radius: 20px; position: sticky; top: 100px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2); }
        .summary-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #1e293b; }
        .item-info { display: flex; align-items: center; gap: 1rem; }
        .item-img { width: 50px; height: 50px; border-radius: 8px; object-fit: cover; }
        
        .totals-row { display: flex; justify-content: space-between; margin-bottom: 1rem; color: #94a3b8; font-weight: 500; }
        .grand-total { display: flex; justify-content: space-between; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 2px solid #1e293b; font-size: 1.8rem; font-weight: 900; color: white; }

        .submit-btn { width: 100%; padding: 1.25rem; background: linear-gradient(135deg, #10b981, #059669); color: white; font-weight: 800; font-size: 1.2rem; border-radius: 12px; border: none; cursor: pointer; box-shadow: 0 10px 15px -3px rgba(16,185,129,0.3); transition: transform 0.2s; margin-top: 2rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .submit-btn:hover:not(:disabled) { transform: translateY(-3px); }
        .submit-btn:disabled { background: #94a3b8; cursor: not-allowed; box-shadow: none; transform: none; }

        /* Overlays */
        .overlay-bg { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.95); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px); }
        .overlay-card { text-align: center; background: white; padding: 4rem; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); max-width: 500px; width: 90%; }
        
        @media (max-width: 1024px) {
          .checkout-grid { grid-template-columns: 1fr; gap: 2rem; }
          .summary-panel { position: relative; top: 0; }
        }
        @media (max-width: 600px) {
          .form-grid { grid-template-columns: 1fr; }
        }
      `}} />

      {/* Dynamic Overlays */}
      {paymentState !== 'idle' && (
        <div className="overlay-bg">
          <div className="overlay-card">
            {paymentState === 'processing' && (
              <>
                <div style={{ width: '80px', height: '80px', border: '8px solid #f3f4f6', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 2rem' }}></div>
                <h2 style={{ fontSize: '1.8rem', color: '#111827', marginBottom: '1rem' }}>Processing Order...</h2>
                <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Please do not refresh or close this window.</p>
                <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }`}} />
              </>
            )}

            {paymentState === 'failed' && (
              <>
                <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>❌</div>
                <h2 style={{ fontSize: '1.8rem', color: '#dc2626', marginBottom: '1rem' }}>Order Failed</h2>
                <p style={{ color: '#4b5563', fontSize: '1.1rem', marginBottom: '2rem' }}>{message}</p>
                <button onClick={() => setPaymentState('idle')} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', width: '100%' }}>Try Again</button>
              </>
            )}

            {paymentState === 'success' && (
              <>
                <div style={{ fontSize: '5rem', marginBottom: '1rem', animation: 'bounceIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>✅</div>
                <h2 style={{ fontSize: '2.2rem', color: '#059669', marginBottom: '1rem', fontWeight: 900 }}>Order Confirmed!</h2>
                <p style={{ color: '#374151', fontSize: '1.2rem', fontWeight: 500, marginBottom: '2rem' }}>Sit back. We notified the farmer.</p>
                <div style={{ width: '100%', height: '6px', background: '#e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: '#10b981', animation: 'loadBar 3s linear' }}></div>
                </div>
                <p style={{ color: '#9ca3af', fontSize: '0.95rem', marginTop: '1.5rem', fontWeight: 600 }}>Routing to Live Delivery Tracking...</p>
                <style dangerouslySetInnerHTML={{ __html: `
                  @keyframes bounceIn { 0% { transform: scale(0); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
                  @keyframes loadBar { 0% { width: 0%; } 100% { width: 100%; } }
                `}} />
              </>
            )}
          </div>
        </div>
      )}

      <h1 className="checkout-header">Secure Checkout</h1>
      
      <form className="checkout-grid" onSubmit={handlePayment}>
        <div>
          {/* User Details Form */}
          <div className="section-card">
            <h2 className="section-title">📍 Delivery Details</h2>
            
            <div className="form-row">
              <label className="input-label">Full Name</label>
              <input required type="text" className="input-field" placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            
            <div className="form-row">
              <label className="input-label">Phone Number</label>
              <input required type="tel" className="input-field" placeholder="+91 9876543210" pattern="[0-9]{10}" title="Must be exactly 10 digits" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>

            <div className="form-row">
              <label className="input-label">Complete Delivery Address</label>
              <textarea required className="input-field" rows="3" placeholder="Flat, House no., Building, Company, Apartment" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
            </div>
          </div>

          {/* Automatic Delivery Method Assignment */}
          <div className="section-card">
            <h2 className="section-title">🚚 Delivery Method</h2>
            
            <div className="payment-options">
              {deliveryMethod === 'self' ? (
                <div className="pay-option selected" style={{ cursor: 'default' }}>
                  <div className="pay-label">🚜 Direct Farmer Delivery <span style={{fontSize: '0.9rem', color: '#10b981', marginLeft: '0.5rem'}}>(Free)</span></div>
                  <div style={{fontSize: '0.9rem', color: '#10b981', fontWeight: 600, marginTop: '0.5rem'}}>✓ System matched: Your farmers will deliver this directly to you.</div>
                </div>
              ) : (
                <div className="pay-option selected" style={{ cursor: 'default' }}>
                  <div className="pay-label">🛵 Platform Delivery Partner <span style={{fontSize: '0.9rem', color: '#64748b', marginLeft: '0.5rem'}}>(₹40 fee)</span></div>
                  <div style={{fontSize: '0.9rem', color: '#f59e0b', fontWeight: 600, marginTop: '0.5rem'}}>✓ System matched: Items in your cart require a platform agent.</div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="section-card">
            <h2 className="section-title">💳 Payment Method</h2>
            
            <div className="payment-options">
              <label className={`pay-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                <div className="pay-label">💳 Credit / Debit Card</div>
                <input type="radio" name="payment" value="card" className="pure-radio" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
              </label>

              {paymentMethod === 'card' && (
                <div className="pay-details-box">
                  <div className="form-row">
                    <label className="input-label">Card Number</label>
                    <input type="text" required placeholder="xxxx xxxx xxxx xxxx" maxLength="19" className="input-field" style={{ fontFamily: 'monospace' }} />
                  </div>
                  <div className="form-grid" style={{ marginBottom: 0 }}>
                    <div>
                      <label className="input-label">Expiry (MM/YY)</label>
                      <input type="text" required placeholder="12/26" maxLength="5" className="input-field" />
                    </div>
                    <div>
                      <label className="input-label">CVV</label>
                      <input type="password" required placeholder="•••" maxLength="3" className="input-field" />
                    </div>
                  </div>
                </div>
              )}

              <label className={`pay-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                <div className="pay-label">📱 UPI / QR (GPay, PhonePe)</div>
                <input type="radio" name="payment" value="upi" className="pure-radio" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
              </label>
              
              {paymentMethod === 'upi' && (
                <div className="pay-details-box">
                  <div className="form-row" style={{ marginBottom: 0 }}>
                    <label className="input-label">Enter your UPI ID</label>
                    <input type="text" required placeholder="username@upi" className="input-field" />
                  </div>
                </div>
              )}

              <label className={`pay-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                <div className="pay-label">💵 Cash on Delivery</div>
                <input type="radio" name="payment" value="cod" className="pure-radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
              </label>
            </div>
          </div>
        </div>

        {/* Floating Order Summary */}
        <div>
           <div className="summary-panel">
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', fontWeight: 800 }}>Order Summary</h3>
              
              <div style={{ marginBottom: '2rem' }}>
                {cart.map(item => (
                  <div key={item.id} className="summary-item">
                    <div className="item-info">
                      <img src={item.image} className="item-img" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{item.name}</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Qty: {item.quantity}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700 }}>₹{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="totals-row">
                <span>Subtotal ({cart.length} items)</span>
                <span style={{color: 'white', fontWeight: 700}}>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="totals-row">
                <span>Standard Delivery</span>
                <span style={{color: 'white', fontWeight: 700}}>₹{delivery.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="totals-row">
                  <span style={{ color: '#34d399' }}>🎟️ {appliedCoupon.code} (-{appliedCoupon.pct}%)</span>
                  <span style={{ color: '#34d399', fontWeight: 700 }}>-₹{discount.toFixed(2)}</span>
                </div>
              )}

              {/* Coupon Input */}
              <div style={{ marginTop: '1.5rem', borderTop: '1px solid #1e293b', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. FARM10)"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value)}
                    style={{ flex: 1, padding: '0.6rem 0.9rem', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: 'white', fontSize: '0.9rem', outline: 'none', fontFamily: 'Inter, sans-serif' }}
                  />
                  <button type="button" onClick={applyCoupon} style={{ padding: '0.6rem 1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>Apply</button>
                </div>
                {couponMsg && <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: couponMsg.startsWith('✅') ? '#34d399' : '#f87171', fontWeight: 600 }}>{couponMsg}</div>}
              </div>
              
              <div className="grand-total">
                <span>Total</span>
                <span style={{ color: '#34d399' }}>₹{total.toFixed(2)}</span>
              </div>

              <button type="submit" disabled={loading} className="submit-btn" style={{ background: paymentMethod === 'cod' ? '#0f766e' : '' }}>
                {paymentMethod === 'cod' ? 'Place Order (COD)' : `Pay ₹${total.toFixed(2)}`}
              </button>
           </div>
        </div>
      </form>
    </div>
  );
}
