import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import api from '../../api/axios';
import ProductCard from './ProductCard';

/* ── Skeleton card ── */
const SkeletonCard = ({ delay = 0 }) => (
  <div className="sp-skeleton" style={{ animationDelay: `${delay}ms` }}>
    <div style={{ height: 192, background: 'rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
      <div className="sp-shimmer" />
    </div>
    <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 9 }}>
      <div style={{ height: 11, borderRadius: 7, background: 'rgba(255,255,255,0.07)', width: '72%' }} />
      <div style={{ height: 11, borderRadius: 7, background: 'rgba(255,255,255,0.05)', width: '48%' }} />
      <div style={{ height: 18, borderRadius: 7, background: 'rgba(255,255,255,0.07)', width: '36%', marginTop: 4 }} />
    </div>
  </div>
);

const SimilarProducts = ({ productId }) => {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [canLeft, setCanLeft]     = useState(false);
  const [canRight, setCanRight]   = useState(true);
  const [progress, setProgress]   = useState(0);       // 0–100
  const scrollRef                 = useRef(null);

  useEffect(() => {
    const fetchSimilar = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/recommendations/similar/${productId}`);
        setProducts(data.products || []);
      } catch (err) {
        console.error('Failed to fetch similar products:', err);
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchSimilar();
  }, [productId]);

  /* ── Scroll tracking ── */
  const updateScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const max = scrollWidth - clientWidth;
    setCanLeft(scrollLeft > 8);
    setCanRight(scrollLeft < max - 8);
    setProgress(max > 0 ? (scrollLeft / max) * 100 : 0);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();
    return () => el.removeEventListener('scroll', updateScroll);
  }, [products, updateScroll]);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -296 : 296, behavior: 'smooth' });
  };

  if (!loading && products.length === 0) return null;

  const showArrows = products.length > 3;

  return (
    <>
      <style>{`
        @keyframes sp-fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sp-shimmer  { 0%{transform:translateX(-100%)} 100%{transform:translateX(220%)} }
        @keyframes sp-pulse    { 0%,100%{opacity:1} 50%{opacity:.42} }
        @keyframes sp-arrow-bounce {
          0%,100%{ transform:translateX(0); }
          50%    { transform:translateX(2px); }
        }
        @keyframes sp-arrow-bounce-l {
          0%,100%{ transform:translateX(0); }
          50%    { transform:translateX(-2px); }
        }

        /* ── Section ── */
        .sp-section {
          padding: 56px 0 64px;
          background: #0A0F1E;
          position: relative;
          overflow: hidden;
        }

        /* Ambient glow — teal/cyan */
        .sp-glow {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 50% 60% at 0% 50%, rgba(8,145,178,0.1) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 100% 30%, rgba(20,184,166,0.08) 0%, transparent 55%);
        }

        .sp-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 1;
        }

        /* ── Header ── */
        .sp-header {
          display: flex; align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 24px;
          gap: 16px; flex-wrap: wrap;
        }

        .sp-pill {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 4px 13px 4px 7px; border-radius: 999px;
          background: rgba(8,145,178,0.12); border: 1px solid rgba(8,145,178,0.28);
          font-size: 10px; font-weight: 700; color: #67e8f9;
          letter-spacing: .05em; text-transform: uppercase; margin-bottom: 10px;
        }
        .sp-pill-dot {
          width: 20px; height: 20px; border-radius: 50%;
          background: linear-gradient(135deg, #0891B2, #0D9488);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 10px rgba(8,145,178,0.5);
        }

        .sp-title-row { display: flex; align-items: center; gap: 13px; }
        .sp-title-icon {
          width: 42px; height: 42px; border-radius: 13px;
          background: linear-gradient(135deg, #0891B2, #0D9488);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 22px rgba(8,145,178,0.42); flex-shrink: 0;
        }
        .sp-title {
          font-size: clamp(18px,2.5vw,22px); font-weight: 700;
          color: #F8FAFC; letter-spacing: -.025em; margin: 0;
        }
        .sp-divider {
          width: 36px; height: 3px; border-radius: 4px;
          background: linear-gradient(90deg, #0891B2, #0D9488);
          margin-top: 7px;
        }
        .sp-sub {
          font-size: 13px; color: #64748b; margin-top: 8px; letter-spacing: .01em;
        }

        /* ── Arrow buttons ── */
        .sp-arrows { display: flex; align-items: center; gap: 8px; }
        .sp-arrow {
          width: 38px; height: 38px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #94a3b8;
          transition: background .2s, border-color .2s, color .2s, opacity .2s, transform .2s;
        }
        .sp-arrow:not(:disabled):hover {
          background: rgba(8,145,178,0.2);
          border-color: rgba(8,145,178,0.4);
          color: #67e8f9;
          transform: scale(1.08);
        }
        .sp-arrow:disabled { opacity: 0.25; cursor: not-allowed; }
        .sp-arrow.right:not(:disabled) svg { animation: sp-arrow-bounce 1.4s ease-in-out infinite; }
        .sp-arrow.left:not(:disabled)  svg { animation: sp-arrow-bounce-l 1.4s ease-in-out infinite; }

        /* ── Scroll container ── */
        .sp-scroll-wrap {
          position: relative;
        }

        /* Edge fade masks */
        .sp-fade-l, .sp-fade-r {
          position: absolute; top: 0; bottom: 20px; width: 64px;
          z-index: 2; pointer-events: none;
          transition: opacity .25s;
        }
        .sp-fade-l { left: 0;  background: linear-gradient(to right, #0A0F1E, transparent); }
        .sp-fade-r { right: 0; background: linear-gradient(to left,  #0A0F1E, transparent); }

        .sp-track {
          display: flex; gap: 14px;
          overflow-x: auto; padding-bottom: 16px;
          scroll-snap-type: x mandatory;
          scrollbar-width: none; -ms-overflow-style: none;
        }
        .sp-track::-webkit-scrollbar { display: none; }

        /* Card slot */
        .sp-card-slot {
          flex-shrink: 0; width: 256px;
          scroll-snap-align: start;
          animation: sp-fadeUp .42s ease both;
        }

        /* ── Skeleton ── */
        .sp-skeleton {
          flex-shrink: 0; width: 256px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.04);
          overflow: hidden;
          animation: sp-pulse 1.7s ease-in-out infinite;
        }
        .sp-shimmer {
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%);
          animation: sp-shimmer 1.8s ease-in-out infinite;
        }

        /* ── Progress bar ── */
        .sp-progress-wrap {
          margin-top: 4px;
          height: 3px; border-radius: 999px;
          background: rgba(255,255,255,0.06);
          overflow: hidden;
        }
        .sp-progress-fill {
          height: 100%; border-radius: 999px;
          background: linear-gradient(90deg, #0891B2, #0D9488);
          transition: width .18s ease;
          box-shadow: 0 0 8px rgba(8,145,178,0.5);
        }
      `}</style>

      <section className="sp-section">
        <div className="sp-glow" />

        <div className="sp-inner">

          {/* ── Header ── */}
          <div className="sp-header">
            <div>
              <div className="sp-pill">
                <span className="sp-pill-dot">
                  <Layers style={{ width: 11, height: 11, color: '#fff' }} />
                </span>
                You may also like
              </div>

              <div className="sp-title-row">
                <div className="sp-title-icon">
                  <Layers style={{ width: 19, height: 19, color: '#fff' }} />
                </div>
                <div>
                  <h3 className="sp-title">Similar Products</h3>
                  <div className="sp-divider" />
                </div>
              </div>

              <p className="sp-sub">Picked based on what others viewed with this item</p>
            </div>

            {/* Arrows — top right */}
            {showArrows && (
              <div className="sp-arrows">
                <button
                  className="sp-arrow left"
                  disabled={!canLeft}
                  onClick={() => scroll('left')}
                  aria-label="Scroll left"
                >
                  <ChevronLeft style={{ width: 17, height: 17 }} />
                </button>
                <button
                  className="sp-arrow right"
                  disabled={!canRight}
                  onClick={() => scroll('right')}
                  aria-label="Scroll right"
                >
                  <ChevronRight style={{ width: 17, height: 17 }} />
                </button>
              </div>
            )}
          </div>

          {/* ── Carousel ── */}
          <div className="sp-scroll-wrap">
            {/* Edge fades */}
            <div className="sp-fade-l" style={{ opacity: canLeft  ? 1 : 0 }} />
            <div className="sp-fade-r" style={{ opacity: canRight ? 1 : 0 }} />

            {loading ? (
              <div className="sp-track">
                {[...Array(4)].map((_, i) => (
                  <SkeletonCard key={i} delay={i * 70} />
                ))}
              </div>
            ) : (
              <div className="sp-track" ref={scrollRef}>
                {products.map((product, i) => (
                  <div
                    key={product._id}
                    className="sp-card-slot"
                    style={{ animationDelay: `${i * 55}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Scroll progress bar ── */}
          {!loading && showArrows && (
            <div className="sp-progress-wrap">
              <div className="sp-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          )}

        </div>
      </section>
    </>
  );
};

export default SimilarProducts;