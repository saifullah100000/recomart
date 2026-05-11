import { Link } from 'react-router-dom';
import { ShoppingBag, Sparkles, Star, TrendingUp } from 'lucide-react';

const HeroBanner = () => {
  return (
    <>
      <style>{`
        @keyframes hb-fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hb-fadeRight {
          from { opacity: 0; transform: translateX(32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes hb-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%       { transform: translateY(-10px) rotate(1deg); }
          66%       { transform: translateY(-5px) rotate(-1deg); }
        }
        @keyframes hb-floatSlow {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-14px); }
        }
        @keyframes hb-spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes hb-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.7; transform: scale(0.96); }
        }
        @keyframes hb-orb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(30px, -20px) scale(1.08); }
        }
        @keyframes hb-orb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(-20px, 15px) scale(1.06); }
        }
        @keyframes hb-shimmer {
          0%   { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(250%) skewX(-15deg); }
        }
        @keyframes hb-count-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .hb-section {
          position: relative;
          overflow: hidden;
          background: #0A0F1E;
          padding: 80px 0 90px;
        }

        /* Dot-grid background */
        .hb-dotgrid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
        }

        /* Ambient orbs */
        .hb-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .hb-orb-1 {
          width: 500px; height: 500px;
          background: rgba(124, 58, 237, 0.18);
          top: -120px; left: -80px;
          animation: hb-orb1 8s ease-in-out infinite;
        }
        .hb-orb-2 {
          width: 400px; height: 400px;
          background: rgba(37, 99, 235, 0.15);
          bottom: -100px; right: 5%;
          animation: hb-orb2 10s ease-in-out infinite;
        }
        .hb-orb-3 {
          width: 280px; height: 280px;
          background: rgba(217, 119, 6, 0.1);
          top: 30%; right: 25%;
          animation: hb-orb1 12s ease-in-out infinite reverse;
        }

        /* Inner container */
        .hb-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 48px;
        }

        /* ── Left column ── */
        .hb-left {
          flex: 1;
          min-width: 0;
        }

        .hb-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px 6px 8px;
          border-radius: 999px;
          background: rgba(124, 58, 237, 0.12);
          border: 1px solid rgba(124, 58, 237, 0.28);
          font-size: 12px;
          font-weight: 600;
          color: #c4b5fd;
          letter-spacing: 0.04em;
          margin-bottom: 24px;
          animation: hb-fadeUp 0.5s ease both;
        }
        .hb-pill-dot {
          width: 24px; height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7C3AED, #4F46E5);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 12px rgba(124,58,237,0.5);
        }

        .hb-h1 {
          font-size: clamp(36px, 5vw, 62px);
          font-weight: 800;
          color: #F8FAFC;
          line-height: 1.1;
          letter-spacing: -0.035em;
          margin: 0 0 8px;
          animation: hb-fadeUp 0.5s 0.1s ease both;
        }
        .hb-h1-accent {
          background: linear-gradient(135deg, #a78bfa, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hb-sub {
          font-size: clamp(15px, 2vw, 17px);
          color: #94a3b8;
          line-height: 1.7;
          max-width: 480px;
          margin: 16px 0 36px;
          animation: hb-fadeUp 0.5s 0.2s ease both;
        }

        /* CTA buttons */
        .hb-ctas {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 52px;
          animation: hb-fadeUp 0.5s 0.3s ease both;
        }
        .hb-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: 14px;
          background: linear-gradient(135deg, #7C3AED, #4F46E5);
          color: #fff;
          font-weight: 700;
          font-size: 15px;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 28px rgba(124,58,237,0.45);
          transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s;
          letter-spacing: -0.01em;
        }
        .hb-btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transform: translateX(-100%) skewX(-15deg);
        }
        .hb-btn-primary:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 12px 36px rgba(124,58,237,0.55); }
        .hb-btn-primary:hover::after { animation: hb-shimmer 0.6s ease forwards; }

        .hb-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.14);
          color: #cbd5e1;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          background: rgba(255,255,255,0.04);
          transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s;
          letter-spacing: -0.01em;
          backdrop-filter: blur(8px);
        }
        .hb-btn-ghost:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.22);
          color: #f1f5f9;
          transform: translateY(-2px);
        }

        /* Stats row */
        .hb-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 28px;
          animation: hb-fadeUp 0.5s 0.4s ease both;
        }
        .hb-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .hb-stat-value {
          font-size: 22px;
          font-weight: 800;
          color: #F8FAFC;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .hb-stat-label {
          font-size: 12px;
          color: #64748b;
          letter-spacing: 0.02em;
          font-weight: 500;
        }
        .hb-stat-divider {
          width: 1px;
          background: rgba(255,255,255,0.08);
          align-self: stretch;
        }

        /* ── Right column / visual ── */
        .hb-right {
          flex: 0 0 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: hb-fadeRight 0.6s 0.25s ease both;
        }
        @media (max-width: 1023px) { .hb-right { display: none; } }

        .hb-card-stack {
          position: relative;
          width: 360px;
          height: 400px;
        }

        /* Rotating ring */
        .hb-ring {
          position: absolute;
          inset: -24px;
          border-radius: 50%;
          border: 1.5px dashed rgba(124,58,237,0.25);
          animation: hb-spin-slow 20s linear infinite;
        }
        .hb-ring-dot {
          position: absolute;
          top: -4px; left: 50%;
          transform: translateX(-50%);
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #7C3AED;
          box-shadow: 0 0 10px rgba(124,58,237,0.7);
        }

        /* Main card */
        .hb-main-card {
          position: absolute;
          inset: 0;
          border-radius: 28px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          animation: hb-float 6s ease-in-out infinite;
          overflow: hidden;
        }
        .hb-main-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
        }

        /* Big icon in card */
        .hb-icon-wrap {
          width: 96px; height: 96px;
          border-radius: 26px;
          background: linear-gradient(135deg, #7C3AED, #4F46E5);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 16px 40px rgba(124,58,237,0.5);
          position: relative;
        }
        .hb-icon-wrap::after {
          content: '';
          position: absolute;
          inset: -8px;
          border-radius: 34px;
          border: 1px solid rgba(124,58,237,0.2);
        }

        /* Tag pills inside card */
        .hb-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          font-size: 12px;
          font-weight: 600;
          color: #e2e8f0;
        }
        .hb-tags { display: flex; gap: 10px; }

        /* Product mini-cards inside card */
        .hb-mini-cards { display: flex; gap: 10px; }
        .hb-mini {
          width: 72px; height: 72px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: center;
          font-size: 28px;
          transition: transform 0.3s;
        }
        .hb-mini:hover { transform: scale(1.08) rotate(-3deg); }

        /* Floating badge chips */
        .hb-float-chip {
          position: absolute;
          padding: 8px 14px;
          border-radius: 12px;
          background: rgba(10, 15, 30, 0.85);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #e2e8f0;
          white-space: nowrap;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }
        .chip-tl { top: -18px; left: -30px; animation: hb-floatSlow 4s ease-in-out infinite; }
        .chip-br { bottom: -18px; right: -30px; animation: hb-floatSlow 5s 1s ease-in-out infinite; }
        .chip-tr { top: 60px; right: -42px; animation: hb-floatSlow 6s 0.5s ease-in-out infinite; }
        .chip-dot { width: 8px; height: 8px; border-radius: 50%; }
      `}</style>

      <section className="hb-section">
        {/* Dot grid */}
        <div className="hb-dotgrid" />

        {/* Ambient orbs */}
        <div className="hb-orb hb-orb-1" />
        <div className="hb-orb hb-orb-2" />
        <div className="hb-orb hb-orb-3" />

        <div className="hb-inner">
          {/* ── LEFT ── */}
          <div className="hb-left">
            {/* Pill badge */}
            <div className="hb-pill">
              <span className="hb-pill-dot">
                <Sparkles style={{ width: 12, height: 12, color: '#fff' }} />
              </span>
              AI-Powered Shopping Experience
            </div>

            {/* Headline */}
            <h1 className="hb-h1">
              Discover{' '}
              <span className="hb-h1-accent">Amazing</span>
              <br />
              Products
            </h1>

            {/* Sub */}
            <p className="hb-sub">
              Personalized recommendations powered by AI — curated for your
              taste, your budget, and your lifestyle. Find exactly what you
              need, every time.
            </p>

            {/* CTAs */}
            <div className="hb-ctas">
              <Link to="/products" className="hb-btn-primary">
                <ShoppingBag style={{ width: 18, height: 18 }} />
                Shop Now
              </Link>
              <Link to="/categories" className="hb-btn-ghost">
                Browse Categories
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Stats */}
            <div className="hb-stats">
              {[
                { value: '50K+', label: 'Products' },
                null,
                { value: '4.9★', label: 'Avg. Rating' },
                null,
                { value: '200K+', label: 'Happy Customers' },
              ].map((s, i) =>
                s === null ? (
                  <div key={i} className="hb-stat-divider" />
                ) : (
                  <div key={i} className="hb-stat">
                    <span className="hb-stat-value">{s.value}</span>
                    <span className="hb-stat-label">{s.label}</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="hb-right">
            <div className="hb-card-stack">
              {/* Spinning ring */}
              <div className="hb-ring">
                <div className="hb-ring-dot" />
              </div>

              {/* Main floating card */}
              <div className="hb-main-card">
                <div className="hb-icon-wrap">
                  <ShoppingBag style={{ width: 44, height: 44, color: '#fff' }} />
                </div>

                <div className="hb-tags">
                  <span className="hb-tag">
                    <Star style={{ width: 13, height: 13, fill: '#fbbf24', color: '#fbbf24' }} />
                    Top Rated
                  </span>
                  <span className="hb-tag">
                    <TrendingUp style={{ width: 13, height: 13, color: '#4ade80' }} />
                    Trending
                  </span>
                </div>

                <div className="hb-mini-cards">
                  {['🎧', '👟', '⌨️'].map((emoji, i) => (
                    <div key={i} className="hb-mini">{emoji}</div>
                  ))}
                </div>
              </div>

              {/* Floating chips */}
              <div className="hb-float-chip chip-tl">
                <span className="chip-dot" style={{ background: '#4ade80', boxShadow: '0 0 6px rgba(74,222,128,0.5)' }} />
                12 new arrivals today
              </div>
              <div className="hb-float-chip chip-tr">
                <span className="chip-dot" style={{ background: '#fbbf24', boxShadow: '0 0 6px rgba(251,191,36,0.5)' }} />
                Free shipping over $50
              </div>
              <div className="hb-float-chip chip-br">
                <span className="chip-dot" style={{ background: '#a78bfa', boxShadow: '0 0 6px rgba(167,139,250,0.5)' }} />
                AI picks just for you
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroBanner;