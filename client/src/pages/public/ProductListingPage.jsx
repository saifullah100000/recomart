import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import ProductFilters from '../../components/product/ProductFilters';
import ProductGrid from '../../components/product/ProductGrid';
import useProducts from '../../hooks/useProducts';

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const PL_STYLE_ID = 'pl-styles';
if (typeof document !== 'undefined' && !document.getElementById(PL_STYLE_ID)) {
  const tag = document.createElement('style');
  tag.id = PL_STYLE_ID;
  tag.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

    .pl-root {
      min-height: 100vh;
      background: #080b1a;
      font-family: 'DM Sans', sans-serif;
      color: #e2e8f0;
    }

    .pl-inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2.5rem 1.5rem 5rem;
    }

    /* ── Header bar ── */
    .pl-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .pl-title {
      font-family: 'Syne', sans-serif;
      font-size: clamp(1.4rem, 3vw, 1.9rem);
      font-weight: 800;
      color: #f1f5f9;
      margin: 0 0 0.3rem;
      line-height: 1.1;
    }
    .pl-title span {
      background: linear-gradient(135deg, #a78bfa, #60a5fa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .pl-count {
      font-size: 0.78rem;
      color: #334155;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .pl-count-dot {
      width: 5px; height: 5px;
      border-radius: 50%;
      background: #7c3aed;
    }

    /* Mobile filter toggle */
    .pl-filter-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      font-size: 0.82rem;
      font-weight: 500;
      color: #94a3b8;
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      transition: background 0.2s, border-color 0.2s, color 0.2s;
    }
    .pl-filter-toggle:hover,
    .pl-filter-toggle.active {
      background: rgba(139,92,246,0.12);
      border-color: rgba(139,92,246,0.3);
      color: #a78bfa;
    }
    @media (min-width: 1024px) { .pl-filter-toggle { display: none; } }

    /* ── Layout ── */
    .pl-layout {
      display: flex;
      gap: 2rem;
      align-items: flex-start;
    }

    /* ── Sidebar ── */
    .pl-sidebar {
      width: 240px;
      flex-shrink: 0;
      position: sticky;
      top: 88px;
      display: none;
    }
    .pl-sidebar.open { display: block; }
    @media (min-width: 1024px) { .pl-sidebar { display: block !important; } }

    /* Sidebar glass shell */
    .pl-sidebar-shell {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 16px;
      overflow: hidden;
    }
    .pl-sidebar-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.9rem 1.1rem;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      font-size: 0.72rem;
      font-weight: 600;
      color: #475569;
      letter-spacing: 0.09em;
      text-transform: uppercase;
    }
    .pl-sidebar-header svg { color: #7c3aed; }
    .pl-sidebar-body { padding: 0.75rem; }

    /* ── Main ── */
    .pl-main { flex: 1; min-width: 0; }

    /* ── Pagination ── */
    .pl-pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.3rem;
      margin-top: 3rem;
      flex-wrap: wrap;
    }
    .pl-pg-btn {
      min-width: 36px; height: 36px;
      display: flex; align-items: center; justify-content: center;
      padding: 0 0.5rem;
      border-radius: 9px;
      font-size: 0.82rem;
      font-weight: 500;
      color: #475569;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      transition: background 0.15s, color 0.15s, border-color 0.15s;
    }
    .pl-pg-btn:hover:not(:disabled) {
      background: rgba(139,92,246,0.12);
      border-color: rgba(139,92,246,0.3);
      color: #a78bfa;
    }
    .pl-pg-btn.current {
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      border-color: transparent;
      color: #fff;
      box-shadow: 0 3px 12px rgba(124,58,237,0.35);
    }
    .pl-pg-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    .pl-pg-dots {
      color: #1e293b;
      font-size: 0.85rem;
      padding: 0 0.25rem;
      user-select: none;
    }
  `;
  document.head.appendChild(tag);
}

/* ─── Component ──────────────────────────────────────────────────────────── */
const ProductListingPage = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const getFiltersFromURL = useCallback(() => ({
    category: slug || searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    brand: searchParams.get('brand') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page')) || 1,
  }), [searchParams, slug]);

  const [filters, setFilters] = useState(getFiltersFromURL);
  const { products, loading, pagination } = useProducts(filters);

  useEffect(() => {
    setFilters(getFiltersFromURL());
  }, [getFiltersFromURL]);

  const handleFilterChange = (newFilters) => {
    const updated = { ...newFilters, page: 1 };
    setFilters(updated);
    const params = new URLSearchParams();
    Object.entries(updated).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '' && v !== 1) params.set(k, v);
    });
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const updated = { ...filters, page };
    setFilters(updated);
    const params = new URLSearchParams();
    Object.entries(updated).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
    });
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPageNumbers = () => {
    const pages = [];
    const { page, totalPages } = pagination;
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

    if (start > 1) {
      pages.push(
        <button key={1} className="pl-pg-btn" onClick={() => handlePageChange(1)}>1</button>
      );
      if (start > 2) pages.push(<span key="s-dots" className="pl-pg-dots">…</span>);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          className={`pl-pg-btn ${i === page ? 'current' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(<span key="e-dots" className="pl-pg-dots">…</span>);
      pages.push(
        <button key={totalPages} className="pl-pg-btn" onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="pl-root">
      <div className="pl-inner">

        {/* ── Header ── */}
        <div className="pl-header">
          <div>
            <h1 className="pl-title">
              {slug
                ? <><span>{slug.charAt(0).toUpperCase() + slug.slice(1)}</span> Products</>
                : <>All <span>Products</span></>}
            </h1>
            <p className="pl-count">
              <span className="pl-count-dot" />
              {pagination.total ?? 0} results found
            </p>
          </div>

          <button
            className={`pl-filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters
              ? <><X size={14} /> Hide Filters</>
              : <><SlidersHorizontal size={14} /> Filters</>}
          </button>
        </div>

        {/* ── Layout ── */}
        <div className="pl-layout">

          {/* Sidebar */}
          <aside className={`pl-sidebar ${showFilters ? 'open' : ''}`}>
            <div className="pl-sidebar-shell">
              <div className="pl-sidebar-header">
                <SlidersHorizontal size={13} />
                Filters
              </div>
              <div className="pl-sidebar-body">
                <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="pl-main">
            <ProductGrid products={products} loading={loading} />

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="pl-pagination">
                <button
                  className="pl-pg-btn"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={15} />
                </button>

                {renderPageNumbers()}

                <button
                  className="pl-pg-btn"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;