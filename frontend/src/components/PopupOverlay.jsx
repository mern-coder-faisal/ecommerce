import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { api } from '../utils/api';

export default function PopupOverlay() {
  const [popup, setPopup] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchPopups = async () => {
      try {
        const popups = await api.getPopups();
        if (popups && popups.length > 0) {
          // Show the most recent one
          setPopup(popups[0]);
          
          // Check if already shown in this session
          const dismissed = sessionStorage.getItem(`popup_dismissed_${popups[0]._id}`);
          if (!dismissed) {
            setTimeout(() => setShow(true), 1500); // Delay for better UX
          }
        }
      } catch (err) {
        console.error('Failed to load popups', err);
      }
    };
    fetchPopups();
  }, []);

  const handleClose = () => {
    setShow(false);
    if (popup) {
      sessionStorage.setItem(`popup_dismissed_${popup._id}`, 'true');
    }
  };

  if (!show || !popup) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 10000, animation: 'fadeIn 0.4s ease'
    }}>
      <div style={{
        position: 'relative', width: '90%', maxWidth: 500,
        borderRadius: 20, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
        animation: 'zoomIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}>
        <button 
          onClick={handleClose}
          style={{
            position: 'absolute', top: 12, right: 12,
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)', color: '#fff',
            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 10
          }}
        >
          <X size={20} />
        </button>
        <img 
          src={popup.image} 
          alt="Promotion" 
          style={{ width: '100%', display: 'block', maxHeight: '80vh', objectFit: 'contain' }} 
        />
      </div>
    </div>
  );
}
