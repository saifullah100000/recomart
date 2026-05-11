import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  Clock,
  Package,
  ChevronRight,
  ImageOff,
  Sparkles,
} from 'lucide-react';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
import useWishlistStore from '../../store/wishlistStore';
import formatPrice from '../../utils/formatPrice';
import formatDate from '../../utils/formatDate';
import { ORDER_STATUSES } from '../../utils/constants';
import Loader from '../../components/common/Loader';
import RecommendedProducts from '../../components/home/RecommendedProducts';

const statPalettes = {
  blue:   { bg: 'rgba(59,130,246,0.12)',  color: '#60a5fa',  shadow: 'rgba(59,130,246,0.2)' },
  pink:   { bg: 'rgba(236,72,153,0.12)',  color: '#f472b6',  shadow: 'rgba(236,72,153,0.2)' },
  yellow: { bg: 'rgba(234,179,8,0.12)',   color: '#facc15',  shadow: 'rgba(234,179,8,0.2)'  },
};

const StatCard = ({ icon: Icon, label, value, palette, to }) => {
  const p = statPalettes[palette] || statPalettes.blue;
  return (
    <Link
      to={to}
      className="rounded-2xl p-5 transition-all duration-300 block"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(12px)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.borderColor = `rgba(124,58,237,0.3)`;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#6b7280' }}>
            {label}
          </p>
          <p className="text-2xl font-extrabold mt-2" style={{ color: '#f0eeff' }}>
            {value}
          </p>
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: p.bg, boxShadow: `0 4px 16px ${p.shadow}` }}
        >
          <Icon className="w-6 h-6" style={{ color: p.color }} />
        </div>
      </div>
      {/* accent line */}
      <div
        className="mt-4 h-px rounded-full"
        style={{ background: `linear-gradient(90deg, ${p.color}40, transparent)` }}
      />
    </Link>
  );
};

const DashboardPage = () => {
  const { user } = useAuthStore();
  const { products: wishlistProducts, fetchWishlist } = useWishlistStore();
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes] = await Promise.all([
          api.get('/orders/my-orders', { params: { limit: 5 } }),
          fetchWishlist(),
        ]);
        const ordersData = ordersRes.data;
        setOrders(ordersData.orders || []);
        setTotalOrders(ordersData.totalOrders || ordersData.orders?.length || 0);
        setPendingOrders(
          (ordersData.orders || []).filter((o) => o.status === 'pending').length
        );
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchWishlist]);

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

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #0d0b1e 0%, #0f0c2a 40%, #080818 100%)' }}
    >
      <div className="container mx-auto px-4 py-8">

        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{
                background: 'rgba(124,58,237,0.18)',
                color: '#a78bfa',
                border: '1px solid rgba(124,58,237,0.35)',
                letterSpacing: '0.05em',
              }}
            >
              My Account
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-2" style={{ color: '#f0eeff' }}>
            Welcome back,{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #a78bfa, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {user?.fullName || 'Customer'}
            </span>
          </h1>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
            Here's what's happening with your account today.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard icon={ShoppingBag} label="Total Orders"   value={totalOrders}             palette="blue"   to="/orders" />
          <StatCard icon={Heart}       label="Wishlist Items"  value={wishlistProducts.length}  palette="pink"   to="/wishlist" />
          <StatCard icon={Clock}       label="Pending Orders"  value={pendingOrders}            palette="yellow" to="/orders" />
        </div>

        {/* Recent Orders */}
        <div
          className="rounded-2xl overflow-hidden mb-8"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Card Header */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <h2 className="text-base font-bold flex items-center gap-2" style={{ color: '#f0eeff' }}>
              <Package className="w-5 h-5" style={{ color: '#a78bfa' }} />
              Recent Orders
            </h2>
            <Link
              to="/orders"
              className="flex items-center gap-1 text-xs font-semibold transition-all duration-200"
              style={{ color: '#a78bfa' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#c4b5fd'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#a78bfa'; }}
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'rgba(124,58,237,0.1)',
                  border: '1px solid rgba(124,58,237,0.2)',
                }}
              >
                <ShoppingBag className="w-7 h-7" style={{ color: '#a78bfa' }} />
              </div>
              <p className="font-semibold" style={{ color: '#6b7280' }}>No orders yet</p>
              <p className="text-sm" style={{ color: '#4b5563' }}>
                Start shopping to see your orders here.
              </p>
              <Link
                to="/products"
                className="mt-1 px-5 py-2 text-sm font-semibold rounded-xl transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                  color: '#ffffff',
                  boxShadow: '0 4px 15px rgba(124,58,237,0.35)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.55)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 15px rgba(124,58,237,0.35)'; }}
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div>
              {orders.map((order, idx) => {
                const statusInfo = ORDER_STATUSES[order.status] || ORDER_STATUSES.pending;
                const firstItem = order.items?.[0];
                const primaryImage = firstItem?.product?.images?.[0]?.url || null;
                const isLast = idx === orders.length - 1;

                return (
                  <Link
                    key={order._id}
                    to={`/orders/${order._id}`}
                    className="flex items-center gap-4 px-5 py-4 transition-all duration-200"
                    style={{
                      borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.05)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(124,58,237,0.06)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    {/* Product thumbnail */}
                    <div
                      className="w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {primaryImage ? (
                        <img src={primaryImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageOff className="w-5 h-5" style={{ color: '#4b5563' }} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: '#f0eeff' }}>
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
                        {formatDate(order.createdAt)} · {order.items?.length || 0} item
                        {(order.items?.length || 0) !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {/* Status badge */}
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={
                        ORDER_STATUSES[order.status]
                          ? {
                              background: 'rgba(124,58,237,0.12)',
                              color: '#a78bfa',
                              border: '1px solid rgba(124,58,237,0.25)',
                            }
                          : {
                              background: 'rgba(234,179,8,0.12)',
                              color: '#facc15',
                              border: '1px solid rgba(234,179,8,0.25)',
                            }
                      }
                    >
                      {statusInfo.label}
                    </span>

                    {/* Total */}
                    <span
                      className="text-sm font-bold hidden sm:block"
                      style={{ color: '#a78bfa' }}
                    >
                      {formatPrice(order.totalAmount)}
                    </span>

                    <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: '#4b5563' }} />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Recommended Products */}
        <RecommendedProducts />
      </div>
    </div>
  );
};

export default DashboardPage;