import { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';

export default function ChatWidget({ products }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Ask me about products and I will find them for you.' }]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    const question = input.trim();
    setMessages((current) => [...current, { role: 'user', text: question }]);
    setInput('');

    const lower = question.toLowerCase();
    let reply = 'I could not find matching products. Try a simpler name.';

    const matched = products.filter((product) => product.name.toLowerCase().includes(lower) || product.category.toLowerCase().includes(lower));
    if (matched.length) {
      const first = matched[0];
      reply = `I found ${matched.length} product${matched.length > 1 ? 's' : ''}. ${first.name} is ${first.description} It costs $${first.price.toFixed(2)}. `;
      if (first.rating) reply += `It has a ${first.rating.toFixed(1)}/5 rating with ${first.reviews} reviews. `;
      reply += `Open the product in the store to buy it.`;
    } else if (lower.includes('good') || lower.includes('best') || lower.includes('popular')) {
      const sorted = [...products].sort((a, b) => b.rating - a.rating).slice(0, 3);
      if (sorted.length) {
        reply = `Top products right now: ${sorted.slice(0, 3).map((p) => p.name).join(', ')}. `;
        reply += `They are highly rated and in stock.`;
      }
    }

    setTimeout(() => {
      setMessages((current) => [...current, { role: 'assistant', text: reply }]);
    }, 500);
  };

  return (
    <div style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 998, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
      {open && (
        <div style={{ width: 340, maxWidth: '100%', borderRadius: 24, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 32px 70px rgba(0,0,0,0.35)', overflow: 'hidden' }}>
          <div style={{ padding: 16, borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Shop assistant</p>
              <p style={{ color: 'var(--text2)', fontSize: 13 }}>Ask about store products</p>
            </div>
            <button onClick={() => setOpen(false)} style={{ color: 'var(--text2)' }}>✕</button>
          </div>
          <div style={{ maxHeight: 320, overflowY: 'auto', padding: 16, display: 'grid', gap: 14 }}>
            {messages.map((message, index) => (
              <div key={index} style={{ alignSelf: message.role === 'assistant' ? 'flex-start' : 'flex-end', background: message.role === 'assistant' ? 'var(--bg2)' : 'var(--accent)', color: message.role === 'assistant' ? 'var(--text)' : '#fff', padding: '12px 14px', borderRadius: 18, maxWidth: '100%' }}>
                {message.text}
              </div>
            ))}
          </div>
          <div style={{ padding: 16, borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Message the assistant..." style={{ flex: 1, padding: '12px 14px', borderRadius: 14, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
            <button onClick={sendMessage} style={{ width: 46, height: 46, borderRadius: 14, background: 'var(--accent)', color: '#fff' }}><Send size={18} /></button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen((current) => !current)} style={{ width: 56, height: 56, borderRadius: 999, background: 'linear-gradient(135deg, var(--accent), var(--accent2))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 48px rgba(108,99,255,0.24)' }}>
        <MessageCircle size={24} />
      </button>
    </div>
  );
}
