import { useState, useEffect } from 'react';
import { Star, User, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import api from '../../api/axios';

/* ── Helpers ── */
const AVATAR_GRADIENTS = [
  ['#7C3AED','#4F46E5'], ['#DB2777','#E11D48'], ['#059669','#0D9488'],
  ['#EA580C','#D97706'], ['#2563EB','#0891B2'], ['#D97706','#CA8A04'],
  ['#8B5CF6','#6D28D9'], ['#0891B2','#2563EB'],
];

const getGradient = (name = '') => {
  const idx = name.charCodeAt(0) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[idx];
};

const StarRow = ({ rating, size = 16 }) =>
  [...Array(5)].map((_, i) => (
    <Star
      key={i}
      style={{
        width: size, height: size,
        fill:  i < Math.round(rating) ? '#FBBF24' : 'transparent',
        color: i < Math.round(rating) ? '#FBBF24' : 'rgba(255,255,255,0.15)',
        flexShrink: 0,
      }}
    />
  ));

/* ── Skeleton ── */
const Skeleton = () => (
  <div className="pr-skeleton-wrap">
    <style>{`
      @keyframes pr-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      .pr-skeleton-wrap { display:flex; flex-direction:column; gap:20px; }
      .pr-skel { border-radius:16px; border:1px solid rgba(255,255,255,.05);
        background:rgba(255,255,255,.04); animation:pr-pulse 1.7s ease-in-out infinite; }
    `}</style>
    <div className="pr-skel" style={{ height: 32, width: 200 }} />
    <div className="pr-skel" style={{ height: 140 }} />
    {[...Array(3)].map((_, i) => (
      <div key={i} className="pr-skel" style={{ height: 100 }} />
    ))}
  </div>
);

/* ── Main component ── */
const ProductReviews = ({ productId }) => {
  const [reviews, setReviews]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews:  0,
    distribution:  { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/reviews/product/${productId}`, {
          params: { page, limit: 5 },
        });

        setReviews(data.reviews || []);
        setTotalPages(data.totalPages || 1);

        if (data.stats) {
          setStats(data.stats);
        } else if (data.averageRating !== undefined) {
          setStats((prev) => ({
            ...prev,
            averageRating: data.averageRating,
            totalReviews:  data.totalReviews || data.reviews?.length || 0,
          }));
        }

        if (data.distribution) {
          setStats((prev) => ({ ...prev, distribution: data.distribution }));
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchReviews();
  }, [productId, page]);

  if (loading && page === 1) return <Skeleton />;

  const maxDist = Math.max(...Object.values(stats.distribution), 1);

  return (
    <>
      <style>{`
        @keyframes pr-fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pr-shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(220%)} }

        .pr-wrap { display:flex; flex-direction:column; gap:28px; }

        .pr-title-row { display:flex; align-items:center; gap:12px; }
        .pr-title-icon {
          width:38px; height:38px; border-radius:12px;
          background:linear-gradient(135deg,#7C3AED,#4F46E5);
          display:flex; align-items:center; justify-content:center;
          box-shadow:0 6px 18px rgba(124,58,237,.4); flex-shrink:0;
        }
        .pr-title {
          font-size:clamp(18px,2.5vw,22px); font-weight:700;
          color:#F8FAFC; letter-spacing:-.025em; margin:0;
        }
        .pr-count-pill {
          margin-left:auto; padding:3px 10px; border-radius:999px;
          background:rgba(124,58,237,.12); border:1px solid rgba(124,58,237,.25);
          font-size:12px; font-weight:700; color:#c4b5fd; letter-spacing:.02em;
        }

        .pr-summary {
          display:flex; flex-direction:column; gap:20px;
          padding:24px; border-radius:20px;
          border:1px solid rgba(255,255,255,.07);
          background:rgba(255,255,255,.04);
          position:relative; overflow:hidden;
        }
        .pr-summary::before {
          content:''; position:absolute; top:0; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent);
        }
        @media(min-width:640px){ .pr-summary{ flex-direction:row; align-items:center; } }

        .pr-big-rating {
          display:flex; flex-direction:column; align-items:center; gap:8px;
          padding:0 8px 0 0; flex-shrink:0;
        }
        @media(min-width:640px){
          .pr-big-rating{
            border-right:1px solid rgba(255,255,255,.07);
            padding:0 28px 0 0; align-items:flex-start;
          }
        }
        .pr-big-num {
          font-size:56px; font-weight:800; color:#F8FAFC;
          letter-spacing:-.04em; line-height:1;
        }
        .pr-star-row { display:flex; align-items:center; gap:3px; }
        .pr-total    { font-size:12px; color:#64748b; font-weight:500; letter-spacing:.02em; margin-top:2px; }

        .pr-dist     { flex:1; display:flex; flex-direction:column; gap:9px; }
        .pr-dist-row { display:flex; align-items:center; gap:10px; }
        .pr-dist-label {
          display:flex; align-items:center; gap:4px;
          font-size:12px; font-weight:600; color:#94a3b8;
          width:36px; flex-shrink:0;
        }
        .pr-bar-track {
          flex:1; height:7px; border-radius:999px;
          background:rgba(255,255,255,.06); overflow:hidden;
        }
        .pr-bar-fill {
          height:100%; border-radius:999px;
          background:linear-gradient(90deg,#7C3AED,#A855F7);
          transition:width .6s cubic-bezier(.4,0,.2,1);
          box-shadow:0 0 8px rgba(124,58,237,.4);
        }
        .pr-dist-count {
          font-size:11px; color:#475569; font-weight:600;
          width:24px; text-align:right; flex-shrink:0;
        }

        .pr-divider {
          height:1px;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.07),transparent);
        }

        .pr-card {
          padding:20px; border-radius:18px;
          border:1px solid rgba(255,255,255,.06);
          background:rgba(255,255,255,.03);
          display:flex; gap:14px;
          transition:background .2s, border-color .2s;
          animation:pr-fadeUp .4s ease both;
          position:relative; overflow:hidden;
        }
        .pr-card:hover {
          background:rgba(255,255,255,.06);
          border-color:rgba(255,255,255,.1);
        }
        .pr-card::before {
          content:''; position:absolute; top:0; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent);
        }

        .pr-avatar {
          width:40px; height:40px; border-radius:12px;
          display:flex; align-items:center; justify-content:center;
          flex-shrink:0; font-size:15px; font-weight:800; color:#fff;
          box-shadow:0 4px 12px rgba(0,0,0,.3);
        }

        .pr-card-body { flex:1; min-width:0; }
        .pr-card-top  {
          display:flex; align-items:flex-start;
          justify-content:space-between; gap:8px; margin-bottom:6px;
        }
        .pr-reviewer { font-size:14px; font-weight:700; color:#e2e8f0; letter-spacing:-.01em; }
        .pr-date     { font-size:11px; color:#475569; font-weight:500; white-space:nowrap; flex-shrink:0; }
        .pr-stars    { display:flex; align-items:center; gap:2px; margin-bottom:10px; }
        .pr-comment  { font-size:13px; color:#94a3b8; line-height:1.7; }

        .pr-empty {
          padding:48px 24px; text-align:center;
          border-radius:20px; border:1px dashed rgba(255,255,255,.08);
          background:rgba(255,255,255,.02);
        }
        .pr-empty-icon {
          width:48px; height:48px; border-radius:14px;
          background:rgba(255,255,255,.05);
          display:flex; align-items:center; justify-content:center;
          margin:0 auto 14px;
        }
        .pr-empty-text { font-size:14px; color:#475569; font-weight:500; }

        .pr-pagination { display:flex; align-items:center; justify-content:center; gap:10px; }
        .pr-page-btn {
          width:36px; height:36px; border-radius:10px;
          border:1px solid rgba(255,255,255,.1);
          background:rgba(255,255,255,.04);
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; color:#94a3b8;
          transition:background .2s, border-color .2s, color .2s, transform .2s;
        }
        .pr-page-btn:hover:not(:disabled) {
          background:rgba(124,58,237,.18);
          border-color:rgba(124,58,237,.35);
          color:#c4b5fd; transform:scale(1.06);
        }
        .pr-page-btn:disabled { opacity:0.3; cursor:not-allowed; }
        .pr-page-info {
          font-size:13px; color:#64748b; font-weight:600;
          padding:0 6px; letter-spacing:.02em;
        }
        .pr-page-info strong { color:#94a3b8; }
      `}</style>

      <div className="pr-wrap">

        {/* ── Title ── */}
        <div className="pr-title-row">
          <div className="pr-title-icon">
            <MessageSquare style={{ width:18, height:18, color:'#fff' }} />
          </div>
          <h3 className="pr-title">Customer Reviews</h3>
          {stats.totalReviews > 0 && (
            <span className="pr-count-pill">
              {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
            </span>
          )}
        </div>

        {/* ── Summary card ── */}
        <div className="pr-summary">
          <div className="pr-big-rating">
            <div className="pr-big-num">{stats.averageRating?.toFixed(1) || '0.0'}</div>
            <div className="pr-star-row">
              <StarRow rating={stats.averageRating} size={17} />
            </div>
            <p className="pr-total">
              {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          <div className="pr-dist">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.distribution[star] || 0;
              const pct   = maxDist > 0 ? (count / maxDist) * 100 : 0;
              return (
                <div key={star} className="pr-dist-row">
                  <span className="pr-dist-label">
                    {star}
                    <Star style={{ width:11, height:11, fill:'#FBBF24', color:'#FBBF24' }} />
                  </span>
                  <div className="pr-bar-track">
                    <div className="pr-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="pr-dist-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="pr-divider" />

        {/* ── Review list ── */}
        {reviews.length === 0 ? (
          <div className="pr-empty">
            <div className="pr-empty-icon">
              <MessageSquare style={{ width:22, height:22, color:'rgba(255,255,255,0.2)' }} />
            </div>
            <p className="pr-empty-text">No reviews yet — be the first to share your thoughts!</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {reviews.map((review, i) => {
              // ✅ FIXED: user.name → user.fullName (matches User model)
              const name   = review.user?.fullName || 'Anonymous';
              const [a, b] = getGradient(name);
              return (
                <div
                  key={review._id}
                  className="pr-card"
                  style={{ animationDelay:`${i * 60}ms` }}
                >
                  {/* Avatar */}
                  <div>
                    {review.user?.avatar ? (
                      <img
                        src={review.user.avatar}
                        alt={name}
                        style={{
                          width:40, height:40, borderRadius:12,
                          objectFit:'cover', display:'block',
                          boxShadow:'0 4px 12px rgba(0,0,0,.3)',
                        }}
                      />
                    ) : (
                      <div
                        className="pr-avatar"
                        style={{
                          background: `linear-gradient(135deg,${a},${b})`,
                          boxShadow:  `0 4px 12px ${a}44`,
                        }}
                      >
                        {name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="pr-card-body">
                    <div className="pr-card-top">
                      <span className="pr-reviewer">{name}</span>
                      <span className="pr-date">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year:'numeric', month:'short', day:'numeric',
                        })}
                      </span>
                    </div>
                    <div className="pr-stars">
                      <StarRow rating={review.rating} size={14} />
                    </div>
                    <p className="pr-comment">{review.comment}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="pr-pagination">
            <button
              className="pr-page-btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <ChevronLeft style={{ width:17, height:17 }} />
            </button>
            <span className="pr-page-info">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </span>
            <button
              className="pr-page-btn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
            >
              <ChevronRight style={{ width:17, height:17 }} />
            </button>
          </div>
        )}

      </div>
    </>
  );
};

export default ProductReviews;