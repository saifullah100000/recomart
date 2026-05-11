import { useState, useEffect } from 'react';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import { Search, ArrowRight, Sparkles, ScanSearch, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../api/axios';
import ProductGrid from '../../components/product/ProductGrid';
import Loader from '../../components/common/Loader';

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const SR_STYLE_ID = 'sr-styles';
if (typeof document !== 'undefined' && !document.getElementById(SR_STYLE_ID)) {
  const tag = document.createElement('style');
  tag.id = SR_STYLE_ID;
  tag.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

    .sr-root {
      min-height: 100vh;
      background: #080b1a;
      font-family: 'DM Sans', sans-serif;
      color: #e2e8f0;
    }
    .sr-inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2.5rem 1.5rem 5rem;
    }

    /* ── Loading state ── */
    .sr-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
    }

    /* ── Header ── */
    .sr-header { margin-bottom: 2rem; }
    .sr-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.25rem 0.75rem;
      background: rgba(139,92,246,0.1);
      border: 1px solid rgba(139,92,246,0.22);
      border-radius: 999px;
      font-size: 0.68rem;
      color: #a78bfa;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-weight: 500;
      margin-bottom: 0.75rem;
    }
    .sr-title {
      font-family: 'Syne', sans-serif;
      font-size: clamp(1.3rem, 3vw, 1.85rem);
      font-weight: 800;
      color: #f1f5f9;
      margin: 0 0 0.5rem;
      line-height: 1.2;
    }
    .sr-title-query {
      background: linear-gradient(135deg, #a78bfa, #60a5fa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .sr-count {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.78rem;
      color: #334155;
    }
    .sr-count-dot {
      width: 5px; height: 5px;
      border-radius: 50%;
      background: #7c3aed;
      flex-shrink: 0;
    }

    /* ── AI Analysis card ── */
    .sr-analysis {
      margin-top: 1.25rem;
      padding: 1.1rem 1.25rem;
      background: rgba(139,92,246,0.07);
      border: 1px solid rgba(139,92,246,0.2);
      border-radius: 14px;
      position: relative;
      overflow: hidden;
    }
    .sr-analysis::before {
      content: '';
      position: absolute;
      top: 0; left: 10%; right: 10%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent);
    }
    .sr-analysis-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.78rem;
      font-weight: 600;
      color: #a78bfa;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-bottom: 0.75rem;
    }
    .sr-analysis-row {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      font-size: 0.82rem;
      color: #64748b;
      margin-bottom: 0.45rem;
    }
    .sr-analysis-row strong { color: #94a3b8; font-weight: 500; }
    .sr-analysis-row svg { flex-shrink: 0; margin-top: 2px; color: #7c3aed; }
    .sr-keywords {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.75rem;
    }
    .sr-keyword {
      padding: 0.2rem 0.65rem;
      background: rgba(139,92,246,0.12);
      border: 1px solid rgba(139,92,246,0.2);
      border-radius: 999px;
      font-size: 0.7rem;
      color: #a78bfa;
      font-weight: 500;
    }

    /* ── Visual similarity notice ── */
    .sr-visual-notice {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      margin-top: 0.75rem;
      padding: 0.3rem 0.8rem;
      background: rgba(96,165,250,0.08);
      border: 1px solid rgba(96,165,250,0.18);
      border-radius: 8px;
      font-size: 0.72rem;
      color: #60a5fa;
    }

    /* ── Empty state ── */
    .sr-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 5rem 1rem;
    }
    .sr-empty-icon {
      width: 72px; height: 72px;
      border-radius: 20px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.07);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 1.5rem;
      color: #1e293b;
    }
    .sr-empty-title {
      font-family: 'Syne', sans-serif;
      font-size: 1.3rem;
      font-weight: 700;
      color: #f1f5f9;
      margin-bottom: 0.5rem;
    }
    .sr-empty-sub {
      font-size: 0.85rem;
      color: #475569;
      max-width: 360px;
      line-height: 1.7;
      font-weight: 300;
      margin-bottom: 1.75rem;
    }
    .sr-suggestions-label {
      font-size: 0.72rem;
      font-weight: 600;
      color: #334155;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 0.65rem;
    }
    .sr-suggestions {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-bottom: 2rem;
    }
    .sr-suggestion-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.82rem;
      color: #334155;
    }
    .sr-suggestion-item::before {
      content: '›';
      color: #7c3aed;
      font-size: 1rem;
      line-height: 1;
    }
    .sr-browse-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.75rem;
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      border-radius: 11px;
      color: #fff;
      font-size: 0.88rem;
      font-weight: 500;
      text-decoration: none;
      font-family: 'DM Sans', sans-serif;
      box-shadow: 0 4px 18px rgba(124,58,237,0.35);
      transition: opacity 0.2s, transform 0.2s;
    }
    .sr-browse-btn:hover { opacity: 0.9; transform: translateY(-1px); }

    /* ── Pagination ── */
    .sr-pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.3rem;
      margin-top: 3rem;
      flex-wrap: wrap;
    }
    .sr-pg-btn {
      min-width: 36px; height: 36px;
      display: flex; align-items: center; justify-content: center;
      padding: 0 0.5rem;
      border-radius: 9px;
      font-size: 0.82rem;
      font-weight: 500;
      color: #475569;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      text-decoration: none;
      font-family: 'DM Sans', sans-serif;
      transition: background 0.15s, color 0.15s, border-color 0.15s;
      cursor: pointer;
    }
    .sr-pg-btn:hover {
      background: rgba(139,92,246,0.12);
      border-color: rgba(139,92,246,0.3);
      color: #a78bfa;
    }
    .sr-pg-btn.current {
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      border-color: transparent;
      color: #fff;
      box-shadow: 0 3px 12px rgba(124,58,237,0.35);
    }
    .sr-pg-btn.disabled {
      opacity: 0.3;
      pointer-events: none;
    }
  `;
  document.head.appendChild(tag);
}

/* ─── Component ──────────────────────────────────────────────────────────── */
const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const query = searchParams.get('q') || '';
  const isVisual = searchParams.get('visual') === 'true';

  const [products, setProducts] = useState(location.state?.products || []);
  const [analysis, setAnalysis] = useState(location.state?.analysis || null);
  const [loading, setLoading] = useState(!location.state?.products);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const page = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    if (location.state?.products) return;
    const fetchResults = async () => {
      if (!query.trim()) { setProducts([]); setLoading(false); return; }
      try {
        setLoading(true);
        const { data } = await api.get(`/search?q=${encodeURIComponent(query)}&page=${page}`);
        setProducts(data.products || []);
        setPagination({
          page: data.pagination?.page || 1,
          totalPages: data.pagination?.totalPages || 1,
          total: data.pagination?.total || 0,
        });
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query, page, location.state]);

  if (loading) {
    return (
      <div className="sr-root">
        <div className="sr-loading"><Loader size="lg" /></div>
      </div>
    );
  }

  const displayQuery = query || analysis?.description || 'Image Search';
  const resultCount = pagination.total || products.length;

  return (
    <div className="sr-root">
      <div className="sr-inner">

        {/* ── Header ── */}
        <div className="sr-header">
          <div className="sr-eyebrow">
            {isVisual || analysis
              ? <><Sparkles size={10} /> AI Visual Search</>
              : <><Search size={10} /> Search Results</>}
          </div>

          <h1 className="sr-title">
            Results for{' '}
            <span className="sr-title-query">"{displayQuery}"</span>
          </h1>

          {products.length > 0 && (
            <span className="sr-count">
              <span className="sr-count-dot" />
              {resultCount} products found
            </span>
          )}

          {/* AI analysis card */}
          {analysis && (
            <div className="sr-analysis">
              <div className="sr-analysis-title">
                <Sparkles size={12} />
                AI Image Analysis
              </div>
              {analysis.description && (
                <div className="sr-analysis-row">
                  <ScanSearch size={13} />
                  <span><strong>Description:</strong> {analysis.description}</span>
                </div>
              )}
              {analysis.category && (
                <div className="sr-analysis-row">
                  <Tag size={13} />
                  <span><strong>Category:</strong> {analysis.category}</span>
                </div>
              )}
              {analysis.keywords?.length > 0 && (
                <div className="sr-keywords">
                  {analysis.keywords.map((kw, i) => (
                    <span key={i} className="sr-keyword">{kw}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Visual similarity notice */}
          {products[0]?.similarity && (
            <div className="sr-visual-notice">
              <Sparkles size={11} />
              AI visual similarity matching enabled
            </div>
          )}
        </div>

        {/* ── Results / Empty ── */}
        {products.length > 0 ? (
          <ProductGrid
            products={products.map(item => item.product || item)}
            loading={false}
          />
        ) : (
          <div className="sr-empty">
            <div className="sr-empty-icon">
              <Search size={30} />
            </div>
            <p className="sr-empty-title">No results found</p>
            <p className="sr-empty-sub">
              We couldn't find any products matching "{displayQuery}". Try adjusting your search or browse our categories.
            </p>
            <p className="sr-suggestions-label">Suggestions</p>
            <div className="sr-suggestions">
              <span className="sr-suggestion-item">Check the spelling of your search term</span>
              <span className="sr-suggestion-item">Try using more general keywords</span>
              <span className="sr-suggestion-item">Browse categories to find what you need</span>
            </div>
            <Link to="/products" className="sr-browse-btn">
              Browse All Products <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* ── Pagination ── */}
        {pagination.totalPages > 1 && (
          <div className="sr-pagination">
            <Link
              to={`/search?q=${encodeURIComponent(query)}&page=${page - 1}`}
              className={`sr-pg-btn ${page === 1 ? 'disabled' : ''}`}
            >
              <ChevronLeft size={15} />
            </Link>

            {[...Array(pagination.totalPages)].map((_, i) => (
              <Link
                key={i + 1}
                to={`/search?q=${encodeURIComponent(query)}&page=${i + 1}`}
                className={`sr-pg-btn ${pagination.page === i + 1 ? 'current' : ''}`}
              >
                {i + 1}
              </Link>
            ))}

            <Link
              to={`/search?q=${encodeURIComponent(query)}&page=${page + 1}`}
              className={`sr-pg-btn ${page === pagination.totalPages ? 'disabled' : ''}`}
            >
              <ChevronRight size={15} />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default SearchResultsPage;