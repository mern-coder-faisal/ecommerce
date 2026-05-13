import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Zap, Github, Twitter, Instagram, Moon, Sun } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import CartDrawer from '../components/CartDrawer';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Store' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(10,10,15,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition: 'all 0.3s ease',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22 }}>
          <span style={{
            width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Zap size={18} color="#fff" />
          </span>
          NextGen
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', gap: 4 }} className="desktop-nav">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                padding: '8px 18px',
                borderRadius: 8,
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                fontSize: 15,
                color: isActive ? 'var(--accent)' : 'var(--text2)',
                background: isActive ? 'rgba(108,99,255,0.1)' : 'transparent',
                transition: 'all 0.2s ease',
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setDrawerOpen(true)}
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              background: 'rgba(108,99,255,0.12)',
              color: 'var(--accent)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 14,
              display: 'flex', alignItems: 'center', gap: 8,
              border: '1px solid rgba(108,99,255,0.2)',
            }}
          >
            <ShoppingBag size={16} />
            Cart {cartCount > 0 ? `(${cartCount})` : ''}
          </button>
          {user && (
            <Link to="/account" style={{ padding: '8px 18px', borderRadius: 8, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              Account
            </Link>
          )}
          <button onClick={toggleTheme} style={{ padding: '8px', borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text2)' }}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link
            to="/admin/login"
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              background: 'linear-gradient(135deg, var(--accent), #9b8fff)',
              color: '#fff',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 14,
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            Admin
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: 'var(--text)', display: 'none' }}
            className="mobile-menu-btn"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '16px 24px',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({
                padding: '12px 16px', borderRadius: 8,
                fontFamily: 'var(--font-display)', fontWeight: 600,
                color: isActive ? 'var(--accent)' : 'var(--text)',
                background: isActive ? 'rgba(108,99,255,0.1)' : 'transparent',
              })}>
              {label}
            </NavLink>
          ))}
        </div>
      )}

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--bg2)',
      padding: '64px 0 32px',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 48,
          marginBottom: 48,
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20 }}>
              <span style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Zap size={16} color="#fff" />
              </span>
              NextGen
            </div>
            <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
              Curated products for the forward-thinking individual. Quality, design, and innovation.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {[Twitter, Github, Instagram].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: 36, height: 36, borderRadius: 8, background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text2)', transition: 'all 0.2s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text2)', marginBottom: 16 }}>Navigation</h4>
            {[['/', 'Store'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([href, label]) => (
              <Link key={href} to={href} style={{ display: 'block', color: 'var(--text2)', fontSize: 14, marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text2)'}>
                {label}
              </Link>
            ))}
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text2)', marginBottom: 16 }}>Support</h4>
            {['FAQ', 'Shipping & Returns', 'Privacy Policy', 'Terms of Service'].map(label => (
              <a key={label} href="#" style={{ display: 'block', color: 'var(--text2)', fontSize: 14, marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text2)'}>
                {label}
              </a>
            ))}
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text2)', marginBottom: 16 }}>Stay Updated</h4>
            <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 16 }}>Get new products and drops straight to your inbox.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="email"
                placeholder="your@email.com"
                style={{
                  flex: 1, padding: '10px 14px', borderRadius: 8,
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  color: 'var(--text)', fontSize: 14, outline: 'none',
                }}
              />
              <button style={{
                padding: '10px 16px', borderRadius: 8,
                background: 'var(--accent)', color: '#fff', fontWeight: 600, fontSize: 14,
              }}>
                →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border)', paddingTop: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12,
        }}>
          <p style={{ color: 'var(--text2)', fontSize: 13 }}>© {year} NextGen Store. All rights reserved.</p>
          <p style={{ color: 'var(--text2)', fontSize: 13 }}>Made with care for innovators.</p>
        </div>
      </div>
    </footer>
  );
}

export default function MainLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, paddingTop: 72 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
