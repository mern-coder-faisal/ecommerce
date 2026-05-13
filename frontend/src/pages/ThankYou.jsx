import { Link, useLocation } from 'react-router-dom';

export default function ThankYou() {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div style={{ padding: '120px 0 100px' }}>
      <div className="container" style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'rgba(67,217,173,0.12)', border: '1px solid rgba(67,217,173,0.25)', borderRadius: 999, padding: '12px 20px', marginBottom: 24 }}>
          <span style={{ color: 'var(--accent3)', fontWeight: 700 }}>Order submitted</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 42, marginBottom: 18 }}>Thank you for your purchase!</h1>
        <p style={{ color: 'var(--text2)', fontSize: 17, marginBottom: 28 }}>Your order {order ? `#${order._id}` : 'has been received'} and is being prepared. You can continue browsing products or visit your dashboard.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <Link to="/" style={{ padding: '14px 24px', borderRadius: 14, background: 'var(--accent)', color: '#fff', fontWeight: 700 }}>Back to store</Link>
          <Link to="/cart" style={{ padding: '14px 24px', borderRadius: 14, border: '1px solid var(--border)', color: 'var(--text)', background: 'var(--surface)' }}>View cart</Link>
        </div>
      </div>
    </div>
  );
}
