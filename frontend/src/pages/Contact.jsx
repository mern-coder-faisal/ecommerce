import { useState } from 'react';
import { Mail, MapPin, Phone, Send, MessageCircle, Clock } from 'lucide-react';

const contactInfo = [
  { icon: Mail, label: 'Email Us', value: 'hello@nextgen.store', sub: 'We reply within 24 hours' },
  { icon: Phone, label: 'Call Us', value: '+1 (800) 555-0192', sub: 'Mon–Fri, 9am–6pm EST' },
  { icon: MapPin, label: 'Find Us', value: '120 Innovation Ave', sub: 'San Francisco, CA 94105' },
  { icon: Clock, label: 'Business Hours', value: 'Mon–Fri 9–6 EST', sub: 'Closed on weekends' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      setStatus({ type: 'error', msg: 'Please fill in all required fields.' });
      return;
    }
    setSending(true);
    await new Promise(r => setTimeout(r, 1400)); // Mock send
    setSending(false);
    setStatus({ type: 'success', msg: 'Message sent! We\'ll get back to you within 24 hours.' });
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div>
      {/* Hero */}
      <section style={{
        padding: '100px 0 72px',
        background: 'linear-gradient(180deg, rgba(67,217,173,0.06) 0%, transparent 100%)',
        borderBottom: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <div className="container">
          <div style={{ maxWidth: 600, margin: '0 auto', animation: 'fadeUp 0.6s ease both' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 20,
              background: 'rgba(67,217,173,0.1)', border: '1px solid rgba(67,217,173,0.3)',
              color: 'var(--accent3)', fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 24,
            }}>
              <MessageCircle size={13} /> Get in Touch
            </span>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.1, marginBottom: 20,
            }}>
              We'd love to<br />
              <span style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                hear from you
              </span>
            </h1>
            <p style={{ color: 'var(--text2)', fontSize: 17 }}>
              Questions, feedback, partnerships — our team is always ready to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact info cards */}
      <section style={{ padding: '60px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {contactInfo.map(({ icon: Icon, label, value, sub }, i) => (
              <div key={i} style={{
                padding: '28px 24px', background: 'var(--surface)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
                display: 'flex', gap: 16, alignItems: 'flex-start',
                transition: 'all 0.3s ease',
                animation: `fadeUp 0.5s ease both`, animationDelay: `${i * 0.08}s`,
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent3)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: 'rgba(67,217,173,0.1)', border: '1px solid rgba(67,217,173,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={20} color="var(--accent3)" />
                </div>
                <div>
                  <p style={{ color: 'var(--text2)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 4 }}>{label}</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{value}</p>
                  <p style={{ color: 'var(--text2)', fontSize: 13 }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48, animation: 'fadeUp 0.5s ease both' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, marginBottom: 12 }}>Send us a message</h2>
              <p style={{ color: 'var(--text2)' }}>Fill in the form below and we'll respond shortly.</p>
            </div>

            {status && (
              <div style={{
                padding: '16px 20px', borderRadius: 10, marginBottom: 28,
                background: status.type === 'success' ? 'rgba(67,217,173,0.1)' : 'rgba(255,107,107,0.1)',
                border: `1px solid ${status.type === 'success' ? 'rgba(67,217,173,0.3)' : 'rgba(255,107,107,0.3)'}`,
                color: status.type === 'success' ? 'var(--accent3)' : 'var(--accent2)',
                fontWeight: 500,
              }}>
                {status.msg}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              {[
                { name: 'name', label: 'Full Name *', type: 'text', placeholder: 'Jane Smith' },
                { name: 'email', label: 'Email Address *', type: 'email', placeholder: 'jane@example.com' },
              ].map(({ name, label, type, placeholder }) => (
                <div key={name}>
                  <label style={{ display: 'block', color: 'var(--text2)', fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
                  <input
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={form[name]}
                    onChange={handleChange}
                    style={{
                      width: '100%', padding: '13px 16px',
                      background: 'var(--surface)', border: '1px solid var(--border)',
                      borderRadius: 10, color: 'var(--text)', fontSize: 15, outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent3)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', color: 'var(--text2)', fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Subject</label>
              <input
                name="subject"
                placeholder="What is this about?"
                value={form.subject}
                onChange={handleChange}
                style={{
                  width: '100%', padding: '13px 16px',
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 10, color: 'var(--text)', fontSize: 15, outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent3)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', color: 'var(--text2)', fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Message *</label>
              <textarea
                name="message"
                placeholder="Tell us how we can help..."
                value={form.message}
                onChange={handleChange}
                rows={6}
                style={{
                  width: '100%', padding: '13px 16px',
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 10, color: 'var(--text)', fontSize: 15, outline: 'none',
                  resize: 'vertical', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent3)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={sending}
              style={{
                width: '100%', padding: '16px',
                background: sending ? 'var(--surface2)' : 'linear-gradient(135deg, var(--accent3), var(--accent))',
                color: '#fff', borderRadius: 12,
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                transition: 'all 0.25s ease',
                cursor: sending ? 'not-allowed' : 'pointer',
              }}
            >
              {sending ? (
                <>
                  <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                  Sending…
                </>
              ) : (
                <><Send size={17} /> Send Message</>
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
