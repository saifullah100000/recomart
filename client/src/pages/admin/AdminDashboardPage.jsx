import React, { useState, useEffect } from 'react';
import {
  Users, Store, Package, ShoppingBag, DollarSign, Clock, AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StatsCards from '../../components/admin/StatsCards';
import RevenueChart from '../../components/admin/RevenueChart';
import formatDate from '../../utils/formatDate';

/* ── Status configs ─────────────────────────────────────── */
const orderStatusConfig = {
  pending:   { color: 'rgba(234,179,8,0.12)',  border: 'rgba(234,179,8,0.28)',  text: '#facc15', label: 'Pending'   },
  confirmed: { color: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.28)', text: '#60a5fa', label: 'Confirmed' },
  shipped:   { color: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.3)',  text: '#a78bfa', label: 'Shipped'   },
  delivered: { color: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.28)',  text: '#4ade80', label: 'Delivered' },
  cancelled: { color: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.28)', text: '#f87171', label: 'Cancelled' },
};

const roleConfig = {
  admin:  { color: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.28)',  text: '#f87171' },
  seller: { color: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.28)', text: '#60a5fa' },
  user:   { color: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)', text: '#94a3b8' },
};

const Badge = ({ config, label }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center',
    padding: '3px 10px', borderRadius: 20,
    fontSize: 11, fontWeight: 600, letterSpacing: '0.03em',
    background: config.color, border: `1px solid ${config.border}`, color: config.text,
    whiteSpace: 'nowrap',
  }}>
    {label}
  </span>
);

/* ── Mini Table Shell ───────────────────────────────────── */
const MiniCard = ({ title, icon: Icon, children, empty, emptyText }) => (
  <div style={{
    background: 'linear-gradient(135deg, #110f22 0%, #0e0c1e 100%)',
    border: '1px solid rgba(139,92,246,0.18)',
    borderRadius: 16, overflow: 'hidden',
  }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '16px 20px', borderBottom: '1px solid rgba(139,92,246,0.1)',
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(139,92,246,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed',
      }}>
        <Icon size={15} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#a78bfa', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {title}
      </span>
    </div>
    {empty ? (
      <p style={{ textAlign: 'center', padding: '32px 24px', fontSize: 13, color: 'rgba(167,139,250,0.35)', margin: 0 }}>
        {emptyText}
      </p>
    ) : (
      <div style={{ overflowX: 'auto' }}>{children}</div>
    )}
  </div>
);

/* ── Shared table styles injected once ──────────────────── */
const TABLE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  .dash-page {
    font-family: 'Outfit', sans-serif;
    display: flex;
    background: #09071a;
    min-height: 100vh;
  }

  .dash-main {
    margin-left: 256px;
    padding: 32px 28px;
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(160deg, #0d0b1e 0%, #080613 100%);
    position: relative;
  }

  /* Ambient glow */
  .dash-main::before {
    content: '';
    position: fixed;
    top: -100px; right: -100px;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .dash-content { position: relative; z-index: 1; }

  /* Page header */
  .dash-heading {
    font-size: 24px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.02em;
    margin: 0 0 6px;
  }
  .dash-heading span {
    background: linear-gradient(90deg, #a78bfa, #818cf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .dash-subheading {
    font-size: 13px;
    color: rgba(167,139,250,0.4);
    margin: 0 0 28px;
  }

  /* Chart card */
  .chart-card {
    background: linear-gradient(135deg, #110f22 0%, #0e0c1e 100%);
    border: 1px solid rgba(139,92,246,0.18);
    border-radius: 16px;
    padding: 24px;
    margin-top: 28px;
    position: relative;
    overflow: hidden;
  }
  .chart-card::before {
    content: '';
    position: absolute;
    bottom: -60px; left: -60px;
    width: 220px; height: 220px;
    background: radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%);
    pointer-events: none;
  }
  .chart-title {
    font-size: 13px;
    font-weight: 600;
    color: #a78bfa;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin: 0 0 20px;
    display: flex; align-items: center; gap: 8px;
  }
  .chart-title-icon {
    width: 28px; height: 28px;
    background: rgba(124,58,237,0.15);
    border: 1px solid rgba(139,92,246,0.2);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: #7c3aed;
  }

  .mini-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 28px;
  }
  @media (max-width: 1024px) { .mini-grid { grid-template-columns: 1fr; } }

  /* Mini tables */
  .mini-table { width: 100%; border-collapse: collapse; text-align: left; }
  .mini-table thead tr { border-bottom: 1px solid rgba(139,92,246,0.1); }
  .mini-table th {
    padding: 10px 16px;
    font-size: 10px; font-weight: 600;
    color: rgba(167,139,250,0.4);
    letter-spacing: 0.09em; text-transform: uppercase; white-space: nowrap;
  }
  .mini-table tbody tr {
    border-bottom: 1px solid rgba(139,92,246,0.05);
    transition: background 0.15s ease;
  }
  .mini-table tbody tr:last-child { border-bottom: none; }
  .mini-table tbody tr:hover { background: rgba(124,58,237,0.04); }
  .mini-table td { padding: 11px 16px; vertical-align: middle; }

  .mono-id {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; font-weight: 500;
    color: #7c3aed;
    background: rgba(124,58,237,0.1);
    border: 1px solid rgba(124,58,237,0.2);
    border-radius: 6px;
    padding: 2px 7px;
    display: inline-block;
  }
  .cell-primary { font-size: 13px; font-weight: 500; color: #ddd6fe; }
  .cell-muted   { font-size: 12px; color: rgba(167,139,250,0.4); }
  .cell-amount  { font-size: 13px; font-weight: 600; color: #e2e0f0; }

  /* Spinner */
  .spin-wrap {
    display: flex; align-items: center; justify-content: center;
    height: 100vh; width: 100%;
  }
  .spinner {
    width: 44px; height: 44px;
    border-radius: 50%;
    border: 3px solid rgba(124,58,237,0.15);
    border-top-color: #7c3aed;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

/* ── Page Component ─────────────────────────────────────── */
const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get('/admin/dashboard');
        const d = data.data || data;

        setStats([
          { label: 'Total Users',     value: d.totalUsers   || 0, icon: Users,       color: 'blue'   },
          { label: 'Total Sellers',   value: d.totalSellers  || 0, icon: Store,       color: 'green'  },
          { label: 'Total Products',  value: d.totalProducts || 0, icon: Package,     color: 'purple' },
          { label: 'Total Orders',    value: d.totalOrders   || 0, icon: ShoppingBag, color: 'orange' },
          { label: 'Total Revenue',   value: `Rs ${Number(d.totalRevenue || d.revenue || 0).toLocaleString()}`, icon: DollarSign, color: 'indigo' },
          { label: 'Pending Sellers', value: d.pendingSellers  || 0, icon: Clock,        color: 'yellow' },
          { label: 'Pending Products',value: d.pendingProducts || 0, icon: AlertCircle,  color: 'red'    },
        ]);

        setRevenueData(d.monthlyRevenue || d.revenueData || []);
        setRecentOrders(d.recentOrders || []);
        setRecentUsers(d.recentUsers || []);
      } catch (err) {
        toast.error('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dash-page">
        <style>{TABLE_STYLES}</style>
        <AdminSidebar />
        <main className="dash-main">
          <div className="spin-wrap"><div className="spinner" /></div>
        </main>
      </div>
    );
  }

  return (
    <div className="dash-page">
      <style>{TABLE_STYLES}</style>
      <AdminSidebar />

      <main className="dash-main">
        <div className="dash-content">

          {/* Header */}
          <h1 className="dash-heading">Admin <span>Dashboard</span></h1>
          <p className="dash-subheading">Welcome back — here's what's happening today.</p>

          {/* Stats */}
          {stats && <StatsCards stats={stats} />}

          {/* Revenue Chart */}
          <div className="chart-card">
            <div className="chart-title">
              <div className="chart-title-icon"><DollarSign size={14} /></div>
              Monthly Revenue
            </div>
            <RevenueChart data={revenueData} />
          </div>

          {/* Mini Tables */}
          <div className="mini-grid">

            {/* Recent Orders */}
            <MiniCard
              title="Recent Orders"
              icon={ShoppingBag}
              empty={recentOrders.length === 0}
              emptyText="No recent orders"
            >
              <table className="mini-table">
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
                  {recentOrders.slice(0, 5).map((order) => {
                    const orderId = order._id || order.id || '';
                    const status = (order.status || 'pending').toLowerCase();
                    const oCfg = orderStatusConfig[status] || orderStatusConfig.pending;
                    return (
                      <tr key={orderId}>
                        <td><span className="mono-id">#{orderId.slice(-8)}</span></td>
                        <td><span className="cell-primary">{order.customer?.name || order.user?.name || order.customerName || 'N/A'}</span></td>
                        <td><span className="cell-amount">Rs {Number(order.totalAmount || order.total || 0).toLocaleString()}</span></td>
                        <td><Badge config={oCfg} label={oCfg.label} /></td>
                        <td><span className="cell-muted">{order.createdAt ? formatDate(order.createdAt) : '—'}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </MiniCard>

            {/* Recent Users */}
            <MiniCard
              title="Recent Users"
              icon={Users}
              empty={recentUsers.length === 0}
              emptyText="No recent users"
            >
              <table className="mini-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.slice(0, 5).map((user) => {
                    const userId = user._id || user.id;
                    const role = (user.role || 'user').toLowerCase();
                    const rCfg = roleConfig[role] || roleConfig.user;
                    return (
                      <tr key={userId}>
                        <td><span className="cell-primary">{user.name}</span></td>
                        <td><span className="cell-muted">{user.email}</span></td>
                        <td><Badge config={rCfg} label={role.charAt(0).toUpperCase() + role.slice(1)} /></td>
                        <td><span className="cell-muted">{user.createdAt ? formatDate(user.createdAt) : '—'}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </MiniCard>

          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;