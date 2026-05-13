import { useState } from 'react';
import { X, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartDrawer({ open, onClose }) {
  const { items, cartTotal, updateQuantity, removeItem } = useCart();
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: open ? 900 : -1, opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity 0.25s ease' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: 420, maxWidth: '100%', background: 'var(--bg)', borderLeft: '1px solid var(--border)', padding: 24, display: 'flex', flexDirection: 'column', gap: 20, transform: open ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.25s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>
            <ShoppingCart size={20} /> Cart
          </div>
          <button onClick={onClose} style={{ color: 'var(--text2)' }}><X size={20} /></button>
        </div>
        {items.length === 0 ? (
          <div style={{ flex: 1, display: 'grid', placeItems: 'center', color: 'var(--text2)' }}>
            Your cart is empty
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gap: 18 }}>
            {items.map((item) => (
              <div key={item._id} style={{ display: 'grid', gridTemplateColumns: '88px 1fr auto', gap: 16, padding: 16, borderRadius: 20, background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <img src={item.image} alt={item.name} style={{ width: 88, height: 88, objectFit: 'cover', borderRadius: 16 }} />
                <div style={{ display: 'grid', gap: 8 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{item.name}</div>
                  <div style={{ color: 'var(--text2)', fontSize: 13 }}>{item.category}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={{ color: 'var(--text2)' }}><Minus size={14} /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={{ color: 'var(--text2)' }}><Plus size={14} /></button>
                  </div>
                </div>
                <button onClick={() => removeItem(item._id)} style={{ color: 'var(--accent2)' }}><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        )}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 18, display: 'grid', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text2)' }}><span>Total</span><strong>${cartTotal.toFixed(2)}</strong></div>
          <Link to="/checkout" onClick={onClose} style={{ display: 'inline-flex', justifyContent: 'center', padding: '14px 18px', borderRadius: 16, background: 'linear-gradient(135deg, var(--accent), var(--accent2))', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700 }}>Checkout</Link>
        </div>
      </div>
    </div>
  );
}
