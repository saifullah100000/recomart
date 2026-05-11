import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, ArrowRight } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';
import CouponInput from '../../components/cart/CouponInput';

const CartPage = () => {
  const { items, total, fetchCart } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  /* ── Empty State ── */
  if (items.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center"
        style={{
          background: 'linear-gradient(135deg, #0d0b1e 0%, #0f0c2a 40%, #080818 100%)',
        }}
      >
        {/* Icon */}
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6"
          style={{
            background: 'rgba(124,58,237,0.1)',
            border: '1px solid rgba(124,58,237,0.2)',
            boxShadow: '0 8px 32px rgba(124,58,237,0.15)',
          }}
        >
          <ShoppingCart className="w-10 h-10" style={{ color: '#a78bfa' }} />
        </div>

        <h1 className="text-2xl font-extrabold mb-2" style={{ color: '#f0eeff' }}>
          Your Cart is Empty
        </h1>
        <p className="text-sm mb-8" style={{ color: '#6b7280' }}>
          Looks like you haven't added anything yet.
        </p>

        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200"
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
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  /* ── Cart with Items ── */
  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #0d0b1e 0%, #0f0c2a 40%, #080818 100%)',
      }}
    >
      <div className="container mx-auto px-4 py-8">

        {/* Page Header */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(124,58,237,0.25)',
            }}
          >
            <ShoppingCart className="w-5 h-5" style={{ color: '#a78bfa' }} />
          </div>

          <div className="flex items-baseline gap-3">
            <h1
              className="text-2xl md:text-3xl font-extrabold tracking-tight"
              style={{ color: '#f0eeff' }}
            >
              Shopping Cart
            </h1>
            <span
              className="text-sm font-semibold px-2.5 py-0.5 rounded-full"
              style={{
                background: 'rgba(124,58,237,0.15)',
                color: '#a78bfa',
                border: '1px solid rgba(124,58,237,0.25)',
              }}
            >
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* Back link */}
          <Link
            to="/products"
            className="ml-auto flex items-center gap-1.5 text-xs font-semibold transition-all duration-200"
            style={{ color: '#6b7280' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#a78bfa'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Continue Shopping
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Cart Items + Coupon */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <CartItem key={item.product._id} item={item} />
            ))}
            <CouponInput />
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CartSummary items={items} total={total} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;