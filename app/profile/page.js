"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', location: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(d => {
        if (d.profile) {
          setProfile(d.profile);
          setForm({ name: d.profile.name, phone: d.profile.phone || '', location: d.profile.location || '' });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setProfile({ ...profile, ...data.profile });
      setMsg('✅ Profile updated successfully!');
      setEditing(false);
      setTimeout(() => setMsg(''), 3000);
    } else {
      setMsg(data.error || 'Update failed');
    }
  };

  if (loading) return (
    <div style={{ maxWidth: 700, margin: '120px auto', padding: '0 1.5rem' }}>
      <div style={{ height: 300, background: 'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)', borderRadius: 20, animation: 'shimmer 1.5s infinite' }}></div>
      <style dangerouslySetInnerHTML={{ __html: `@keyframes shimmer{0%{background-position:-468px 0}100%{background-position:468px 0}}` }} />
    </div>
  );

  if (!profile) return (
    <div style={{ maxWidth: 500, margin: '10rem auto', textAlign: 'center', padding: '3rem', background: 'white', borderRadius: 20, boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔐</div>
      <h2 style={{ color: '#0f172a', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 800 }}>Login Required</h2>
      <button onClick={() => router.push('/login')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.9rem 2rem', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: '1rem', width: '100%' }}>Go to Login</button>
    </div>
  );

  const totalSpent = profile._count?.orders ? profile._count.orders * 250 : 0; // Approx

  return (
    <div style={{ maxWidth: 800, margin: '100px auto 4rem', padding: '0 1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .stat-card { background: white; padding: 1.5rem; border-radius: 16px; border: 1px solid #e2e8f0; text-align: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .input-f { width: 100%; padding: 0.9rem 1rem; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 1rem; font-family: Inter, sans-serif; transition: 0.2s; }
        .input-f:focus { border-color: #10b981; outline: none; box-shadow: 0 0 0 3px rgba(16,185,129,0.1); }
      `}} />

      {/* Profile Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: 24, padding: '2.5rem', marginBottom: '2rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, background: 'rgba(16,185,129,0.1)', borderRadius: '50%' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 900, color: 'white', flexShrink: 0 }}>
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0 0 0.25rem' }}>{profile.name}</h1>
            <p style={{ color: '#94a3b8', margin: 0 }}>{profile.email}</p>
            <span style={{ background: profile.role === 'FARMER' ? '#065f46' : '#1e3a5f', color: profile.role === 'FARMER' ? '#34d399' : '#60a5fa', padding: '0.25rem 0.75rem', borderRadius: 100, fontSize: '0.75rem', fontWeight: 700, marginTop: '0.5rem', display: 'inline-block' }}>
              {profile.role === 'FARMER' ? '👨‍🌾 Verified Farmer' : '🛍️ Customer'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { icon: '📦', val: profile._count?.orders || 0, label: 'Orders' },
          { icon: '❤️', val: profile._count?.wishlist || 0, label: 'Wishlist' },
          { icon: '⭐', val: profile._count?.reviews || 0, label: 'Reviews' },
          { icon: '🌾', val: profile._count?.products || 0, label: 'Products' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{s.icon}</div>
            <div style={{ fontWeight: 900, fontSize: '1.8rem', color: '#0f172a' }}>{s.val}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Profile Details Card */}
      <div style={{ background: 'white', borderRadius: 20, padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.3rem', margin: 0 }}>👤 Personal Information</h2>
          {!editing && (
            <button onClick={() => setEditing(true)} style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', padding: '0.6rem 1.25rem', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
              ✏️ Edit
            </button>
          )}
        </div>

        {msg && <div style={{ padding: '0.75rem 1rem', background: msg.startsWith('✅') ? '#ecfdf5' : '#fee2e2', color: msg.startsWith('✅') ? '#047857' : '#dc2626', borderRadius: 10, marginBottom: '1.5rem', fontWeight: 600 }}>{msg}</div>}

        {editing ? (
          <form onSubmit={saveProfile}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, color: '#475569', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Full Name</label>
                <input className="input-f" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, color: '#475569', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Phone</label>
                <input className="input-f" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXXXXXXX" />
              </div>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#475569', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Location</label>
              <input className="input-f" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="City, State" />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" disabled={saving} style={{ flex: 1, padding: '0.9rem', background: '#10b981', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
              <button type="button" onClick={() => setEditing(false)} style={{ padding: '0.9rem 1.5rem', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {[
              { label: '📛 Name', value: profile.name },
              { label: '📧 Email', value: profile.email },
              { label: '📞 Phone', value: profile.phone || 'Not set' },
              { label: '📍 Location', value: profile.location || 'Not set' },
              { label: '🎭 Role', value: profile.role },
              { label: '🗓️ Joined', value: new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) },
            ].map(f => (
              <div key={f.label} style={{ padding: '1rem', background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>{f.label}</div>
                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem' }}>{f.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
        {[
          { label: 'My Orders', icon: '📦', path: '/orders', color: '#3b82f6' },
          { label: 'My Wishlist', icon: '❤️', path: '/wishlist', color: '#e11d48' },
          { label: 'Browse Market', icon: '🛍️', path: '/marketplace', color: '#10b981' },
        ].map(action => (
          <button key={action.label} onClick={() => router.push(action.path)}
            style={{ background: 'white', border: `2px solid #e2e8f0`, padding: '1.25rem', borderRadius: 16, cursor: 'pointer', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: '0.2s', fontSize: '1rem' }}
            onMouseOver={e => e.currentTarget.style.borderColor = action.color}
            onMouseOut={e => e.currentTarget.style.borderColor = '#e2e8f0'}
          >
            <span style={{ fontSize: '1.5rem' }}>{action.icon}</span> {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
