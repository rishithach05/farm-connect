export default function Footer() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .footer {
          background: var(--neutral-900);
          color: var(--neutral-300);
          padding: 4rem 2rem 2rem;
        }
        .footer-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 3rem;
        }
        .footer-brand .logo {
          color: white;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.5rem;
          font-weight: 700;
        }
        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--primary-green), var(--primary-dark));
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.25rem;
        }
        .footer-brand p {
          color: var(--neutral-400);
          margin-bottom: 1.5rem;
          max-width: 300px;
        }
        .social-links {
          display: flex;
          gap: 1rem;
        }
        .social-link {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--neutral-800);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--neutral-300);
          transition: all 0.3s ease;
        }
        .social-link:hover {
          background: var(--primary-green);
          color: white;
        }
        .footer-column h4 {
          color: white;
          font-size: 1.125rem;
          margin-bottom: 1.5rem;
        }
        .footer-links li {
          margin-bottom: 0.75rem;
        }
        .footer-links a {
          color: var(--neutral-400);
          transition: color 0.3s ease;
        }
        .footer-links a:hover {
          color: var(--primary-light);
        }
        .footer-bottom {
          max-width: 1400px;
          margin: 3rem auto 0;
          padding-top: 2rem;
          border-top: 1px solid var(--neutral-800);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .footer-bottom p {
          color: var(--neutral-500);
          font-size: 0.875rem;
        }
        @media (max-width: 1024px) {
          .footer-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
          .footer-container {
            grid-template-columns: 1fr;
          }
        }
      `}} />
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <a href="#" className="logo">
              <div className="logo-icon">🌾</div>
              Farm Connect
            </a>
            <p>Connecting farmers directly to consumers for fair trade and fresh produce. Building a better agricultural ecosystem for everyone.</p>
            <div className="social-links">
              <a href="#" className="social-link">📘</a>
              <a href="#" className="social-link">🐦</a>
              <a href="#" className="social-link">📸</a>
              <a href="#" className="social-link">💼</a>
            </div>
          </div>
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="/marketplace">Products</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>For Farmers</h4>
            <ul className="footer-links">
              <li><a href="/register">Register</a></li>
              <li><a href="/farmer/dashboard">List Products</a></li>
              <li><a href="#">Pricing Guide</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>For Customers</h4>
            <ul className="footer-links">
              <li><a href="/marketplace">Browse Products</a></li>
              <li><a href="#">How to Order</a></li>
              <li><a href="#">Delivery Info</a></li>
              <li><a href="#">FAQs</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Farm Connect. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <a href="#" style={{ color: 'var(--neutral-500)' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'var(--neutral-500)' }}>Terms of Service</a>
          </div>
        </div>
      </footer>
    </>
  );
}
