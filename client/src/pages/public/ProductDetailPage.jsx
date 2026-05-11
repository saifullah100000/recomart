import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Star, Heart, ShoppingCart, Minus, Plus,
  CheckCircle, XCircle, Zap, Package, ShieldCheck, Truck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import ProductImageGallery from '../../components/product/ProductImageGallery';
import ProductReviews from '../../components/product/ProductReviews';
import SimilarProducts from '../../components/product/SimilarProducts';
import ReviewSubmissionForm from '../../components/product/ReviewSubmissionForm';
import useCartStore from '../../store/cartStore';
import useWishlistStore from '../../store/wishlistStore';
import useAuthStore from '../../store/authStore';
import formatPrice from '../../utils/formatPrice';

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const PD_STYLE_ID = 'pd-styles';
if (typeof document !== 'undefined' && !document.getElementById(PD_STYLE_ID)) {
  const tag = document.createElement('style');
  tag.id = PD_STYLE_ID;
  tag.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

    .pd-root {
      min-height: 100vh;
      background: #080b1a;
      font-family: 'DM Sans', sans-serif;
      color: #e2e8f0;
    }

    .pd-inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2.5rem 1.5rem 5rem;
    }

    /* ── Loading / not-found states ── */
    .pd-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      gap: 1rem;
      text-align: center;
    }
    .pd-not-found-title {
      font-family: 'Syne', sans-serif;
      font-size: 1.6rem;
      font-weight: 800;
      color: #f1f5f9;
    }
    .pd-not-found-sub { font-size: 0.9rem; color: #475569; }

    /* ── Main grid ── */
    .pd-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }
    @media (min-width: 1024px) {
      .pd-grid { grid-template-columns: 1fr 1fr; gap: 4rem; }
    }

    /* ── Info col ── */
    .pd-info { display: flex; flex-direction: column; gap: 1.5rem; }

    /* Category chip */
    .pd-category {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.25rem 0.75rem;
      background: rgba(139,92,246,0.12);
      border: 1px solid rgba(139,92,246,0.25);
      border-radius: 999px;
      font-size: 0.7rem;
      color: #a78bfa;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-weight: 500;
      width: fit-content;
    }

    /* Title */
    .pd-title {
      font-family: 'Syne', sans-serif;
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 800;
      color: #f1f5f9;
      line-height: 1.2;
      margin: 0;
    }

    /* Stars */
    .pd-stars { display: flex; align-items: center; gap: 0.5rem; }
    .pd-star-filled { color: #fbbf24; fill: #fbbf24; }
    .pd-star-empty  { color: #1e293b; fill: #1e293b; }
    .pd-review-count { font-size: 0.8rem; color: #475569; }

    /* Price */
    .pd-price-row { display: flex; align-items: baseline; gap: 0.75rem; flex-wrap: wrap; }
    .pd-price {
      font-family: 'Syne', sans-serif;
      font-size: 2rem;
      font-weight: 700;
      color: #f1f5f9;
    }
    .pd-compare-price { font-size: 1rem; color: #334155; text-decoration: line-through; }
    .pd-discount-badge {
      padding: 0.2rem 0.65rem;
      background: rgba(239,68,68,0.15);
      border: 1px solid rgba(239,68,68,0.25);
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 600;
      color: #fca5a5;
    }

    /* Short description */
    .pd-short-desc {
      font-size: 0.88rem;
      color: #64748b;
      line-height: 1.75;
      font-weight: 300;
    }

    /* ── Specs table ── */
    .pd-specs-title {
      font-size: 0.72rem;
      font-weight: 600;
      color: #475569;
      letter-spacing: 0.09em;
      text-transform: uppercase;
      margin-bottom: 0.65rem;
    }
    .pd-specs-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;
    }
    .pd-specs-table tr { border-bottom: 1px solid rgba(255,255,255,0.04); }
    .pd-specs-table tr:last-child { border-bottom: none; }
    .pd-specs-table td { padding: 0.55rem 0.75rem; }
    .pd-specs-table td:first-child {
      color: #94a3b8;
      font-weight: 500;
      width: 38%;
    }
    .pd-specs-table td:last-child { color: #e2e8f0; }
    .pd-specs-table tr:nth-child(even) td {
      background: rgba(255,255,255,0.02);
    }
    .pd-specs-table tr:nth-child(even) td:first-child { border-radius: 6px 0 0 6px; }
    .pd-specs-table tr:nth-child(even) td:last-child  { border-radius: 0 6px 6px 0; }

    /* ── Stock status ── */
    .pd-stock {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 0.85rem;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 500;
    }
    .pd-stock-in {
      background: rgba(34,197,94,0.1);
      border: 1px solid rgba(34,197,94,0.2);
      color: #4ade80;
    }
    .pd-stock-out {
      background: rgba(239,68,68,0.1);
      border: 1px solid rgba(239,68,68,0.2);
      color: #f87171;
    }

    /* ── Quantity ── */
    .pd-qty-label { font-size: 0.78rem; color: #475569; font-weight: 500; margin-bottom: 0.5rem; }
    .pd-qty-row {
      display: inline-flex;
      align-items: center;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      overflow: hidden;
    }
    .pd-qty-btn {
      width: 38px; height: 38px;
      display: flex; align-items: center; justify-content: center;
      background: transparent;
      border: none;
      color: #64748b;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
    }
    .pd-qty-btn:hover { background: rgba(139,92,246,0.12); color: #a78bfa; }
    .pd-qty-val {
      width: 44px;
      text-align: center;
      font-size: 0.9rem;
      font-weight: 500;
      color: #e2e8f0;
      border-left: 1px solid rgba(255,255,255,0.06);
      border-right: 1px solid rgba(255,255,255,0.06);
    }

    /* ── CTA buttons ── */
    .pd-actions { display: flex; gap: 0.75rem; }
    .pd-cart-btn {
      flex: 1;
      display: flex; align-items: center; justify-content: center;
      gap: 0.5rem;
      padding: 0.85rem 1.5rem;
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      border: none;
      border-radius: 12px;
      color: #fff;
      font-size: 0.9rem;
      font-weight: 500;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.2s;
      box-shadow: 0 4px 20px rgba(124,58,237,0.35);
    }
    .pd-cart-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
    .pd-cart-btn:disabled { opacity: 0.45; cursor: not-allowed; }

    .pd-wish-btn {
      width: 52px;
      display: flex; align-items: center; justify-content: center;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      color: #475569;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s;
      flex-shrink: 0;
    }
    .pd-wish-btn:hover { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); color: #f87171; transform: scale(1.05); }
    .pd-wish-btn.active { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.35); color: #f87171; }

    /* ── Trust badges ── */
    .pd-trust {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
      padding: 1rem;
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 12px;
    }
    .pd-trust-item {
      display: flex; flex-direction: column; align-items: center;
      gap: 0.35rem;
      font-size: 0.7rem;
      color: #475569;
      text-align: center;
    }
    .pd-trust-item svg { color: #7c3aed; }

    /* ── Divider ── */
    .pd-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(139,92,246,0.2), transparent);
      margin: 3rem 0;
    }

    /* ── Tabs ── */
    .pd-tabs {
      display: flex;
      gap: 0;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      margin-bottom: 2rem;
    }
    .pd-tab {
      padding: 0.75rem 1.25rem;
      font-size: 0.85rem;
      font-weight: 500;
      color: #475569;
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      transition: color 0.2s, border-color 0.2s;
      margin-bottom: -1px;
    }
    .pd-tab:hover { color: #94a3b8; }
    .pd-tab.active {
      color: #a78bfa;
      border-bottom-color: #7c3aed;
    }

    /* ── Description content ── */
    .pd-desc-content {
      font-size: 0.88rem;
      color: #64748b;
      line-height: 1.85;
      font-weight: 300;
      white-space: pre-line;
    }

    /* ── Reviews tab layout ── */
    .pd-reviews-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    @media (min-width: 768px) {
      .pd-reviews-layout {
        grid-template-columns: 1fr 360px;
        align-items: start;
      }
    }
  `;
  document.head.appendChild(tag);
}

/* ─── Component ──────────────────────────────────────────────────────────── */
const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addingToCart, setAddingToCart] = useState(false);
  const [reviewKey, setReviewKey] = useState(0); // force re-fetch reviews after submission

  const { addToCart } = useCartStore();
  const { toggleWishlist, productIds } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  const isInWishlist = product ? productIds.has(product._id) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${slug}`);
        setProduct(data.product);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error('Please login to add items to cart'); return; }
    try {
      setAddingToCart(true);
      await addToCart(product._id, quantity);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) { toast.error('Please login to manage wishlist'); return; }
    try {
      const result = await toggleWishlist(product._id);
      toast.success(result ? 'Added to wishlist' : 'Removed from wishlist');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update wishlist');
    }
  };

  /* Called when ReviewSubmissionForm succeeds — refresh review list */
  const handleReviewSubmitted = () => {
    setReviewKey((k) => k + 1);
  };

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={18}
        className={i < Math.round(rating) ? 'pd-star-filled' : 'pd-star-empty'}
      />
    ));

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="pd-root">
        <div className="pd-center"><Loader size="lg" /></div>
      </div>
    );
  }

  /* ── Not found ── */
  if (!product) {
    return (
      <div className="pd-root">
        <div className="pd-center">
          <p className="pd-not-found-title">Product not found</p>
          <p className="pd-not-found-sub">This product doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const inStock = product.stockQuantity > 0;
  const hasSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPct = hasSale
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="pd-root">
      <div className="pd-inner">

        {/* ── Main grid ── */}
        <div className="pd-grid">

          {/* Gallery */}
          <ProductImageGallery images={product.images || []} />

          {/* Info */}
          <div className="pd-info">
            {product.category && (
              <span className="pd-category">
                {product.category.name || product.category}
              </span>
            )}

            <h1 className="pd-title">{product.name}</h1>

            <div className="pd-stars">
              {renderStars(product.rating || 0)}
              <span className="pd-review-count">({product.reviewCount || 0} reviews)</span>
            </div>

            <div className="pd-price-row">
              <span className="pd-price">{formatPrice(product.price)}</span>
              {hasSale && (
                <>
                  <span className="pd-compare-price">{formatPrice(product.compareAtPrice)}</span>
                  <span className="pd-discount-badge">{discountPct}% OFF</span>
                </>
              )}
            </div>

            {(product.shortDescription || product.description) && (
              <p className="pd-short-desc">
                {product.shortDescription || product.description?.substring(0, 200)}
              </p>
            )}

            {product.specifications?.length > 0 && (
              <div>
                <p className="pd-specs-title">Specifications</p>
                <table className="pd-specs-table">
                  <tbody>
                    {product.specifications.map((spec, i) => (
                      <tr key={i}>
                        <td>{spec.key}</td>
                        <td>{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div>
              {inStock ? (
                <span className="pd-stock pd-stock-in">
                  <CheckCircle size={14} />
                  In Stock — {product.stockQuantity} available
                </span>
              ) : (
                <span className="pd-stock pd-stock-out">
                  <XCircle size={14} />
                  Out of Stock
                </span>
              )}
            </div>

            {inStock && (
              <>
                <div>
                  <p className="pd-qty-label">Quantity</p>
                  <div className="pd-qty-row">
                    <button className="pd-qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                      <Minus size={14} />
                    </button>
                    <span className="pd-qty-val">{quantity}</span>
                    <button className="pd-qty-btn" onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}>
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="pd-actions">
                  <button className="pd-cart-btn" onClick={handleAddToCart} disabled={addingToCart}>
                    {addingToCart
                      ? <><Loader size="sm" /> Adding…</>
                      : <><Zap size={16} /> Add to Cart</>}
                  </button>
                  <button
                    className={`pd-wish-btn ${isInWishlist ? 'active' : ''}`}
                    onClick={handleToggleWishlist}
                    aria-label="Toggle wishlist"
                  >
                    <Heart size={18} style={{ fill: isInWishlist ? 'currentColor' : 'transparent' }} />
                  </button>
                </div>
              </>
            )}

            <div className="pd-trust">
              <div className="pd-trust-item"><Truck size={18} />Free Shipping</div>
              <div className="pd-trust-item"><ShieldCheck size={18} />Secure Payment</div>
              <div className="pd-trust-item"><Package size={18} />Easy Returns</div>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="pd-divider" />

        {/* ── Tabs ── */}
        <div>
          <div className="pd-tabs">
            <button
              className={`pd-tab ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`pd-tab ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.reviewCount || 0})
            </button>
            <button
              className={`pd-tab ${activeTab === 'write' ? 'active' : ''}`}
              onClick={() => setActiveTab('write')}
            >
              Write a Review
            </button>
          </div>

          {/* Description */}
          {activeTab === 'description' && (
            <div className="pd-desc-content">{product.description}</div>
          )}

          {/* Reviews list */}
          {activeTab === 'reviews' && (
            <ProductReviews key={reviewKey} productId={product._id} />
          )}

          {/* Write a review — side-by-side layout on desktop */}
          {activeTab === 'write' && (
            <div className="pd-reviews-layout">
              {/* Left: existing reviews */}
              <ProductReviews key={reviewKey} productId={product._id} />

              {/* Right: submission form */}
              <div style={{ position: 'sticky', top: '6rem' }}>
                <ReviewSubmissionForm
                  productId={product._id}
                  onReviewSubmitted={handleReviewSubmitted}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Similar Products ── */}
        <div className="pd-divider" />
        <SimilarProducts productId={product._id} />

      </div>
    </div>
  );
};

export default ProductDetailPage;