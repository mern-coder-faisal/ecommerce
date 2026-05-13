import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../utils/api';

const PAYMENT_OPTIONS = ['Cash on Delivery', 'Credit Card', 'Mobile Wallet'];
const DELIVERY_OPTIONS = [
  { label: 'Standard Delivery', value: 0 },
  { label: 'Express Delivery', value: 12 },
  { label: 'Next-day delivery', value: 24 },
];

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: PAYMENT_OPTIONS[0],
    deliveryCharge: DELIVERY_OPTIONS[0].value,
  });
  const [error, setError] = useState('');

  const total = cartTotal + Number(form.deliveryCharge || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!items.length) {
      setError('Your cart is empty.');
      return;
    }
    if (!form.customerName || !form.email || !form.phone || !form.address) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customerName: form.customerName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        paymentMethod: form.paymentMethod,
        deliveryCharge: Number(form.deliveryCharge),
        products: items.map((item) => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total,
      };
      const response = await api.createOrder(payload);
      if (response.token && response.user) {
        login(response.token, response.user);
      }
      clearCart();
      navigate('/account');
    } catch (err) {
      setError(err.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '100px 0 80px' }}>
      <div className="container" style={{ maxWidth: 960 }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8 }}>Checkout</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36 }}>Complete your order</h1>
          <p style={{ color: 'var(--text2)' }}>Enter billing details and confirm your purchase.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 24 }}>
          <div style={{ display: 'grid', gap: 18 }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 18 }}>Billing details</h2>
              <label style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
                Name
                <input type="text" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="Your full name" style={inputStyle} />
              </label>
              <label style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
                Email
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" style={inputStyle} />
              </label>
              <label style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
                Phone
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone number" style={inputStyle} />
              </label>
              <label style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
                Delivery address
                <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Street, city, ZIP code" rows={4} style={inputStyle} />
              </label>
              <label style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
                Payment method
                <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} style={inputStyle}>
                  {PAYMENT_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
                Delivery option
                <select value={form.deliveryCharge} onChange={(e) => setForm({ ...form, deliveryCharge: Number(e.target.value) })} style={inputStyle}>
                  {DELIVERY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label} (${option.value})</option>)}
                </select>
              </label>
            </div>
            {error && <div style={{ padding: 16, borderRadius: 16, background: 'rgba(255,107,107,0.12)', color: 'var(--accent2)' }}>{error}</div>}
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '18px 20px', borderRadius: 16, background: 'linear-gradient(135deg, var(--accent), var(--accent2))', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, border: 'none' }}>
              {loading ? 'Placing order…' : 'Place order'}
            </button>
          </div>

          <div style={{ display: 'grid', gap: 18 }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 18 }}>Order summary</h2>
              {items.map((item) => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 18, alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 700 }}>{item.name}</p>
                    <p style={{ color: 'var(--text2)', fontSize: 13 }}>{item.quantity} × ${item.price.toFixed(2)}</p>
                  </div>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 18, marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: 'var(--text2)' }}><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: 'var(--text2)' }}><span>Delivery</span><span>${form.deliveryCharge.toFixed(2)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18 }}><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: 14,
  border: '1px solid var(--border)',
  background: 'var(--bg2)',
  color: 'var(--text)',
  outline: 'none',
  fontSize: 14,
};
