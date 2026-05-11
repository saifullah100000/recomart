import { useEffect, useRef } from 'react';
import HeroBanner from '../../components/home/HeroBanner';
import CategoryGrid from '../../components/home/CategoryGrid';
import FeaturedProducts from '../../components/home/FeaturedProducts';
import TrendingProducts from '../../components/home/TrendingProducts';
import RecommendedProducts from '../../components/home/RecommendedProducts';

/* ─── Page-level styles ───────────────────────────────────────────────────── */
const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --hp-bg:        #080b1a;
    --hp-surface:   rgba(255,255,255,0.03);
    --hp-border:    rgba(255,255,255,0.06);
    --hp-purple:    #7c3aed;
    --hp-purple-lo: rgba(124,58,237,0.12);
    --hp-blue-lo:   rgba(59,130,246,0.10);
    --hp-text:      #f1f5f9;
    --hp-muted:     #64748b;
  }

  /* ── Page root ── */
  .hp-root {
    background: var(--hp-bg);
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
    font-family: 'DM Sans', sans-serif;
    color: var(--hp-text);
  }

  /* Global noise grain overlay for texture */
  .hp-root::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    opacity: 0.018;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
    background-size: 180px 180px;
  }

  /* ── Persistent vertical glow rail (left edge) ── */
  .hp-rail {
    position: fixed;
    top: 0; left: 0;
    width: 1px;
    height: 100vh;
    background: linear-gradient(to bottom,
      transparent 0%,
      rgba(139,92,246,0.35) 30%,
      rgba(139,92,246,0.35) 70%,
      transparent 100%
    );
    z-index: 100;
    pointer-events: none;
  }
  .hp-rail::after {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 1px;
    height: 100%;
    background: linear-gradient(to bottom,
      transparent 0%,
      rgba(139,92,246,0.5) 40%,
      rgba(139,92,246,0.5) 60%,
      transparent 100%
    );
    animation: hp-rail-travel 4s ease-in-out infinite alternate;
  }
  @keyframes hp-rail-travel {
    0%   { transform: translateY(-30%); opacity: 0.4; }
    100% { transform: translateY(30%);  opacity: 0.9; }
  }

  /* ── Inner content constraint ── */
  .hp-inner {
    position: relative;
    z-index: 1;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  /* ── Section wrapper ── */
  .hp-section {
    position: relative;
    padding: 4.5rem 0;
  }

  /* ── Decorative section divider ── */
  .hp-divider {
    position: relative;
    height: 1px;
    margin: 0;
    overflow: visible;
  }
  .hp-divider-line {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(139,92,246,0.2) 20%,
      rgba(139,92,246,0.35) 50%,
      rgba(59,130,246,0.2) 80%,
      transparent 100%
    );
  }
  .hp-divider-glow {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 120px; height: 20px;
    background: radial-gradient(ellipse, rgba(139,92,246,0.4) 0%, transparent 70%);
    filter: blur(6px);
  }
  /* Diamond accent at center */
  .hp-divider-diamond {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
    width: 7px; height: 7px;
    background: var(--hp-purple);
    box-shadow: 0 0 10px rgba(124,58,237,0.6);
  }

  /* ── Ambient floating orbs (fixed, decorative) ── */
  .hp-orb {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    filter: blur(120px);
  }
  .hp-orb-1 {
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(109,40,217,0.15) 0%, transparent 65%);
    top: -150px; left: -200px;
    animation: hp-drift1 14s ease-in-out infinite alternate;
  }
  .hp-orb-2 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 65%);
    top: 40vh; right: -180px;
    animation: hp-drift2 18s ease-in-out infinite alternate;
  }
  .hp-orb-3 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 65%);
    bottom: 10vh; left: 20%;
    animation: hp-drift3 22s ease-in-out infinite alternate;
  }
  @keyframes hp-drift1 {
    0%   { transform: translate(0, 0) scale(1); }
    100% { transform: translate(60px, 80px) scale(1.08); }
  }
  @keyframes hp-drift2 {
    0%   { transform: translate(0, 0) scale(1.05); }
    100% { transform: translate(-80px, -60px) scale(1); }
  }
  @keyframes hp-drift3 {
    0%   { transform: translate(0, 0); }
    100% { transform: translate(50px, -50px) scale(1.1); }
  }

  /* ── Scroll-reveal for sections ── */
  .hp-reveal {
    opacity: 0;
    transform: translateY(32px);
    transition: opacity 0.65s cubic-bezier(0.16,1,0.3,1),
                transform 0.65s cubic-bezier(0.16,1,0.3,1);
  }
  .hp-reveal.hp-visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── Section label chips ── */
  .hp-section-label {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.28rem 0.8rem;
    background: rgba(139,92,246,0.10);
    border: 1px solid rgba(139,92,246,0.22);
    border-radius: 999px;
    color: #a78bfa;
    font-size: 0.68rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
  .hp-section-label-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #a78bfa;
    animation: hp-dot-blink 2.5s ease-in-out infinite;
  }
  @keyframes hp-dot-blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.35; }
  }

  /* ── Page progress bar ── */
  .hp-progress {
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    background: linear-gradient(90deg, #7c3aed, #3b82f6, #7c3aed);
    background-size: 200% 100%;
    z-index: 9998;
    transition: width 0.1s linear;
    animation: hp-progress-shimmer 2.5s linear infinite;
    box-shadow: 0 0 8px rgba(124,58,237,0.5);
  }
  @keyframes hp-progress-shimmer {
    0%   { background-position: 0% 0; }
    100% { background-position: 200% 0; }
  }

  /* ── Full-bleed sections (TrendingProducts, RecommendedProducts) break out ── */
  .hp-breakout {
    margin-left: calc(-50vw + 50%);
    margin-right: calc(-50vw + 50%);
  }
`;

/* ── Intersection observer hook for scroll reveal ── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.hp-reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('hp-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -48px 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ── Scroll progress bar ── */
function useScrollProgress(ref) {
  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;
    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = `${(scrolled / total) * 100}%`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ref]);
}

/* ── Divider component ── */
const Divider = () => (
  <div className="hp-divider">
    <div className="hp-divider-line" />
    <div className="hp-divider-glow" />
    <div className="hp-divider-diamond" />
  </div>
);

/* ── Section label ── */
const SectionLabel = ({ children }) => (
  <div className="hp-section-label">
    <span className="hp-section-label-dot" />
    {children}
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────── */
const HomePage = () => {
  const progressRef = useRef(null);
  useReveal();
  useScrollProgress(progressRef);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PAGE_STYLES }} />

      {/* Progress bar */}
      <div ref={progressRef} className="hp-progress" style={{ width: '0%' }} />

      {/* Left glow rail */}
      <div className="hp-rail" />

      {/* Ambient background orbs */}
      <div className="hp-orb hp-orb-1" />
      <div className="hp-orb hp-orb-2" />
      <div className="hp-orb hp-orb-3" />

      <div className="hp-root">
        {/* ── Hero — full bleed, no constraint ── */}
        <HeroBanner />

        <div className="hp-inner">

          {/* ── Categories ── */}
          <Divider />
          <div className="hp-section hp-reveal">
            <SectionLabel>Shop by category</SectionLabel>
            <CategoryGrid />
          </div>

          {/* ── Featured Products ── */}
          <Divider />
          <div className="hp-section hp-reveal" style={{ transitionDelay: '80ms' }}>
            <SectionLabel>Editor's picks</SectionLabel>
            <FeaturedProducts />
          </div>
        </div>

        {/* ── Trending — full bleed breakout ── */}
        <Divider />
        <div className="hp-reveal" style={{ transitionDelay: '60ms' }}>
          <TrendingProducts />
        </div>

        <div className="hp-inner">
          {/* ── Recommended ── */}
          <Divider />
          <div className="hp-section hp-reveal" style={{ transitionDelay: '80ms' }}>
            <SectionLabel>Picked for you</SectionLabel>
            <RecommendedProducts />
          </div>
        </div>

        {/* ── Footer spacer glow ── */}
        <div style={{
          height: '120px',
          background: 'linear-gradient(to top, rgba(109,40,217,0.08) 0%, transparent 100%)',
          marginTop: '2rem',
          pointerEvents: 'none',
        }} />
      </div>
    </>
  );
};

export default HomePage;