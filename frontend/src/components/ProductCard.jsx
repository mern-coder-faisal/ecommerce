import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleAdd = () => {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleOrder = () => {
    addItem(product, 1);
    navigate('/checkout');
  };

  const handleViewDetails = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      position: 'relative',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px var(--accent)';
        e.currentTarget.style.borderColor = 'var(--accent)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', paddingBottom: '65%', overflow: 'hidden' }}>
        <Link to={`/product/${product._id}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'block' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', transition: 'transform 0.4s ease',
            }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
        </Link>
        {/* Category badge */}
        <span style={{
          position: 'absolute', top: 12, left: 12,
          background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(8px)',
          border: '1px solid var(--border)',
          color: 'var(--text2)', fontSize: 11, fontWeight: 600,
          padding: '4px 10px', borderRadius: 20,
          fontFamily: 'var(--font-display)',
          textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>
          {product.category}
        </span>
        {/* Like button */}
        <button
          onClick={() => setLiked(!liked)}
          style={{
            position: 'absolute', top: 12, right: 12,
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(8px)',
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: liked ? 'var(--accent2)' : 'var(--text2)',
            transition: 'all 0.2s ease',
          }}
        >
          <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 16, marginBottom: 6, lineHeight: 1.3,
        }}>
          {product.name}
        </h3>
        <p style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.5, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.description}
        </p>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 2 }}>
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={12} fill={i <= Math.round(product.rating) ? '#fbbf24' : 'none'} color={i <= Math.round(product.rating) ? '#fbbf24' : 'var(--border)'} />
            ))}
          </div>
          <span style={{ color: 'var(--text2)', fontSize: 12 }}>{product.rating} ({product.reviews})</span>
        </div>

        {/* Price & Add */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--text)' }}>
              ${product.price.toFixed(2)}
            </span>
            <p style={{ color: 'var(--text2)', fontSize: 13, marginTop: 4 }}>Stock: {product.stock}</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={handleAdd}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 16px', borderRadius: 10,
                background: added ? 'var(--accent3)' : 'linear-gradient(135deg, var(--accent), #9b8fff)',
                color: '#fff', fontWeight: 600, fontSize: 13,
                fontFamily: 'var(--font-display)',
                transition: 'all 0.25s ease',
                transform: added ? 'scale(0.96)' : 'scale(1)',
              }}
            >
              <ShoppingCart size={15} />
              {added ? 'Added' : 'Add to cart'}
            </button>
            <button
              onClick={handleOrder}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 16px', borderRadius: 10,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text)', fontWeight: 600, fontSize: 13,
                fontFamily: 'var(--font-display)',
              }}
            >
              Order now
            </button>
            <button
              onClick={handleViewDetails}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 16px', borderRadius: 10,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text2)', fontWeight: 600, fontSize: 13,
                fontFamily: 'var(--font-display)',
              }}
            >
              <Eye size={15} /> View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
