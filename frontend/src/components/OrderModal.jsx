import { useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OrderModal({ product, open, onClose }) {
  const { addItem, clearCart } = useCart();
  const { addToast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'Cash on Delivery',
    deliveryCharge: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const total = product.price + Number(form.deliveryCharge || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.customerName || !form.email || !form.phone || !form.address) {
      return setError('Please complete billing details.');
    }
    setLoading(true);
    try {
      const response = await api.createOrder({
        customerName: form.customerName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        paymentMethod: form.paymentMethod,
        deliveryCharge: Number(form.deliveryCharge),
        products: [{ product: product._id, name: product.name, quantity: 1, price: product.price }],
        total,
      });
      
      // Auto-create account and login
      if (response.token && response.user) {
        login(response.token, response.user);
      }
      
      addToast('Order placed successfully! Redirecting to your account...', 'success');
      clearCart();
      onClose();
      
      // Redirect to account page instead of thank you
      setTimeout(() => {
        navigate('/account', { state: { order: response.order, newCustomer: true } });
      }, 500);
    } catch (err) {
      setError(err.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 950, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,0.55)', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 760, borderRadius: 28, background: 'var(--bg)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 32px 96px rgba(0,0,0,0.35)' }}>
        <div style={{ padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, marginBottom: 6 }}>Quick checkout</h2>
            <p style={{ color: 'var(--text2)', fontSize: 14 }}>Complete your order without leaving the page.</p>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text2)' }}><X size={20} /></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, minHeight: 420 }}>
          <div style={{ padding: 24, borderRight: '1px solid var(--border)', display: 'grid', gap: 18 }}>
            <div style={{ display: 'grid', gap: 12 }}>
              <img src={product.image} alt={product.name} style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 22 }} />
              <div>
                <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 6 }}>Product</p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22 }}>{product.name}</h3>
                <p style={{ color: 'var(--text2)', fontSize: 14, marginTop: 8 }}>{product.category}</p>
              </div>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text2)' }}><span>Price</span><strong>${product.price.toFixed(2)}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text2)' }}><span>Delivery</span><strong>${Number(form.deliveryCharge || 0).toFixed(2)}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontWeight: 800 }}><span>Total</span><strong>${total.toFixed(2)}</strong></div>
            </div>
          </div>
          <form onSubmit={handleSubmit} style={{ padding: 24, display: 'grid', gap: 16 }}>
            <label style={labelStyle}>
              Full name
              <input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} type="text" placeholder="Your name" style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Email address
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="you@example.com" style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Phone number
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} type="tel" placeholder="01XXXXXXXXX" style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Delivery address
              <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={3} placeholder="Street, city, ZIP" style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Payment method
              <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} style={inputStyle}>
                <option>Cash on Delivery</option>
                <option>Credit Card</option>
                <option>Mobile Wallet</option>
              </select>
            </label>
            <label style={labelStyle}>
              Delivery charge
              <select value={form.deliveryCharge} onChange={(e) => setForm({ ...form, deliveryCharge: Number(e.target.value) })} style={inputStyle}>
                <option value={0}>Standard - $0</option>
                <option value={12}>Express - $12</option>
                <option value={24}>Next-day - $24</option>
              </select>
            </label>
            {error && <div style={{ color: '#ffbaba', background: 'rgba(255,107,107,0.12)', borderRadius: 14, padding: 12 }}>{error}</div>}
            <button type="submit" disabled={loading} style={{ marginTop: 12, padding: '14px 22px', borderRadius: 16, background: 'linear-gradient(135deg, var(--accent), var(--accent2))', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{loading ? 'Placing order…' : 'Place order'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: 'grid', gap: 8, fontSize: 13, color: 'var(--text2)' };
const inputStyle = { width: '100%', padding: '14px 16px', borderRadius: 14, border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--text)', outline: 'none', fontSize: 14 };
