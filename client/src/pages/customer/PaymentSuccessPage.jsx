import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Package, ShoppingBag, XCircle, Sparkles, ArrowRight } from 'lucide-react';
import api from '../../api/axios';
import useCartStore from '../../store/cartStore';
import formatPrice from '../../utils/formatPrice';
import Loader from '../../components/common/Loader';

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  .pay-page {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #080b1a;
    position: relative;
    overflow: hidden;
  }

  /* Ambient orbs */
  .pay-orb {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(100px);
    z-index: 0;
  }
  .pay-orb-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(109,40,217,0.16) 0%, transparent 65%);
    top: -150px; left: -150px;
  }
  .pay-orb-2 {
    width: 380px; height: 380px;
    background: radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 65%);
    bottom: -80px; right: -80px;
  }

  /* Grid texture */
  .pay-grid {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(139,92,246,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139,92,246,0.035) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  /* ── Verifying ── */
  .verifying-wrap {
    position: relative; z-index: 1;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    min-height: 100vh; gap: 1rem;
  }
  .verifying-text {
    font-size: 0.8rem; color: #475569;
    letter-spacing: 0.06em; text-transform: uppercase;
    animation: pay-fade-pulse 1.8s ease-in-out infinite;
  }
  @keyframes pay-fade-pulse {
    0%, 100% { opacity: 0.5; }
    50%       { opacity: 1; }
  }

  /* ── Center container ── */
  .pay-center {
    position: relative; z-index: 1;
    max-width: 460px; margin: 0 auto;
    padding: 5rem 1.5rem 4rem;
    text-align: center;
  }

  /* ── Icon circle ── */
  .icon-circle {
    width: 90px; height: 90px;
    border-radius: 50%; margin: 0 auto 1.75rem;
    display: flex; align-items: center; justify-content: center;
  }
  .icon-circle.success {
    background: rgba(34,197,94,0.08);
    border: 2px solid rgba(34,197,94,0.22);
    box-shadow: 0 0 50px rgba(34,197,94,0.12), 0 0 0 8px rgba(34,197,94,0.04);
    animation: pay-pop-in 0.55s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  .icon-circle.error {
    background: rgba(239,68,68,0.08);
    border: 2px solid rgba(239,68,68,0.2);
    box-shadow: 0 0 40px rgba(239,68,68,0.1), 0 0 0 8px rgba(239,68,68,0.04);
  }
  @keyframes pay-pop-in {
    from { transform: scale(0.4); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
  }

  /* ── Headings ── */
  .pay-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.4rem, 3vw, 1.85rem);
    font-weight: 800; color: #f1f5f9;
    letter-spacing: -0.02em; margin: 0 0 0.6rem;
    line-height: 1.15;
  }
  .pay-title.success span { color: #4ade80; }
  .pay-title.error   span { color: #f87171; }

  .pay-sub {
    font-size: 0.85rem; color: #475569;
    line-height: 1.7; margin: 0 0 2rem;
    font-weight: 300;
  }

  /* ── Confetti dots (success only) ── */
  .pay-confetti {
    position: absolute; top: 80px; left: 50%;
    transform: translateX(-50%);
    width: 300px; height: 120px;
    pointer-events: none; z-index: 0;
  }
  .pay-dot {
    position: absolute; border-radius: 50%;
    animation: pay-float 2.5s ease-in-out infinite alternate;
  }
  @keyframes pay-float {
    from { transform: translateY(0) scale(1); opacity: 0.6; }
    to   { transform: translateY(-18px) scale(1.2); opacity: 0.2; }
  }

  /* ── Order card ── */
  .order-card {
    background: rgba(12,15,30,0.9);
    border: 1px solid rgba(139,92,246,0.2);
    border-radius: 18px; padding: 1.5rem;
    margin-bottom: 1.75rem; text-align: left;
    position: relative; overflow: hidden;
    backdrop-filter: blur(16px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.35);
  }
  .order-card::before {
    content: '';
    position: absolute; top: 0; left: 15%; right: 15%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent);
  }
  .order-card::after {
    content: '';
    position: absolute; top: -50px; right: -50px;
    width: 150px; height: 150px;
    background: radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  .order-card-title {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.68rem; font-weight: 600; color: #a78bfa;
    letter-spacing: 0.09em; text-transform: uppercase;
    margin-bottom: 1.1rem;
  }
  .order-card-title-icon {
    width: 22px; height: 22px; border-radius: 6px;
    background: rgba(124,58,237,0.15); border: 1px solid rgba(139,92,246,0.2);
    display: flex; align-items: center; justify-content: center; color: #7c3aed;
    flex-shrink: 0;
  }

  .order-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.6rem 0; border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .order-row:last-child { border-bottom: none; }

  .order-row-label { font-size: 0.75rem; color: #334155; }
  .order-row-value { font-size: 0.82rem; font-weight: 500; color: #c4b5fd; }
  .order-row-value.mono {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem; color: #a78bfa;
    background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.2);
    border-radius: 6px; padding: 2px 8px;
  }
  .order-row-value.paid { color: #4ade80; }
  .order-row-value.bold { font-weight: 700; color: #f1f5f9; font-size: 0.95rem; }

  /* ── Buttons ── */
  .btn-row {
    display: flex; align-items: center; justify-content: center;
    gap: 0.75rem; flex-wrap: wrap;
  }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 0.45rem;
    padding: 0.7rem 1.5rem; border-radius: 11px;
    background: linear-gradient(135deg, #7c3aed, #4f46e5);
    border: none; color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 500;
    text-decoration: none; cursor: pointer;
    transition: opacity 0.2s, transform 0.2s;
    box-shadow: 0 4px 18px rgba(124,58,237,0.35);
  }
  .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }

  .btn-secondary {
    display: inline-flex; align-items: center; gap: 0.45rem;
    padding: 0.7rem 1.5rem; border-radius: 11px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    color: #475569;
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 500;
    text-decoration: none; cursor: pointer;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
  }
  .btn-secondary:hover {
    background: rgba(139,92,246,0.08);
    border-color: rgba(139,92,246,0.3);
    color: #a78bfa;
  }
`;

/* Decorative confetti dots for success state */
const ConfettiDots = () => {
  const dots = [
    { x: '15%', y: '20%', size: 6, color: '#a78bfa', delay: '0s'   },
    { x: '80%', y: '10%', size: 5, color: '#60a5fa', delay: '0.3s' },
    { x: '50%', y: '5%',  size: 4, color: '#4ade80', delay: '0.6s' },
    { x: '25%', y: '60%', size: 4, color: '#f472b6', delay: '0.2s' },
    { x: '75%', y: '55%', size: 5, color: '#fbbf24', delay: '0.5s' },
    { x: '60%', y: '80%', size: 3, color: '#a78bfa', delay: '0.8s' },
    { x: '10%', y: '80%', size: 4, color: '#60a5fa', delay: '0.4s' },
  ];
  return (
    <div className="pay-confetti" aria-hidden="true">
      {dots.map((d, i) => (
        <div
          key={i}
          className="pay-dot"
          style={{
            left: d.x, top: d.y,
            width: d.size, height: d.size,
            background: d.color,
            animationDelay: d.delay,
            animationDuration: `${2 + i * 0.3}s`,
          }}
        />
      ))}
    </div>
  );
};

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCartStore();
  const [status, setStatus] = useState('verifying');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) { setStatus('error'); return; }
      try {
        const { data } = await api.get(`/payments/verify/${sessionId}`);
        setOrder(data.order);
        setStatus('success');
        await clearCart();
      } catch (err) {
        console.error('Payment verification failed:', err);
        setStatus('error');
      }
    };
    verifyPayment();
  }, [sessionId, clearCart]);

  /* ── Verifying ── */
  if (status === 'verifying') {
    return (
      <div className="pay-page">
        <style>{PAGE_STYLES}</style>
        <div className="pay-orb pay-orb-1" />
        <div className="pay-orb pay-orb-2" />
        <div className="pay-grid" />
        <div className="verifying-wrap">
          <Loader size="lg" />
          <p className="verifying-text">Verifying your payment…</p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (status === 'error') {
    return (
      <div className="pay-page">
        <style>{PAGE_STYLES}</style>
        <div className="pay-orb pay-orb-1" />
        <div className="pay-orb pay-orb-2" />
        <div className="pay-grid" />
        <div className="pay-center">
          <div className="icon-circle error">
            <XCircle size={42} color="#f87171" />
          </div>
          <h1 className="pay-title error">Payment <span>Failed</span></h1>
          <p className="pay-sub">
            We could not verify your payment. If you were charged, please contact our support team.
          </p>
          <div className="btn-row">
            <Link to="/orders" className="btn-primary">
              <Package size={14} /> View My Orders
            </Link>
            <Link to="/products" className="btn-secondary">
              <ShoppingBag size={14} /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Success ── */
  return (
    <div className="pay-page">
      <style>{PAGE_STYLES}</style>
      <div className="pay-orb pay-orb-1" />
      <div className="pay-orb pay-orb-2" />
      <div className="pay-grid" />

      <div className="pay-center" style={{ position: 'relative' }}>
        <ConfettiDots />

        <div className="icon-circle success">
          <CheckCircle2 size={46} color="#4ade80" />
        </div>

        <h1 className="pay-title success">Payment <span>Successful!</span></h1>
        <p className="pay-sub">
          Thank you for your purchase. Your order has been confirmed and is being prepared.
        </p>

        {order && (
          <div className="order-card">
            <div className="order-card-title">
              <div className="order-card-title-icon"><Sparkles size={11} /></div>
              Order Details
            </div>

            <div className="order-row">
              <span className="order-row-label">Order ID</span>
              <span className="order-row-value mono">#{order._id?.slice(-8).toUpperCase()}</span>
            </div>
            {order.totalAmount && (
              <div className="order-row">
                <span className="order-row-label">Total Paid</span>
                <span className="order-row-value bold">{formatPrice(order.totalAmount)}</span>
              </div>
            )}
            <div className="order-row">
              <span className="order-row-label">Payment</span>
              <span className="order-row-value paid">✓ Confirmed via Stripe</span>
            </div>
            {order.items && (
              <div className="order-row">
                <span className="order-row-label">Items</span>
                <span className="order-row-value">{order.items.length}</span>
              </div>
            )}
          </div>
        )}

        <div className="btn-row">
          {order && (
            <Link to={`/orders/${order._id}`} className="btn-primary">
              <Package size={14} /> View Order <ArrowRight size={13} />
            </Link>
          )}
          <Link to="/products" className="btn-secondary">
            <ShoppingBag size={14} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;