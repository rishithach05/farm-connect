"use client";

import { useState, useEffect } from 'react';

const IMAGE_MAP = {
  tomato:     "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=600&q=80",
  potato:     "https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=600&q=80",
  carrot:     "https://images.unsplash.com/photo-1447175008436-054170c2e979?w=600&q=80",
  onion:      "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&q=80",
  cabbage:    "/images/cabbage.png",
  mango:      "/images/mango.jpg",
  apple:      "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=600&q=80",
  banana:     "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&q=80",
  orange:     "https://images.unsplash.com/photo-1547514701-42782101795e?w=600&q=80",
  watermelon: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80",
  rice:       "/images/rice.png",
  wheat:      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80",
  corn:       "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&q=80",
  dal:        "/images/toordal.jpg",
  millet:     "/images/millet_new.png",
  milk:       "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&q=80",
  ghee:       "/images/ghee.png",
  paneer:     "/images/paneer.jpg",
  curd:       "/images/curd.jpg",
  fallback:   "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80"
};

function getPreviewImage(name) {
  if (!name) return IMAGE_MAP.fallback;
  const lowerName = name.toLowerCase();
  for (const [key, url] of Object.entries(IMAGE_MAP)) {
    if (lowerName.includes(key)) return url;
  }
  return IMAGE_MAP.fallback;
}
export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // V2 UX Features
  const [toast, setToast] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  // V3 Final Polish States
  const [addedMap, setAddedMap] = useState({}); // Tracking which item just got 'Added ✓'
  const [badgeBump, setBadgeBump] = useState(false); // CSS pop animation for Cart Badge
  
  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [location, setLocation] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  // Cart State
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setFiltered(data.products || []);
        setLoading(false);
      });
  }, []);

  // Filter & Logic Matrix
  useEffect(() => {
    let result = [...products];
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (category !== 'all') result = result.filter(p => p.category === category);
    result = result.filter(p => p.price <= maxPrice);
    if (location) result = result.filter(p => p.farmer?.location?.toLowerCase().includes(location.toLowerCase()));
    
    // Sort Logic (Req 3)
    if (sortOption === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'highest-rated') {
      // Since ratings are simulated based on deterministic strings, we mock a mock sort
      result.sort((a, b) => (b.id.length % 5) - (a.id.length % 5)); 
    } else { // 'newest'
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    setFiltered(result);
  }, [search, category, maxPrice, location, sortOption, products]);

  // V2 Voice Search Feature
  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Your browser doesn't support Voice AI");

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearch(transcript);
      showToast('🎤 Voice Command Processed');
    };
    recognition.start();
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    showToast(`🛒 ${product.name} added to your Cart!`);
    
    // V3: Button Change "Added ✓" feedback
    setAddedMap({ ...addedMap, [product.id]: true });
    setTimeout(() => setAddedMap(prev => ({ ...prev, [product.id]: false })), 2000);

    // V3: Cart Badge Pump Animation
    setBadgeBump(true);
    setTimeout(() => setBadgeBump(false), 300);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    sessionStorage.setItem('farm_connect_cart', JSON.stringify(cart));
    window.location.href = '/cart';
  };

  // V3: Dynamic Trending Logic based strictly on newest high-priced products
  const popularNearYou = [...products].filter(p => p.price > 50).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);

  return (
    <div style={{ position: 'relative' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .market-layout { display: grid; grid-template-columns: 300px 1fr; grid-template-areas: 'sidebar main'; gap: 2.5rem; max-width: 1400px; margin: 100px auto 3rem; padding: 0 1.5rem; }
        .sidebar { grid-area: sidebar; background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid var(--neutral-200); position: sticky; top: 100px; height: fit-content; transition: 0.3s ease; }
        .market-main { grid-area: main; }
        .filter-group { margin-bottom: 2rem; }
        .filter-title { font-weight: 700; color: #1e293b; margin-bottom: 1rem; font-size: 1.15rem; }
        .filter-input { width: 100%; padding: 0.85rem 1rem; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 1rem; transition: 0.2s; }
        .filter-input:focus { border-color: #10b981; outline: none; box-shadow: 0 0 0 3px rgba(16,185,129,0.1); }
        .filter-btn { display: block; width: 100%; text-align: left; padding: 0.75rem 1rem; background: transparent; border: 1px solid transparent; border-radius: 8px; cursor: pointer; color: #64748b; transition: all 0.2s; font-size: 1rem; margin-bottom: 0.25rem; }
        .filter-btn:hover { background: #f8fafc; color: #0f172a; }
        .filter-btn.active { background: #ecfdf5; color: #047857; border-color: #a7f3d0; font-weight: 700; }
        
        .sort-select { padding: 0.5rem 1rem; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 0.95rem; font-weight: 600; color: #1e293b; background: white; cursor: pointer; transition: 0.2s; }
        .sort-select:focus { border-color: #10b981; outline: none; }

        /* Voice AI Button */
        .search-box-wrapper { position: relative; display: flex; align-items: center; }
        .mic-btn { position: absolute; right: 10px; background: ${isListening ? '#ef4444' : '#f1f5f9'}; color: ${isListening ? 'white' : '#64748b'}; border: none; width: 35px; height: 35px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; font-size: 1rem; animation: ${isListening ? 'pulse 1.5s infinite' : 'none'}; }
        .mic-btn:hover { background: ${isListening ? '#dc2626' : '#e2e8f0'}; color: ${isListening ? 'white' : '#0f172a'}; }
        
        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem; }
        .product-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; transition: transform 0.3s, box-shadow 0.3s; display: flex; flex-direction: column; position: relative; }
        .product-card:hover { transform: translateY(-8px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); border-color: #cbd5e1; }
        .product-img { width: 100%; height: 220px; object-fit: cover; background: #f1f5f9; }
        .product-info { padding: 1.5rem; display: flex; flex-direction: column; flex-grow: 1; }
        
        .tag { display: inline-block; background: #f1f5f9; color: #475569; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid #e2e8f0; }
        .p-name { font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; line-height: 1.3; }
        .p-farmer { font-size: 0.9rem; color: #64748b; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; }
        
        .p-price-row { display: flex; justify-content: space-between; align-items: center; margin-top: auto; border-top: 1px solid #f1f5f9; padding-top: 1rem; }
        .p-price { font-size: 1.5rem; font-weight: 900; color: #047857; }
        
        .add-btn { background: #10b981; color: white; border: none; padding: 0.75rem 1.25rem; border-radius: 10px; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 6px -1px rgba(16,185,129,0.3); width: max-content; }
        .add-btn:hover:not(:disabled) { background: #059669; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(16,185,129,0.4); }
        .add-btn:disabled { background: #e2e8f0; box-shadow: none; cursor: not-allowed; color: #94a3b8; border: 1px solid #cbd5e1; }
        .add-btn.added-success { background: #047857; box-shadow: none; }
        
        /* Shimmer Loading Skeletons */
        .skel-card { background: white; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; height: 420px; display: flex; flex-direction: column; padding: 1rem; gap: 1rem; }
        .skel-img { background: #f1f5f9; height: 200px; border-radius: 12px; width: 100%; }
        .skel-line { background: #f1f5f9; height: 20px; border-radius: 4px; width: 100%; }
        .skel-box { background: #f1f5f9; height: 40px; border-radius: 8px; width: 100px; }
        .shimmer { animation: placeHolderShimmer 1.5s infinite linear; background: linear-gradient(90deg, #f1f5f9 8%, #e2e8f0 18%, #f1f5f9 33%); background-size: 800px 104px; }
        @keyframes placeHolderShimmer { 0% { background-position: -468px 0 } 100% { background-position: 468px 0 } }
        
        .recommendations { margin-bottom: 4rem; background: linear-gradient(135deg, #fef3c7 0%, #fef08a 100%); padding: 3rem; border-radius: 24px; box-shadow: 0 10px 15px -3px rgba(253,230,138,0.5); border: 1px solid #fde047; }
        .rec-title { font-size: 1.8rem; color: #92400e; font-weight: 900; margin-bottom: 2rem; display: flex; align-items: center; gap: 0.75rem; }

        .cart-floating { position: fixed; bottom: 2rem; right: 2rem; background: #0f172a; color: white; padding: 1rem 1.5rem; border-radius: 100px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3); font-weight: 700; display: flex; align-items: center; gap: 1.5rem; cursor: pointer; z-index: 50; transition: transform 0.2s; border: 2px solid #334155; }
        .cart-floating:hover { transform: scale(1.05); background: #1e293b; }
        .cart-badge { background: #ef4444; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; position: absolute; top: -10px; left: -10px; border: 3px solid #0f172a; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .badge-bump { transform: scale(1.4); }

        /* Toast Notification System */
        .toast-notification { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%) translateY(${toast ? '0' : '100px'}); opacity: ${toast ? '1' : '0'}; background: #0f172a; color: white; padding: 1rem 2rem; border-radius: 100px; font-weight: 600; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2); z-index: 9999; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); display: flex; align-items: center; gap: 1rem; border: 1px solid #334155; }
        
        @media (max-width: 1024px) {
          .market-layout { grid-template-columns: 1fr; grid-template-areas: 'main'; padding: 0 1rem; margin-top: 80px; }
          .mobile-filter-btn { display: block; }
          .sidebar { position: fixed; top: 0; left: 0; bottom: 0; z-index: 1000; border-radius: 0; transform: translateX(${showMobileSidebar ? '0' : '-100%'}); width: 85%; max-width: 350px; overflow-y: auto; }
          .recommendations { padding: 1.5rem; border-radius: 16px; margin: 1rem; }
          .products-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; }
          .cart-floating { bottom: 1.5rem; right: 1.5rem; flex-direction: column; gap: 0.5rem; text-align: center; border-radius: 16px; }
          .cart-floating .btn-text { display: none; }
        }
      `}} />

      {toast && <div className="toast-notification">✅ {toast}</div>}

      {showMobileSidebar && <div style={{position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(0,0,0,0.5)', zIndex: 999}} onClick={() => setShowMobileSidebar(false)}></div>}

      {!loading && popularNearYou.length > 0 && (
        <div style={{ maxWidth: 1400, margin: '6rem auto 1rem' }}>
          <div className="recommendations">
            <h2 className="rec-title">✨ Trending Fresh Harvests</h2>
            <div className="products-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {popularNearYou.map(p => (
                <div key={`rec-${p.id}`} className="product-card" style={{ border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                  <img 
                    src={p.image} 
                    style={{ height: 180, objectFit: 'cover', width: '100%' }}
                    onError={(e) => { e.target.onerror = null; e.target.src = getPreviewImage(p.name); }}
                  />
                  <div className="product-info">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div className="p-name" style={{fontSize: '1.1rem'}}>{p.name}</div>
                      <div className="p-price" style={{fontSize: '1.1rem'}}>₹{p.price}</div>
                    </div>
                    <button className={`add-btn ${addedMap[p.id] ? 'added-success' : ''}`} style={{ width: '100%' }} onClick={() => addToCart(p)} disabled={p.quantity <= 0}>
                      {addedMap[p.id] ? 'Added ✓' : (p.quantity <= 0 ? 'Out of Stock' : 'Fast Add')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 1.5rem' }}>
        <button className="mobile-filter-btn" onClick={() => setShowMobileSidebar(true)}>
          <span style={{marginRight: '8px'}}>⚙️</span> Adjust Search & Filters
        </button>
      </div>

      <div className="market-layout">
        <aside className="sidebar">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
            <h3 style={{fontSize: '1.25rem', fontWeight: 800, color: '#0f172a'}}>Smart Filters</h3>
            <span style={{cursor: 'pointer', fontSize: '1.5rem', display: showMobileSidebar ? 'block' : 'none'}} onClick={() => setShowMobileSidebar(false)}>✕</span>
          </div>

          <div className="filter-group">
            <div className="filter-title">🎙️ AI Voice Search</div>
            <div className="search-box-wrapper">
              <input type="text" className="filter-input" placeholder="Say 'Tomatoes'..." value={search} onChange={(e) => setSearch(e.target.value)} />
              <button className="mic-btn" onClick={startVoiceSearch} title="Click to speak">🎤</button>
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-title">📍 Farm Location</div>
            <input type="text" className="filter-input" placeholder="City or Pincode" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>

          <div className="filter-group">
            <div className="filter-title">💸 Price Cap (₹{maxPrice})</div>
            <input type="range" style={{ width: '100%', accentColor: '#10b981' }} min="10" max="2000" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            <div style={{ fontWeight: 600, color: '#047857', marginTop: '0.5rem', fontSize: '0.9rem' }}>Under ₹{maxPrice}</div>
          </div>

          <div className="filter-group">
            <div className="filter-title">📁 Fresh Categories</div>
            <button className={`filter-btn ${category === 'all' ? 'active' : ''}`} onClick={() => setCategory('all')}>🌾 All Departments</button>
            <button className={`filter-btn ${category === 'vegetables' ? 'active' : ''}`} onClick={() => setCategory('vegetables')}>🥕 Vegetables</button>
            <button className={`filter-btn ${category === 'fruits' ? 'active' : ''}`} onClick={() => setCategory('fruits')}>🍎 Fruits</button>
            <button className={`filter-btn ${category === 'grains' ? 'active' : ''}`} onClick={() => setCategory('grains')}>🌾 Grains & Pulses</button>
            <button className={`filter-btn ${category === 'dairy' ? 'active' : ''}`} onClick={() => setCategory('dairy')}>🥛 Farm Dairy</button>
          </div>
        </aside>

        <main className="market-main">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.2rem', color: '#0f172a', fontWeight: 900, marginBottom: '0.25rem' }}>Marketplace</h1>
              <span style={{ fontSize: '0.95rem', background: '#f8fafc', padding: '0.4rem 0.8rem', borderRadius: '8px', color: '#64748b', fontWeight: 700, border: '1px solid #e2e8f0' }}>Showing {filtered.length} products</span>
            </div>
            
            {/* V3 Add Sorting Option Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: '#64748b', fontWeight: 600, fontSize: '0.95rem' }}>Sort By:</span>
              <select className="sort-select" value={sortOption} onChange={e => setSortOption(e.target.value)}>
                <option value="newest">New Arrivals 🔥</option>
                <option value="highest-rated">Highest Rated ⭐</option>
                <option value="price-low">Price: Low to High 📉</option>
                <option value="price-high">Price: High to Low 📈</option>
              </select>
            </div>
          </div>

          {loading ? (
             <div className="products-grid">
               {[1,2,3,4,5,6].map(sk => (
                 <div key={sk} className="skel-card border-none box-shadow-none">
                   <div className="skel-img shimmer"></div>
                   <div className="skel-line shimmer" style={{ width: '40%' }}></div>
                   <div className="skel-line shimmer" style={{ width: '80%' }}></div>
                   <div className="skel-line shimmer" style={{ width: '100%' }}></div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
                     <div className="skel-box shimmer" style={{ width: '60px' }}></div>
                     <div className="skel-box shimmer"></div>
                   </div>
                 </div>
               ))}
             </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'white', borderRadius: '24px', border: '2px dashed #cbd5e1' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🚜</div>
              <h3 style={{ color: '#0f172a', marginBottom: '0.75rem', fontSize: '1.5rem', fontWeight: 800 }}>No crops found matching filters</h3>
              <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Try expanding your search radius or using AI Voice search.</p>
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map(product => (
                <div key={product.id} className="product-card">
                  <a href={`/product/${product.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="product-img"
                      onError={(e) => { e.target.onerror = null; e.target.src = getPreviewImage(product.name); }}
                    />
                  </a>
                  <div className="product-info">
                    <span className="tag">{product.category}</span>
                    <a href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h3 className="p-name">{product.name}</h3>
                    </a>
                    
                    <div className="p-farmer">
                      <span style={{color: '#94a3b8', fontSize: '0.8rem'}}>📌 {product.farmer?.location || 'Unknown'}</span>
                      <span style={{ fontWeight: 700, color: '#475569' }}>👨‍🌾 {product.farmer?.name || 'Local Farmer'}</span>
                    </div>
                    
                    {(() => {
                      const MOCK_STATS = {
                        'Fresh Bananas': { rating: '4.9', views: 51 },
                        'Red Apples': { rating: '4.5', views: 155 },
                        'Alphonso Mangoes': { rating: '4.8', views: 193 },
                        'Green Cabbage': { rating: '4.5', views: 183 },
                        'Red Onions': { rating: '4.2', views: 60 },
                        'Crunchy Carrots': { rating: '4.9', views: 151 },
                      };
                      const stats = MOCK_STATS[product.name] || {
                        rating: (4.0 + (product.name.length % 10) / 10).toFixed(1),
                        views: (product.name.length * 13 % 200 + 10)
                      };
                      return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1rem', color: '#eab308', fontSize: '0.9rem', fontWeight: 700 }}>
                          ⭐ {stats.rating} <span style={{ color: '#94a3b8', fontWeight: 500, fontSize: '0.8rem' }}>( {stats.views} views )</span>
                        </div>
                      );
                    })()}
                    
                    {product.quantity > 0 && product.quantity < 10 && (
                      <div style={{ fontSize: '0.8rem', color: '#dc2626', marginBottom: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#fee2e2', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                        <span>🔥</span> Hurry, only {product.quantity} left in stock!
                      </div>
                    )}
                    {product.quantity <= 0 && (
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f1f5f9', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                        <span>❌</span> Sold out for the season.
                      </div>
                    )}

                    <div className="p-price-row">
                      <div>
                        <span className="p-price">₹{product.price}</span>
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}> /{product.unit}</span>
                      </div>
                      <button 
                        className={`add-btn ${addedMap[product.id] ? 'added-success' : ''}`} 
                        onClick={() => addToCart(product)}
                        disabled={product.quantity <= 0 || addedMap[product.id]}
                      >
                        {addedMap[product.id] ? 'Added ✓' : (product.quantity > 0 ? '+ Add' : 'Out of Stock')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {cart.length > 0 && (
        <div className="cart-floating" onClick={handleCheckout}>
          <div className={`cart-badge ${badgeBump ? 'badge-bump' : ''}`}>{cart.reduce((s, i) => s + i.quantity, 0)}</div>
          <div style={{ fontSize: '1.5rem' }}>🛒</div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Subtotal</div>
            <div style={{ fontSize: '1.2rem', color: '#34d399' }}>₹{cart.reduce((s, i) => s + (i.price * i.quantity), 0).toFixed(2)}</div>
          </div>
          <span className="btn-text" style={{ background: '#10b981', padding: '0.5rem 1rem', borderRadius: '100px', color: 'white', border: 'none' }}>Review Cart →</span>
        </div>
      )}
    </div>
  );
}
