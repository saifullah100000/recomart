import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

  .nf-page {
    font-family: 'Outfit', sans-serif;
    min-height: 80vh;
    display: flex; align-items: center; justify-content: center;
    padding: 24px; position: relative; overflow: hidden;
  }

  /* Ambient orbs */
  .nf-page::before {
    content: '';
    position: absolute; top: -80px; left: 50%; transform: translateX(-50%);
    width: 500px; height: 300px;
    background: radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  .nf-inner {
    position: relative; z-index: 1;
    text-align: center; max-width: 480px;
  }

  /* Big 404 */
  .nf-number {
    font-size: clamp(96px, 18vw, 160px);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.04em;
    background: linear-gradient(180deg,
      rgba(139,92,246,0.25) 0%,
      rgba(109,40,217,0.06) 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 4px;
    position: relative;
    user-select: none;
  }

  /* Glowing underline under 404 */
  .nf-glow-bar {
    width: 80px; height: 3px;
    border-radius: 2px;
    background: linear-gradient(90deg, #7c3aed, #6d28d9);
    box-shadow: 0 0 14px rgba(124,58,237,0.5);
    margin: 0 auto 28px;
  }

  .nf-title {
    font-size: 24px; font-weight: 700; color: #fff;
    letter-spacing: -0.02em; margin: 0 0 12px;
  }
  .nf-title span {
    background: linear-gradient(90deg, #a78bfa, #818cf8);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .nf-sub {
    font-size: 14px; color: rgba(167,139,250,0.45);
    line-height: 1.6; margin: 0 0 36px;
  }

  /* Button */
  .nf-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 13px 28px; border-radius: 12px;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    border: none; color: #fff;
    font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600;
    text-decoration: none; cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 20px rgba(124,58,237,0.35);
  }
  .nf-btn:hover {
    background: linear-gradient(135deg, #6d28d9, #5b21b6);
    box-shadow: 0 6px 26px rgba(124,58,237,0.5);
    transform: translateY(-2px);
  }
`;

const NotFoundPage = () => (
  <div className="nf-page">
    <style>{PAGE_STYLES}</style>

    <div className="nf-inner">
      <div className="nf-number">404</div>
      <div className="nf-glow-bar" />
      <h2 className="nf-title">Page <span>Not Found</span></h2>
      <p className="nf-sub">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="nf-btn">
        <Home size={17} /> Go Home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;