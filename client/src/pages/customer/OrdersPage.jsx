import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ChevronRight,
  ChevronLeft,
  ImageOff,
  ShoppingBag,
} from 'lucide-react';
import api from '../../api/axios';
import formatPrice from '../../utils/formatPrice';
import formatDate from '../../utils/formatDate';
import { ORDER_STATUSES } from '../../utils/constants';
import Loader from '../../components/common/Loader';

const TABS = [
  { value: 'all',       label: 'All' },
  { value: 'pending',   label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'shipped',   label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const LIMIT = 10;

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState({ tab: 'all', page: 1 });
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const activeTab = query.tab;
  const page = query.page;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const params = { page: query.page, limit: LIMIT };
        if (query.tab !== 'all') params.status = query.tab;
        const { data } = await api.get('/orders/my-orders', { params });
        setOrders(data.orders || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [query]);

  const handleTabChange = (tab) => setQuery({ tab, page: 1 });

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #0d0b1e 0%, #0f0c2a 40%, #080818 100%)' }}
    >
      <div className="container mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(124,58,237,0.25)',
            }}
          >
            <Package className="w-5 h-5" style={{ color: '#a78bfa' }} />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ color: '#f0eeff' }}>
            My Orders
          </h1>
        </div>

        {/* Filter Tabs */}
        <div
          className="flex gap-1 overflow-x-auto pb-1 mb-6 p-1 rounded-xl w-fit"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            scrollbarWidth: 'none',
          }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className="px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200"
                style={
                  isActive
                    ? {
                        background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                        color: '#ffffff',
                        boxShadow: '0 4px 15px rgba(124,58,237,0.4)',
                      }
                    : { background: 'transparent', color: '#9ca3af' }
                }
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = '#e5e7eb'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = '#9ca3af'; }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader size="lg" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center"
              style={{
                background: 'rgba(124,58,237,0.1)',
                border: '1px solid rgba(124,58,237,0.2)',
                boxShadow: '0 8px 32px rgba(124,58,237,0.1)',
              }}
            >
              <ShoppingBag className="w-9 h-9" style={{ color: '#a78bfa' }} />
            </div>
            <h2 className="text-xl font-bold" style={{ color: '#f0eeff' }}>No Orders Found</h2>
            <p className="text-sm" style={{ color: '#6b7280' }}>
              {activeTab !== 'all'
                ? `You have no ${activeTab} orders.`
                : "You haven't placed any orders yet."}
            </p>
            <Link
              to="/products"
              className="mt-2 inline-block px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200"
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
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const statusInfo   = ORDER_STATUSES[order.status] || ORDER_STATUSES.pending;
              const firstItem    = order.items?.[0];
              const primaryImage = firstItem?.product?.images?.[0]?.url || null;
              const itemCount    = order.items?.length || 0;

              return (
                <Link
                  key={order._id}
                  to={`/orders/${order._id}`}
                  className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl transition-all duration-200 block"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(12px)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(124,58,237,0.07)';
                    e.currentTarget.style.borderColor = 'rgba(124,58,237,0.25)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    className="w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden hidden sm:block"
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold" style={{ color: '#f0eeff' }}>
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <span
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                        style={{
                          background: 'rgba(124,58,237,0.12)',
                          color: '#a78bfa',
                          border: '1px solid rgba(124,58,237,0.25)',
                        }}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: '#6b7280' }}>
                      {formatDate(order.createdAt)} · {itemCount} item{itemCount !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Total */}
                  <span className="text-sm font-bold" style={{ color: '#a78bfa' }}>
                    {formatPrice(order.totalAmount)}
                  </span>

                  <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: '#4b5563' }} />
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <p className="text-sm" style={{ color: '#6b7280' }}>
              Page{' '}
              <span style={{ color: '#a78bfa', fontWeight: 600 }}>{page}</span>
              {' '}of{' '}
              <span style={{ color: '#a78bfa', fontWeight: 600 }}>{totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuery((q) => ({ ...q, page: Math.max(1, q.page - 1) }))}
                disabled={page === 1}
                className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: page === 1 ? '#4b5563' : '#d1d5db',
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (page !== 1) {
                    e.currentTarget.style.background = 'rgba(124,58,237,0.15)';
                    e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)';
                    e.currentTarget.style.color = '#a78bfa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (page !== 1) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.color = '#d1d5db';
                  }
                }}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={() => setQuery((q) => ({ ...q, page: Math.min(totalPages, q.page + 1) }))}
                disabled={page === totalPages}
                className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                style={{
                  background: page === totalPages
                    ? 'rgba(255,255,255,0.03)'
                    : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                  border: '1px solid rgba(124,58,237,0.3)',
                  color: page === totalPages ? '#4b5563' : '#ffffff',
                  cursor: page === totalPages ? 'not-allowed' : 'pointer',
                  boxShadow: page === totalPages ? 'none' : '0 4px 15px rgba(124,58,237,0.3)',
                }}
                onMouseEnter={(e) => {
                  if (page !== totalPages)
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.5)';
                }}
                onMouseLeave={(e) => {
                  if (page !== totalPages)
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(124,58,237,0.3)';
                }}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;