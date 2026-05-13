import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Zap } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ChatWidget from '../components/ChatWidget';
import PopupOverlay from '../components/PopupOverlay';
import { api } from '../utils/api';

const DEFAULT_CATEGORIES = ['All', 'Electronics', 'Furniture', 'Lifestyle', 'Accessories'];
const SORTS = [
  { value: '', label: 'Latest' },
  { value: 'price_asc', label: 'Price: Low' },
  { value: 'price_desc', label: 'Price: High' },
  { value: 'rating', label: 'Top Rated' },
];

function SkeletonCard() {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <div style={{ paddingBottom: '65%', background: 'linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
      <div style={{ padding: 20 }}>
        {[80, 100, 60].map((w, i) => (
          <div key={i} style={{ height: 14, width: `${w}%`, background: 'var(--surface2)', borderRadius: 6, marginBottom: 12, animation: 'pulse 1.5s infinite', animationDelay: `${i * 0.15}s` }} />
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <div style={{ height: 28, width: '40%', background: 'var(--surface2)', borderRadius: 6, animation: 'pulse 1.5s infinite' }} />
          <div style={{ height: 38, width: '32%', background: 'var(--surface2)', borderRadius: 10, animation: 'pulse 1.5s infinite' }} />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (search) params.search = search;
        if (category !== 'All') params.category = category;
        if (sort) params.sort = sort;
        const data = await api.getProducts(params);
        setProducts(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, category, sort]);

  useEffect(() => {
    const loadExtras = async () => {
      try {
        const [bannerData, categoryData] = await Promise.all([api.getBanners(), api.getCategories()]);
        setBanners(bannerData);
        setCategories(['All', ...categoryData.map((item) => item.name)]);
      } catch (e) {
        // ignore optional extras if backend not available
      }
    };

    const record = async () => {
      await api.recordVisit({
        path: window.location.pathname,
        userAgent: navigator.userAgent,
        referer: document.referrer || 'direct',
        source: document.referrer.includes('google') ? 'google' : document.referrer.includes('facebook') ? 'facebook' : 'direct',
        device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
      });
    };

    loadExtras();
    record();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section style={{
        padding: '80px 0 60px',
        background: 'linear-gradient(180deg, rgba(108,99,255,0.08) 0%, transparent 100%)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container">
          <div style={{ maxWidth: 640, animation: 'fadeUp 0.7s ease both' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.3)',
              borderRadius: 20, padding: '6px 14px', marginBottom: 24,
              fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, color: 'var(--accent)',
            }}>
              <Zap size={13} /> New Arrivals Available
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', lineHeight: 1.1, marginBottom: 20,
            }}>
              Products built for<br />
              <span style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                the next generation
              </span>
            </h1>
            <p style={{ color: 'var(--text2)', fontSize: 18, maxWidth: 500 }}>
              Discover curated electronics, furniture, and lifestyle products designed for modern living.
            </p>
            {banners.length > 0 && (
              <div style={{ marginTop: 32, display: 'grid', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 16, alignItems: 'stretch' }}>
                  <div style={{ borderRadius: 28, overflow: 'hidden', minHeight: 260, background: 'var(--surface)', boxShadow: '0 24px 64px rgba(0,0,0,0.16)' }}>
                    <img src={banners[0].image} alt={banners[0].title || 'Banner'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ display: 'grid', gap: 14 }}>
                    {banners.slice(1, 3).map((banner) => (
                      <div key={banner._id} style={{ display: 'grid', gridTemplateRows: '1fr auto', borderRadius: 24, overflow: 'hidden', background: 'var(--surface)', boxShadow: '0 20px 48px rgba(0,0,0,0.12)' }}>
                        <img src={banner.image} alt={banner.title || 'Banner'} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                        <div style={{ padding: 16 }}>
                          <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 6 }}>{banner.title}</p>
                          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text)' }}>{banner.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <section style={{ padding: '28px 0', borderBottom: '1px solid var(--border)', position: 'sticky', top: 72, background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(16px)', zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text2)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              style={{
                width: '100%', padding: '11px 14px 11px 40px',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 10, color: 'var(--text)', fontSize: 14, outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Categories */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{
                padding: '8px 16px', borderRadius: 8,
                background: category === cat ? 'var(--accent)' : 'var(--surface)',
                border: `1px solid ${category === cat ? 'var(--accent)' : 'var(--border)'}`,
                color: category === cat ? '#fff' : 'var(--text2)',
                fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13,
                transition: 'all 0.2s',
              }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{
              padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 10, color: 'var(--text)', fontSize: 14, outline: 'none',
            }}
          >
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </section>

      {/* Products */}
      <section style={{ padding: '48px 0 80px' }}>
        <div className="container">
          {error && (
            <div style={{
              padding: 24, borderRadius: 12, background: 'rgba(255,107,107,0.1)',
              border: '1px solid rgba(255,107,107,0.3)', color: 'var(--accent2)',
              textAlign: 'center', marginBottom: 32,
            }}>
              <p style={{ fontWeight: 600 }}>Failed to load products</p>
              <p style={{ fontSize: 13, marginTop: 4, color: 'var(--text2)' }}>{error} — Make sure the backend is running.</p>
            </div>
          )}

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28,
          }}>
            <p style={{ color: 'var(--text2)', fontSize: 14 }}>
              {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 24,
          }}>
            {loading
              ? Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : products.map((p, i) => (
                <div key={p._id} style={{ animation: `fadeUp 0.5s ease both`, animationDelay: `${i * 0.07}s` }}>
                  <ProductCard product={p} />
                </div>
              ))}
          </div>

          {!loading && products.length === 0 && !error && (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>No products found</h3>
              <p style={{ color: 'var(--text2)' }}>Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </section>
      <ChatWidget products={products} />
      <PopupOverlay />
    </div>
  );
}
