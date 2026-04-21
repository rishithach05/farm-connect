export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: 600 }}>
        <div style={{ fontSize: '8rem', marginBottom: '1rem', animation: 'bounce 2s infinite' }}>🌾</div>
        <h1 style={{ fontSize: '8rem', fontWeight: 900, color: '#10b981', lineHeight: 1, margin: '0 0 1rem' }}>404</h1>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Page Not Found</h2>
        <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
          Looks like this page wandered off into the fields. Let's get you back to the harvest!
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/" style={{ background: '#10b981', color: 'white', padding: '0.9rem 2rem', borderRadius: 12, fontWeight: 700, textDecoration: 'none', fontSize: '1rem', boxShadow: '0 10px 15px -3px rgba(16,185,129,0.3)' }}>
            🏠 Go Home
          </a>
          <a href="/marketplace" style={{ background: 'white', color: '#047857', padding: '0.9rem 2rem', borderRadius: 12, fontWeight: 700, textDecoration: 'none', fontSize: '1rem', border: '2px solid #a7f3d0' }}>
            🛍️ Browse Market
          </a>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }` }} />
      </div>
    </div>
  );
}
