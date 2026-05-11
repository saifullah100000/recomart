import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import useWishlistStore from '../../store/wishlistStore';
import useCartStore from '../../store/cartStore';
import ProductCard from '../../components/product/ProductCard';

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  .wishlist-page {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #080b1a;
    position: relative;
    overflow-x: hidden;
  }

  /* Ambient orbs */
  .wl-orb {
    position: fixed; border-radius: 50%;
    pointer-events: none; filter: blur(110px); z-index: 0;
  }
  .wl-orb-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 65%);
    top: -120px; left: -120px;
  }
  .wl-orb-2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(109,40,217,0.12) 0%, transparent 65%);
    bottom: -80px; right: -80px;
  }

  /* Grid texture */
  .wl-grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(139,92,246,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139,92,246,0.035) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  /* ── Inner ── */
  .wishlist-inner {
    position: relative; z-index: 1;
    max-width: 1280px; margin: 0 auto;
    padding: 3rem 1.5rem 5rem;
  }

  /* ── Empty state ── */
  .wishlist-empty {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 6rem 1.5rem; text-align: center;
  }
  .empty-icon-wrap {
    width: 80px; height: 80px; border-radius: 50%;
    background: rgba(236,72,153,0.08);
    border: 2px solid rgba(236,72,153,0.18);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.5rem;
    box-shadow: 0 0 40px rgba(236,72,153,0.1);
    animation: wl-float 3s ease-in-out infinite;
  }
  @keyframes wl-float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-8px); }
  }
  .empty-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.45rem; font-weight: 800; color: #f1f5f9;
    letter-spacing: -0.02em; margin: 0 0 0.5rem;
  }
  .empty-sub {
    font-size: 0.85rem; color: #334155;
    margin: 0 0 1.75rem; font-weight: 300;
  }
  .btn-browse {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.72rem 1.5rem; border-radius: 11px;
    background: linear-gradient(135deg, #7c3aed, #4f46e5);
    border: none; color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 500;
    text-decoration: none; cursor: pointer;
    transition: opacity 0.2s, transform 0.2s;
    box-shadow: 0 4px 18px rgba(124,58,237,0.35);
  }
  .btn-browse:hover { opacity: 0.9; transform: translateY(-1px); }

  /* ── Page header ── */
  .wishlist-header {
    display: flex; align-items: center; gap: 0.75rem;
    margin-bottom: 2rem;
  }
  .wishlist-header-icon {
    width: 42px; height: 42px; border-radius: 12px;
    background: rgba(236,72,153,0.1);
    border: 1px solid rgba(236,72,153,0.22);
    display: flex; align-items: center; justify-content: center;
    color: #f472b6;
    box-shadow: 0 3px 12px rgba(236,72,153,0.15);
  }
  .wishlist-header h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.3rem, 3vw, 1.8rem); font-weight: 800; color: #f1f5f9;
    letter-spacing: -0.02em; margin: 0; line-height: 1.1;
  }
  .wishlist-header h1 span {
    background: linear-gradient(135deg, #f472b6, #a78bfa);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .wishlist-count {
    font-size: 0.72rem; font-weight: 600; color: #a78bfa;
    background: rgba(124,58,237,0.1); border: 1px solid rgba(139,92,246,0.2);
    border-radius: 999px; padding: 0.2rem 0.7rem;
  }

  /* ── Grid ── */
  .wishlist-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
  }
  @media (max-width: 1024px) { .wishlist-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 640px)  { .wishlist-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; } }

  /* ── Product item ── */
  .wishlist-item { position: relative; display: flex; flex-direction: column; }

  .move-to-cart-btn {
    display: flex; align-items: center; justify-content: center; gap: 0.45rem;
    width: 100%; margin-top: 0.5rem; padding: 0.6rem 0.9rem;
    border-radius: 10px; cursor: pointer;
    background: rgba(124,58,237,0.08);
    border: 1px solid rgba(139,92,246,0.18);
    color: #64748b;
    font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 500;
    transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s;
  }
  .move-to-cart-btn:hover {
    background: rgba(124,58,237,0.16);
    border-color: rgba(139,92,246,0.38);
    color: #a78bfa;
    transform: translateY(-1px);
  }
`;

const WishlistPage = () => {
  const { products, fetchWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const handleMoveToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      toast.success('Added to cart');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  if (products.length === 0) {
    return (
      <div className="wishlist-page">
        <style>{PAGE_STYLES}</style>
        <div className="wl-orb wl-orb-1" />
        <div className="wl-orb wl-orb-2" />
        <div className="wl-grid-bg" />
        <div className="wishlist-inner">
          <div className="wishlist-empty">
            <div className="empty-icon-wrap">
              <Heart size={36} color="#f472b6" />
            </div>
            <h1 className="empty-title">Your Wishlist is Empty</h1>
            <p className="empty-sub">Save items you love and find them here anytime.</p>
            <Link to="/products" className="btn-browse">
              <ArrowLeft size={14} /> Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <style>{PAGE_STYLES}</style>
      <div className="wl-orb wl-orb-1" />
      <div className="wl-orb wl-orb-2" />
      <div className="wl-grid-bg" />

      <div className="wishlist-inner">
        <div className="wishlist-header">
          <div className="wishlist-header-icon"><Heart size={20} /></div>
          <h1>My <span>Wishlist</span></h1>
          <span className="wishlist-count">{products.length} item{products.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="wishlist-grid">
          {products.map((product) => (
            <div key={product._id} className="wishlist-item">
              <ProductCard product={product} />
              <button onClick={() => handleMoveToCart(product._id)} className="move-to-cart-btn">
                <ShoppingCart size={13} />
                Move to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;