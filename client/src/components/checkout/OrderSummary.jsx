import { ImageOff, ShieldCheck, ArrowRight } from 'lucide-react';
import formatPrice from '../../utils/formatPrice';

const OrderSummary = ({ items, subtotal, shippingFee, total, paymentMethod, onPlaceOrder }) => {
  return (
    <div
      className="rounded-2xl p-6 space-y-5"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <h3
        className="text-lg font-extrabold tracking-tight"
        style={{ color: '#f0eeff' }}
      >
        Order Summary
      </h3>

      {/* Item List */}
      <div
        className="space-y-3 max-h-64 overflow-y-auto pr-1"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(124,58,237,0.3) transparent' }}
      >
        {items.map((item) => {
          const { product, quantity } = item;
          const primaryImage =
            product.images && product.images.length > 0
              ? product.images[0].url
              : null;

          return (
            <div
              key={product._id}
              className="flex items-center gap-3 text-sm p-2 rounded-xl transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.02)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(124,58,237,0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
              }}
            >
              {/* Image */}
              <div
                className="w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {primaryImage ? (
                  <img
                    src={primaryImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageOff className="w-5 h-5" style={{ color: '#4b5563' }} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate" style={{ color: '#f0eeff' }}>
                  {product.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
                  Qty: {quantity}
                </p>
              </div>

              {/* Line price */}
              <span className="font-bold flex-shrink-0" style={{ color: '#a78bfa' }}>
                {formatPrice(product.price * quantity)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div
        className="pt-4 space-y-2 text-sm"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex justify-between">
          <span style={{ color: '#9ca3af' }}>Subtotal</span>
          <span style={{ color: '#d1d5db' }}>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: '#9ca3af' }}>Shipping</span>
          <span>
            {shippingFee === 0 ? (
              <span className="font-semibold" style={{ color: '#4ade80' }}>Free</span>
            ) : (
              <span style={{ color: '#d1d5db' }}>{formatPrice(shippingFee)}</span>
            )}
          </span>
        </div>
        <div
          className="pt-3 flex justify-between items-center"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <span className="text-base font-bold" style={{ color: '#f0eeff' }}>Total</span>
          <span
            className="text-lg font-extrabold"
            style={{
              background: 'linear-gradient(90deg, #a78bfa, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* Payment Method */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <span style={{ color: '#6b7280' }}>Paying via:</span>
        <span
          className="font-semibold px-2 py-0.5 rounded-full"
          style={{
            background: 'rgba(124,58,237,0.15)',
            color: '#a78bfa',
            border: '1px solid rgba(124,58,237,0.3)',
          }}
        >
          {paymentMethod === 'stripe' ? 'Card (Stripe)' : 'Cash on Delivery'}
        </span>
      </div>

      {/* Place Order Button */}
      <button
        onClick={onPlaceOrder}
        className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-xl transition-all duration-200"
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
        <ShieldCheck className="w-4 h-4" />
        Place Order
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default OrderSummary;