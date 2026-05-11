import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Package,
  ArrowLeft,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
  ImageOff,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import formatPrice from '../../utils/formatPrice';
import formatDate, { formatDateTime } from '../../utils/formatDate';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '../../utils/constants';
import Loader from '../../components/common/Loader';

const STATUS_STEPS = ['pending', 'confirmed', 'packed', 'shipped', 'delivered'];
const STATUS_ICONS = {
  pending:   Clock,
  confirmed: CheckCircle2,
  packed:    PackageCheck,
  shipped:   Truck,
  delivered: Package,
};

/* shared card style */
const card = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
  backdropFilter: 'blur(12px)',
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.order);
      } catch (error) {
        console.error('Failed to fetch order:', error);
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      const { data } = await api.put(`/orders/${id}/cancel`, {});
      setOrder(data.order);
      toast.success('Order cancelled successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: 'linear-gradient(135deg, #0d0b1e 0%, #0f0c2a 40%, #080818 100%)' }}
      >
        <Loader size="lg" />
      </div>
    );
  }

  /* ── Not Found ── */
  if (!order) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center"
        style={{ background: 'linear-gradient(135deg, #0d0b1e 0%, #0f0c2a 40%, #080818 100%)' }}
      >
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <AlertTriangle className="w-9 h-9" style={{ color: '#f87171' }} />
        </div>
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: '#f0eeff' }}>
          Order Not Found
        </h1>
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 mt-4 text-sm font-semibold transition-all duration-200"
          style={{ color: '#a78bfa' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#c4b5fd'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#a78bfa'; }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
      </div>
    );
  }

  const statusInfo     = ORDER_STATUSES[order.status]        || ORDER_STATUSES.pending;
  const paymentStatus  = PAYMENT_STATUSES[order.paymentStatus] || PAYMENT_STATUSES.pending;
  const isCancelled    = order.status === 'cancelled';
  const currentStepIdx = STATUS_STEPS.indexOf(order.status);
  const subtotal       = order.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0;
  const shippingFee    = (order.totalAmount || 0) - subtotal;

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #0d0b1e 0%, #0f0c2a 40%, #080818 100%)' }}
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">

        {/* Back link */}
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold mb-6 transition-all duration-200"
          style={{ color: '#6b7280' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#a78bfa'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold flex items-center gap-2" style={{ color: '#f0eeff' }}>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}
              >
                <Package className="w-5 h-5" style={{ color: '#a78bfa' }} />
              </div>
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-sm mt-1 ml-11" style={{ color: '#6b7280' }}>
              Placed on {formatDateTime(order.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Status pill */}
            <span
              className="text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(124,58,237,0.12)',
                color: '#a78bfa',
                border: '1px solid rgba(124,58,237,0.25)',
              }}
            >
              {statusInfo.label}
            </span>

            {/* Cancel button */}
            {order.status === 'pending' && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  color: '#f87171',
                  cursor: cancelling ? 'not-allowed' : 'pointer',
                  opacity: cancelling ? 0.5 : 1,
                }}
                onMouseEnter={(e) => { if (!cancelling) e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; }}
                onMouseLeave={(e) => { if (!cancelling) e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
              >
                <XCircle className="w-4 h-4" />
                {cancelling ? 'Cancelling…' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>

        {/* Status Tracker */}
        {!isCancelled && (
          <div className="rounded-2xl p-6 mb-6" style={card}>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: '#6b7280' }}>
              Order Progress
            </h2>
            <div className="flex items-center justify-between">
              {STATUS_STEPS.map((step, index) => {
                const Icon      = STATUS_ICONS[step];
                const isActive  = index <= currentStepIdx;
                const isCurrent = index === currentStepIdx;
                return (
                  <div key={step} className="flex-1 flex flex-col items-center relative">
                    {/* Connector */}
                    {index > 0 && (
                      <div
                        className="absolute top-5 right-1/2 w-full h-0.5 -translate-y-1/2"
                        style={{
                          zIndex: 0,
                          background: isActive
                            ? 'linear-gradient(90deg, #7c3aed, #a78bfa)'
                            : 'rgba(255,255,255,0.08)',
                        }}
                      />
                    )}
                    {/* Circle */}
                    <div
                      className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                      style={
                        isCurrent
                          ? {
                              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                              boxShadow: '0 0 0 4px rgba(124,58,237,0.2)',
                              color: '#fff',
                            }
                          : isActive
                          ? { background: 'rgba(124,58,237,0.25)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)' }
                          : { background: 'rgba(255,255,255,0.05)', color: '#4b5563', border: '1px solid rgba(255,255,255,0.08)' }
                      }
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className="text-xs mt-2 font-semibold capitalize"
                      style={{ color: isActive ? '#a78bfa' : '#4b5563' }}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cancelled Notice */}
        {isCancelled && (
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6"
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
            }}
          >
            <XCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#f87171' }} />
            <p className="text-sm font-medium" style={{ color: '#f87171' }}>
              This order has been cancelled.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Items + Totals */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl p-6" style={card}>
              <h2 className="text-base font-bold mb-4" style={{ color: '#f0eeff' }}>
                Items ({order.items?.length || 0})
              </h2>

              <div>
                {order.items?.map((item, idx) => {
                  const primaryImage = item.product?.images?.[0]?.url || null;
                  const isLast = idx === (order.items.length - 1);
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-4 py-4"
                      style={{ borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <div
                        className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        {primaryImage ? (
                          <img src={primaryImage} alt={item.product?.name || 'Product'} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageOff className="w-6 h-6" style={{ color: '#4b5563' }} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: '#f0eeff' }}>
                          {item.product?.name || 'Product'}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-bold" style={{ color: '#a78bfa' }}>
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div
                className="mt-4 pt-4 space-y-2 text-sm"
                style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex justify-between">
                  <span style={{ color: '#9ca3af' }}>Subtotal</span>
                  <span style={{ color: '#d1d5db' }}>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#9ca3af' }}>Shipping</span>
                  <span>
                    {shippingFee <= 0
                      ? <span className="font-semibold" style={{ color: '#4ade80' }}>Free</span>
                      : <span style={{ color: '#d1d5db' }}>{formatPrice(shippingFee)}</span>
                    }
                  </span>
                </div>
                <div
                  className="pt-2 flex justify-between items-center"
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
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping + Payment */}
          <div className="space-y-4">

            {/* Shipping Address */}
            <div className="rounded-2xl p-5" style={card}>
              <h3
                className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-4"
                style={{ color: '#a78bfa' }}
              >
                <MapPin className="w-4 h-4" />
                Shipping Address
              </h3>
              {order.shippingAddress ? (
                <div className="text-sm space-y-0.5">
                  {order.shippingAddress.label && (
                    <p className="font-semibold" style={{ color: '#f0eeff' }}>
                      {order.shippingAddress.label}
                    </p>
                  )}
                  <p style={{ color: '#9ca3af' }}>{order.shippingAddress.street}</p>
                  <p style={{ color: '#9ca3af' }}>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p style={{ color: '#9ca3af' }}>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && (
                    <p className="mt-1" style={{ color: '#6b7280' }}>{order.shippingAddress.phone}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm" style={{ color: '#4b5563' }}>No address provided</p>
              )}
            </div>

            {/* Payment Info */}
            <div className="rounded-2xl p-5" style={card}>
              <h3
                className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-4"
                style={{ color: '#a78bfa' }}
              >
                <CreditCard className="w-4 h-4" />
                Payment
              </h3>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span style={{ color: '#9ca3af' }}>Method</span>
                  <span className="font-semibold" style={{ color: '#f0eeff' }}>
                    {order.paymentMethod === 'stripe' ? 'Card (Stripe)' : 'Cash on Delivery'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#9ca3af' }}>Status</span>
                  <span
                    className="font-semibold px-2 py-0.5 rounded-full text-xs"
                    style={{
                      background: order.paymentStatus === 'paid'
                        ? 'rgba(34,197,94,0.12)'
                        : 'rgba(234,179,8,0.12)',
                      color: order.paymentStatus === 'paid' ? '#4ade80' : '#facc15',
                      border: order.paymentStatus === 'paid'
                        ? '1px solid rgba(34,197,94,0.25)'
                        : '1px solid rgba(234,179,8,0.25)',
                    }}
                  >
                    {paymentStatus.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;