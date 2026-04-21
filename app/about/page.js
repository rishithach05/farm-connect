export default function About() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", paddingTop: 80 }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .step-card { background: white; padding: 2rem; border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); text-align: center; transition: transform 0.3s; }
        .step-card:hover { transform: translateY(-8px); }
        .team-card { background: white; padding: 2rem; border-radius: 20px; border: 1px solid #e2e8f0; text-align: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .value-card { padding: 2rem; border-radius: 16px; border-left: 4px solid #10b981; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.04); }
      `}} />

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: 'white', padding: '6rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌾</div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.2 }}>
            About <span style={{ color: '#34d399' }}>Farm Connect</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#94a3b8', lineHeight: 1.7 }}>
            We are building India's most trusted farm-to-table marketplace, eliminating middlemen and ensuring farmers earn what they deserve while consumers get the freshest produce possible.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#f8fafc', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center' }}>
          {[
            { val: '5,000+', label: 'Verified Farmers', icon: '👨‍🌾' },
            { val: '50,000+', label: 'Happy Customers', icon: '😊' },
            { val: '30%', label: 'Higher Farmer Income', icon: '📈' },
            { val: '48hrs', label: 'Farm to Doorstep', icon: '🚚' },
          ].map(s => (
            <div key={s.label} style={{ padding: '2rem', background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#10b981' }}>{s.val}</div>
              <div style={{ color: '#64748b', fontWeight: 600, marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: '5rem 2rem', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', textAlign: 'center', marginBottom: '3rem' }}>Our Mission</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {[
            { icon: '🤝', title: 'Fair Trade', desc: 'Farmers earn 30-40% more by selling directly to consumers without middlemen taking a cut.' },
            { icon: '🌱', title: 'Organic First', desc: 'We prioritize organic and sustainably grown produce from farms that care about the environment.' },
            { icon: '🔬', title: 'Quality Verified', desc: 'Every farmer on our platform is verified and their produce is tested for quality standards.' },
            { icon: '💡', title: 'Tech Enabled', desc: 'AI-powered recommendations, voice search, and live order tracking powered by modern technology.' },
          ].map(v => (
            <div key={v.title} className="value-card">
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{v.icon}</div>
              <h3 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', fontSize: '1.2rem' }}>{v.title}</h3>
              <p style={{ color: '#64748b', lineHeight: 1.6, margin: 0 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ background: '#f8fafc', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', textAlign: 'center', marginBottom: '3rem' }}>How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
            {[
              { step: '01', icon: '🔍', title: 'Browse', desc: 'Explore fresh produce from verified local farmers using AI-powered filters.' },
              { step: '02', icon: '🛒', title: 'Order', desc: 'Add items to cart and checkout with multiple payment options.' },
              { step: '03', icon: '👨‍🌾', title: 'Farmers Pack', desc: 'Your assigned farmer personally packs your fresh order.' },
              { step: '04', icon: '🚚', title: 'Delivered', desc: 'Track your order live and receive farm-fresh produce at your door.' },
            ].map(s => (
              <div key={s.step} className="step-card">
                <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '0.85rem', margin: '0 auto 1rem' }}>{s.step}</div>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{s.icon}</div>
                <h3 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>{s.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #10b981, #059669)', padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: '1rem' }}>Ready to Shop Fresh?</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', marginBottom: '2rem' }}>Join thousands of families already enjoying farm-direct produce.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href="/marketplace" style={{ background: 'white', color: '#047857', padding: '0.9rem 2rem', borderRadius: 12, fontWeight: 800, textDecoration: 'none', fontSize: '1rem' }}>🛍️ Shop Now</a>
            <a href="/register" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '0.9rem 2rem', borderRadius: 12, fontWeight: 800, textDecoration: 'none', fontSize: '1rem', border: '2px solid rgba(255,255,255,0.4)' }}>👨‍🌾 Become a Farmer</a>
          </div>
        </div>
      </section>
    </div>
  );
}
