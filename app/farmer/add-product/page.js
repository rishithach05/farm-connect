"use client";

import { useState } from 'react';

const IMAGE_MAP = {
  tomato:     "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=600&q=80",
  potato:     "https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=600&q=80",
  carrot:     "https://images.unsplash.com/photo-1447175008436-054170c2e979?w=600&q=80",
  onion:      "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&q=80",
  cabbage:    "/images/cabbage.png",
  mango:      "/images/mango.jpg",
  apple:      "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=600&q=80",
  banana:     "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&q=80",
  orange:     "https://images.unsplash.com/photo-1547514701-42782101795e?w=600&q=80",
  watermelon: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80",
  rice:       "/images/rice.png",
  wheat:      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80",
  corn:       "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&q=80",
  dal:        "/images/toordal.jpg",
  millet:     "/images/millet_new.png",
  milk:       "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&q=80",
  ghee:       "/images/ghee.png",
  paneer:     "/images/paneer.jpg",
  curd:       "/images/curd.jpg",
  fallback:   "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80"
};

function getPreviewImage(name) {
  if (!name) return IMAGE_MAP.fallback;
  const lowerName = name.toLowerCase();
  for (const [key, url] of Object.entries(IMAGE_MAP)) {
    if (lowerName.includes(key)) return url;
  }
  return IMAGE_MAP.fallback;
}

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    category: 'vegetables',
    price: '',
    unit: 'kg',
    quantity: '',
    deliveryOption: 'BOTH'
  });
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const startVoiceInput = (field) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; // Indian English
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setFormData({ ...formData, [field]: transcript });
    };

    recognition.start();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error });
        return;
      }
      
      setMessage({ type: 'success', text: 'Crop added successfully!' });
      setFormData({ name: '', category: 'vegetables', price: '', unit: 'kg', quantity: '', deliveryOption: 'BOTH' });
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred while communicating with the server.' });
    }
  };

  return (
    <>
      <style>{`
        .farmer-container {
          max-width: 800px;
          margin: 4rem auto;
          padding: 2rem;
        }
        .header-title {
          font-size: 2.25rem;
          color: var(--primary-dark);
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .product-card {
          background: white;
          padding: 2.5rem;
          border-radius: 16px;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--neutral-200);
        }
        .form-group { margin-bottom: 1.5rem; }
        .form-label {
          display: block;
          font-weight: 600;
          color: var(--neutral-700);
          margin-bottom: 0.5rem;
        }
        .input-wrapper { display: flex; gap: 0.5rem; }
        .form-input, .form-select {
          flex: 1;
          padding: 0.85rem;
          border: 1px solid var(--neutral-300);
          border-radius: 8px;
          font-size: 1rem;
        }
        .voice-btn {
          background: #dcfce7;
          border: 1px solid var(--primary-green);
          color: var(--primary-dark);
          border-radius: 8px;
          cursor: pointer;
          font-size: 1.25rem;
          width: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .voice-btn:hover { background: var(--primary-light); }
        .voice-btn.listening { background: #fee2e2; border-color: #ef4444; color: #ef4444; animation: pulse 1s infinite; }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .message-box {
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }
        .msg-success { background: #dcfce7; color: var(--primary-dark); border: 1px solid #bbf7d0; }
        .msg-error { background: #fee2e2; color: #dc2626; border: 1px solid #fecaca; }
        .submit-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, var(--primary-green), var(--primary-dark));
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 700;
          margin-top: 1rem;
          cursor: pointer;
        }
      `}</style>

      <div className="farmer-container">
        <h1 className="header-title"><span>🌽</span> Add New Crop</h1>
        
        <div className="product-card fade-in visible">
          {message.text && (
            <div className={`message-box msg-${message.type}`}>
              {message.text}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', alignItems: 'center', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '2px dashed #cbd5e1' }}>
             <img src={getPreviewImage(formData.name)} alt="Preview" style={{ width: '100px', height: '100px', borderRadius: '12px', objectFit: 'cover', border: '4px solid white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', transition: 'all 0.3s' }} />
             <div>
               <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Photo Preview</div>
               <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>{formData.name || 'Crop Name...'}</div>
               <div style={{ color: '#059669', fontSize: '0.9rem', fontWeight: 600, marginTop: '0.25rem' }}>✨ System matches a photo automatically!</div>
             </div>
          </div>

          <form onSubmit={handleAddProduct}>
            <div className="form-group">
              <label className="form-label">Crop Name</label>
              <div className="input-wrapper">
                <input type="text" className="form-input" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Fresh Tomatoes" required />
                <button type="button" className={`voice-btn ${isListening ? 'listening' : ''}`} onClick={() => startVoiceInput('name')} title="Click to use Voice">
                  🎤
                </button>
              </div>
              <p style={{fontSize: '0.8rem', color: 'gray', marginTop:'5px'}}>Tip: Click the microphone to speak the crop name!</p>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" name="category" value={formData.category} onChange={handleChange}>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="grains">Grains</option>
                <option value="dairy">Dairy</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Supported Delivery Methods</label>
              <select className="form-select" name="deliveryOption" value={formData.deliveryOption} onChange={handleChange}>
                <option value="BOTH">Customer's Choice (Both)</option>
                <option value="SELF">Farmer Self Delivery Only</option>
                <option value="AGENT">Platform Delivery Agent Only</option>
              </select>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
              <div className="form-group">
                <label className="form-label">Price</label>
                <div style={{display:'flex', alignItems: 'center', gap: '8px'}}>
                  <span style={{fontSize:'1.2rem', fontWeight:600, color:'var(--neutral-600)'}}>₹</span>
                  <input type="number" className="form-input" name="price" value={formData.price} onChange={handleChange} placeholder="100" required min="1" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Unit</label>
                <select className="form-select" name="unit" value={formData.unit} onChange={handleChange}>
                  <option value="kg">per Kg</option>
                  <option value="piece">per Piece</option>
                  <option value="dozen">per Dozen</option>
                  <option value="liter">per Liter</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Available Stock Quantity</label>
              <input type="number" className="form-input" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="e.g. 50" required min="1" />
            </div>

            <button type="submit" className="submit-btn" disabled={isListening}>
              List Product on Marketplace
            </button>
          </form>
          <div style={{textAlign:'center', marginTop:'1rem'}}><a href="/farmer/dashboard" style={{color:'var(--primary-dark)', fontWeight:600}}>Back to Dashboard</a></div>
        </div>
      </div>
    </>
  );
}
