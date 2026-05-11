import React, { useState, useEffect } from 'react';
import { Package, ShoppingBag, DollarSign, Clock, LayoutDashboard, TrendingUp, ClipboardList, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import SellerSidebar from '../../components/seller/SellerSidebar';
import StatsCards from '../../components/admin/StatsCards';
import SalesChart from '../../components/seller/SalesChart';
import formatDate from '../../utils/formatDate';

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const SD_STYLE_ID = 'sd-styles';
if (typeof document !== 'undefined' && !document.getElementById(SD_STYLE_ID)) {
  const tag = document.createElement('style');
  tag.id = SD_STYLE_ID;
  tag.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

    .sd-root {
      min-height: 100vh;
      background: #080b1a;
      font-family: 'DM Sans', sans-serif;
      color: #e2e8f0;
      position: relative;
      overflow-x: hidden;
    }

    /* Orbs */
    .sd-orb {
      position: fixed; border-radius: 50%;
      pointer-events: none; filter: blur(110px); z-index: 0;
    }
    .sd-orb-1 {
      width: 550px; height: 550px;
      background: radial-gradient(circle, rgba(109,40,217,0.16) 0%, transparent 65%);
      top: -150px; left: -150px;
    }
    .sd-orb-2 {
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 65%);
      bottom: -80px; right: -80px;
    }

    /* Grid */
    .sd-grid-bg {
      position: fixed; inset: 0; z-index: 0; pointer-events: none;
      background-image:
        linear-gradient(rgba(139,92,246,0.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(139,92,246,0.035) 1px, transparent 1px);
      background-size: 48px 48px;
    }

    /* Main */
    .sd-main {
      position: relative; z-index: 1;
      margin-left: 256px;
      padding: 3rem 2rem 6rem;
      min-height: 100vh;
    }

    /* ── Header ── */
    .sd-header { margin-bottom: 2.5rem; }
    .sd-badge {
      display: inline-flex; align-items: center; gap: 0.4rem;
      padding: 0.3rem 0.9rem;
      background: rgba(139,92,246,0.12);
      border: 1px solid rgba(139,92,246,0.28);
      border-radius: 999px;
      font-size: 0.7rem; color: #a78bfa;
      letter-spacing: 0.09em; text-transform: uppercase; font-weight: 500;
      margin-bottom: 0.75rem;
    }
    .sd-title {
      font-family: 'Syne', sans-serif;
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 800; color: #f1f5f9;
      line-height: 1.15; margin: 0 0 0.35rem;
    }
    .sd-title span {
      background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .sd-subtitle {
      font-size: 0.85rem; color: #475569;
      font-weight: 300; line-height: 1.6;
    }

    /* ── Loading ── */
    .sd-loading-wrap {
      display: flex; align-items: center; justify-content: center;
      height: 60vh;
    }
    .sd-spinner {
      width: 44px; height: 44px;
      border: 3px solid rgba(139,92,246,0.15);
      border-top-color: #7c3aed;
      border-radius: 50%;
      animation: sd-spin 0.8s linear infinite;
    }
    @keyframes sd-spin { to { transform: rotate(360deg); } }

    /* ── Stat cards row ── */
    .sd-stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    @media (min-width: 1024px) {
      .sd-stats-grid { grid-template-columns: repeat(4, 1fr); }
    }

    .sd-stat-card {
      position: relative;
      background: rgba(12,15,30,0.85);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(139,92,246,0.18);
      border-radius: 16px;
      padding: 1.25rem 1.5rem;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      animation: sd-fade-up 0.4s ease both;
      overflow: hidden;
    }
    .sd-stat-card::before {
      content: '';
      position: absolute;
      top: 0; left: 10%; right: 10%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(139,92,246,0.45), transparent);
    }
    .sd-stat-top {
      display: flex; align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }
    .sd-stat-label {
      font-size: 0.72rem; font-weight: 500;
      color: #475569; text-transform: uppercase;
      letter-spacing: 0.07em;
    }
    .sd-stat-icon {
      width: 32px; height: 32px;
      border-radius: 9px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .sd-stat-icon.blue   { background: rgba(59,130,246,0.12);  border: 1px solid rgba(59,130,246,0.2);  color: #60a5fa; }
    .sd-stat-icon.green  { background: rgba(16,185,129,0.12);  border: 1px solid rgba(16,185,129,0.2);  color: #34d399; }
    .sd-stat-icon.purple { background: rgba(139,92,246,0.12);  border: 1px solid rgba(139,92,246,0.2);  color: #a78bfa; }
    .sd-stat-icon.orange { background: rgba(249,115,22,0.12);  border: 1px solid rgba(249,115,22,0.2);  color: #fb923c; }
    .sd-stat-value {
      font-family: 'Syne', sans-serif;
      font-size: 1.45rem; font-weight: 800;
      color: #f1f5f9; line-height: 1;
    }

    /* ── Glass card ── */
    .sd-card {
      position: relative;
      background: rgba(12,15,30,0.85);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(139,92,246,0.2);
      border-radius: 20px;
      padding: 1.75rem;
      box-shadow: 0 20px 64px rgba(0,0,0,0.45);
      margin-bottom: 1.5rem;
      animation: sd-fade-up 0.4s ease both;
    }
    .sd-card::before {
      content: '';
      position: absolute;
      top: 0; left: 15%; right: 15%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(139,92,246,0.55), transparent);
    }

    .sd-card-header {
      display: flex; align-items: center; gap: 0.65rem;
      margin-bottom: 1.5rem;
    }
    .sd-card-icon {
      width: 34px; height: 34px;
      border-radius: 10px;
      background: rgba(139,92,246,0.1);
      border: 1px solid rgba(139,92,246,0.2);
      display: flex; align-items: center; justify-content: center;
      color: #7c3aed; flex-shrink: 0;
    }
    .sd-card-title {
      font-family: 'Syne', sans-serif;
      font-size: 0.95rem; font-weight: 700; color: #f1f5f9;
    }
    .sd-card-line {
      flex: 1; height: 1px;
      background: linear-gradient(90deg, rgba(139,92,246,0.2), transparent);
    }

    /* ── Table ── */
    .sd-table { width: 100%; border-collapse: collapse; }
    .sd-table thead tr { border-bottom: 1px solid rgba(139,92,246,0.12); }
    .sd-table th {
      padding: 0.6rem 0.75rem;
      font-size: 0.68rem; font-weight: 600;
      color: #475569; text-transform: uppercase;
      letter-spacing: 0.08em; text-align: left;
    }
    .sd-table tbody tr {
      border-bottom: 1px solid rgba(255,255,255,0.03);
      transition: background 0.15s;
    }
    .sd-table tbody tr:hover { background: rgba(139,92,246,0.05); }
    .sd-table td { padding: 0.75rem; font-size: 0.83rem; color: #cbd5e1; }
    .sd-order-id {
      font-family: monospace; font-size: 0.78rem;
      color: #a78bfa; letter-spacing: 0.03em;
    }

    /* Status badges */
    .sd-status {
      display: inline-flex; align-items: center;
      padding: 0.2rem 0.65rem;
      border-radius: 999px;
      font-size: 0.68rem; font-weight: 600;
      text-transform: capitalize;
      letter-spacing: 0.03em;
    }
    .sd-status.pending   { background: rgba(245,158,11,0.12);  border: 1px solid rgba(245,158,11,0.25);  color: #fbbf24; }
    .sd-status.confirmed { background: rgba(59,130,246,0.12);  border: 1px solid rgba(59,130,246,0.25);  color: #60a5fa; }
    .sd-status.shipped   { background: rgba(139,92,246,0.12);  border: 1px solid rgba(139,92,246,0.25);  color: #a78bfa; }
    .sd-status.delivered { background: rgba(16,185,129,0.12);  border: 1px solid rgba(16,185,129,0.25);  color: #34d399; }
    .sd-status.cancelled { background: rgba(239,68,68,0.12);   border: 1px solid rgba(239,68,68,0.25);   color: #f87171; }

    /* Empty state */
    .sd-empty {
      display: flex; align-items: center; justify-content: center;
      padding: 3rem 1rem;
      font-size: 0.83rem; color: #334155; font-weight: 300;
    }

    @keyframes sd-fade-up {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Scrollbar */
    .sd-root ::-webkit-scrollbar { width: 6px; }
    .sd-root ::-webkit-scrollbar-track { background: transparent; }
    .sd-root ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.2); border-radius: 3px; }
    .sd-root ::-webkit-scrollbar-thumb:hover { background: rgba(139,92,246,0.4); }
  `;
  document.head.appendChild(tag);
}

/* ─── Icon map ───────────────────────────────────────────────────────────── */
const ICON_MAP = { Package, ShoppingBag, DollarSign, Clock };

/* ─── Component ──────────────────────────────────────────────────────────── */
const SellerDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get('/seller/dashboard');
        const d = data.data || data;

        const { data: analyticsRes } = await api.get('/seller/analytics');
        const analytics = analyticsRes.data || analyticsRes;

        setStats([
          { label: 'Total Products', value: d.totalProducts || 0,                                                       icon: Package,     color: 'blue'   },
          { label: 'Total Orders',   value: d.totalOrders || 0,                                                          icon: ShoppingBag, color: 'green'  },
          { label: 'Revenue',        value: `Rs ${Number(d.revenue || d.totalRevenue || 0).toLocaleString()}`,           icon: DollarSign,  color: 'purple' },
          { label: 'Pending Orders', value: d.pendingOrders || 0,                                                        icon: Clock,       color: 'orange' },
        ]);

        setSalesData(analytics.monthlySales || []);
        setRecentOrders(d.recentOrders || []);
      } catch (err) {
        toast.error('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="sd-root">
        <div className="sd-orb sd-orb-1" />
        <div className="sd-orb sd-orb-2" />
        <div className="sd-grid-bg" />
        <SellerSidebar />
        <main className="sd-main">
          <div className="sd-loading-wrap">
            <div className="sd-spinner" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="sd-root">
      <div className="sd-orb sd-orb-1" />
      <div className="sd-orb sd-orb-2" />
      <div className="sd-grid-bg" />

      <SellerSidebar />

      <main className="sd-main">

        {/* ── Header ── */}
        <div className="sd-header">
          <div className="sd-badge"><Sparkles size={10} /> Seller Dashboard</div>
          <h1 className="sd-title">My <span>Dashboard</span></h1>
          <p className="sd-subtitle">An overview of your store's performance and recent activity.</p>
        </div>

        {/* ── Stat Cards ── */}
        {stats && (
          <div className="sd-stats-grid">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div className="sd-stat-card" key={i} style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className="sd-stat-top">
                    <span className="sd-stat-label">{s.label}</span>
                    <div className={`sd-stat-icon ${s.color}`}>
                      <Icon size={15} />
                    </div>
                  </div>
                  <div className="sd-stat-value">{s.value}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Sales Chart ── */}
        <div className="sd-card" style={{ animationDelay: '0.3s' }}>
          <div className="sd-card-header">
            <div className="sd-card-icon"><TrendingUp size={16} /></div>
            <span className="sd-card-title">Monthly Sales</span>
            <div className="sd-card-line" />
          </div>
          <SalesChart data={salesData} />
        </div>

        {/* ── Recent Orders ── */}
        <div className="sd-card" style={{ animationDelay: '0.38s' }}>
          <div className="sd-card-header">
            <div className="sd-card-icon"><ClipboardList size={16} /></div>
            <span className="sd-card-title">Recent Orders</span>
            <div className="sd-card-line" />
          </div>

          {recentOrders.length === 0 ? (
            <div className="sd-empty">No recent orders</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="sd-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const orderId = order._id || order.id || '';
                    const status = order.status || 'pending';
                    return (
                      <tr key={orderId}>
                        <td><span className="sd-order-id">#{orderId.slice(-8)}</span></td>
                        <td>{order.customer?.name || order.user?.name || order.customerName || 'N/A'}</td>
                        <td>Rs {Number(order.totalAmount || order.total || 0).toLocaleString()}</td>
                        <td>
                          <span className={`sd-status ${status}`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </td>
                        <td style={{ color: '#475569' }}>
                          {order.createdAt ? formatDate(order.createdAt) : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default SellerDashboardPage;