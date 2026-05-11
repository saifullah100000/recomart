import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid } from 'lucide-react';
import api from '../../api/axios';

const CATEGORY_GRADIENTS = [
  ['#7C3AED', '#4F46E5'],
  ['#2563EB', '#0891B2'],
  ['#059669', '#0D9488'],
  ['#EA580C', '#D97706'],
  ['#DB2777', '#E11D48'],
  ['#0891B2', '#2563EB'],
  ['#D97706', '#CA8A04'],
  ['#7C3AED', '#DB2777'],
  ['#0D9488', '#059669'],
  ['#E11D48', '#DB2777'],
];

const SkeletonCard = () => (
  <div
    style={{
      borderRadius: '20px',
      border: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(255,255,255,0.04)',
      padding: '28px 20px',
      textAlign: 'center',
      animation: 'pulse 1.6s ease-in-out infinite',
    }}
  >
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: 16,
        background: 'rgba(255,255,255,0.08)',
        margin: '0 auto 16px',
      }}
    />
    <div
      style={{
        height: 12,
        borderRadius: 8,
        background: 'rgba(255,255,255,0.08)',
        width: '60%',
        margin: '0 auto 10px',
      }}
    />
    <div
      style={{
        height: 10,
        borderRadius: 8,
        background: 'rgba(255,255,255,0.04)',
        width: '35%',
        margin: '0 auto',
      }}
    />
  </div>
);

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data.categories || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (!loading && categories.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cat-card {
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.04);
          padding: 28px 20px;
          text-align: center;
          text-decoration: none;
          display: block;
          position: relative;
          overflow: hidden;
          transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1),
                      background 0.22s ease,
                      border-color 0.22s ease,
                      box-shadow 0.22s ease;
          animation: fadeSlideUp 0.45s ease both;
          cursor: pointer;
        }
        .cat-card:hover {
          transform: translateY(-6px) scale(1.02);
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.14);
          box-shadow: 0 24px 48px rgba(0,0,0,0.45);
        }
        .cat-card:hover .cat-icon {
          transform: scale(1.12) rotate(4deg);
        }
        .cat-card:hover .cat-name {
          color: #c4b5fd;
        }
        .cat-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
          box-shadow: 0 8px 24px rgba(0,0,0,0.35);
        }
        .cat-name {
          font-weight: 600;
          font-size: 14px;
          color: #f1f5f9;
          margin-bottom: 6px;
          transition: color 0.2s ease;
          letter-spacing: -0.01em;
        }
        .cat-count {
          font-size: 12px;
          color: #64748b;
          letter-spacing: 0.01em;
        }
        .cat-glow {
          position: absolute;
          inset: 0;
          border-radius: 20px;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .cat-card:hover .cat-glow {
          opacity: 1;
        }
        .section-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }
        @media (min-width: 640px) {
          .section-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1024px) {
          .section-grid { grid-template-columns: repeat(5, 1fr); }
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
        {/* Ambient background glows */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse 60% 50% at 15% 60%, rgba(124,58,237,0.12) 0%, transparent 60%),' +
              'radial-gradient(ellipse 50% 40% at 85% 20%, rgba(37,99,235,0.1) 0%, transparent 60%)',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 40 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(124,58,237,0.4)',
                flexShrink: 0,
              }}
            >
              <LayoutGrid style={{ width: 20, height: 20, color: '#fff' }} />
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
                Shop by Category
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: '#64748b',
                  margin: '4px 0 0',
                  letterSpacing: '0.01em',
                }}
              >
                Explore our curated collections
              </p>
            </div>
          </div>

          {/* ── Grid ── */}
          <div className="section-grid">
            {loading
              ? [...Array(10)].map((_, i) => <SkeletonCard key={i} />)
              : categories.map((category, index) => {
                  const [colorA, colorB] = CATEGORY_GRADIENTS[index % CATEGORY_GRADIENTS.length];
                  return (
                    <Link
                      key={category._id}
                      to={`/products?category=${category.slug}`}
                      className="cat-card"
                      style={{ animationDelay: `${index * 45}ms` }}
                    >
                      {/* Gradient glow overlay on hover */}
                      <div
                        className="cat-glow"
                        style={{
                          background: `radial-gradient(circle at 50% 0%, ${colorA}18 0%, transparent 70%)`,
                        }}
                      />

                      {/* Icon badge */}
                      <div
                        className="cat-icon"
                        style={{
                          background: `linear-gradient(135deg, ${colorA}, ${colorB})`,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 22,
                            fontWeight: 800,
                            color: '#fff',
                            lineHeight: 1,
                            textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                          }}
                        >
                          {category.name.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      <h3 className="cat-name">{category.name}</h3>
                      <p className="cat-count">{category.productCount || 0} Products</p>
                    </Link>
                  );
                })}
          </div>
        </div>
      </section>
    </>
  );
};

export default CategoryGrid;