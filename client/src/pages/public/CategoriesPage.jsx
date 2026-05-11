import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { Grid3X3, ChevronRight, Sparkles } from 'lucide-react';

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  .categories-page {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #080b1a;
    position: relative;
    overflow-x: hidden;
  }

  /* Ambient orbs */
  .cat-orb {
    position: fixed; border-radius: 50%;
    pointer-events: none; filter: blur(110px); z-index: 0;
  }
  .cat-orb-1 {
    width: 520px; height: 520px;
    background: radial-gradient(circle, rgba(109,40,217,0.15) 0%, transparent 65%);
    top: -140px; left: -140px;
  }
  .cat-orb-2 {
    width: 380px; height: 380px;
    background: radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 65%);
    bottom: -80px; right: -80px;
  }

  /* Grid texture */
  .cat-grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(139,92,246,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139,92,246,0.035) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  /* ── Inner ── */
  .categories-inner {
    position: relative; z-index: 1;
    max-width: 1280px; margin: 0 auto;
    padding: 3rem 1.5rem 5rem;
  }

  /* ── Header ── */
  .categories-header {
    display: flex; align-items: center; gap: 0.75rem;
    margin-bottom: 0.5rem;
  }
  .categories-header-icon {
    width: 42px; height: 42px; border-radius: 12px;
    background: rgba(124,58,237,0.15); border: 1px solid rgba(139,92,246,0.25);
    display: flex; align-items: center; justify-content: center; color: #7c3aed;
    flex-shrink: 0;
    box-shadow: 0 3px 12px rgba(124,58,237,0.2);
  }
  .categories-header h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.4rem, 3vw, 1.85rem);
    font-weight: 800; color: #f1f5f9;
    letter-spacing: -0.02em; margin: 0; line-height: 1.1;
  }
  .categories-header h1 span {
    background: linear-gradient(135deg, #a78bfa, #60a5fa);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .categories-sub {
    font-size: 0.82rem; color: #334155;
    margin: 0 0 2.25rem 3.5rem;
    font-weight: 300;
  }

  /* ── Grid ── */
  .categories-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
  @media (max-width: 1024px) { .categories-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 640px)  { .categories-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; } }

  /* ── Category card ── */
  .cat-card {
    position: relative; overflow: hidden;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(139,92,246,0.12);
    border-radius: 16px; padding: 1.4rem 1.25rem;
    cursor: pointer;
    transition: border-color 0.22s, background 0.22s, box-shadow 0.22s, transform 0.22s;
    display: flex; flex-direction: column; gap: 0.5rem;
    backdrop-filter: blur(8px);
  }
  .cat-card::before {
    content: '';
    position: absolute; bottom: -40px; right: -40px;
    width: 120px; height: 120px;
    background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%);
    pointer-events: none; transition: opacity 0.22s ease;
    opacity: 0;
  }
  .cat-card:hover {
    border-color: rgba(139,92,246,0.38);
    background: rgba(139,92,246,0.07);
    box-shadow: 0 8px 32px rgba(124,58,237,0.15), 0 0 0 1px rgba(139,92,246,0.18);
    transform: translateY(-3px);
  }
  .cat-card:hover::before { opacity: 1; }
  .cat-card:hover .cat-arrow { opacity: 1; transform: translateX(0); }
  .cat-card:hover .cat-icon-wrap {
    background: rgba(124,58,237,0.22);
    border-color: rgba(139,92,246,0.38);
  }

  /* Icon */
  .cat-icon-wrap {
    width: 38px; height: 38px; border-radius: 10px;
    background: rgba(124,58,237,0.1); border: 1px solid rgba(139,92,246,0.18);
    display: flex; align-items: center; justify-content: center;
    color: #7c3aed; margin-bottom: 0.25rem;
    transition: background 0.2s, border-color 0.2s; flex-shrink: 0;
  }

  /* Text */
  .cat-name {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem; font-weight: 600; color: #e2e8f0;
    line-height: 1.3;
  }
  .cat-desc {
    font-size: 0.75rem; color: #334155;
    line-height: 1.55; font-weight: 300;
    display: -webkit-box; -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden;
  }

  /* Arrow */
  .cat-arrow {
    position: absolute; top: 1.1rem; right: 1rem;
    color: rgba(124,58,237,0.55);
    opacity: 0; transform: translateX(-5px);
    transition: opacity 0.2s, transform 0.2s;
  }

  /* ── Skeleton ── */
  .skeleton-card {
    background: rgba(139,92,246,0.03);
    border: 1px solid rgba(139,92,246,0.07);
    border-radius: 16px; padding: 1.4rem 1.25rem;
    display: flex; flex-direction: column; gap: 0.65rem;
  }
  .skeleton-line {
    border-radius: 6px;
    background: linear-gradient(90deg,
      rgba(139,92,246,0.06) 25%,
      rgba(139,92,246,0.12) 50%,
      rgba(139,92,246,0.06) 75%
    );
    background-size: 200% 100%;
    animation: cat-shimmer 1.5s infinite;
  }
  @keyframes cat-shimmer { to { background-position: -200% 0; } }
`;

const SKELETON_COUNT = 8;

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data.categories || data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="categories-page">
      <style>{PAGE_STYLES}</style>
      <div className="cat-orb cat-orb-1" />
      <div className="cat-orb cat-orb-2" />
      <div className="cat-grid-bg" />

      <div className="categories-inner">
        {/* Header */}
        <div className="categories-header">
          <div className="categories-header-icon"><Grid3X3 size={20} /></div>
          <h1>Browse <span>Categories</span></h1>
        </div>
        <p className="categories-sub">Find exactly what you're looking for.</p>

        {/* Grid */}
        <div className="categories-grid">
          {loading
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-line" style={{ width: 38, height: 38, borderRadius: 10 }} />
                  <div className="skeleton-line" style={{ width: '65%', height: 13 }} />
                  <div className="skeleton-line" style={{ width: '90%', height: 11 }} />
                  <div className="skeleton-line" style={{ width: '70%', height: 11 }} />
                </div>
              ))
            : categories.map((cat) => (
                <div
                  key={cat._id || cat.id}
                  className="cat-card"
                  onClick={() => navigate(`/category/${cat.slug || cat.name}`)}
                >
                  <ChevronRight size={14} className="cat-arrow" />
                  <div className="cat-icon-wrap">
                    <Sparkles size={16} />
                  </div>
                  <div className="cat-name">{cat.name}</div>
                  <div className="cat-desc">{cat.description || 'Explore products'}</div>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;