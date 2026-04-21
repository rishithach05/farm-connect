"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const [toast, setToast] = useState('');

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [myRating, setMyRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [myComment, setMyComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    const saved = sessionStorage.getItem('farm_connect_cart');
    if (saved) setCart(JSON.parse(saved));

    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(d => { setProduct(d.product); setReviews(d.product?.reviews || []); setLoading(false); });
  }, [id]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const addToCart = () => {
    const existing = cart.find(i => i.id === product.id);
    let newCart;
    if (existing) {
      newCart = cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    setCart(newCart);
    sessionStorage.setItem('farm_connect_cart', JSON.stringify(newCart));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    showToast(`🛒 ${product.name} added to cart!`);
  };

  const toggleWishlist = async () => {
    const res = await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: id })
    });
    const data = await res.json();
    if (res.ok) {
      setWishlisted(data.wishlisted);
      showToast(data.wishlisted ? '❤️ Added to Wishlist!' : '💔 Removed from Wishlist');
    } else {
      showToast('⚠️ Please login to use Wishlist');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (myRating === 0) return setReviewMsg('Please select a star rating!');
    setSubmittingReview(true);
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: id, rating: myRating, comment: myComment })
    });
    const data = await res.json();
    setSubmittingReview(false);
    if (res.ok) {
      setReviews(prev => [{ ...data.review, user: { name: 'You' } }, ...prev.filter(r => r.user?.name !== 'You')]);
      setMyRating(0); setMyComment('');
      setReviewMsg('✅ Review submitted!');
      setTimeout(() => setReviewMsg(''), 3000);
    } else {
      setReviewMsg(data.error || 'Failed to submit. Please login first.');
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (loading) return (
    <div style={{ maxWidth: 1100, margin: '120px auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
      {[1, 2].map(i => <div key={i} style={{ height: 400, background: 'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)', borderRadius: 16, animation: 'shimmer 1.5s infinite' }}></div>)}
      <style dangerouslySetInnerHTML={{ __html: `@keyframes shimmer{0%{background-position:-468px 0}100%{background-position:468px 0}}` }} />
    </div>
  );

  if (!product) return (
    <div style={{ textAlign: 'center', padding: '10rem', color: '#64748b', fontSize: '1.2rem' }}>
      Product not found. <button onClick={() => router.push('/marketplace')} style={{ color: '#10b981', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>← Back to Marketplace</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: '100px auto 4rem', padding: '0 1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .star { font-size: 1.8rem; cursor: pointer; transition: transform 0.1s; }
        .star:hover { transform: scale(1.2); }
        .review-card { background: #f8fafc; border-radius: 12px; padding: 1.25rem; border: 1px solid #e2e8f0; margin-bottom: 1rem; }
        .toast-pd { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); background: #0f172a; color: white; padding: 0.85rem 2rem; border-radius: 100px; font-weight: 600; z-index: 9999; animation: slideUp 0.4s ease; }
        @keyframes slideUp { from { transform: translateX(-50%) translateY(30px); opacity: 0; } to { transform: translateX(-50%) translateY(0); opacity: 1; } }
      `}} />

      {toast && <div className="toast-pd">{toast}</div>}

      {/* Breadcrumb */}
      <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <span style={{ cursor: 'pointer', color: '#10b981' }} onClick={() => router.push('/')}>Home</span> /
        <span style={{ cursor: 'pointer', color: '#10b981' }} onClick={() => router.push('/marketplace')}>Marketplace</span> /
        <span>{product.name}</span>
      </div>

      {/* Main Product Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '4rem' }}>
        <div>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: 400, objectFit: 'cover', borderRadius: 20, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
            onError={e => { e.target.src = `https://placehold.co/600x400/dcfce7/166534?text=${encodeURIComponent(product.name)}`; }}
          />
          {/* Farmer Card */}
          <div style={{ marginTop: '1.5rem', background: 'white', padding: '1.5rem', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', fontSize: '1.1rem' }}>👨‍🌾 About the Farmer</div>
            <div style={{ fontWeight: 700, color: '#047857', fontSize: '1.1rem' }}>{product.farmer?.name}</div>
            <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>📌 {product.farmer?.location}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.5rem' }}>Member since {new Date(product.farmer?.createdAt).getFullYear()}</div>
          </div>
        </div>

        <div>
          <span style={{ background: '#dcfce7', color: '#166534', padding: '0.35rem 1rem', borderRadius: 100, fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{product.category}</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', margin: '1rem 0 0.5rem', lineHeight: 1.2 }}>{product.name}</h1>

          {/* Rating Summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#eab308' }}>⭐ {avgRating || 'New'}</span>
            <span style={{ color: '#64748b', fontSize: '0.95rem' }}>({reviews.length} reviews)</span>
            <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem', background: '#ecfdf5', padding: '0.25rem 0.75rem', borderRadius: 100 }}>✅ Verified Farm</span>
          </div>

          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>{product.description || 'Farm-fresh product sourced directly from trusted local farmers.'}</p>

          {/* Stock Alert */}
          {product.quantity > 0 && product.quantity < 10 && (
            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: 10, fontWeight: 700, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              🔥 Only {product.quantity} {product.unit} left in stock!
            </div>
          )}
          {product.quantity <= 0 && (
            <div style={{ background: '#f1f5f9', color: '#64748b', padding: '0.75rem 1rem', borderRadius: 10, fontWeight: 700, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              ❌ Currently out of stock
            </div>
          )}

          {/* Price */}
          <div style={{ fontSize: '3rem', fontWeight: 900, color: '#047857', marginBottom: '2rem' }}>
            ₹{product.price} <span style={{ fontSize: '1.2rem', color: '#94a3b8', fontWeight: 500 }}>per {product.unit}</span>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <button
              onClick={addToCart}
              disabled={product.quantity <= 0}
              style={{ flex: 1, padding: '1rem 2rem', background: added ? '#047857' : 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: '1.1rem', cursor: product.quantity <= 0 ? 'not-allowed' : 'pointer', transition: '0.2s', boxShadow: '0 10px 15px -3px rgba(16,185,129,0.3)' }}
            >
              {added ? 'Added ✓' : (product.quantity > 0 ? '🛒 Add to Cart' : 'Out of Stock')}
            </button>
            <button
              onClick={toggleWishlist}
              style={{ padding: '1rem 1.5rem', background: wishlisted ? '#ffe4e6' : 'white', color: wishlisted ? '#e11d48' : '#64748b', border: '2px solid', borderColor: wishlisted ? '#fda4af' : '#e2e8f0', borderRadius: 12, cursor: 'pointer', fontSize: '1.3rem', transition: '0.2s' }}
            >
              {wishlisted ? '❤️' : '🤍'}
            </button>
          </div>

          {/* Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            {[
              { icon: '📦', label: 'In Stock', value: `${product.quantity} ${product.unit}` },
              { icon: '🚚', label: 'Delivery', value: '2-3 Days' },
              { icon: '♻️', label: 'Type', value: 'Farm Direct' },
            ].map(s => (
              <div key={s.label} style={{ background: '#f8fafc', padding: '1rem', borderRadius: 12, textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '1.5rem' }}>{s.icon}</div>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{s.value}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
        {/* Write Review */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>✍️ Write a Review</h2>
          <form onSubmit={submitReview}>
            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  className="star"
                  style={{ color: star <= (hoverRating || myRating) ? '#eab308' : '#e2e8f0' }}
                  onClick={() => setMyRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >★</span>
              ))}
            </div>
            <textarea
              value={myComment}
              onChange={e => setMyComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={4}
              style={{ width: '100%', padding: '0.85rem 1rem', border: '2px solid #e2e8f0', borderRadius: 10, fontSize: '1rem', resize: 'vertical', outline: 'none', fontFamily: 'Inter, sans-serif' }}
            />
            {reviewMsg && <div style={{ margin: '0.75rem 0', color: reviewMsg.startsWith('✅') ? '#047857' : '#dc2626', fontWeight: 600 }}>{reviewMsg}</div>}
            <button type="submit" disabled={submittingReview} style={{ marginTop: '1rem', width: '100%', padding: '0.9rem', background: '#10b981', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>

        {/* Review List */}
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>
            💬 Customer Reviews {reviews.length > 0 && <span style={{ color: '#94a3b8', fontWeight: 500, fontSize: '1rem' }}>({reviews.length})</span>}
          </h2>
          {reviews.length === 0 ? (
            <div style={{ background: '#f8fafc', padding: '3rem', borderRadius: 16, textAlign: 'center', color: '#64748b' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
              <div style={{ fontWeight: 600 }}>Be the first to review this product!</div>
            </div>
          ) : (
            <div style={{ maxHeight: 400, overflowY: 'auto', paddingRight: '0.5rem' }}>
              {reviews.map(review => (
                <div key={review.id} className="review-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{review.user?.name}</span>
                    <span style={{ color: '#eab308', fontWeight: 700 }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                  </div>
                  {review.comment && <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0 }}>{review.comment}</p>}
                  <div style={{ color: '#cbd5e1', fontSize: '0.8rem', marginTop: '0.5rem' }}>{new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating cart if items in cart */}
      {cart.length > 0 && (
        <div
          onClick={() => { sessionStorage.setItem('farm_connect_cart', JSON.stringify(cart)); window.location.href = '/cart'; }}
          style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: '#0f172a', color: 'white', padding: '1rem 1.5rem', borderRadius: 100, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', zIndex: 50 }}>
          <div style={{ background: '#ef4444', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', position: 'absolute', top: -8, left: -8, border: '2px solid #0f172a' }}>{cart.reduce((s, i) => s + i.quantity, 0)}</div>
          🛒 <span style={{ color: '#34d399' }}>₹{cart.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}</span>
          <span style={{ background: '#10b981', padding: '0.4rem 0.9rem', borderRadius: 100, fontSize: '0.9rem' }}>View Cart →</span>
        </div>
      )}
    </div>
  );
}
