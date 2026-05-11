import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, ImageOff, Zap } from 'lucide-react';
import formatPrice from '../../utils/formatPrice';
import useCartStore from '../../store/cartStore';
import useWishlistStore from '../../store/wishlistStore';
import useAuthStore from '../../store/authStore';

/* ─── Styles (injected once via a shared singleton pattern) ──────────────── */
const CARD_STYLE_ID = 'pc-styles';
if (typeof document !== 'undefined' && !document.getElementById(CARD_STYLE_ID)) {
  const tag = document.createElement('style');
  tag.id = CARD_STYLE_ID;
  tag.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

    /* ── Card shell ── */
    .pc-card {
      position: relative;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 16px;
      overflow: hidden;
      font-family: 'DM Sans', sans-serif;
      transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
      cursor: pointer;
    }
    .pc-card:hover {
      border-color: rgba(139,92,246,0.35);
      box-shadow:
        0 0 0 1px rgba(139,92,246,0.12),
        0 12px 40px rgba(0,0,0,0.4),
        0 0 60px rgba(109,40,217,0.08);
      transform: translateY(-3px);
    }

    /* Shimmer sweep on hover */
    .pc-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        115deg,
        transparent 40%,
        rgba(139,92,246,0.06) 50%,
        transparent 60%
      );
      background-size: 200% 100%;
      background-position: 200% 0;
      transition: background-position 0.6s ease;
      z-index: 0;
      pointer-events: none;
      border-radius: inherit;
    }
    .pc-card:hover::before {
      background-position: -200% 0;
    }

    /* ── Image wrapper ── */
    .pc-img-wrap {
      position: relative;
      width: 100%;
      height: 200px;
      overflow: hidden;
      background: rgba(255,255,255,0.02);
    }
    .pc-img {
      width: 100%; height: 100%;
      object-fit: cover;
      transition: transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.3s;
      display: block;
    }
    .pc-card:hover .pc-img {
      transform: scale(1.07);
      filter: brightness(1.05);
    }
    .pc-img-placeholder {
      width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      background: rgba(255,255,255,0.02);
    }

    /* Gradient overlay on image */
    .pc-img-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to top,
        rgba(8,11,26,0.5) 0%,
        transparent 50%
      );
      pointer-events: none;
      z-index: 1;
    }

    /* ── Badges ── */
    .pc-badge {
      position: absolute;
      top: 0.65rem; left: 0.65rem;
      z-index: 2;
      padding: 0.22rem 0.6rem;
      border-radius: 6px;
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      font-family: 'DM Sans', sans-serif;
    }
    .pc-badge-oos {
      background: rgba(239,68,68,0.2);
      border: 1px solid rgba(239,68,68,0.35);
      color: #fca5a5;
      backdrop-filter: blur(8px);
    }
    .pc-badge-sale {
      background: rgba(239,68,68,0.2);
      border: 1px solid rgba(239,68,68,0.3);
      color: #fca5a5;
      backdrop-filter: blur(8px);
    }

    /* ── Wishlist button ── */
    .pc-wish-btn {
      position: absolute;
      top: 0.65rem; right: 0.65rem;
      z-index: 2;
      width: 32px; height: 32px;
      border-radius: 50%;
      background: rgba(8,11,26,0.6);
      border: 1px solid rgba(255,255,255,0.1);
      backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s, transform 0.2s;
    }
    .pc-wish-btn:hover {
      background: rgba(239,68,68,0.15);
      border-color: rgba(239,68,68,0.35);
      transform: scale(1.15);
    }
    .pc-wish-btn.active {
      background: rgba(239,68,68,0.18);
      border-color: rgba(239,68,68,0.4);
    }
    .pc-wish-btn svg {
      transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
    }
    .pc-wish-btn:hover svg { transform: scale(1.2); }

    /* ── Body ── */
    .pc-body {
      position: relative;
      z-index: 1;
      padding: 1rem 1rem 1.1rem;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    /* Category chip */
    .pc-category {
      display: inline-block;
      font-size: 0.65rem;
      font-weight: 500;
      color: #7c3aed;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      margin-bottom: 0.4rem;
    }

    /* Title */
    .pc-title {
      font-size: 0.875rem;
      font-weight: 500;
      color: #e2e8f0;
      line-height: 1.45;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 40px;
      margin-bottom: 0.55rem;
      transition: color 0.2s;
      text-decoration: none;
    }
    .pc-title:hover { color: #c4b5fd; }

    /* Stars */
    .pc-stars {
      display: flex;
      align-items: center;
      gap: 1px;
      margin-bottom: 0.65rem;
    }
    .pc-star-filled { color: #fbbf24; fill: #fbbf24; }
    .pc-star-empty  { color: #1e293b; fill: #1e293b; }
    .pc-review-count {
      font-size: 0.7rem;
      color: #475569;
      margin-left: 0.35rem;
    }

    /* Price row */
    .pc-price-row {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      margin-bottom: 0.85rem;
    }
    .pc-price {
      font-family: 'Syne', sans-serif;
      font-size: 1.1rem;
      font-weight: 700;
      color: #f1f5f9;
    }
    .pc-compare-price {
      font-size: 0.8rem;
      color: #334155;
      text-decoration: line-through;
    }

    /* ── Add to cart button ── */
    .pc-btn {
      width: 100%;
      display: flex; align-items: center; justify-content: center;
      gap: 0.45rem;
      padding: 0.6rem 1rem;
      border-radius: 10px;
      font-size: 0.82rem;
      font-weight: 500;
      font-family: 'DM Sans', sans-serif;
      border: none;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
      position: relative;
      overflow: hidden;
    }
    .pc-btn::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
      pointer-events: none;
    }
    .pc-btn-active {
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      color: #fff;
      box-shadow: 0 4px 18px rgba(124,58,237,0.35);
    }
    .pc-btn-active:hover {
      opacity: 0.9;
      transform: translateY(-1px);
      box-shadow: 0 6px 22px rgba(124,58,237,0.45);
    }
    .pc-btn-active:active { transform: translateY(0); }
    .pc-btn-oos {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      color: #334155;
      cursor: not-allowed;
    }

    /* Quick-buy flash ripple */
    .pc-btn-active:active::before {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,0.12);
      animation: pc-ripple 0.3s ease forwards;
    }
    @keyframes pc-ripple {
      from { opacity: 1; }
      to   { opacity: 0; }
    }
  `;
  document.head.appendChild(tag);
}

/* ─── Component ──────────────────────────────────────────────────────────── */
const ProductCard = ({ product }) => {
  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  const wishlisted = isInWishlist(product._id);
  const primaryImage = product.images?.length > 0 ? product.images[0].url : null;
  const isOutOfStock = product.stockQuantity <= 0;

  const hasSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPct = hasSale
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    try { await addToCart(product._id, 1); }
    catch (err) { console.error('Failed to add to cart:', err); }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    try { await toggleWishlist(product._id); }
    catch (err) { console.error('Failed to toggle wishlist:', err); }
  };

  const renderStars = (rating) => {
    const rounded = Math.round(rating || 0);
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={i < rounded ? 'pc-star-filled' : 'pc-star-empty'}
      />
    ));
  };

  return (
    <div className="pc-card">
      {/* ── Image ── */}
      <div className="pc-img-wrap">
        <Link to={`/products/${product.slug}`} tabIndex={-1}>
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={product.title || product.name}
              className="pc-img"
              loading="lazy"
            />
          ) : (
            <div className="pc-img-placeholder">
              <ImageOff size={36} color="rgba(255,255,255,0.1)" />
            </div>
          )}
        </Link>

        {/* Gradient overlay */}
        <div className="pc-img-overlay" />

        {/* Badges */}
        {isOutOfStock && (
          <span className="pc-badge pc-badge-oos">Out of Stock</span>
        )}
        {!isOutOfStock && hasSale && (
          <span className="pc-badge pc-badge-sale">{discountPct}% off</span>
        )}

        {/* Wishlist */}
        {isAuthenticated && (
          <button
            onClick={handleToggleWishlist}
            className={`pc-wish-btn ${wishlisted ? 'active' : ''}`}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              size={14}
              style={{
                fill: wishlisted ? '#ef4444' : 'transparent',
                color: wishlisted ? '#ef4444' : '#94a3b8',
              }}
            />
          </button>
        )}
      </div>

      {/* ── Body ── */}
      <div className="pc-body">
        {/* Category */}
        {product.category && (
          <span className="pc-category">
            {product.category.name || product.category}
          </span>
        )}

        {/* Title */}
        <Link
          to={`/products/${product.slug}`}
          className="pc-title"
          title={product.title || product.name}
        >
          {product.title || product.name}
        </Link>

        {/* Stars */}
        <div className="pc-stars">
          {renderStars(product.averageRating)}
          <span className="pc-review-count">({product.reviewCount || 0})</span>
        </div>

        {/* Price */}
        <div className="pc-price-row">
          <span className="pc-price">{formatPrice(product.price)}</span>
          {hasSale && (
            <span className="pc-compare-price">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`pc-btn ${isOutOfStock ? 'pc-btn-oos' : 'pc-btn-active'}`}
        >
          {isOutOfStock ? (
            <>
              <ShoppingCart size={14} />
              Out of Stock
            </>
          ) : (
            <>
              <Zap size={13} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;