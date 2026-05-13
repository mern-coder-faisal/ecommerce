import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, cartCount, cartTotal, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  return (
    <div style={{ padding: '100px 0 80px' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8 }}>Your Cart</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36 }}>Shopping bag</h1>
            <p style={{ color: 'var(--text2)' }}>{cartCount} item{cartCount !== 1 ? 's' : ''} in cart</p>
          </div>
          <button onClick={() => navigate('/checkout')} style={{ padding: '14px 22px', borderRadius: 14, background: 'linear-gradient(135deg, var(--accent), var(--accent2))', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700, border: 'none' }}>
            Checkout
          </button>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, borderRadius: 24, background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <ShoppingCart size={36} style={{ marginBottom: 18 }} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 10 }}>Your cart is empty</h2>
            <p style={{ color: 'var(--text2)', marginBottom: 24 }}>Add products from the store to continue.</p>
            <Link to="/" style={{ padding: '12px 20px', borderRadius: 12, background: 'var(--accent)', color: '#fff', fontWeight: 700 }}>Browse store</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: 24 }}>
            <div style={{ display: 'grid', gap: 18 }}>
              {items.map((item) => (
                <div key={item._id} style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 18, padding: 22, borderRadius: 24, background: 'var(--surface)', border: '1px solid var(--border)', alignItems: 'center' }}>
                  <img src={item.image} alt={item.name} style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 18 }} />
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 8 }}>{item.name}</h3>
                    <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 12, maxWidth: 460 }}>{item.description}</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', color: 'var(--text2)', fontSize: 13 }}>
                      <span>Category: {item.category}</span>
                      <span>Stock: {item.stock}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 14, background: 'var(--bg2)' }}>
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={{ color: 'var(--text2)' }}><Minus size={16} /></button>
                      <span style={{ minWidth: 28, textAlign: 'center', fontWeight: 700 }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={{ color: 'var(--text2)' }}><Plus size={16} /></button>
                    </div>
                    <button onClick={() => removeItem(item._id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--accent2)', fontWeight: 700 }}>
                      <Trash2 size={16} /> Remove
                    </button>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18 }}>${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderRadius: 24, padding: 28, background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 20, height: 'fit-content' }}>
              <div>
                <p style={{ color: 'var(--text2)', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Order summary</p>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, marginTop: 10 }}>${cartTotal.toFixed(2)}</h2>
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text2)' }}><span>Items</span><span>{cartCount}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text2)' }}><span>Delivery</span><span>Calculated at checkout</span></div>
              </div>
              <button onClick={() => navigate('/checkout')} style={{ width: '100%', padding: '16px 20px', borderRadius: 14, background: 'linear-gradient(135deg, var(--accent), var(--accent2))', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700 }}>Proceed to checkout</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
