"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-wrapper">
      <style dangerouslySetInnerHTML={{ __html: `
        .landing-wrapper {
          font-family: 'Inter', sans-serif;
          color: #1e293b;
          overflow-x: hidden;
          background: #fafafa;
        }

        /* --- Animations --- */
        .reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .delay-1 { transition-delay: 0.1s; }
        .delay-2 { transition-delay: 0.2s; }
        .delay-3 { transition-delay: 0.3s; }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        /* --- Hero Section --- */
        .hero-section {
          padding: 8rem 2rem 3rem;
          background: linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%);
          position: relative;
        }
        
        .hero-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 4rem;
          align-items: center;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.6);
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          color: #047857;
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .pill-dot { width: 6px; height: 6px; background: #10b981; border-radius: 50%; }

        .hero-content h1 {
          font-size: 4rem;
          font-weight: 800;
          line-height: 1.1;
          color: #064e3b;
          margin-bottom: 1.5rem;
        }
        .hero-content h1 span {
          color: #0f172a;
        }

        .hero-content p {
          font-size: 1.15rem;
          color: #475569;
          line-height: 1.6;
          max-width: 550px;
          margin-bottom: 2.5rem;
        }

        .hero-buttons {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .btn-shop {
          background: #10b981;
          color: white;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.1rem;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 14px 0 rgba(16, 185, 129, 0.39);
          transition: transform 0.2s;
        }
        .btn-shop:hover { transform: translateY(-2px); }

        .btn-seller {
          background: white;
          color: #0f172a;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.1rem;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s;
        }
        .btn-seller:hover { transform: translateY(-2px); }

        .mini-stats {
          display: flex;
          gap: 3rem;
        }
        .ms-item { display: flex; align-items: flex-start; gap: 0.5rem; }
        .ms-icon { font-size: 1.25rem; }
        .ms-val { font-weight: 800; color: #0f172a; font-size: 1.1rem; }
        .ms-label { color: #64748b; font-size: 0.85rem; font-weight: 500; }

        .hero-image-wrapper {
          position: relative;
        }
        .hero-img {
          width: 100%;
          border-radius: 24px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .hero-glass-card {
          position: absolute;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          padding: 1rem 1.25rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          animation: float 4s ease-in-out infinite;
        }
        .hgc-1 { top: 10%; left: -8%; }
        .hgc-2 { bottom: 15%; left: 5%; animation-delay: 1.5s; top: auto; }
        .hgc-3 { bottom: 10%; right: -5%; animation-delay: 0.7s; top: auto; }

        .hgc-icon {
          width: 32px; height: 32px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
        }
        .i-green { background: #dcfce7; color: #16a34a; }
        .i-yellow { background: #fef9c3; color: #ca8a04; }
        .i-red { background: #fee2e2; color: #dc2626; }

        .hgc-title { font-weight: 700; color: #0f172a; font-size: 0.9rem; }
        .hgc-sub { color: #64748b; font-size: 0.75rem; font-weight: 500; }

        /* --- Trust Bar --- */
        .trust-bar-wrapper {
          background: linear-gradient(180deg, #e0f2fe 0%, #fafafa 100%);
          padding: 2rem 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .trust-bar {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          padding: 0 2rem;
          overflow-x: auto;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #475569;
          font-size: 0.95rem;
          white-space: nowrap;
        }

        /* --- Common Section Styling --- */
        .section-tag {
          color: #10b981;
          font-weight: 800;
          font-size: 0.85rem;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
        }
        .section-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #0f172a;
          text-align: center;
          margin-bottom: 1rem;
        }
        .section-subtitle {
          text-align: center;
          color: #64748b;
          font-size: 1.1rem;
          max-width: 700px;
          margin: 0 auto 3rem;
          line-height: 1.6;
        }

        /* --- Categories --- */
        .categories-sec {
          padding: 6rem 2rem;
        }
        .cat-scroll {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          padding-bottom: 2rem;
        }
        .cat-card {
          min-width: 200px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 2rem 1.5rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .cat-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
          transform: translateY(-5px);
        }
        .cat-icon-wrap {
          width: 60px; height: 60px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.8rem;
          margin: 0 auto 1.5rem;
        }
        .ci-veg { background: #dcfce7; }
        .ci-fruit { background: #ffedd5; }
        .ci-grain { background: #fef9c3; }
        .ci-dairy { background: #e0f2fe; }
        .ci-herb { background: #f3e8ff; }
        .ci-pulse { background: #ffe4e6; }
        
        .cat-card h3 { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin-bottom: 0.25rem; }
        .cat-card p { color: #64748b; font-size: 0.85rem; }

        /* --- Why Farm Connect --- */
        .why-sec {
          padding: 6rem 2rem;
          background: #f8fafc;
        }
        .benefits-grid {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .b-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }
        .b-card.large {
          grid-row: span 2;
          background: linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%);
          border: none;
        }
        .b-icon-top {
          width: 45px; height: 45px;
          background: #f1f5f9;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .b-card h3 { font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem; }
        .b-card p { color: #475569; font-size: 0.95rem; line-height: 1.6; }

        .b-card.large h3 { font-size: 1.5rem; margin-top: 1rem; color: #064e3b; }
        .b-card.large p { color: #065f46; }

        .large-checks {
          margin-top: 1.5rem;
          display: flex; gap: 1rem;
        }
        .l-check { font-size: 0.85rem; font-weight: 700; color: #047857; display: flex; align-items: center; gap: 0.25rem; }
        
        .big-corn {
          position: absolute;
          bottom: -20px; right: -20px;
          font-size: 9rem;
          opacity: 0.9;
          transform: rotate(-15deg);
        }

        @media (max-width: 1024px) {
          .hero-container { grid-template-columns: 1fr; }
          .hero-content { text-align: center; }
          .hero-content p { margin-left: auto; margin-right: auto; }
          .hero-buttons { justify-content: center; }
          .mini-stats { justify-content: center; }
          .benefits-grid { grid-template-columns: 1fr; }
          .b-card.large { grid-row: auto; }
        }

        /* --- Simple Process --- */
        .process-sec {
          padding: 6rem 2rem;
          background: #fafafa;
        }
        .process-steps {
          max-width: 1200px;
          margin: 4rem auto 0;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          position: relative;
        }
        .process-steps::before {
          content: '';
          position: absolute;
          top: 40px;
          left: 10%;
          right: 10%;
          height: 2px;
          background: repeating-linear-gradient(90deg, #dcfce7, #dcfce7 10px, transparent 10px, transparent 20px);
          z-index: 1;
        }
        .step-col {
          text-align: center;
          position: relative;
          z-index: 2;
        }
        .step-icon-wrap {
          width: 80px; height: 80px;
          background: #f8fafc;
          border: 4px solid white;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem;
          margin: 0 auto 1.5rem;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          position: relative;
        }
        .step-num {
          position: absolute;
          top: -5px; right: -5px;
          background: #10b981; color: white;
          width: 24px; height: 24px;
          border-radius: 50%;
          font-size: 0.8rem; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid white;
        }
        .step-col h3 { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem; }
        .step-col p { color: #64748b; font-size: 0.9rem; line-height: 1.5; }

        /* --- Why Farm Connect Wins (Table) --- */
        .wins-sec { padding: 6rem 2rem; background: #fafafa; }
        .wins-table-wrap {
          max-width: 900px;
          margin: 3rem auto 0;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
          overflow: hidden;
        }
        .w-row { display: grid; grid-template-columns: 1fr 1fr 1fr; border-bottom: 1px solid #f1f5f9; }
        .w-row:last-child { border-bottom: none; }
        .w-header { font-weight: 800; color: #64748b; font-size: 0.85rem; letter-spacing: 0.05em; padding: 1.5rem; text-transform: uppercase; }
        .w-header.green { background: #166534; color: white; border-radius: 0 16px 0 0; display: flex; align-items: center; gap: 0.5rem; }
        .w-col { padding: 1.25rem 1.5rem; display: flex; align-items: center; font-size: 0.95rem; color: #475569; font-weight: 600; }
        .w-col.title { color: #0f172a; font-weight: 700; }
        .w-col.trad { color: #64748b; }
        .w-col.fc { background: #f0fdf4; color: #064e3b; font-weight: 700; }
        .x-mark { color: #ef4444; margin-right: 0.5rem; font-weight: bold; }
        .c-mark { color: #10b981; margin-right: 0.5rem; font-weight: bold; }

        /* --- Stats Banner --- */
        .stats-banner {
          background: #064e3b;
          padding: 5rem 2rem;
          text-align: center;
        }
        .sb-grid {
          max-width: 1200px;
          margin: 0 auto 3rem;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .sb-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2.5rem 2rem;
        }
        .sb-icon { font-size: 2rem; margin-bottom: 1rem; }
        .sb-num { font-size: 3.5rem; font-weight: 900; color: white; margin-bottom: 0.5rem; display: flex; justify-content: center; }
        .sb-num span { color: #34d399; }
        .sb-label { color: #a7f3d0; font-weight: 600; font-size: 0.95rem; }
        .sb-footer { color: #dcfce7; font-weight: 500; font-size: 0.95rem; }

        /* --- Testimonials --- */
        .testimo-sec { padding: 6rem 2rem; background: #fafafa; }
        .tm-grid { max-width: 1200px; margin: 3rem auto 0; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .tm-card {
           background: white; border: 1px solid #e2e8f0; border-radius: 24px; padding: 2.5rem; position: relative;
        }
        .tm-badge {
           display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.8rem;
           background: #f0fdf4; color: #059669; font-size: 0.8rem; font-weight: 700; border-radius: 20px;
           margin-bottom: 1.5rem;
        }
        .tm-quote-icon { position: absolute; top: 2.5rem; right: 2.5rem; font-size: 4rem; color: #f1f5f9; font-family: serif; line-height: 1; }
        .tm-stars { color: #f59e0b; font-size: 1.2rem; margin-bottom: 1rem; letter-spacing: 2px; }
        .tm-text { color: #475569; font-size: 1.05rem; line-height: 1.7; margin-bottom: 2rem; font-weight: 500; }
        .tm-author { display: flex; align-items: center; gap: 1rem; }
        .tm-avatar { width: 48px; height: 48px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
        .tm-name { font-weight: 800; color: #0f172a; margin-bottom: 0.1rem; }
        .tm-role { font-size: 0.85rem; color: #64748b; font-weight: 500; }

        /* --- Newsletter --- */
        .nl-sec { padding: 6rem 2rem; background: #fafafa; border-top: 1px solid #f1f5f9; }
        .nl-box { max-width: 800px; margin: 0 auto; text-align: center; }
        .nl-icon {
           width: 80px; height: 80px; background: #10b981; border-radius: 24px;
           display: flex; align-items: center; justify-content: center; font-size: 2.5rem;
           margin: 0 auto 2rem; box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.4);
        }
        .nl-title { font-size: 2.5rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem; }
        .nl-sub { color: #64748b; font-size: 1.1rem; line-height: 1.6; margin-bottom: 2.5rem; max-width: 600px; margin-left: auto; margin-right: auto; }
        .nl-form { display: flex; gap: 1rem; max-width: 500px; margin: 0 auto 1.5rem; }
        .nl-input { flex: 1; padding: 1rem 1.5rem; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 1rem; font-family: Inter, sans-serif; outline: none; transition: border 0.2s; }
        .nl-input:focus { border-color: #10b981; }
        .nl-btn { background: #166534; color: white; padding: 0 1.5rem; border-radius: 12px; font-weight: 700; border: none; cursor: pointer; transition: background 0.2s; white-space: nowrap; }
        .nl-btn:hover { background: #14532d; }
        .nl-footer { color: #64748b; font-size: 0.85rem; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 0.4rem; }

        @media (max-width: 1024px) {
          .process-steps { grid-template-columns: 1fr; gap: 3rem; }
          .process-steps::before { display: none; }
          .sb-grid, .tm-grid { grid-template-columns: 1fr; }
          .nl-form { flex-direction: column; }
          .nl-btn { padding: 1rem; }
        }
      `}} />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content reveal">
            <div className="pill">
              <div className="pill-dot"></div> Now Live in 12 States Across India
            </div>
            <h1>Farm Fresh,<br/>Straight to Your <span>Door</span></h1>
            <p>We connect verified local farmers directly with conscious consumers — cutting out middlemen, ensuring fair prices, and delivering the freshest produce right to your doorstep.</p>
            
            <div className="hero-buttons">
              <button className="btn-shop" onClick={() => router.push('/marketplace')}>
                🛒 Shop Fresh Produce
              </button>
              <button className="btn-seller" onClick={() => router.push('/register')}>
                👨‍🌾 Become a Seller
              </button>
            </div>

            <div className="mini-stats">
              <div className="ms-item">
                <div className="ms-icon">🌽</div>
                <div>
                  <div className="ms-val">5,000+</div>
                  <div className="ms-label">Verified Farmers</div>
                </div>
              </div>
              <div className="ms-item">
                <div className="ms-icon">👥</div>
                <div>
                  <div className="ms-val">50K+</div>
                  <div className="ms-label">Happy Customers</div>
                </div>
              </div>
              <div className="ms-item">
                <div className="ms-icon">📦</div>
                <div>
                  <div className="ms-val">30%</div>
                  <div className="ms-label">Better Prices</div>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-image-wrapper reveal delay-2">
            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200" alt="Fresh Produce Market" className="hero-img" />
            
            <div className="hero-glass-card hgc-1">
              <div className="hgc-icon i-green">✔️</div>
              <div>
                <div className="hgc-title">100% Verified Farmers</div>
                <div className="hgc-sub">KYC & Quality Checked</div>
              </div>
            </div>

            <div className="hero-glass-card hgc-2">
              <div className="hgc-icon i-yellow">⭐</div>
              <div>
                <div className="hgc-title">4.9 / 5 Rating</div>
                <div className="hgc-sub">From 12,000+ reviews</div>
              </div>
            </div>

            <div className="hero-glass-card hgc-3">
              <div className="hgc-icon i-red">🚀</div>
              <div>
                <div className="hgc-title">Same-Day Dispatch</div>
                <div className="hgc-sub">Harvest to delivery</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="trust-bar-wrapper text-center">
        <div className="trust-bar reveal delay-3">
          <div className="trust-item">📍 12 States Covered</div>
          <div className="trust-item">⭐ 4.9 Average Rating</div>
          <div className="trust-item">🍃 No Middlemen</div>
          <div className="trust-item">🥦 Farm-Fresh Produce</div>
          <div className="trust-item">🚚 Fast Delivery</div>
          <div className="trust-item">💰 Fair Prices</div>
        </div>
      </div>

      {/* Categories */}
      <section className="categories-sec">
        <div className="section-tag reveal">✦ BROWSE BY CATEGORY</div>
        <h2 className="section-title reveal delay-1">What Would You Like Today?</h2>
        <p className="section-subtitle reveal delay-1">From farm-fresh vegetables and seasonal fruits to organic dairy and artisan spices — all delivered directly from the source.</p>

        <div className="cat-scroll reveal delay-2">
          <div className="cat-card" onClick={() => router.push('/marketplace?category=vegetables')}>
            <div className="cat-icon-wrap ci-veg">🥬</div>
            <h3>Vegetables</h3>
            <p>240+ Products</p>
          </div>
          <div className="cat-card" onClick={() => router.push('/marketplace?category=fruits')}>
            <div className="cat-icon-wrap ci-fruit">🍎</div>
            <h3>Fruits</h3>
            <p>180+ Products</p>
          </div>
          <div className="cat-card" onClick={() => router.push('/marketplace?category=grains')}>
            <div className="cat-icon-wrap ci-grain">🌾</div>
            <h3>Grains & Cereals</h3>
            <p>95+ Products</p>
          </div>
          <div className="cat-card" onClick={() => router.push('/marketplace?category=dairy')}>
            <div className="cat-icon-wrap ci-dairy">🥛</div>
            <h3>Dairy & Eggs</h3>
            <p>60+ Products</p>
          </div>
          <div className="cat-card" onClick={() => router.push('/marketplace?category=spices')}>
            <div className="cat-icon-wrap ci-herb">🌿</div>
            <h3>Herbs & Spices</h3>
            <p>120+ Products</p>
          </div>
          <div className="cat-card" onClick={() => router.push('/marketplace?category=pulses')}>
            <div className="cat-icon-wrap ci-pulse">🫘</div>
            <h3>Pulses & Legumes</h3>
            <p>80+ Products</p>
          </div>
        </div>
      </section>

      {/* Why Farm Connect */}
      <section className="why-sec">
        <div className="section-tag reveal">✦ WHY FARM CONNECT</div>
        <h2 className="section-title reveal delay-1">Built for Farmers. Loved by<br/>Consumers.</h2>
        <p className="section-subtitle reveal delay-1">We've reimagined how India buys and sells fresh produce — making every transaction transparent, fair, and delightfully simple.</p>

        <div className="benefits-grid">
          <div className="b-card large reveal delay-2">
            <div className="b-icon-top" style={{background: 'rgba(255,255,255,0.8)'}}>🌾</div>
            <h3>Direct Farmer Connection</h3>
            <p>Browse authentic produce listed directly by verified farmers across India. Every product comes with full farmer details, farm location, and harvest date — so you always know your food's story.</p>
            <div className="large-checks">
              <div className="l-check">✔️ Verified Sellers</div>
              <div className="l-check">📍 Farm Location</div>
            </div>
            <div className="big-corn">🌽</div>
          </div>

          <div className="b-card reveal delay-2">
            <div className="b-icon-top" style={{background: '#ffedd5', color: '#ea580c'}}>💰</div>
            <h3>Fair & Transparent Pricing</h3>
            <p>Farmers set their own prices directly. No hidden commissions, no inflated retail markups. You pay what's fair, the farmer earns what they deserve.</p>
          </div>

          <div className="b-card reveal delay-3">
            <div className="b-icon-top" style={{background: '#e0f2fe', color: '#0284c7'}}>🚚</div>
            <h3>Same-Day Fresh Delivery</h3>
            <p>Harvested, packed, and dispatched on the same day. Your produce arrives within 24-48 hours — fresher than anything on a supermarket shelf.</p>
          </div>

          <div className="b-card reveal delay-3">
            <div className="b-icon-top" style={{background: '#fef9c3', color: '#ca8a04'}}>🔒</div>
            <h3>Secure & Easy Payments</h3>
            <p>Pay with UPI, cards, net banking, or wallets. Every transaction is encrypted end-to-end. Your money, your data — always secure.</p>
          </div>

          <div className="b-card reveal delay-4">
            <div className="b-icon-top" style={{background: '#f3e8ff', color: '#9333ea'}}>📊</div>
            <h3>Farmer Analytics Dashboard</h3>
            <p>Sellers get a powerful dashboard to track orders, manage inventory, analyze revenue, and understand customer trends in real-time.</p>
          </div>

          <div className="b-card reveal delay-4">
            <div className="b-icon-top" style={{background: '#dcfce7', color: '#16a34a'}}>💚</div>
            <h3>Sustainability First</h3>
            <p>Every purchase supports local agriculture, reduces food miles, and empowers small-scale farmers to build dignified livelihoods.</p>
          </div>
        </div>
      </section>

      {/* Simple Process */}
      <section className="process-sec">
        <div className="section-tag reveal">✦ SIMPLE PROCESS</div>
        <h2 className="section-title reveal delay-1">Farm to Table in 4 Easy Steps</h2>
        <p className="section-subtitle reveal delay-1">Getting the freshest produce delivered to your home has never been this simple.</p>

        <div className="process-steps reveal delay-2">
          <div className="step-col">
            <div className="step-icon-wrap">
              🧑‍🌾
              <div className="step-num">1</div>
            </div>
            <h3>Farmers List Produce</h3>
            <p>Verified farmers upload harvests with price, quantity, farm location, and freshness dates.</p>
          </div>
          <div className="step-col">
            <div className="step-icon-wrap">
              🔍
              <div className="step-num">2</div>
            </div>
            <h3>Customers Browse</h3>
            <p>Explore a curated marketplace with smart filters for category, location, organic, and budget.</p>
          </div>
          <div className="step-col">
            <div className="step-icon-wrap">
              🛒
              <div className="step-num">3</div>
            </div>
            <h3>Place Your Order</h3>
            <p>Add to cart, choose delivery slot, and pay securely via UPI, card, or wallet in seconds.</p>
          </div>
          <div className="step-col">
            <div className="step-icon-wrap">
              🚚
              <div className="step-num">4</div>
            </div>
            <h3>Fresh to Your Door</h3>
            <p>Harvested, packed, and dispatched the same day — delivered fresh within 24–48 hours.</p>
          </div>
        </div>
      </section>

      {/* Why Farm Connect Wins */}
      <section className="wins-sec">
        <h2 className="section-title reveal">Why Farm Connect Wins</h2>
        <p className="section-subtitle reveal delay-1">See how our direct farm-to-table model stacks up against traditional grocery supply chains.</p>

        <div className="wins-table-wrap reveal delay-2">
          <div className="w-row">
            <div className="w-header">FEATURE</div>
            <div className="w-header">TRADITIONAL MARKET</div>
            <div className="w-header green">⚡ FARM CONNECT</div>
          </div>
          <div className="w-row">
            <div className="w-col title">Middlemen Cut</div>
            <div className="w-col trad"><span className="x-mark">❌</span> 2-3 layers</div>
            <div className="w-col fc"><span className="c-mark">✅</span> Zero</div>
          </div>
          <div className="w-row">
            <div className="w-col title">Price Transparency</div>
            <div className="w-col trad"><span className="x-mark">❌</span> Hidden markups</div>
            <div className="w-col fc"><span className="c-mark">✅</span> Farmer-set prices</div>
          </div>
          <div className="w-row">
            <div className="w-col title">Freshness</div>
            <div className="w-col trad"><span className="x-mark">❌</span> 3-7 days old</div>
            <div className="w-col fc"><span className="c-mark">✅</span> Same-day harvest</div>
          </div>
          <div className="w-row">
            <div className="w-col title">Farmer Income</div>
            <div className="w-col trad"><span className="x-mark">❌</span> 30% of retail</div>
            <div className="w-col fc"><span className="c-mark">✅</span> 70%+ of retail</div>
          </div>
          <div className="w-row">
            <div className="w-col title">Traceability</div>
            <div className="w-col trad"><span className="x-mark">❌</span> Unknown source</div>
            <div className="w-col fc"><span className="c-mark">✅</span> Farm-to-table trail</div>
          </div>
          <div className="w-row">
            <div className="w-col title">Support Local</div>
            <div className="w-col trad"><span className="x-mark">❌</span> Corporate chain</div>
            <div className="w-col fc"><span className="c-mark">✅</span> 5,000+ families</div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="stats-banner">
        <div className="sb-grid reveal">
          <div className="sb-card">
            <div className="sb-icon">🌿</div>
            <div className="sb-num">5.0<span>K+</span></div>
            <div className="sb-label">Verified Farmers Enrolled</div>
          </div>
          <div className="sb-card">
            <div className="sb-icon">👨‍👩‍👧‍👦</div>
            <div className="sb-num">50.0<span>K+</span></div>
            <div className="sb-label">Happy Customers Served</div>
          </div>
          <div className="sb-card">
            <div className="sb-icon">📦</div>
            <div className="sb-num">120<span>K+</span></div>
            <div className="sb-label">Orders Delivered Fresh</div>
          </div>
        </div>
        <div className="sb-footer reveal delay-1">🍃 Trusted by families across 12 states in India since 2024</div>
      </section>

      {/* Testimonials */}
      <section className="testimo-sec">
        <div className="section-tag reveal">✦ REAL STORIES</div>
        <h2 className="section-title reveal delay-1">Loved by Farmers & Families</h2>
        <p className="section-subtitle reveal delay-1">Don't take our word for it — hear from the people who've experienced the Farm Connect difference firsthand.</p>
        
        <div className="tm-grid reveal delay-2">
          <div className="tm-card">
            <div className="tm-quote-icon">”</div>
            <div className="tm-badge">📈 35% more income</div>
            <div className="tm-stars">★★★★★</div>
            <p className="tm-text">Farm Connect changed everything for my family. I now earn 35% more since I list my produce directly. No more depending on local traders who underpay.</p>
            <div className="tm-author">
              <div className="tm-avatar">👨‍🌾</div>
              <div>
                <div className="tm-name">Ramesh Patel</div>
                <div className="tm-role">Wheat & Maize Farmer, Gujarat</div>
              </div>
            </div>
          </div>

          <div className="tm-card">
            <div className="tm-quote-icon">”</div>
            <div className="tm-badge" style={{color: '#16a34a'}}>🍃 10x fresher</div>
            <div className="tm-stars">★★★★★</div>
            <p className="tm-text">The freshness is unbelievable. I ordered vegetables on Monday and they arrived Tuesday morning, straight from the farm. The quality is 10x better than supermarkets.</p>
            <div className="tm-author">
              <div className="tm-avatar">👩</div>
              <div>
                <div className="tm-name">Priya Sharma</div>
                <div className="tm-role">Customer, Pune</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="nl-sec">
        <div className="nl-box reveal">
          <div className="nl-icon">🌱</div>
          <h2 className="nl-title">Get Fresh Deals in Your Inbox</h2>
          <p className="nl-sub">Sign up for our weekly harvest newsletter — seasonal picks, farmer stories, exclusive discounts, and farm-fresh recipes delivered weekly.</p>
          <form className="nl-form" onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing!"); }}>
            <input type="email" placeholder="Enter your email address..." className="nl-input" required />
            <button type="submit" className="nl-btn">Subscribe Free →</button>
          </form>
          <div className="nl-footer">🔒 Zero spam. Unsubscribe at any time.</div>
        </div>
      </section>

    </div>
  );
}
