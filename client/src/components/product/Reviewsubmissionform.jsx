import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  Send,
  CheckCircle2,
  Lock,
  ShoppingBag,
  ChevronDown
} from 'lucide-react';

import api from '../../api/axios';
import useAuthStore from '../../store/authStore';

/* ─── Singleton styles ───────────────────────────────────────────────────── */
const RF_STYLE_ID = 'rf-styles';

if (
  typeof document !== 'undefined' &&
  !document.getElementById(RF_STYLE_ID)
) {
  const tag = document.createElement('style');

  tag.id = RF_STYLE_ID;

  tag.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

    .rf-wrap {
      font-family: 'DM Sans', sans-serif;
      background: rgba(10, 13, 28, 0.85);
      border: 1px solid rgba(139,92,246,0.18);
      border-radius: 20px;
      overflow: hidden;
      backdrop-filter: blur(16px);
      position: relative;
    }

    .rf-wrap::before {
      content: '';
      position: absolute;
      top: 0;
      left: 15%;
      right: 15%;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(139,92,246,0.5),
        transparent
      );
      z-index: 1;
    }

    .rf-header {
      padding: 1.4rem 1.75rem 1.25rem;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }

    .rf-header-icon {
      width: 34px;
      height: 34px;
      border-radius: 9px;
      background: rgba(124,58,237,0.15);
      border: 1px solid rgba(139,92,246,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #7c3aed;
      flex-shrink: 0;
    }

    .rf-header-title {
      font-family: 'Syne', sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      color: #f1f5f9;
      margin: 0;
    }

    .rf-header-sub {
      font-size: 0.72rem;
      color: #334155;
      font-weight: 300;
      margin-top: 0.1rem;
    }

    .rf-body {
      padding: 1.5rem 1.75rem 1.75rem;
    }

    .rf-stars-label {
      font-size: 0.72rem;
      font-weight: 600;
      color: #475569;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 0.65rem;
      display: block;
    }

    .rf-stars {
      display: flex;
      gap: 0.3rem;
      margin-bottom: 0.5rem;
    }

    .rf-star-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 3px;
      border-radius: 5px;
      transition: transform 0.15s cubic-bezier(0.34,1.56,0.64,1);
      line-height: 0;
    }

    .rf-star-btn:hover {
      transform: scale(1.25);
    }

    .rf-star-btn:active {
      transform: scale(0.92);
    }

    .rf-star-btn svg {
      transition: fill 0.12s, color 0.12s, filter 0.12s;
    }

    .rf-star-btn.filled svg {
      fill: #fbbf24;
      color: #fbbf24;
      filter: drop-shadow(0 0 4px rgba(251,191,36,0.5));
    }

    .rf-star-btn.empty svg {
      fill: #1e293b;
      color: #1e293b;
    }

    .rf-rating-hint {
      font-size: 0.72rem;
      color: #475569;
      height: 1rem;
      margin-bottom: 1.25rem;
    }

    .rf-field {
      margin-bottom: 1.1rem;
    }

    .rf-label {
      font-size: 0.72rem;
      font-weight: 600;
      color: #475569;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 0.45rem;
      display: block;
    }

    .rf-select-wrap {
      position: relative;
    }

    .rf-select {
      width: 100%;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      padding: 0.65rem 2.5rem 0.65rem 0.9rem;
      font-size: 0.83rem;
      color: #e2e8f0;
      font-family: 'DM Sans', sans-serif;
      outline: none;
      appearance: none;
      cursor: pointer;
    }

    .rf-select option {
      background: #0f1124;
      color: #e2e8f0;
    }

    .rf-select-icon {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: #334155;
      pointer-events: none;
    }

    .rf-textarea {
      width: 100%;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      padding: 0.75rem 0.9rem;
      font-size: 0.83rem;
      color: #e2e8f0;
      font-family: 'DM Sans', sans-serif;
      resize: vertical;
      min-height: 110px;
      outline: none;
      box-sizing: border-box;
    }

    .rf-submit {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.8rem 1.5rem;
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      border: none;
      border-radius: 11px;
      color: #fff;
      font-size: 0.88rem;
      cursor: pointer;
      margin-top: 1.1rem;
    }

    .rf-submit:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    .rf-error {
      font-size: 0.72rem;
      color: #f87171;
      margin-top: 0.5rem;
    }

    .rf-success {
      padding: 2.5rem 1.75rem;
      text-align: center;
    }

    .rf-login-prompt {
      padding: 2rem 1.75rem;
      text-align: center;
    }

    .rf-login-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.65rem 1.4rem;
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      border-radius: 10px;
      color: #fff;
      text-decoration: none;
      margin-top: 0.35rem;
    }

    .rf-no-orders {
      display: flex;
      align-items: flex-start;
      gap: 0.6rem;
      padding: 0.75rem 0.9rem;
      background: rgba(251,191,36,0.06);
      border: 1px solid rgba(251,191,36,0.15);
      border-radius: 9px;
      font-size: 0.75rem;
      color: #fbbf24;
      line-height: 1.5;
      margin-bottom: 1.1rem;
    }
  `;

  document.head.appendChild(tag);
}

const RATING_LABELS = {
  1: 'Poor — not what I expected',
  2: 'Fair — some issues',
  3: 'Good — meets expectations',
  4: 'Great — really happy with it',
  5: 'Excellent — absolutely love it! ⭐',
};

const MAX_CHARS = 500;

const ReviewSubmissionForm = ({
  productId,
  onReviewSubmitted
}) => {

  const { isAuthenticated } = useAuthStore();

  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [orderId, setOrderId] = useState('');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  /* ─── Fetch Orders ─── */
  useEffect(() => {

    if (!isAuthenticated || !productId) return;

    const fetchOrders = async () => {

      setOrdersLoading(true);

      try {

        const { data } =
          await api.get(
            `/orders/eligible-for-review/${productId}`
          );

        console.log('ELIGIBLE ORDERS:', data);

        const list =
          data.orders ||
          data.data ||
          data ||
          [];

        setOrders(list);

        if (list.length === 1) {

          const firstOrderId =
            list[0].orderId ||
            list[0]._id ||
            list[0].id ||
            '';

          setOrderId(firstOrderId);
        }

      } catch (err) {

        console.log(err);

        setOrders([]);

      } finally {

        setOrdersLoading(false);
      }
    };

    fetchOrders();

  }, [isAuthenticated, productId]);

  /* ─── Submit Review ─── */
  const handleSubmit = async () => {

    setError('');

    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }

    if (!comment.trim()) {
      setError('Please write a comment.');
      return;
    }

    if (orders.length > 0 && !orderId) {
      setError(
        'Please select the order for this review.'
      );
      return;
    }

    try {

      setSubmitting(true);

      console.log('FINAL ORDER ID:', orderId);

      await api.post(`/reviews/${productId}`, {
  rating,
  comment: comment.trim()
});

      setSubmitted(true);

      onReviewSubmitted?.();

    } catch (err) {

      console.log(err);

      setError(
        err.response?.data?.message ||
        'Failed to submit review.'
      );

    } finally {

      setSubmitting(false);
    }
  };

  /* ─── Login Prompt ─── */
  if (!isAuthenticated) {
    return (
      <div className="rf-wrap">
        <div className="rf-login-prompt">
          <p>Please login to submit a review.</p>

          <Link
            to="/login"
            className="rf-login-btn"
          >
            <Lock size={14} />
            Login
          </Link>
        </div>
      </div>
    );
  }

  /* ─── Success ─── */
  if (submitted) {
    return (
      <div className="rf-wrap">
        <div className="rf-success">
          <CheckCircle2
            size={45}
            color="#4ade80"
          />

          <h3>Review Submitted!</h3>

          <p>
            Thank you for sharing your experience.
          </p>
        </div>
      </div>
    );
  }

  const activeRating = hovered || rating;

  return (
    <div className="rf-wrap">

      {/* Header */}
      <div className="rf-header">

        <div className="rf-header-icon">
          <Star size={16} />
        </div>

        <div>
          <p className="rf-header-title">
            Write a Review
          </p>

          <p className="rf-header-sub">
            Share your experience
          </p>
        </div>
      </div>

      <div className="rf-body">

        {/* Rating */}
        <span className="rf-stars-label">
          Your Rating
        </span>

        <div className="rf-stars">
          {[1,2,3,4,5].map((n) => (
            <button
              key={n}
              type="button"
              className={`rf-star-btn ${
                n <= activeRating
                  ? 'filled'
                  : 'empty'
              }`}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(n)}
            >
              <Star size={28} />
            </button>
          ))}
        </div>

        <p className="rf-rating-hint">
          {activeRating
            ? RATING_LABELS[activeRating]
            : 'Click to rate'}
        </p>

        {/* Order Selector */}
        {ordersLoading ? (

          <p>Loading orders...</p>

        ) : orders.length > 0 ? (

          <div className="rf-field">

            <label className="rf-label">
              Order
            </label>

            <div className="rf-select-wrap">

              <select
                className="rf-select"
                value={orderId}
                onChange={(e) => {
                  console.log(
                    'SELECTED:',
                    e.target.value
                  );

                  setOrderId(e.target.value);
                }}
              >

                <option value="">
                  Select an order…
                </option>

                {orders.map((o, index) => {

                  const actualOrderId =
                    o.orderId ||
                    o._id ||
                    o.id ||
                    '';

                  return (
                    <option
                      key={actualOrderId || index}
                      value={actualOrderId}
                    >
                      #
                      {actualOrderId
                        ?.slice(-8)
                        ?.toUpperCase()}
                    </option>
                  );
                })}
              </select>

              <ChevronDown
                size={14}
                className="rf-select-icon"
              />
            </div>
          </div>

        ) : (

          <div className="rf-no-orders">

            <ShoppingBag size={14} />

            <span>
              You need a delivered order
              containing this product.
            </span>
          </div>
        )}

        {/* Comment */}
        <div className="rf-field">

          <label className="rf-label">
            Your Review
          </label>

          <textarea
            className="rf-textarea"
            placeholder="Write your review..."
            value={comment}
            onChange={(e) =>
              setComment(
                e.target.value.slice(0, MAX_CHARS)
              )
            }
          />
        </div>

        {/* Error */}
        {error && (
          <p className="rf-error">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          className="rf-submit"
          onClick={handleSubmit}
          disabled={submitting}
        >
          <Send size={14} />

          {submitting
            ? 'Submitting...'
            : 'Submit Review'}
        </button>

      </div>
    </div>
  );
};

export default ReviewSubmissionForm;