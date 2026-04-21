import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Product from '@/lib/models/Product';
import Order from '@/lib/models/Order';

export default async function AdminDashboard() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) redirect('/login');

  let decoded;
  try { 
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'super-secret-fallback'); 
  } catch (err) { 
    redirect('/login'); 
  }

  // Temporarily allowing anyone to view Admin for demo purposes, 
  // normally we'd check if (decoded.role !== 'ADMIN') redirect('/');
  
  await connectDB();

  const [usersRaw, productsRaw, ordersRaw] = await Promise.all([
    User.find().sort({ createdAt: -1 }).limit(20).lean(),
    Product.find().populate('farmerId').sort({ createdAt: -1 }).limit(20).lean(),
    Order.find().populate('customerId').sort({ createdAt: -1 }).limit(20).lean(),
  ]);

  // Serialize Mongoose objects
  const users = usersRaw.map(u => ({
    id: u._id.toString(),
    name: u.name,
    email: u.email,
    role: u.role,
    location: u.location || '-',
    createdAt: u.createdAt
  }));

  const products = productsRaw.map(p => ({
    id: p._id.toString(),
    name: p.name,
    farmer: { name: p.farmerId?.name || 'Deleted Farmer' },
    category: p.category,
    quantity: p.quantity,
    unit: p.unit,
    price: p.price
  }));

  const orders = ordersRaw.map(o => ({
    id: o._id.toString(),
    customer: { name: o.customer?.name || o.customerId?.name || 'Unknown' },
    status: o.status,
    total: o.total
  }));

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', fontFamily: 'var(--font-inter)' }}>
      <style>{`
        .admin-title { font-size: 2.5rem; font-weight: 800; color: #1e293b; margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem; }
        .admin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .admin-panel { background: white; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: var(--shadow-sm); overflow: auto; max-height: 500px; }
        .panel-header { padding: 1.5rem; background: #f8fafc; border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; font-weight: 700; font-size: 1.25rem; color: #334155; display: flex; justify-content: space-between; align-items: center; }
        
        table { width: 100%; border-collapse: collapse; text-align: left; }
        th { padding: 1rem 1.5rem; font-size: 0.85rem; text-transform: uppercase; color: #64748b; border-bottom: 1px solid #e2e8f0; }
        td { padding: 1rem 1.5rem; border-bottom: 1px solid #f1f5f9; color: #334155; }
        
        .role-badge { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
        .role-FARMER { background: #dcfce7; color: #16a34a; }
        .role-CUSTOMER { background: #e0e7ff; color: #4338ca; }
        .role-ADMIN { background: #fef3c7; color: #d97706; }
        
        .btn-danger { background: #fee2e2; color: #dc2626; border: 1px solid #fecaca; padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .btn-danger:hover { background: #fecaca; }
        
        @media (max-width: 1024px) { .admin-grid { grid-template-columns: 1fr; } }
      `}</style>
      
      <h1 className="admin-title">🛡️ Admin Command Center</h1>

      <div className="admin-grid">
        {/* Users Panel */}
        <div className="admin-panel">
          <div className="panel-header">👥 Registered Users <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'normal' }}>Total: {users.length}</span></div>
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Location</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td style={{ fontSize: '0.9rem', color: '#64748b' }}>{u.email}</td>
                  <td><span className={`role-badge role-${u.role}`}>{u.role}</span></td>
                  <td>{u.location || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Global Orders Panel */}
        <div className="admin-panel">
          <div className="panel-header">📦 Global Orders Monitor <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'normal' }}>Recent 20</span></div>
          <table>
            <thead><tr><th>Order ID</th><th>Customer</th><th>Status</th><th>Total</th></tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#475569' }}>#{o.id.slice(0,6)}</td>
                  <td>{o.customer.name}</td>
                  <td>
                    <span style={{ padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                      {o.status}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: '#16a34a' }}>₹{o.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Product Inventory Panel */}
      <div className="admin-panel" style={{ marginTop: '2rem' }}>
        <div className="panel-header">🌾 Active Marketplace Inventory <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'normal' }}>Manage all listed crops</span></div>
        <table>
          <thead><tr><th>Product Name</th><th>Farmer</th><th>Category</th><th>Stock</th><th>Price</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td>👨‍🌾 {p.farmer.name}</td>
                <td><span style={{ textTransform: 'capitalize', color: '#64748b', fontSize: '0.9rem' }}>{p.category}</span></td>
                <td>
                  {p.quantity > 0 ? <span style={{ fontWeight: 600, color: '#334155' }}>{p.quantity} {p.unit}</span> : <span style={{ color: '#dc2626', fontWeight: 600 }}>Out of Stock</span>}
                </td>
                <td style={{ fontWeight: 700, color: '#16a34a' }}>₹{p.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
