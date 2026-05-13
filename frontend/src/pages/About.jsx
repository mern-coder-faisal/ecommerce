import { Users, Package, Globe, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { value: '12K+', label: 'Happy Customers' },
  { value: '300+', label: 'Curated Products' },
  { value: '48', label: 'Countries Served' },
  { value: '4.8★', label: 'Average Rating' },
];

const values = [
  { icon: Package, title: 'Quality First', desc: 'Every product is hand-picked and tested to meet our rigorous quality standards before reaching you.' },
  { icon: Globe, title: 'Sustainability', desc: 'We prioritize suppliers with responsible manufacturing practices and eco-conscious packaging.' },
  { icon: Users, title: 'Community', desc: 'We build for a community of creators, makers, and forward-thinkers who refuse the ordinary.' },
  { icon: Award, title: 'Innovation', desc: 'We actively seek cutting-edge products that push the boundary of what\'s possible in everyday life.' },
];

const team = [
  { name: 'Sarah Chen', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=face' },
  { name: 'Marcus Reid', role: 'Head of Product', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face' },
  { name: 'Aiko Tanaka', role: 'Design Director', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face' },
  { name: 'Leo Martins', role: 'Tech Lead', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face' },
];

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section style={{
        padding: '100px 0 80px',
        background: 'linear-gradient(180deg, rgba(108,99,255,0.06) 0%, transparent 100%)',
        borderBottom: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <div className="container">
          <div style={{ maxWidth: 680, margin: '0 auto', animation: 'fadeUp 0.7s ease both' }}>
            <span style={{
              display: 'inline-block', padding: '6px 16px', borderRadius: 20,
              background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.3)',
              color: 'var(--accent)', fontSize: 13, fontFamily: 'var(--font-display)',
              fontWeight: 600, marginBottom: 24,
            }}>Our Story</span>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'clamp(2rem, 5vw, 3.2rem)', lineHeight: 1.1, marginBottom: 24,
            }}>
              Built by people who believe<br />
              <span style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                products should inspire
              </span>
            </h1>
            <p style={{ color: 'var(--text2)', fontSize: 18, lineHeight: 1.7 }}>
              NextGen was born in 2021 out of frustration with mediocre products flooding the market.
              We set out to curate the world's most thoughtfully designed, functional products and bring them to people who care about what they own.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '72px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
            {stats.map(({ value, label }, i) => (
              <div key={i} style={{
                textAlign: 'center', padding: '36px 24px',
                background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                animation: `fadeUp 0.5s ease both`, animationDelay: `${i * 0.1}s`,
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: 40, color: 'var(--accent)', marginBottom: 8,
                }}>
                  {value}
                </div>
                <div style={{ color: 'var(--text2)', fontSize: 15 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', marginBottom: 16 }}>What we stand for</h2>
            <p style={{ color: 'var(--text2)', fontSize: 17, maxWidth: 500, margin: '0 auto' }}>Four principles that guide every decision we make.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {values.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} style={{
                padding: 32, background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)', transition: 'all 0.3s ease',
                animation: `fadeUp 0.5s ease both`, animationDelay: `${i * 0.1}s`,
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(255,107,107,0.1))',
                  border: '1px solid rgba(108,99,255,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20,
                }}>
                  <Icon size={24} color="var(--accent)" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, marginBottom: 10 }}>{title}</h3>
                <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', marginBottom: 16 }}>Meet the team</h2>
            <p style={{ color: 'var(--text2)', fontSize: 17 }}>The people behind the curation.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {team.map(({ name, role, img }, i) => (
              <div key={i} style={{
                textAlign: 'center', padding: '32px 24px',
                background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)', transition: 'all 0.3s ease',
                animation: `fadeUp 0.5s ease both`, animationDelay: `${i * 0.1}s`,
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <img src={img} alt={name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px', border: '3px solid var(--border)' }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{name}</h3>
                <p style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 600 }}>{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{
            textAlign: 'center', padding: '64px 32px',
            background: 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(255,107,107,0.05))',
            borderRadius: 'var(--radius-lg)', border: '1px solid rgba(108,99,255,0.2)',
            animation: 'fadeUp 0.6s ease both',
          }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', marginBottom: 16 }}>
              Ready to explore?
            </h2>
            <p style={{ color: 'var(--text2)', fontSize: 17, marginBottom: 32 }}>
              Browse our full catalog of next-generation products.
            </p>
            <Link to="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', borderRadius: 12,
              background: 'linear-gradient(135deg, var(--accent), #9b8fff)',
              color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
            }}>
              Shop Now <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
