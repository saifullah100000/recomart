import React, { useState, useEffect } from 'react';
import { Calendar, BarChart2, Sparkles, TrendingUp, LayoutGrid } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import api from '../../api/axios';
import SellerSidebar from '../../components/seller/SellerSidebar';
import SalesChart from '../../components/seller/SalesChart';

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const SA_STYLE_ID = 'sa-styles';
if (typeof document !== 'undefined' && !document.getElementById(SA_STYLE_ID)) {
  const tag = document.createElement('style');
  tag.id = SA_STYLE_ID;
  tag.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

    .sa-root {
      min-height: 100vh;
      background: #080b1a;
      font-family: 'DM Sans', sans-serif;
      color: #e2e8f0;
      position: relative;
      overflow-x: hidden;
    }

    /* Orbs */
    .sa-orb {
      position: fixed; border-radius: 50%;
      pointer-events: none; filter: blur(110px); z-index: 0;
    }
    .sa-orb-1 {
      width: 550px; height: 550px;
      background: radial-gradient(circle, rgba(109,40,217,0.16) 0%, transparent 65%);
      top: -150px; left: -150px;
    }
    .sa-orb-2 {
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 65%);
      bottom: -80px; right: -80px;
    }

    /* Grid */
    .sa-grid-bg {
      position: fixed; inset: 0; z-index: 0; pointer-events: none;
      background-image:
        linear-gradient(rgba(139,92,246,0.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(139,92,246,0.035) 1px, transparent 1px);
      background-size: 48px 48px;
    }

    /* Main */
    .sa-main {
      position: relative; z-index: 1;
      margin-left: 256px;
      padding: 3rem 2rem 6rem;
      min-height: 100vh;
    }

    /* ── Top bar ── */
    .sa-topbar {
      display: flex; align-items: flex-end;
      justify-content: space-between;
      flex-wrap: wrap; gap: 1.25rem;
      margin-bottom: 2.5rem;
    }
    .sa-badge {
      display: inline-flex; align-items: center; gap: 0.4rem;
      padding: 0.3rem 0.9rem;
      background: rgba(139,92,246,0.12);
      border: 1px solid rgba(139,92,246,0.28);
      border-radius: 999px;
      font-size: 0.7rem; color: #a78bfa;
      letter-spacing: 0.09em; text-transform: uppercase; font-weight: 500;
      margin-bottom: 0.75rem;
    }
    .sa-title {
      font-family: 'Syne', sans-serif;
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 800; color: #f1f5f9;
      line-height: 1.15; margin: 0 0 0.35rem;
    }
    .sa-title span {
      background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .sa-subtitle {
      font-size: 0.85rem; color: #475569;
      font-weight: 300; line-height: 1.6;
    }

    /* Date range selector */
    .sa-range-wrap {
      display: flex; align-items: center; gap: 0.6rem;
      padding: 0.5rem 0.9rem;
      background: rgba(12,15,30,0.85);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(139,92,246,0.2);
      border-radius: 12px;
      flex-shrink: 0;
    }
    .sa-range-wrap svg { color: #7c3aed; flex-shrink: 0; }
    .sa-range-select {
      background: transparent !important;
      border: none !important;
      outline: none !important;
      color: #cbd5e1 !important;
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.82rem !important;
      cursor: pointer;
    }
    .sa-range-select option {
      background: #0f1220 !important;
      color: #e2e8f0 !important;
    }

    /* ── Loading ── */
    .sa-loading-wrap {
      display: flex; align-items: center; justify-content: center;
      height: 60vh;
    }
    .sa-spinner {
      width: 44px; height: 44px;
      border: 3px solid rgba(139,92,246,0.15);
      border-top-color: #7c3aed;
      border-radius: 50%;
      animation: sa-spin 0.8s linear infinite;
    }
    @keyframes sa-spin { to { transform: rotate(360deg); } }

    /* ── Glass card ── */
    .sa-card {
      position: relative;
      background: rgba(12,15,30,0.85);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(139,92,246,0.2);
      border-radius: 20px;
      padding: 1.75rem;
      box-shadow: 0 20px 64px rgba(0,0,0,0.45);
      animation: sa-fade-up 0.4s ease both;
    }
    .sa-card::before {
      content: '';
      position: absolute;
      top: 0; left: 15%; right: 15%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(139,92,246,0.55), transparent);
    }

    .sa-card-header {
      display: flex; align-items: center; gap: 0.65rem;
      margin-bottom: 1.5rem;
    }
    .sa-card-icon {
      width: 34px; height: 34px;
      border-radius: 10px;
      background: rgba(139,92,246,0.1);
      border: 1px solid rgba(139,92,246,0.2);
      display: flex; align-items: center; justify-content: center;
      color: #7c3aed; flex-shrink: 0;
    }
    .sa-card-title {
      font-family: 'Syne', sans-serif;
      font-size: 0.95rem; font-weight: 700; color: #f1f5f9;
    }
    .sa-card-line {
      flex: 1; height: 1px;
      background: linear-gradient(90deg, rgba(139,92,246,0.2), transparent);
    }

    /* Revenue chart card */
    .sa-chart-card {
      margin-bottom: 1.5rem;
      animation-delay: 0.05s;
    }

    /* Grid of 2 */
    .sa-grid-2 {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    @media (min-width: 1024px) {
      .sa-grid-2 { grid-template-columns: 1fr 1fr; }
    }

    /* ── Top Products table ── */
    .sa-table { width: 100%; border-collapse: collapse; }
    .sa-table thead tr {
      border-bottom: 1px solid rgba(139,92,246,0.12);
    }
    .sa-table th {
      padding: 0.6rem 0.75rem;
      font-size: 0.68rem; font-weight: 600;
      color: #475569; text-transform: uppercase;
      letter-spacing: 0.08em; text-align: left;
    }
    .sa-table tbody tr {
      border-bottom: 1px solid rgba(255,255,255,0.03);
      transition: background 0.15s;
    }
    .sa-table tbody tr:hover { background: rgba(139,92,246,0.05); }
    .sa-table td {
      padding: 0.75rem;
      font-size: 0.83rem; color: #cbd5e1;
    }
    .sa-rank {
      display: inline-flex; align-items: center; justify-content: center;
      width: 22px; height: 22px;
      border-radius: 6px;
      background: rgba(139,92,246,0.12);
      border: 1px solid rgba(139,92,246,0.2);
      font-size: 0.65rem; font-weight: 700; color: #a78bfa;
      margin-right: 0.6rem; flex-shrink: 0;
    }
    .sa-product-name {
      display: flex; align-items: center;
    }

    /* Empty state */
    .sa-empty {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 0.5rem;
      padding: 3rem 1rem; text-align: center;
    }
    .sa-empty-text { font-size: 0.83rem; color: #334155; font-weight: 300; }

    /* ── Pie chart overrides ── */
    .recharts-legend-item-text { color: #94a3b8 !important; font-size: 0.78rem !important; }
    .recharts-default-legend { padding-top: 0.5rem !important; }

    @keyframes sa-fade-up {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Scrollbar */
    .sa-root ::-webkit-scrollbar { width: 6px; }
    .sa-root ::-webkit-scrollbar-track { background: transparent; }
    .sa-root ::-webkit-scrollbar-thumb {
      background: rgba(139,92,246,0.2); border-radius: 3px;
    }
    .sa-root ::-webkit-scrollbar-thumb:hover { background: rgba(139,92,246,0.4); }
  `;
  document.head.appendChild(tag);
}

/* ─── Custom Pie Tooltip ─────────────────────────────────────────────────── */
const PIE_COLORS = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#14b8a6', '#f97316', '#ef4444'];

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(12,15,30,0.95)',
        border: '1px solid rgba(139,92,246,0.3)',
        borderRadius: '10px',
        padding: '0.65rem 1rem',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
        <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#c4b5fd', marginBottom: '0.2rem' }}>
          {payload[0].name}
        </p>
        <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
          Revenue: Rs {Number(payload[0].value).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

/* ─── Component ──────────────────────────────────────────────────────────── */
const SellerAnalyticsPage = () => {
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryRevenue, setCategoryRevenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('12');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/seller/analytics', {
          params: { months: dateRange },
        });
        const d = data.data || data;

        setSalesData(d.monthlySales || d.salesData || []);
        setTopProducts(d.topProducts || []);
        setCategoryRevenue(
          (d.revenueByCategory || d.categoryRevenue || []).map((item) => ({
            name: item.category || item.name || item._id,
            value: item.revenue || item.total || item.value || 0,
          }))
        );
      } catch (err) {
        toast.error('Failed to load analytics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [dateRange]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="sa-root">
        <div className="sa-orb sa-orb-1" />
        <div className="sa-orb sa-orb-2" />
        <div className="sa-grid-bg" />
        <SellerSidebar />
        <main className="sa-main">
          <div className="sa-loading-wrap">
            <div className="sa-spinner" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="sa-root">
      <div className="sa-orb sa-orb-1" />
      <div className="sa-orb sa-orb-2" />
      <div className="sa-grid-bg" />

      <SellerSidebar />

      <main className="sa-main">

        {/* ── Top bar ── */}
        <div className="sa-topbar">
          <div>
            <div className="sa-badge"><Sparkles size={10} /> Seller Dashboard</div>
            <h1 className="sa-title">Sales <span>Analytics</span></h1>
            <p className="sa-subtitle">Track your revenue, top products, and category performance.</p>
          </div>

          <div className="sa-range-wrap">
            <Calendar size={15} />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="sa-range-select"
            >
              <option value="3">Last 3 months</option>
              <option value="6">Last 6 months</option>
              <option value="12">Last 12 months</option>
            </select>
          </div>
        </div>

        {/* ── Monthly Revenue Chart ── */}
        <div className="sa-card sa-chart-card">
          <div className="sa-card-header">
            <div className="sa-card-icon"><TrendingUp size={16} /></div>
            <span className="sa-card-title">Monthly Revenue</span>
            <div className="sa-card-line" />
          </div>
          <SalesChart data={salesData} />
        </div>

        {/* ── Bottom grid ── */}
        <div className="sa-grid-2">

          {/* Top Products */}
          <div className="sa-card" style={{ animationDelay: '0.1s' }}>
            <div className="sa-card-header">
              <div className="sa-card-icon"><BarChart2 size={16} /></div>
              <span className="sa-card-title">Top Products</span>
              <div className="sa-card-line" />
            </div>

            {topProducts.length === 0 ? (
              <div className="sa-empty">
                <p className="sa-empty-text">No product data available</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="sa-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product, index) => (
                      <tr key={index}>
                        <td>
                          <div className="sa-product-name">
                            <span className="sa-rank">{index + 1}</span>
                            {product.title || product.name || product.productName || 'N/A'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Revenue by Category */}
          <div className="sa-card" style={{ animationDelay: '0.15s' }}>
            <div className="sa-card-header">
              <div className="sa-card-icon"><LayoutGrid size={16} /></div>
              <span className="sa-card-title">Revenue by Category</span>
              <div className="sa-card-line" />
            </div>

            {categoryRevenue.length === 0 ? (
              <div className="sa-empty">
                <p className="sa-empty-text">No category data available</p>
              </div>
            ) : (
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryRevenue}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={105}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryRevenue.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => (
                        <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default SellerAnalyticsPage;