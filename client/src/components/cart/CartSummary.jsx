import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import formatPrice from '../../utils/formatPrice';

const FREE_SHIPPING_THRESHOLD = 5000;
const SHIPPING_FEE = 200;

const CartSummary = ({ items, total }) => {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = total;
  const shippingFee = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const orderTotal = subtotal + shippingFee;
  const progressPct = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <h2
        className="text-lg font-extrabold tracking-tight mb-5"
        style={{ color: '#f0eeff' }}
      >
        Order Summary
      </h2>

      <div className="space-y-3 text-sm">
        {/* Items row */}
        <div className="flex justify-between">
          <span style={{ color: '#9ca3af' }}>Items ({itemCount})</span>
          <span style={{ color: '#d1d5db' }}>{formatPrice(subtotal)}</span>
        </div>

        {/* Shipping row */}
        <div className="flex justify-between">
          <span style={{ color: '#9ca3af' }}>Shipping</span>
          <span>
            {shippingFee === 0 ? (
              <span
                className="font-semibold"
                style={{ color: '#4ade80' }}
              >
                Free
              </span>
            ) : (
              <span style={{ color: '#d1d5db' }}>{formatPrice(shippingFee)}</span>
            )}
          </span>
        </div>

        {/* Free shipping progress */}
        {shippingFee > 0 && (
          <div className="pt-1">
            <div className="flex justify-between mb-1.5">
              <p className="text-xs" style={{ color: '#6b7280' }}>
                Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
              </p>
              <p className="text-xs font-medium" style={{ color: '#a78bfa' }}>
                {Math.round(progressPct)}%
              </p>
            </div>
            <div
              className="w-full rounded-full overflow-hidden"
              style={{ height: 4, background: 'rgba(255,255,255,0.08)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPct}%`,
                  background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
                }}
              />
            </div>
          </div>
        )}

        {/* Divider */}
        <div
          className="pt-3 mt-1"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex justify-between items-center">
            <span
              className="text-base font-bold"
              style={{ color: '#f0eeff' }}
            >
              Total
            </span>
            <span
              className="text-lg font-extrabold"
              style={{
                background: 'linear-gradient(90deg, #a78bfa, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {formatPrice(orderTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <Link
        to="/checkout"
        className="mt-6 w-full flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-xl transition-all duration-200"
        style={{
          background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
          color: '#ffffff',
          boxShadow: '0 4px 15px rgba(124,58,237,0.4)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 6px 24px rgba(124,58,237,0.6)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(124,58,237,0.4)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <ShoppingBag className="w-4 h-4" />
        Proceed to Checkout
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default CartSummary;