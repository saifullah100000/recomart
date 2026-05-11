import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Mail, MapPin, Phone } from 'lucide-react';

const currentYear = new Date().getFullYear();

const FOOTER_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .ft-root {
    position: relative;
    background: #060918;
    font-family: 'DM Sans', sans-serif;
    overflow: hidden;
    border-top: 1px solid rgba(139,92,246,0.15);
  }

  /* Top glow sweep */
  .ft-top-glow {
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 700px; height: 180px;
    background: radial-gradient(ellipse, rgba(109,40,217,0.13) 0%, transparent 70%);
    pointer-events: none;
    filter: blur(40px);
  }

  /* Ambient orbs */
  .ft-orb {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(100px);
  }
  .ft-orb-l {
    width: 380px; height: 380px;
    background: radial-gradient(circle, rgba(109,40,217,0.12) 0%, transparent 70%);
    bottom: -120px; left: -120px;
  }
  .ft-orb-r {
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 70%);
    top: 20px; right: -80px;
  }

  /* Grid texture */
  .ft-grid {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image:
      linear-gradient(rgba(139,92,246,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139,92,246,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  .ft-inner {
    position: relative;
    z-index: 1;
    max-width: 1280px;
    margin: 0 auto;
    padding: 5rem 1.5rem 2rem;
  }

  /* ── Main grid ── */
  .ft-grid-main {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    margin-bottom: 4rem;
  }
  @media (min-width: 640px) {
    .ft-grid-main { grid-template-columns: 1fr 1fr; }
  }
  @media (min-width: 1024px) {
    .ft-grid-main { grid-template-columns: 2fr 1fr 1fr 1.4fr; gap: 2.5rem; }
  }

  /* ── Brand col ── */
  .ft-logo {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    text-decoration: none;
    margin-bottom: 1.1rem;
  }
  .ft-logo-icon {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, #7c3aed, #4f46e5);
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 3px 14px rgba(124,58,237,0.4);
    flex-shrink: 0;
  }
  .ft-logo-text {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.3rem;
    color: #f1f5f9;
    letter-spacing: -0.02em;
  }
  .ft-logo-accent {
    background: linear-gradient(135deg, #a78bfa, #60a5fa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .ft-tagline {
    font-size: 0.85rem;
    color: #475569;
    line-height: 1.7;
    max-width: 300px;
    margin-bottom: 1.75rem;
    font-weight: 300;
  }

  /* Newsletter strip */
  .ft-newsletter {
    display: flex;
    align-items: center;
    gap: 0;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    overflow: hidden;
    max-width: 320px;
    transition: border-color 0.2s;
  }
  .ft-newsletter:focus-within {
    border-color: rgba(139,92,246,0.4);
    box-shadow: 0 0 0 3px rgba(124,58,237,0.08);
  }
  .ft-newsletter-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    padding: 0.65rem 0.9rem;
    font-size: 0.8rem;
    color: #e2e8f0;
    font-family: 'DM Sans', sans-serif;
  }
  .ft-newsletter-input::placeholder { color: #475569; }
  .ft-newsletter-btn {
    padding: 0.65rem 0.85rem;
    background: linear-gradient(135deg, #7c3aed, #4f46e5);
    border: none;
    cursor: pointer;
    display: flex; align-items: center;
    color: #fff;
    transition: opacity 0.2s;
    flex-shrink: 0;
  }
  .ft-newsletter-btn:hover { opacity: 0.85; }

  /* ── Column headers ── */
  .ft-col-title {
    font-family: 'Syne', sans-serif;
    font-size: 0.78rem;
    font-weight: 700;
    color: #e2e8f0;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .ft-col-title::before {
    content: '';
    display: inline-block;
    width: 16px; height: 1.5px;
    background: linear-gradient(90deg, #7c3aed, #60a5fa);
    border-radius: 2px;
  }

  /* ── Links ── */
  .ft-links { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.6rem; }
  .ft-link {
    font-size: 0.83rem;
    color: #475569;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    transition: color 0.2s, gap 0.2s;
    width: fit-content;
  }
  .ft-link::before {
    content: '›';
    color: #7c3aed;
    opacity: 0;
    font-size: 1rem;
    line-height: 1;
    transition: opacity 0.2s;
  }
  .ft-link:hover { color: #c4b5fd; }
  .ft-link:hover::before { opacity: 1; }

  /* ── Contact items ── */
  .ft-contact-list { display: flex; flex-direction: column; gap: 0.85rem; }
  .ft-contact-item {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    font-size: 0.82rem;
    color: #475569;
    line-height: 1.5;
  }
  .ft-contact-icon {
    width: 28px; height: 28px;
    background: rgba(139,92,246,0.1);
    border: 1px solid rgba(139,92,246,0.18);
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }

  /* ── Social icons ── */
  .ft-socials {
    display: flex;
    gap: 0.6rem;
    margin-top: 1.5rem;
    flex-wrap: wrap;
  }
  .ft-social-btn {
    width: 36px; height: 36px;
    border-radius: 9px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    display: flex; align-items: center; justify-content: center;
    color: #64748b;
    text-decoration: none;
    transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.2s;
  }
  .ft-social-btn:hover {
    background: rgba(139,92,246,0.15);
    border-color: rgba(139,92,246,0.35);
    color: #a78bfa;
    transform: translateY(-2px);
  }

  /* ── Divider ── */
  .ft-divider {
    height: 1px;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(139,92,246,0.2) 20%,
      rgba(139,92,246,0.3) 50%,
      rgba(59,130,246,0.15) 80%,
      transparent 100%
    );
    margin-bottom: 2rem;
  }

  /* ── Bottom bar ── */
  .ft-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .ft-copyright {
    font-size: 0.77rem;
    color: #334155;
  }
  .ft-copyright span { color: #7c3aed; }
  .ft-bottom-links {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    flex-wrap: wrap;
  }
  .ft-bottom-link {
    font-size: 0.75rem;
    color: #334155;
    text-decoration: none;
    transition: color 0.2s;
  }
  .ft-bottom-link:hover { color: #a78bfa; }
  .ft-bottom-sep {
    width: 3px; height: 3px;
    border-radius: 50%;
    background: #1e293b;
  }

  /* ── AI badge ── */
  .ft-ai-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.3rem 0.75rem;
    background: rgba(139,92,246,0.1);
    border: 1px solid rgba(139,92,246,0.2);
    border-radius: 999px;
    font-size: 0.7rem;
    color: #a78bfa;
    letter-spacing: 0.06em;
    font-weight: 500;
  }
`;

/* ── Social SVG paths ── */
const socials = [
  {
    label: 'Facebook',
    href: '#',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    label: 'Twitter / X',
    href: '#',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.261 5.635L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z',
  },
  {
    label: 'Instagram',
    href: '#',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  },
];

const Footer = () => (
  <>
    <style dangerouslySetInnerHTML={{ __html: FOOTER_STYLES }} />

    <footer className="ft-root">
      {/* Decorative layers */}
      <div className="ft-top-glow" />
      <div className="ft-orb ft-orb-l" />
      <div className="ft-orb ft-orb-r" />
      <div className="ft-grid" />

      <div className="ft-inner">
        {/* ── Main columns ── */}
        <div className="ft-grid-main">

          {/* Brand */}
          <div>
            <Link to="/" className="ft-logo">
              <span className="ft-logo-icon">
                <Sparkles size={15} color="#fff" />
              </span>
              <span className="ft-logo-text">
                Reco<span className="ft-logo-accent">Mart</span>
              </span>
            </Link>
            <p className="ft-tagline">
              Your smart shopping destination powered by AI — personalized recommendations curated for your taste, budget, and lifestyle.
            </p>
            <div className="ft-newsletter">
              <input
                className="ft-newsletter-input"
                type="email"
                placeholder="Get AI picks in your inbox"
              />
              <button className="ft-newsletter-btn" aria-label="Subscribe">
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="ft-col-title">Quick Links</div>
            <ul className="ft-links">
              {[
                { label: 'Home',           to: '/'              },
                { label: 'Products',       to: '/products'      },
                { label: 'Visual AI',      to: '/visual-style'  },
                { label: 'About',          to: '/about'         },
                { label: 'Contact',        to: '/contact'       },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="ft-link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="ft-col-title">Legal</div>
            <ul className="ft-links">
              {[
                { label: 'Privacy Policy',   to: '/privacy-policy' },
                { label: 'Terms of Service', to: '/terms'          },
                { label: 'Cookie Policy',    to: '/cookies'        },
                { label: 'Refund Policy',    to: '/refunds'        },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="ft-link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Social */}
          <div>
            <div className="ft-col-title">Get in Touch</div>
            <div className="ft-contact-list">
              <div className="ft-contact-item">
                <span className="ft-contact-icon">
                  <Mail size={12} color="#a78bfa" />
                </span>
                hello@recomart.ai
              </div>
              <div className="ft-contact-item">
                <span className="ft-contact-icon">
                  <Phone size={12} color="#a78bfa" />
                </span>
                +1 (800) 555-0199
              </div>
              <div className="ft-contact-item">
                <span className="ft-contact-icon">
                  <MapPin size={12} color="#a78bfa" />
                </span>
                San Francisco, CA 94103
              </div>
            </div>

            {/* Socials */}
            <div className="ft-socials">
              {socials.map(({ label, href, path }) => (
                <a key={label} href={href} className="ft-social-btn" aria-label={label}>
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="ft-divider" />

        {/* ── Bottom bar ── */}
        <div className="ft-bottom">
          <p className="ft-copyright">
            &copy; {currentYear} <span>RecoMart</span>. All rights reserved.
          </p>

          <div className="ft-ai-badge">
            <Sparkles size={10} />
            AI-Powered Shopping
          </div>

          <div className="ft-bottom-links">
            <Link to="/sitemap" className="ft-bottom-link">Sitemap</Link>
            <span className="ft-bottom-sep" />
            <Link to="/accessibility" className="ft-bottom-link">Accessibility</Link>
            <span className="ft-bottom-sep" />
            <Link to="/security" className="ft-bottom-link">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  </>
);

export default Footer;