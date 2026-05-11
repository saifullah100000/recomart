import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, ChevronLeft, ChevronRight, Package, ShieldCheck, Sparkles } from 'lucide-react';
import api from '../../api/axios';
import ProductGrid from '../../components/product/ProductGrid';
import Loader from '../../components/common/Loader';

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const SS_STYLE_ID = 'ss-styles';
if (typeof document !== 'undefined' && !document.getElementById(SS_STYLE_ID)) {
  const tag = document.createElement('style');
  tag.id = SS_STYLE_ID;
  tag.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

    .ss-root {
      min-height: 100vh;
      background: #080b1a;
      font-family: 'DM Sans', sans-serif;
      color: #e2e8f0;
    }

    /* ── Banner ── */
    .ss-banner {
      position: relative;
      height: 220px;
      background: linear-gradient(135deg, #1a0533 0%, #0f172a 50%, #0a1628 100%);
      overflow: hidden;
    }
    @media (min-width: 768px) { .ss-banner { height: 280px; } }

    .ss-banner-img {
      position: absolute;
      inset: 0;
      width: 100%; height: 100%;
      object-fit: cover;
    }

    /* Purple/blue gradient overlay always on top of image */
    .ss-banner-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba(109,40,217,0.55) 0%,
        rgba(30,41,59,0.6) 50%,
        rgba(15,23,42,0.7) 100%
      );
    }

    /* Grid texture on banner */
    .ss-banner-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(139,92,246,0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(139,92,246,0.08) 1px, transparent 1px);
      background-size: 48px 48px;
      pointer-events: none;
    }

    /* Ambient glow inside banner */
    .ss-banner-glow {
      position: absolute;
      width: 400px; height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%);
      filter: blur(60px);
      top: -80px; left: -60px;
      pointer-events: none;
    }

    /* ── Inner wrapper ── */
    .ss-inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem 5rem;
    }

    /* ── Store info card ── */
    .ss-card {
      position: relative;
      margin-top: -64px;
      margin-bottom: 2.5rem;
      background: rgba(12,15,30,0.92);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(139,92,246,0.2);
      border-radius: 18px;
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      box-shadow: 0 16px 48px rgba(0,0,0,0.45);
    }
    @media (min-width: 640px) {
      .ss-card { flex-direction: row; align-items: center; }
    }

    /* Top accent */
    .ss-card::before {
      content: '';
      position: absolute;
      top: 0; left: 15%; right: 15%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent);
    }

    /* Logo */
    .ss-logo {
      width: 88px; height: 88px;
      border-radius: 16px;
      border: 2px solid rgba(139,92,246,0.3);
      overflow: hidden;
      flex-shrink: 0;
      background: rgba(255,255,255,0.03);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }
    .ss-logo img { width: 100%; height: 100%; object-fit: cover; }
    .ss-logo-initial {
      font-family: 'Syne', sans-serif;
      font-size: 2rem;
      font-weight: 800;
      background: linear-gradient(135deg, #a78bfa, #60a5fa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Store details */
    .ss-details { flex: 1; min-width: 0; }
    .ss-store-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.2rem 0.65rem;
      background: rgba(139,92,246,0.1);
      border: 1px solid rgba(139,92,246,0.22);
      border-radius: 999px;
      font-size: 0.65rem;
      color: #a78bfa;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
    .ss-store-name {
      font-family: 'Syne', sans-serif;
      font-size: clamp(1.2rem, 2.5vw, 1.6rem);
      font-weight: 800;
      color: #f1f5f9;
      margin: 0 0 0.4rem;
      line-height: 1.2;
    }
    .ss-store-desc {
      font-size: 0.83rem;
      color: #475569;
      line-height: 1.6;
      font-weight: 300;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 0.85rem;
    }

    /* Meta row */
    .ss-meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem;
    }
    .ss-meta-item {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.78rem;
    }
    .ss-meta-rating { color: #fbbf24; font-weight: 600; }
    .ss-meta-rating svg { fill: #fbbf24; color: #fbbf24; }
    .ss-meta-location { color: #475569; }
    .ss-meta-location svg { color: #7c3aed; }
    .ss-meta-count {
      padding: 0.18rem 0.6rem;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 6px;
      font-size: 0.72rem;
      color: #475569;
    }

    /* ── Section header ── */
    .ss-section-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
    .ss-section-title {
      font-family: 'Syne', sans-serif;
      font-size: 1.15rem;
      font-weight: 700;
      color: #f1f5f9;
      margin: 0;
    }
    .ss-section-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, rgba(139,92,246,0.25), transparent);
    }

    /* ── Not found ── */
    .ss-not-found {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      min-height: 60vh; text-align: center; gap: 0.75rem;
    }
    .ss-nf-title {
      font-family: 'Syne', sans-serif;
      font-size: 1.4rem; font-weight: 800; color: #f1f5f9;
    }
    .ss-nf-sub { font-size: 0.85rem; color: #475569; }

    /* ── Pagination ── */
    .ss-pagination {
      display: flex; align-items: center; justify-content: center;
      gap: 0.3rem; margin-top: 2.5rem; flex-wrap: wrap;
    }
    .ss-pg-btn {
      min-width: 36px; height: 36px;
      display: flex; align-items: center; justify-content: center;
      padding: 0 0.5rem; border-radius: 9px;
      font-size: 0.82rem; font-weight: 500;
      color: #475569;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      cursor: pointer; font-family: 'DM Sans', sans-serif;
      transition: background 0.15s, color 0.15s, border-color 0.15s;
    }
    .ss-pg-btn:hover:not(:disabled) {
      background: rgba(139,92,246,0.12);
      border-color: rgba(139,92,246,0.3);
      color: #a78bfa;
    }
    .ss-pg-btn.current {
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      border-color: transparent; color: #fff;
      box-shadow: 0 3px 12px rgba(124,58,237,0.35);
    }
    .ss-pg-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  `;
  document.head.appendChild(tag);
}

/* ─── Component ──────────────────────────────────────────────────────────── */
const SellerStorePage = () => {
  const { vendorId } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/seller/store/${vendorId}`);
        setStore(data.store);
      } catch {
        setStore(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [vendorId]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const { data } = await api.get(`/products?vendor=${vendorId}&page=${page}`);
        setProducts(data.products || []);
        setPagination({ page: data.page || 1, totalPages: data.totalPages || 1, total: data.total || 0 });
      } catch {
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, [vendorId, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* Loading */
  if (loading) {
    return (
      <div className="ss-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader size="lg" />
      </div>
    );
  }

  /* Not found */
  if (!store) {
    return (
      <div className="ss-root">
        <div className="ss-not-found">
          <p className="ss-nf-title">Store not found</p>
          <p className="ss-nf-sub">This seller store does not exist or is no longer available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ss-root">

      {/* ── Banner ── */}
      <div className="ss-banner">
        {store.banner && (
          <img src={store.banner} alt={store.businessName} className="ss-banner-img" />
        )}
        <div className="ss-banner-overlay" />
        <div className="ss-banner-grid" />
        <div className="ss-banner-glow" />
      </div>

      <div className="ss-inner">

        {/* ── Store info card ── */}
        <div className="ss-card">

          {/* Logo */}
          <div className="ss-logo">
            {store.logo
              ? <img src={store.logo} alt={store.businessName} />
              : <span className="ss-logo-initial">{store.businessName?.charAt(0)?.toUpperCase()}</span>}
          </div>

          {/* Details */}
          <div className="ss-details">
            <span className="ss-store-badge">
              <ShieldCheck size={10} /> Verified Seller
            </span>
            <h1 className="ss-store-name">{store.businessName}</h1>
            {store.description && (
              <p className="ss-store-desc">{store.description}</p>
            )}
            <div className="ss-meta">
              {store.rating !== undefined && (
                <span className="ss-meta-item ss-meta-rating">
                  <Star size={14} />
                  {store.rating.toFixed(1)}
                </span>
              )}
              {store.location && (
                <span className="ss-meta-item ss-meta-location">
                  <MapPin size={13} />
                  {store.location}
                </span>
              )}
              <span className="ss-meta-count">
                <Package size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                {pagination.total} products
              </span>
            </div>
          </div>
        </div>

        {/* ── Products section ── */}
        <section>
          <div className="ss-section-header">
            <h2 className="ss-section-title">Products</h2>
            <div className="ss-section-line" />
            <span style={{ fontSize: '0.72rem', color: '#334155', whiteSpace: 'nowrap' }}>
              {pagination.total} listed
            </span>
          </div>

          <ProductGrid products={products} loading={productsLoading} />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="ss-pagination">
              <button
                className="ss-pg-btn"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft size={15} />
              </button>

              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  className={`ss-pg-btn ${page === i + 1 ? 'current' : ''}`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className="ss-pg-btn"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === pagination.totalPages}
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SellerStorePage;