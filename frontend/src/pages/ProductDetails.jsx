import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../utils/api';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await api.getProduct(id);
        setProduct(data);
      } catch (err) {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAdd = () => {
    if (!product) return;
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleOrder = () => {
    if (!product) return;
    addItem(product, 1);
    navigate('/checkout');
  };

  if (loading) {
    return <div style={{ padding: '100px 0', textAlign: 'center', color: 'var(--text2)' }}>Loading product...</div>;
  }

  if (error || !product) {
    return (
      <div style={{ padding: '100px 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--accent2)', marginBottom: 16 }}>{error || 'Product not found.'}</p>
        <button onClick={() => navigate(-1)} style={{ padding: '10px 20px', borderRadius: 8, background: 'var(--bg2)', color: 'var(--text)', border: '1px solid var(--border)' }}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '120px 0 80px' }}>
      <div className="container" style={{ maxWidth: 1100 }}>
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text2)', marginBottom: 32, fontSize: 14, fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back
        </button>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 48, alignItems: 'start' }}>
          <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg2)' }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block' }} />
          </div>
          
          <div style={{ display: 'grid', gap: 24 }}>
            <div>
              <p style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{product.category}</p>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 40, lineHeight: 1.2, marginBottom: 16 }}>{product.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={16} fill={i <= Math.round(product.rating) ? '#fbbf24' : 'none'} color={i <= Math.round(product.rating) ? '#fbbf24' : 'var(--border)'} />
                  ))}
                </div>
                <span style={{ color: 'var(--text2)', fontSize: 14 }}>{product.rating.toFixed(1)} ({product.reviews} reviews)</span>
              </div>
            </div>

            <p style={{ color: 'var(--text2)', fontSize: 16, lineHeight: 1.8 }}>{product.description}</p>
            
            <div style={{ padding: '24px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 8 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36, color: 'var(--text)' }}>
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <p style={{ color: product.stock > 0 ? 'var(--accent3)' : 'var(--accent2)', fontSize: 14, fontWeight: 600 }}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 8 }}>
              <button 
                onClick={handleAdd}
                disabled={product.stock <= 0}
                style={{ flex: 1, minWidth: 200, padding: '16px 24px', borderRadius: 16, background: added ? 'var(--accent3)' : 'linear-gradient(135deg, var(--accent), #9b8fff)', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s', opacity: product.stock <= 0 ? 0.5 : 1, cursor: product.stock <= 0 ? 'not-allowed' : 'pointer' }}
              >
                <ShoppingCart size={18} />
                {added ? 'Added to Cart' : 'Add to Cart'}
              </button>
              <button 
                onClick={handleOrder}
                disabled={product.stock <= 0}
                style={{ flex: 1, minWidth: 200, padding: '16px 24px', borderRadius: 16, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, transition: 'all 0.2s', opacity: product.stock <= 0 ? 0.5 : 1, cursor: product.stock <= 0 ? 'not-allowed' : 'pointer' }}
              >
                Buy Now
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
              <div style={{ padding: 16, borderRadius: 16, background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 4 }}>Fast Delivery</p>
                <p style={{ fontSize: 14, fontWeight: 600 }}>Get it in 1-3 days</p>
              </div>
              <div style={{ padding: 16, borderRadius: 16, background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 4 }}>Secure Payment</p>
                <p style={{ fontSize: 14, fontWeight: 600 }}>100% safe checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .container > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
