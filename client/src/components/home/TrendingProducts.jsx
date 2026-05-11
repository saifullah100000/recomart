import { useState, useEffect } from 'react';
import { TrendingUp, Flame, ArrowRight, Sparkles } from 'lucide-react';
import api from '../../api/axios';
import ProductCard from '../product/ProductCard';

/* ─── Keyframe styles injected once ─────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .tp-section {
    position: relative;
    padding: 5rem 0;
    background: #080b1a;
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
  }

  /* Ambient glow blobs */
  .tp-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    pointer-events: none;
    z-index: 0;
  }
  .tp-blob-1 {
    width: 480px; height: 480px;
    background: radial-gradient(circle, rgba(109,40,217,0.22) 0%, transparent 70%);
    top: -120px; left: -100px;
  }
  .tp-blob-2 {
    width: 360px; height: 360px;
    background: radial-gradient(circle, rgba(59,130,246,0.13) 0%, transparent 70%);
    bottom: -80px; right: -60px;
  }
  .tp-blob-3 {
    width: 260px; height: 260px;
    background: radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%);
    top: 40%; left: 55%;
  }

  /* Subtle grid overlay */
  .tp-grid-overlay {
    position: absolute;
    inset: 0;
    z-index: 0;
    background-image:
      linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  /* Content wrapper */
  .tp-container {
    position: relative;
    z-index: 1;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  /* ── Header ── */
  .tp-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 2.5rem;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .tp-header-left {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .tp-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.85rem;
    background: rgba(139,92,246,0.15);
    border: 1px solid rgba(139,92,246,0.3);
    border-radius: 999px;
    color: #a78bfa;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    width: fit-content;
  }
  .tp-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.75rem, 3.5vw, 2.5rem);
    font-weight: 800;
    color: #f1f5f9;
    line-height: 1.1;
    margin: 0;
  }
  .tp-title span {
    background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .tp-subtitle {
    color: #64748b;
    font-size: 0.9rem;
    font-weight: 300;
    margin: 0.25rem 0 0;
    max-width: 340px;
    line-height: 1.6;
  }

  /* View All link */
  .tp-view-all {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.55rem 1.25rem;
    background: rgba(139,92,246,0.1);
    border: 1px solid rgba(139,92,246,0.25);
    border-radius: 10px;
    color: #a78bfa;
    font-size: 0.85rem;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, transform 0.2s;
    white-space: nowrap;
    align-self: flex-start;
  }
  .tp-view-all:hover {
    background: rgba(139,92,246,0.2);
    border-color: rgba(139,92,246,0.5);
    transform: translateX(2px);
  }
  .tp-view-all svg {
    transition: transform 0.2s;
  }
  .tp-view-all:hover svg {
    transform: translateX(3px);
  }

  /* ── Live indicator strip ── */
  .tp-live-strip {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
    padding: 0.75rem 1.25rem;
    background: rgba(15,20,40,0.7);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    backdrop-filter: blur(12px);
    overflow-x: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .tp-live-strip::-webkit-scrollbar { display: none; }
  .tp-live-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 0 3px rgba(34,197,94,0.2);
    flex-shrink: 0;
    animation: tp-pulse 2s infinite;
  }
  @keyframes tp-pulse {
    0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.2); }
    50% { box-shadow: 0 0 0 6px rgba(34,197,94,0.1); }
  }
  .tp-live-text {
    color: #94a3b8;
    font-size: 0.78rem;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .tp-live-text strong { color: #e2e8f0; font-weight: 500; }
  .tp-divider {
    width: 1px; height: 16px;
    background: rgba(255,255,255,0.08);
    flex-shrink: 0;
  }
  .tp-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.2rem 0.65rem;
    border-radius: 6px;
    font-size: 0.72rem;
    font-weight: 500;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .tp-tag-hot { background: rgba(239,68,68,0.12); color: #f87171; border: 1px solid rgba(239,68,68,0.2); }
  .tp-tag-ai  { background: rgba(139,92,246,0.12); color: #a78bfa; border: 1px solid rgba(139,92,246,0.2); }
  .tp-tag-new { background: rgba(34,197,94,0.10); color: #4ade80; border: 1px solid rgba(34,197,94,0.18); }

  /* ── Grid ── */
  .tp-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  @media (min-width: 640px)  { .tp-grid { grid-template-columns: repeat(3, 1fr); gap: 1.25rem; } }
  @media (min-width: 1024px) { .tp-grid { grid-template-columns: repeat(4, 1fr); gap: 1.5rem; } }

  /* Card wrapper — stagger reveal */
  .tp-card-wrap {
    opacity: 0;
    transform: translateY(20px);
    animation: tp-rise 0.45s ease forwards;
  }
  @keyframes tp-rise {
    to { opacity: 1; transform: translateY(0); }
  }

  /* Rank badge overlay on each card */
  .tp-card-outer {
    position: relative;
  }
  .tp-rank {
    position: absolute;
    top: 0.6rem; left: 0.6rem;
    z-index: 10;
    width: 26px; height: 26px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 7px;
    font-family: 'Syne', sans-serif;
    font-size: 0.72rem;
    font-weight: 700;
    backdrop-filter: blur(8px);
    pointer-events: none;
  }
  .tp-rank-1 { background: rgba(251,191,36,0.25); color: #fbbf24; border: 1px solid rgba(251,191,36,0.35); }
  .tp-rank-2 { background: rgba(148,163,184,0.2); color: #cbd5e1; border: 1px solid rgba(148,163,184,0.3); }
  .tp-rank-3 { background: rgba(180,120,80,0.2);  color: #d4956a; border: 1px solid rgba(180,120,80,0.3); }
  .tp-rank-n { background: rgba(15,20,40,0.55);   color: #64748b; border: 1px solid rgba(255,255,255,0.08); }

  /* ── Skeleton ── */
  .tp-skeleton-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    overflow: hidden;
  }
  .tp-skel-img { width: 100%; height: 180px; background: rgba(255,255,255,0.05); }
  .tp-skel-body { padding: 1rem; display: flex; flex-direction: column; gap: 0.6rem; }
  .tp-skel-line {
    border-radius: 6px;
    background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.05) 75%);
    background-size: 200% 100%;
    animation: tp-shimmer 1.5s infinite;
  }
  @keyframes tp-shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── Bottom CTA strip ── */
  .tp-cta-strip {
    margin-top: 2.5rem;
    padding: 1.25rem 1.75rem;
    background: linear-gradient(135deg, rgba(109,40,217,0.15) 0%, rgba(59,130,246,0.10) 100%);
    border: 1px solid rgba(139,92,246,0.2);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    backdrop-filter: blur(12px);
  }
  .tp-cta-text {
    color: #94a3b8;
    font-size: 0.88rem;
  }
  .tp-cta-text strong { color: #e2e8f0; font-weight: 500; }
  .tp-cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.65rem 1.5rem;
    background: linear-gradient(135deg, #7c3aed, #4f46e5);
    border: none;
    border-radius: 10px;
    color: #fff;
    font-size: 0.85rem;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.2s;
    box-shadow: 0 4px 20px rgba(124,58,237,0.3);
    white-space: nowrap;
  }
  .tp-cta-btn:hover { opacity: 0.9; transform: translateY(-1px); }
`;

const StyleTag = () => (
  <style dangerouslySetInnerHTML={{ __html: STYLES }} />
);

const SkeletonCard = () => (
  <div className="tp-skeleton-card">
    <div className="tp-skel-img" />
    <div className="tp-skel-body">
      <div className="tp-skel-line" style={{ height: 14, width: '75%' }} />
      <div className="tp-skel-line" style={{ height: 12, width: '50%' }} />
      <div className="tp-skel-line" style={{ height: 18, width: '35%' }} />
      <div className="tp-skel-line" style={{ height: 38, width: '100%', marginTop: 4 }} />
    </div>
  </div>
);

const rankClass = (i) => {
  if (i === 0) return 'tp-rank tp-rank-1';
  if (i === 1) return 'tp-rank tp-rank-2';
  if (i === 2) return 'tp-rank tp-rank-3';
  return 'tp-rank tp-rank-n';
};

const TrendingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await api.get('/recommendations/trending');
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch trending products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <>
      <StyleTag />
      <section className="tp-section">
        {/* Ambient blobs */}
        <div className="tp-blob tp-blob-1" />
        <div className="tp-blob tp-blob-2" />
        <div className="tp-blob tp-blob-3" />
        <div className="tp-grid-overlay" />

        <div className="tp-container">
          {/* Header */}
          <div className="tp-header">
            <div className="tp-header-left">
              <span className="tp-badge">
                <TrendingUp size={11} />
                Real-time trends
              </span>
              <h2 className="tp-title">
                TRENDING <span>NOW</span>
              </h2>
              <p className="tp-subtitle">
                What everyone's reaching for — updated hourly by our AI engine.
              </p>
            </div>
            <button className="tp-view-all">
              View all <ArrowRight size={14} />
            </button>
          </div>

          {/* Live strip */}
          <div className="tp-live-strip">
            <span className="tp-live-dot" />
            <span className="tp-live-text"><strong>Live</strong> — refreshed just now</span>
            <span className="tp-divider" />
            <span className="tp-tag tp-tag-hot"><Flame size={10} /> Hot picks</span>
            <span className="tp-divider" />
            <span className="tp-tag tp-tag-ai"><Sparkles size={10} /> AI curated</span>
            <span className="tp-divider" />
            <span className="tp-tag tp-tag-new">✦ New arrivals</span>
          </div>

          {/* Grid */}
          <div className="tp-grid">
            {loading
              ? [...Array(8)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : products.slice(0, 8).map((product, i) => (
                  <div
                    key={product._id}
                    className="tp-card-wrap tp-card-outer"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <span className={rankClass(i)}>#{i + 1}</span>
                    <ProductCard product={product} />
                  </div>
                ))}
          </div>

          {/* Bottom CTA */}
          {!loading && products.length > 0 && (
            <div className="tp-cta-strip">
              <p className="tp-cta-text">
                <strong>Can't find what you're looking for?</strong>{' '}
                Let our AI find it for you — personalized to your taste.
              </p>
              <button className="tp-cta-btn">
                <Sparkles size={14} />
                Get AI Picks
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default TrendingProducts;