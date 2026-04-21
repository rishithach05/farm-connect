"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Cart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  // 3. Fetch cart data from sessionStorage
  useEffect(() => {
    const savedCart = sessionStorage.getItem('farm_connect_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setLoading(false);
  }, []);

  // Update session storage whenever cart changes
  const syncCart = (newCart) => {
    setCartItems(newCart);
    sessionStorage.setItem('farm_connect_cart', JSON.stringify(newCart));
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // 3. Implement [+] and [-] buttons
  const updateQuantity = (id, delta) => {
    const newCart = cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        // 3. If quantity becomes 0 -> remove automatically
        if (newQuantity <= 0) return null;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean); // Remove null items
    
    // Check if an item was completely removed mechanically by decreasing
    if (newCart.length < cartItems.length) {
       showToast("🗑️ Item removed from cart");
    } else {
       showToast(delta > 0 ? "📈 Quantity Increased" : "📉 Quantity Decreased");
    }
    
    syncCart(newCart);
  };

  const removeItem = (id) => {
    const newCart = cartItems.filter(item => item.id !== id);
    syncCart(newCart);
    showToast("🗑️ Item removed from cart");
  };

  // 6. Empty Cart Case
  if (loading) return <div style={{textAlign:'center', padding:'5rem', color:'#64748b', fontSize:'1.2rem', fontWeight:600}}>Loading your cart...</div>;
  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 2rem', fontFamily: 'var(--font-inter)', background: '#f8fafc', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '5rem', marginBottom: '1.5rem', animation: 'float 3s ease-in-out infinite' }}>🛒</div>
        <h2 style={{ fontSize: '2.5rem', color: '#0f172a', fontWeight: 900, marginBottom: '1rem' }}>Your Cart is Empty</h2>
        <p style={{ color: '#64748b', fontSize: '1.2rem', marginBottom: '2.5rem', maxWidth: '400px' }}>Looks like you haven't added any fresh farm produce to your basket yet.</p>
        <button onClick={() => window.location.href = '/marketplace'} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', padding: '1.2rem 2.5rem', borderRadius: '14px', fontSize: '1.2rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(16,185,129,0.3)', transition: 'transform 0.2s' }} onMouseOver={e => e.target.style.transform='translateY(-3px)'} onMouseOut={e => e.target.style.transform='translateY(0)'}>
          ← Browse Marketplace
        </button>
        <style dangerouslySetInnerHTML={{ __html: `@keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }` }} />
      </div>
    );
  }

  // 3. Update total price
  const subTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const delivery = 50;
  const grandTotal = subTotal + delivery;

  return (
    <div style={{ fontFamily: 'var(--font-inter)', maxWidth: '1200px', margin: '3rem auto', padding: '0 1.5rem', minHeight: '80vh' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .cart-header { font-size: 2.2rem; color: #0f172a; font-weight: 900; margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem; }
        .cart-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 3rem; align-items: start; }
        
        .items-container { display: flex; flex-direction: column; gap: 1.5rem; }
        .cart-item { display: flex; gap: 1.5rem; background: white; padding: 1.5rem; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; align-items: center; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); animation: slideIn 0.4s ease-out; position: relative; overflow: hidden; }
        .cart-item:hover { box-shadow: 0 15px 25px -5px rgba(0,0,0,0.1); transform: translateY(-3px); border-color: #cbd5e1; }
        
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        .item-img { width: 100px; height: 100px; object-fit: cover; border-radius: 12px; background: #f1f5f9; flex-shrink: 0; }
        .item-details { flex-grow: 1; }
        .item-name { font-size: 1.3rem; font-weight: 800; color: #1e293b; margin-bottom: 0.25rem; }
        .item-price { color: #64748b; font-weight: 600; font-size: 0.95rem; }
        
        .quantity-controller { display: flex; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; width: max-content; margin-top: 1rem; }
        .q-btn { background: transparent; border: none; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 600; color: #0f172a; cursor: pointer; transition: background 0.2s; }
        .q-btn:hover { background: #e2e8f0; }
        .q-val { width: 40px; text-align: center; font-weight: 700; color: #10b981; font-size: 1.1rem; }
        
        .item-total { font-size: 1.4rem; font-weight: 800; color: #059669; text-align: right; }
        .remove-btn { background: #fee2e2; color: #dc2626; border: none; width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; font-size: 1.1rem; }
        .remove-btn:hover { background: #fecaca; transform: scale(1.1); color: #b91c1c; }

        .summary-card { background: white; padding: 2rem; border-radius: 20px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; position: sticky; top: 120px; }
        .summary-title { font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 2px dashed #e2e8f0; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 1rem; color: #475569; font-weight: 500; font-size: 1.05rem; }
        .summary-total { display: flex; justify-content: space-between; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 2px solid #cbd5e1; font-size: 1.6rem; font-weight: 900; color: #0f172a; }
        
        .checkout-btn { width: 100%; margin-top: 2rem; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 1.25rem; border-radius: 14px; font-weight: 800; font-size: 1.2rem; border: none; cursor: pointer; box-shadow: 0 10px 15px -3px rgba(16,185,129,0.3); transition: transform 0.2s, box-shadow 0.2s; text-transform: uppercase; letter-spacing: 1px; }
        .checkout-btn:hover { transform: translateY(-3px); box-shadow: 0 15px 20px -5px rgba(16,185,129,0.4); }

        .toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%) translateY(${toast ? '0' : '50px'}); opacity: ${toast ? '1' : '0'}; background: #0f172a; color: white; padding: 1rem 2rem; border-radius: 100px; font-weight: 600; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2); z-index: 9999; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); display: flex; align-items: center; border: 2px solid #334155; pointer-events: none; }

        @media (max-width: 1024px) {
          .cart-layout { grid-template-columns: 1fr; gap: 2rem; }
          .summary-card { position: relative; top: 0; }
        }
        @media (max-width: 600px) {
          .cart-item { flex-direction: column; align-items: flex-start; gap: 1rem; position: relative; }
          .item-img { width: 100%; height: 180px; }
          .item-total { text-align: left; margin-top: 0.5rem; }
          .remove-btn { position: absolute; top: 1.5rem; right: 1.5rem; }
        }
      `}} />

      {/* 8. Toast notification built-in */}
      <div className="toast">{toast}</div>

      <h1 className="cart-header">🛒 Review Your Basket</h1>
      
      <div className="cart-layout">
        
        {/* Cart Items List */}
        <div className="items-container">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="item-img" />
              
              <div className="item-details">
                <div className="item-name">{item.name}</div>
                <div className="item-price">₹{item.price} / {item.unit}</div>
                
                <div className="quantity-controller">
                  <button className="q-btn" onClick={() => updateQuantity(item.id, -1)}>−</button>
                  <div className="q-val">{item.quantity}</div>
                  <button className="q-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2rem' }}>
                <button className="remove-btn" onClick={() => removeItem(item.id)} title="Remove Item">🗑️</button>
                <div className="item-total">₹{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Checkout Panel */}
        <div>
          <div className="summary-card">
            <h3 className="summary-title">Bill Details</h3>
            
            <div className="summary-row">
              <span>Item Total ({cartItems.length} items)</span>
              <span style={{color: '#0f172a', fontWeight: 600}}>₹{subTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Farm Delivery Partner Fee</span>
              <span style={{color: '#0f172a', fontWeight: 600}}>₹{delivery.toFixed(2)}</span>
            </div>
            
            <div style={{ padding: '0.75rem', background: '#ecfdf5', borderRadius: '8px', color: '#047857', fontSize: '0.9rem', fontWeight: 600, display: 'flex', gap: '0.5rem', marginTop: '1rem', border: '1px solid #10b981' }}>
               ✨ <span>Buying directly from farmers saves you up to 30% on middleman costs!</span>
            </div>

            <div className="summary-total">
              <span>Grand Total</span>
              <span style={{color: '#10b981'}}>₹{grandTotal.toFixed(2)}</span>
            </div>

            <button className="checkout-btn" onClick={() => router.push('/checkout')}>
               Proceed to Checkout →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
