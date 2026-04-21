"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Wishlist() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = sessionStorage.getItem('farm_connect_cart');
    if (saved) setCart(JSON.parse(saved));

    fetch('/api/wishlist')
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error);
        else setWishlist(d.wishlist || []);
        setLoading(false);
      })
      .catch(() => { setError('Login required'); setLoading(false); });
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const removeFromWishlist = async (productId) => {
    await fetch('/api/wishlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId }) });
    setWishlist(prev => prev.filter(w => w.productId !== productId));
    showToast('💔 Removed from wishlist');
  };

  const addToCart = (product) => {
    const existing = cart.find(i => i.id === product.id);
    let newCart;
    if (existing) {
      newCart = cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    setCart(newCart);
    sessionStorage.setItem('farm_connect_cart', JSON.stringify(newCart));
    showToast(`🛒 ${product.name} added to Cart!`);
  };

  if (loading) return (
    <div style={{ maxWidth: 1100, margin: '120px auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
      {[1,2,3].map(i => <div key={i} style={{ height: 350, background: 'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)', borderRadius: 16, animation: 'shimmer 1.5s infinite' }}></div>)}
      <style dangerouslySetInnerHTML={{ __html: `@keyframes shimmer{0%{background-position:-468px 0}100%{background-position:468px 0}}` }} />
    </div>
  );

  if (error) return (
    <div style={{ maxWidth: 500, margin: '10rem auto', textAlign: 'center', padding: '3rem', background: 'white', borderRadius: 20, boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔐</div>
      <h2 style={{ color: '#0f172a', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 800 }}>Login to View Wishlist</h2>
      <button onClick={() => router.push('/login')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.9rem 2rem', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: '1rem', width: '100%' }}>Login Now</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: '100px auto 4rem', padding: '0 1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .wish-card { background: white; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); transition: transform 0.3s, box-shadow 0.3s; display: flex; flex-direction: column; }
        .wish-card:hover { transform: translateY(-6px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
        .toast-wl { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); background: #0f172a; color: white; padding: 0.85rem 2rem; border-radius: 100px; font-weight: 600; z-index: 9999; animation: slideUp 0.4s ease; }
        @keyframes slideUp { from { transform: translateX(-50%) translateY(30px); opacity:0 } to { transform: translateX(-50%) translateY(0); opacity:1 } }
      `}} />

      {toast && <div className="toast-wl">{toast}</div>}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.25rem' }}>❤️ My Wishlist</h1>
          <p style={{ color: '#64748b' }}>{wishlist.length} saved product{wishlist.length !== 1 ? 's' : ''}</p>
        </div>
        {cart.length > 0 && (
          <button onClick={() => router.push('/cart')} style={{ background: '#0f172a', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>
            🛒 View Cart ({cart.reduce((s,i) => s+i.quantity, 0)})
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'white', borderRadius: 24, border: '2px dashed #cbd5e1' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🤍</div>
          <h3 style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>Your wishlist is empty</h3>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>Browse the marketplace and heart the products you love!</p>
          <button onClick={() => router.push('/marketplace')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.9rem 2rem', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
            🌾 Explore Marketplace
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {wishlist.map(({ product, productId }) => (
            <div key={productId} className="wish-card">
              <div style={{ position: 'relative' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: 220, objectFit: 'cover' }}
                  onError={e => { e.target.src = `https://placehold.co/500x300/dcfce7/166534?text=${encodeURIComponent(product.name)}`; }}
                />
                <button
                  onClick={() => removeFromWishlist(productId)}
                  style={{ position: 'absolute', top: 12, right: 12, background: 'white', border: 'none', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontSize: '1.1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Remove from wishlist"
                >❤️</button>
              </div>
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span style={{ background: '#f1f5f9', color: '#475569', padding: '0.2rem 0.6rem', borderRadius: 100, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', width: 'fit-content', marginBottom: '0.75rem' }}>{product.category}</span>
                <h3 style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem', marginBottom: '0.35rem' }}>{product.name}</h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.75rem' }}>📌 {product.farmer?.location} · 👨‍🌾 {product.farmer?.name}</p>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                  <span style={{ fontWeight: 900, fontSize: '1.4rem', color: '#047857' }}>₹{product.price}<span style={{ fontWeight: 500, color: '#94a3b8', fontSize: '0.85rem' }}>/{product.unit}</span></span>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.quantity <= 0}
                    style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.6rem 1.1rem', borderRadius: 10, fontWeight: 700, cursor: product.quantity <= 0 ? 'not-allowed' : 'pointer', fontSize: '0.9rem', opacity: product.quantity <= 0 ? 0.5 : 1 }}
                  >{product.quantity > 0 ? '+ Add' : 'Sold Out'}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
