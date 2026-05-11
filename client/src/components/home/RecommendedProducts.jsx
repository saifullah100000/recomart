import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
import ProductCard from '../product/ProductCard';

const SkeletonCard = ({ delay = 0 }) => (
  <div
    style={{
      borderRadius: 20,
      border: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(255,255,255,0.04)',
      overflow: 'hidden',
      animationDelay: `${delay}ms`,
    }}
    className="rp-skeleton"
  >
    <div style={{ width: '100%', height: 196, background: 'rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
      <div className="rp-shimmer" />
    </div>
    <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ height: 12, borderRadius: 8, background: 'rgba(255,255,255,0.07)', width: '72%' }} />
      <div style={{ height: 12, borderRadius: 8, background: 'rgba(255,255,255,0.05)', width: '48%' }} />
      <div style={{ height: 20, borderRadius: 8, background: 'rgba(255,255,255,0.07)', width: '36%', marginTop: 4 }} />
      <div style={{ height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.05)', marginTop: 6 }} />
    </div>
  </div>
);

const RecommendedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        let data;
        if (isAuthenticated) {
          const response = await api.get('/recommendations/for-you');
          data = response.data;
        } else {
          const response = await api.get('/products', {
            params: { sort: 'rating', limit: 8 },
          });
          data = response.data;
        }
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch recommended products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommended();
  }, [isAuthenticated]);

  if (!loading && products.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes rp-fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rp-shimmer-move {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(220%); }
        }
        @keyframes rp-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }
        @keyframes rp-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes rp-sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
          50%       { transform: scale(1.2) rotate(15deg); opacity: 0.85; }
        }

        .rp-skeleton { animation: rp-pulse 1.7s ease-in-out infinite; }
        .rp-shimmer {
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%);
          animation: rp-shimmer-move 1.8s ease-in-out infinite;
        }
        .rp-card-wrap {
          animation: rp-fadeUp 0.45s ease both;
        }
        .rp-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }
        @media (min-width: 768px)  { .rp-grid { grid-template-columns: repeat(3, 1fr); gap: 18px; } }
        @media (min-width: 1024px) { .rp-grid { grid-template-columns: repeat(4, 1fr); } }

        /* ── AI pill ── */
        .rp-ai-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 5px 14px 5px 8px;
          border-radius: 999px;
          background: rgba(139, 92, 246, 0.12);
          border: 1px solid rgba(139, 92, 246, 0.28);
          font-size: 11px;
          font-weight: 700;
          color: #c4b5fd;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .rp-ai-icon {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8B5CF6, #6D28D9);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 10px rgba(139,92,246,0.5);
          animation: rp-sparkle 3s ease-in-out infinite;
        }

        /* ── Auth-aware badge ── */
        .rp-mode-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
        }
        .rp-mode-badge.personal {
          background: rgba(74, 222, 128, 0.1);
          border: 1px solid rgba(74, 222, 128, 0.2);
          color: #4ade80;
        }
        .rp-mode-badge.popular {
          background: rgba(251, 191, 36, 0.1);
          border: 1px solid rgba(251, 191, 36, 0.2);
          color: #fbbf24;
        }
        .rp-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          animation: rp-pulse 2s ease-in-out infinite;
        }

        /* ── Divider ── */
        .rp-divider {
          width: 40px; height: 3px;
          border-radius: 4px;
          background: linear-gradient(90deg, #8B5CF6, #6D28D9);
          margin: 8px 0 0;
        }

        /* ── View all ── */
        .rp-view-all {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #a78bfa;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 10px;
          border: 1px solid rgba(167,139,250,0.2);
          background: rgba(167,139,250,0.06);
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          letter-spacing: 0.01em;
          cursor: pointer;
          white-space: nowrap;
        }
        .rp-view-all:hover {
          background: rgba(167,139,250,0.13);
          border-color: rgba(167,139,250,0.35);
          color: #c4b5fd;
        }
        .rp-view-all svg { transition: transform 0.2s; }
        .rp-view-all:hover svg { transform: translateX(3px); }

        /* ── DNA / AI line decoration ── */
        .rp-ai-line {
          position: absolute;
          top: 0; right: 0; bottom: 0;
          width: 320px;
          pointer-events: none;
          opacity: 0.35;
        }
      `}</style>

      <section
        style={{
          padding: '72px 0 80px',
          background: '#0A0F1E',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient glows — top-center violet + bottom-left cyan */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse 50% 60% at 50% -10%, rgba(139,92,246,0.13) 0%, transparent 60%),' +
              'radial-gradient(ellipse 40% 40% at 5% 90%, rgba(6,182,212,0.09) 0%, transparent 55%)',
          }}
        />

        {/* Subtle SVG grid lines — top-right decoration */}
        <svg
          className="rp-ai-line"
          viewBox="0 0 320 500"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMaxYMid slice"
        >
          {[...Array(8)].map((_, i) => (
            <line
              key={i}
              x1={i * 46}
              y1="0"
              x2={i * 46 + 80}
              y2="500"
              stroke="rgba(139,92,246,0.4)"
              strokeWidth="0.5"
              strokeDasharray="4 8"
            />
          ))}
          {[...Array(6)].map((_, i) => (
            <circle
              key={`c${i}`}
              cx={i % 2 === 0 ? i * 55 : i * 55 + 20}
              cy={60 + i * 75}
              r="3"
              fill="rgba(139,92,246,0.6)"
            />
          ))}
        </svg>

        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 24px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* ── Section Header ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: 36,
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <div>
              {/* AI pill */}
              <div className="rp-ai-pill">
                <span className="rp-ai-icon">
                  <Sparkles style={{ width: 11, height: 11, color: '#fff' }} />
                </span>
                AI Powered
              </div>

              {/* Title row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 44, height: 44,
                    borderRadius: 14,
                    background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(139,92,246,0.42)',
                    flexShrink: 0,
                  }}
                >
                  <Sparkles style={{ width: 20, height: 20, color: '#fff' }} />
                </div>
                <div>
                  <h2
                    style={{
                      fontSize: 'clamp(22px, 3vw, 30px)',
                      fontWeight: 700,
                      color: '#F8FAFC',
                      margin: 0,
                      letterSpacing: '-0.025em',
                      lineHeight: 1.2,
                    }}
                  >
                    {isAuthenticated ? 'Recommended For You' : 'You Might Like'}
                  </h2>
                  <div className="rp-divider" />
                </div>
              </div>

              {/* Sub + auth-aware badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                <p style={{ fontSize: 14, color: '#64748b', margin: 0, letterSpacing: '0.01em' }}>
                  {isAuthenticated
                    ? 'Curated by AI based on your browsing & purchase history'
                    : 'Top-rated picks loved by our community'}
                </p>
                {isAuthenticated ? (
                  <span className="rp-mode-badge personal">
                    <span className="rp-badge-dot" style={{ background: '#4ade80', boxShadow: '0 0 5px rgba(74,222,128,0.5)' }} />
                    Personalized
                  </span>
                ) : (
                  <span className="rp-mode-badge popular">
                    <span className="rp-badge-dot" style={{ background: '#fbbf24', boxShadow: '0 0 5px rgba(251,191,36,0.5)' }} />
                    Popular
                  </span>
                )}
              </div>
            </div>

            {/* View all */}
            {!loading && (
              <a
                href={isAuthenticated ? '/products?sort=recommended' : '/products?sort=rating'}
                className="rp-view-all"
              >
                View all
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            )}
          </div>

          {/* ── Grid ── */}
          <div className="rp-grid">
            {loading
              ? [...Array(8)].map((_, i) => <SkeletonCard key={i} delay={i * 60} />)
              : products.slice(0, 8).map((product, i) => (
                  <div
                    key={product._id}
                    className="rp-card-wrap"
                    style={{ animationDelay: `${i * 55}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default RecommendedProducts;