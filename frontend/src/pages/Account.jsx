import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

export default function Account() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.customerOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div style={{ padding: '100px 0 80px' }}>
      <div className="container" style={{ maxWidth: 1024 }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 10 }}>Customer Dashboard</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36 }}>Welcome back, {user?.name || 'customer'}</h1>
          <p style={{ color: 'var(--text2)' }}>Your orders and account details are all in one place.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 36 }}>
          <div style={{ padding: 24, borderRadius: 24, background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 18 }}>Profile</h2>
            <p style={{ color: 'var(--text2)', marginBottom: 12 }}><strong>Name:</strong> {user?.name}</p>
            <p style={{ color: 'var(--text2)', marginBottom: 12 }}><strong>Email:</strong> {user?.email}</p>
            <p style={{ color: 'var(--text2)' }}><strong>Role:</strong> {user?.role}</p>
          </div>
          <div style={{ padding: 24, borderRadius: 24, background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 18 }}>Orders</h2>
            <p style={{ color: 'var(--text2)' }}>{loading ? 'Loading orders…' : `${orders.length} orders found`}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 18 }}>
          {loading && <div style={{ color: 'var(--text2)' }}>Loading...</div>}
          {!loading && orders.length === 0 && <div style={{ color: 'var(--text2)' }}>No orders found yet.</div>}
          {orders.map((order) => (
            <div key={order._id} style={{ padding: 24, borderRadius: 24, background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h3 
                    onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, cursor: 'pointer', color: 'var(--accent)', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--text)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--accent)'}
                  >
                    Order #{order._id.slice(-6)}
                  </h3>
                  <p style={{ color: 'var(--text2)', fontSize: 14 }}>Placed on {new Date(order.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div style={{ display: 'inline-flex', padding: '8px 14px', borderRadius: 999, background: 'var(--bg2)', color: 'var(--text2)', fontWeight: 700 }}>{order.status}</div>
              </div>
              <div style={{ display: 'grid', gap: 12, marginTop: 18 }}>
                {order.products.map((product) => (
                  <div key={product.product} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text2)' }}>
                    <span>{product.name} × {product.quantity}</span>
                    <span>${(product.price * product.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && selectedOrder && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 20
        }}>
          <div style={{
            background: 'var(--bg)', borderRadius: 24, width: '100%', maxWidth: 600,
            border: '1px solid var(--border)', overflow: 'hidden',
            boxShadow: '0 24px 80px rgba(0,0,0,0.6)'
          }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg2)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20 }}>Order Details</h3>
              <button onClick={() => { setShowModal(false); setSelectedOrder(null); }} style={{ fontSize: 24, cursor: 'pointer', background: 'none', border: 'none', color: 'var(--text2)' }}>×</button>
            </div>
            <div style={{ padding: 32, display: 'grid', gap: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 4 }}>Order ID</p>
                  <p style={{ fontWeight: 600, fontFamily: 'monospace' }}>{selectedOrder._id}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 4 }}>Date</p>
                  <p style={{ fontWeight: 600 }}>{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 4 }}>Status</p>
                  <span style={{ padding: '4px 10px', borderRadius: 999, background: 'var(--bg2)', fontSize: 13, fontWeight: 700 }}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 4 }}>Total</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--accent)' }}>${selectedOrder.total.toFixed(2)}</p>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24 }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16 }}>Shipping Details</h4>
                <div style={{ background: 'var(--surface)', padding: 16, borderRadius: 12, border: '1px solid var(--border)' }}>
                  <p style={{ fontWeight: 600, marginBottom: 4 }}>{selectedOrder.customerName}</p>
                  <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 4 }}>{selectedOrder.email} • {selectedOrder.phone}</p>
                  <p style={{ color: 'var(--text2)', fontSize: 14 }}>{selectedOrder.address}</p>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24 }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16 }}>Items</h4>
                <div style={{ display: 'grid', gap: 12 }}>
                  {selectedOrder.products.map(p => (
                    <div key={p.product} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border)' }}>
                      <div>
                        <p style={{ fontWeight: 600 }}>{p.name}</p>
                        <p style={{ color: 'var(--text2)', fontSize: 13 }}>Qty: {p.quantity} × ${p.price}</p>
                      </div>
                      <span style={{ fontWeight: 700 }}>${(p.quantity * p.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
