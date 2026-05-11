import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronRight, ClipboardList, Sparkles } from 'lucide-react';
import api from '../../api/axios';
import SellerSidebar from '../../components/seller/SellerSidebar';
import OrdersTable from '../../components/seller/OrdersTable';

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const SO_STYLE_ID = 'so-styles';
if (typeof document !== 'undefined' && !document.getElementById(SO_STYLE_ID)) {
  const tag = document.createElement('style');
  tag.id = SO_STYLE_ID;
  tag.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

    .so-root {
      min-height: 100vh;
      background: #080b1a;
      font-family: 'DM Sans', sans-serif;
      color: #e2e8f0;
      position: relative;
      overflow-x: hidden;
    }

    /* Orbs */
    .so-orb {
      position: fixed; border-radius: 50%;
      pointer-events: none; filter: blur(110px); z-index: 0;
    }
    .so-orb-1 {
      width: 550px; height: 550px;
      background: radial-gradient(circle, rgba(109,40,217,0.16) 0%, transparent 65%);
      top: -150px; left: -150px;
    }
    .so-orb-2 {
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 65%);
      bottom: -80px; right: -80px;
    }

    /* Grid */
    .so-grid-bg {
      position: fixed; inset: 0; z-index: 0; pointer-events: none;
      background-image:
        linear-gradient(rgba(139,92,246,0.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(139,92,246,0.035) 1px, transparent 1px);
      background-size: 48px 48px;
    }

    /* Main */
    .so-main {
      position: relative; z-index: 1;
      margin-left: 256px;
      padding: 3rem 2rem 6rem;
      min-height: 100vh;
    }

    /* ── Header ── */
    .so-header { margin-bottom: 2rem; }
    .so-badge {
      display: inline-flex; align-items: center; gap: 0.4rem;
      padding: 0.3rem 0.9rem;
      background: rgba(139,92,246,0.12);
      border: 1px solid rgba(139,92,246,0.28);
      border-radius: 999px;
      font-size: 0.7rem; color: #a78bfa;
      letter-spacing: 0.09em; text-transform: uppercase; font-weight: 500;
      margin-bottom: 0.75rem;
    }
    .so-title {
      font-family: 'Syne', sans-serif;
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 800; color: #f1f5f9;
      line-height: 1.15; margin: 0 0 0.35rem;
    }
    .so-title span {
      background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .so-subtitle {
      font-size: 0.85rem; color: #475569;
      font-weight: 300; line-height: 1.6;
    }

    /* ── Status tabs ── */
    .so-tabs {
      display: flex; flex-wrap: wrap;
      gap: 0.5rem; margin-bottom: 1.5rem;
    }
    .so-tab {
      padding: 0.4rem 1rem;
      border-radius: 10px;
      font-size: 0.78rem; font-weight: 500;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s, color 0.2s;
      border: 1px solid rgba(139,92,246,0.15);
      background: rgba(12,15,30,0.6);
      color: #475569;
    }
    .so-tab:hover {
      background: rgba(139,92,246,0.08);
      border-color: rgba(139,92,246,0.3);
      color: #94a3b8;
    }
    .so-tab.active {
      background: linear-gradient(135deg, rgba(124,58,237,0.25), rgba(79,70,229,0.25));
      border-color: rgba(139,92,246,0.5);
      color: #c4b5fd;
    }

    /* ── Glass card ── */
    .so-card {
      position: relative;
      background: rgba(12,15,30,0.85);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(139,92,246,0.2);
      border-radius: 20px;
      box-shadow: 0 20px 64px rgba(0,0,0,0.45);
      overflow: hidden;
      animation: so-fade-up 0.4s ease both;
    }
    .so-card::before {
      content: '';
      position: absolute;
      top: 0; left: 15%; right: 15%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(139,92,246,0.55), transparent);
      z-index: 1;
    }

    /* Card header */
    .so-card-header {
      display: flex; align-items: center; gap: 0.65rem;
      padding: 1.25rem 1.75rem;
      border-bottom: 1px solid rgba(139,92,246,0.1);
    }
    .so-card-icon {
      width: 34px; height: 34px;
      border-radius: 10px;
      background: rgba(139,92,246,0.1);
      border: 1px solid rgba(139,92,246,0.2);
      display: flex; align-items: center; justify-content: center;
      color: #7c3aed; flex-shrink: 0;
    }
    .so-card-title {
      font-family: 'Syne', sans-serif;
      font-size: 0.95rem; font-weight: 700; color: #f1f5f9;
    }
    .so-card-line {
      flex: 1; height: 1px;
      background: linear-gradient(90deg, rgba(139,92,246,0.2), transparent);
    }

    /* ── Loading ── */
    .so-loading-wrap {
      display: flex; align-items: center; justify-content: center;
      height: 16rem;
    }
    .so-spinner {
      width: 40px; height: 40px;
      border: 3px solid rgba(139,92,246,0.15);
      border-top-color: #7c3aed;
      border-radius: 50%;
      animation: so-spin 0.8s linear infinite;
    }
    @keyframes so-spin { to { transform: rotate(360deg); } }

    /* ── Pagination ── */
    .so-pagination {
      display: flex; align-items: center;
      justify-content: center; gap: 0.4rem;
      margin-top: 1.75rem;
    }
    .so-page-btn {
      display: flex; align-items: center; justify-content: center;
      min-width: 36px; height: 36px;
      padding: 0 0.65rem;
      border-radius: 10px;
      font-size: 0.8rem; font-weight: 500;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s, color 0.2s;
      border: 1px solid rgba(139,92,246,0.15);
      background: rgba(12,15,30,0.6);
      color: #475569;
    }
    .so-page-btn:hover:not(:disabled) {
      background: rgba(139,92,246,0.08);
      border-color: rgba(139,92,246,0.3);
      color: #94a3b8;
    }
    .so-page-btn.active {
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      border-color: transparent;
      color: #fff;
      box-shadow: 0 2px 12px rgba(124,58,237,0.4);
    }
    .so-page-btn:disabled {
      opacity: 0.35; cursor: not-allowed;
    }

    /* Override OrdersTable internals for dark theme */
    .so-card table { width: 100%; border-collapse: collapse; }
    .so-card thead tr { border-bottom: 1px solid rgba(139,92,246,0.12); }
    .so-card th {
      padding: 0.65rem 1rem;
      font-size: 0.68rem; font-weight: 600;
      color: #475569; text-transform: uppercase;
      letter-spacing: 0.08em; text-align: left;
      background: transparent;
    }
    .so-card tbody tr {
      border-bottom: 1px solid rgba(255,255,255,0.03);
      transition: background 0.15s;
    }
    .so-card tbody tr:hover { background: rgba(139,92,246,0.05); }
    .so-card td {
      padding: 0.75rem 1rem;
      font-size: 0.83rem; color: #cbd5e1;
      background: transparent;
    }
    .so-card select {
      background: rgba(255,255,255,0.04) !important;
      border: 1px solid rgba(139,92,246,0.2) !important;
      border-radius: 8px !important;
      color: #e2e8f0 !important;
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.78rem !important;
      padding: 0.3rem 0.6rem !important;
    }
    .so-card select option {
      background: #0f1220 !important;
      color: #e2e8f0 !important;
    }

    @keyframes so-fade-up {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Scrollbar */
    .so-root ::-webkit-scrollbar { width: 6px; }
    .so-root ::-webkit-scrollbar-track { background: transparent; }
    .so-root ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.2); border-radius: 3px; }
    .so-root ::-webkit-scrollbar-thumb:hover { background: rgba(139,92,246,0.4); }
  `;
  document.head.appendChild(tag);
}

/* ─── Constants ──────────────────────────────────────────────────────────── */
const statusTabs = [
  { label: 'All',       value: '' },
  { label: 'Pending',   value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Packed',    value: 'packed' },
  { label: 'Shipped',   value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

/* ─── Component ──────────────────────────────────────────────────────────── */
const SellerOrdersPage = () => {
  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages]   = useState(1);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit: 10 };
      if (activeTab) params.status = activeTab;

      const { data } = await api.get('/orders/seller/orders', { params });
      const result = data.data || data;

      setOrders(result.orders || []);
      setTotalPages(result.pagination?.totalPages || 1);
      setCurrentPage(result.pagination?.page || 1);
    } catch (err) {
      toast.error('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/seller/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
      console.error(err);
    }
  };

  return (
    <div className="so-root">
      <div className="so-orb so-orb-1" />
      <div className="so-orb so-orb-2" />
      <div className="so-grid-bg" />

      <SellerSidebar />

      <main className="so-main">

        {/* ── Header ── */}
        <div className="so-header">
          <div className="so-badge"><Sparkles size={10} /> Seller Dashboard</div>
          <h1 className="so-title">Manage <span>Orders</span></h1>
          <p className="so-subtitle">View, filter, and update the status of your customer orders.</p>
        </div>

        {/* ── Status Tabs ── */}
        <div className="so-tabs">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              className={`so-tab ${activeTab === tab.value ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab.value); setCurrentPage(1); }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Orders Card ── */}
        <div className="so-card">
          <div className="so-card-header">
            <div className="so-card-icon"><ClipboardList size={16} /></div>
            <span className="so-card-title">
              {activeTab
                ? statusTabs.find((t) => t.value === activeTab)?.label + ' Orders'
                : 'All Orders'}
            </span>
            <div className="so-card-line" />
          </div>

          {loading ? (
            <div className="so-loading-wrap">
              <div className="so-spinner" />
            </div>
          ) : (
            <OrdersTable orders={orders} onStatusUpdate={handleStatusUpdate} />
          )}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="so-pagination">
            <button
              className="so-page-btn"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`so-page-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="so-page-btn"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

      </main>
    </div>
  );
};

export default SellerOrdersPage;