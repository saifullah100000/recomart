import { useState, useEffect } from 'react';
import { Award } from 'lucide-react';
import api from '../../api/axios';
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
    className="fp-skeleton"
  >
    {/* Image placeholder */}
    <div
      style={{
        width: '100%',
        height: 200,
        background: 'rgba(255,255,255,0.06)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="fp-shimmer" />
    </div>

    {/* Content placeholder */}
    <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ height: 12, borderRadius: 8, background: 'rgba(255,255,255,0.07)', width: '75%' }} />
      <div style={{ height: 12, borderRadius: 8, background: 'rgba(255,255,255,0.05)', width: '50%' }} />
      <div style={{ height: 20, borderRadius: 8, background: 'rgba(255,255,255,0.07)', width: '38%', marginTop: 4 }} />
      <div style={{ height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.05)', marginTop: 6 }} />
    </div>
  </div>
);

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/products', {
          params: { sort: 'rating', limit: 8 },
        });
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes fp-fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fp-shimmer-move {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes fp-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }

        .fp-skeleton {
          animation: fp-pulse 1.7s ease-in-out infinite;
        }
        .fp-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255,255,255,0.06) 50%,
            transparent 100%
          );
          animation: fp-shimmer-move 1.8s ease-in-out infinite;
        }

        .fp-card-wrap {
          animation: fp-fadeUp 0.45s ease both;
        }

        .fp-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }
        @media (min-width: 768px) {
          .fp-grid { grid-template-columns: repeat(3, 1fr); gap: 18px; }
        }
        @media (min-width: 1024px) {
          .fp-grid { grid-template-columns: repeat(4, 1fr); }
        }

        /* ── Badge pill on header ── */
        .fp-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 12px;
          border-radius: 999px;
          background: rgba(234,179,8,0.12);
          border: 1px solid rgba(234,179,8,0.22);
          font-size: 11px;
          font-weight: 600;
          color: #fbbf24;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .fp-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #fbbf24;
          box-shadow: 0 0 6px 2px rgba(251,191,36,0.5);
          animation: fp-pulse 2s ease-in-out infinite;
        }

        /* ── Divider accent line ── */
        .fp-divider {
          width: 40px;
          height: 3px;
          border-radius: 4px;
          background: linear-gradient(90deg, #7C3AED, #4F46E5);
          margin: 8px 0 0;
        }

        /* ── View all link ── */
        .fp-view-all {
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
          cursor: pointer;
          letter-spacing: 0.01em;
        }
        .fp-view-all:hover {
          background: rgba(167,139,250,0.12);
          border-color: rgba(167,139,250,0.35);
          color: #c4b5fd;
        }
        .fp-view-all svg {
          transition: transform 0.2s;
        }
        .fp-view-all:hover svg {
          transform: translateX(3px);
        }
      `}</style>

      <section
        style={{
          padding: '72px 0',
          background: '#0A0F1E',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient glows — different positions from CategoryGrid for variety */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse 55% 45% at 80% 70%, rgba(124,58,237,0.1) 0%, transparent 60%),' +
              'radial-gradient(ellipse 45% 35% at 10% 25%, rgba(234,179,8,0.07) 0%, transparent 55%)',
          }}
        />

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
              {/* Live badge */}
              <div style={{ marginBottom: 12 }}>
                <span className="fp-badge">
                  <span className="fp-badge-dot" />
                  Top Rated
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: 'linear-gradient(135deg, #D97706, #CA8A04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(217,119,6,0.4)',
                    flexShrink: 0,
                  }}
                >
                  <Award style={{ width: 20, height: 20, color: '#fff' }} />
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
                    Featured Products
                  </h2>
                  <div className="fp-divider" />
                </div>
              </div>

              <p
                style={{
                  fontSize: 14,
                  color: '#64748b',
                  marginTop: 10,
                  letterSpacing: '0.01em',
                }}
              >
                Hand-picked, highest-rated items just for you
              </p>
            </div>

            {/* View all button — only when loaded */}
            {!loading && (
              <a href="/products?sort=rating" className="fp-view-all">
                View all
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            )}
          </div>

          {/* ── Product Grid ── */}
          <div className="fp-grid">
            {loading
              ? [...Array(8)].map((_, i) => <SkeletonCard key={i} delay={i * 60} />)
              : products.map((product, i) => (
                  <div
                    key={product._id}
                    className="fp-card-wrap"
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

export default FeaturedProducts;