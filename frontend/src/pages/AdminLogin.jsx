import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Zap, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: 'admin@nextgen.com', password: 'admin123' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user && isAdmin) {
    navigate('/admin');
    return null;
  }

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await api.login(form);
      if (data.user.role !== 'admin') {
        setError('This account does not have admin access.');
        return;
      }
      login(data.token, data.user);
      navigate('/admin');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = e => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)',
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,107,0.06) 0%, transparent 70%)',
        top: '20%', right: '10%',
        pointerEvents: 'none',
      }} />

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 440, margin: '24px',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(108,99,255,0.1)',
        animation: 'fadeUp 0.5s ease both',
        position: 'relative',
      }}>
        {/* Header */}
        <div style={{
          padding: '36px 36px 28px',
          borderBottom: '1px solid var(--border)',
          textAlign: 'center',
        }}>
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, marginBottom: 24,
          }}>
            <span style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={18} color="#fff" />
            </span>
            NextGen
          </Link>
          <div style={{
            width: 60, height: 60, borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(155,143,255,0.1))',
            border: '1px solid rgba(108,99,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <ShieldCheck size={28} color="var(--accent)" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, marginBottom: 8 }}>
            Admin Portal
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>
            Sign in to access the dashboard
          </p>
        </div>

        {/* Form */}
        <div style={{ padding: '28px 36px 36px' }}>
          {error && (
            <div style={{
              padding: '12px 16px', borderRadius: 8, marginBottom: 20,
              background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)',
              color: 'var(--accent2)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Lock size={14} /> {error}
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', color: 'var(--text2)', fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text2)' }} />
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                onKeyDown={handleKeyDown}
                placeholder="admin@nextgen.com"
                style={{
                  width: '100%', padding: '13px 14px 13px 42px',
                  background: 'var(--bg)', border: '1px solid var(--border)',
                  borderRadius: 10, color: 'var(--text)', fontSize: 15, outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', color: 'var(--text2)', fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text2)' }} />
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                onKeyDown={handleKeyDown}
                placeholder="Enter password"
                style={{
                  width: '100%', padding: '13px 44px 13px 42px',
                  background: 'var(--bg)', border: '1px solid var(--border)',
                  borderRadius: 10, color: 'var(--text)', fontSize: 15, outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              <button
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text2)', padding: 4,
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', padding: '15px',
              background: loading ? 'var(--surface2)' : 'linear-gradient(135deg, var(--accent), #9b8fff)',
              color: '#fff', borderRadius: 12,
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'all 0.25s ease',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 8px 32px rgba(108,99,255,0.35)',
            }}
          >
            {loading ? (
              <>
                <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                Signing in…
              </>
            ) : (
              <><ShieldCheck size={17} /> Sign In to Dashboard</>
            )}
          </button>

          <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: 13, marginTop: 20 }}>
            Default credentials: <span style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>admin@nextgen.com</span> / <span style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>admin123</span>
          </p>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Link to="/" style={{ color: 'var(--text2)', fontSize: 13, transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--text)'}
              onMouseLeave={e => e.target.style.color = 'var(--text2)'}>
              ← Back to Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
