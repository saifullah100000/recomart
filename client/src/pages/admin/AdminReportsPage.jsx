import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  LineChart, Line, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import api from '../../api/axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import RevenueChart from '../../components/admin/RevenueChart';
import { TrendingUp, Users, ShoppingBag, Grid3X3, DollarSign } from 'lucide-react';

const PIE_COLORS = ['#facc15', '#60a5fa', '#a78bfa', '#4ade80', '#f87171', '#818cf8'];

const TOOLTIP_STYLE = {
  backgroundColor: '#1a1630',
  border: '1px solid rgba(139,92,246,0.25)',
  borderRadius: '10px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  color: '#ddd6fe',
  fontFamily: "'Outfit', sans-serif",
  fontSize: 12,
};

const AXIS_TICK  = { fontSize: 11, fill: 'rgba(167,139,250,0.45)', fontFamily: "'Outfit',sans-serif" };
const AXIS_LINE  = { stroke: 'rgba(139,92,246,0.1)' };
const GRID_STYLE = { stroke: 'rgba(139,92,246,0.08)', strokeDasharray: '4 4' };

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

  .reports-page { font-family: 'Outfit', sans-serif; display: flex; background: #09071a; min-height: 100vh; }

  .reports-main {
    margin-left: 256px; padding: 32px 28px;
    width: 100%; min-height: 100vh;
    background: linear-gradient(160deg, #0d0b1e 0%, #080613 100%);
    position: relative;
  }
  .reports-main::before {
    content: '';
    position: fixed; top: -100px; right: -100px;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .reports-content { position: relative; z-index: 1; }

  .page-heading { font-size: 24px; font-weight: 700; color: #fff; letter-spacing: -0.02em; margin: 0 0 6px; }
  .page-heading span { background: linear-gradient(90deg,#a78bfa,#818cf8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .page-sub { font-size: 13px; color: rgba(167,139,250,0.4); margin: 0 0 28px; }

  .charts-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  @media (max-width: 1024px) { .charts-grid { grid-template-columns: 1fr; } }

  .chart-card {
    background: linear-gradient(135deg, #110f22 0%, #0e0c1e 100%);
    border: 1px solid rgba(139,92,246,0.18);
    border-radius: 16px; padding: 24px;
    position: relative; overflow: hidden;
  }
  .chart-card::before {
    content: '';
    position: absolute; bottom: -50px; right: -50px;
    width: 160px; height: 160px;
    background: radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%);
    pointer-events: none;
  }

  .chart-header {
    display: flex; align-items: center; gap: 10px; margin-bottom: 20px;
  }
  .chart-icon {
    width: 30px; height: 30px; border-radius: 8px;
    background: rgba(124,58,237,0.15); border: 1px solid rgba(139,92,246,0.2);
    display: flex; align-items: center; justify-content: center; color: #7c3aed;
    flex-shrink: 0;
  }
  .chart-title {
    font-size: 13px; font-weight: 600; color: #a78bfa;
    letter-spacing: 0.05em; text-transform: uppercase; margin: 0;
  }

  .empty-chart {
    display: flex; align-items: center; justify-content: center;
    height: 260px; font-size: 13px; color: rgba(167,139,250,0.35);
  }

  .loading-box { display:flex; align-items:center; justify-content:center; height: 100vh; width: 100%; }
  .spinner { width:44px;height:44px;border-radius:50%;border:3px solid rgba(124,58,237,0.15);border-top-color:#7c3aed;animation:spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const ChartCard = ({ title, icon: Icon, children, empty, emptyText }) => (
  <div className="chart-card">
    <div className="chart-header">
      <div className="chart-icon"><Icon size={15} /></div>
      <p className="chart-title">{title}</p>
    </div>
    {empty
      ? <div className="empty-chart">{emptyText || 'No data available'}</div>
      : children
    }
  </div>
);

const AdminReportsPage = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await api.get('/admin/reports');
        const d = data.data || data;
        setRevenueData(d.monthlyRevenue || d.revenueByMonth || []);
        setUserGrowth(d.userGrowth || d.monthlyUsers || []);
        setOrdersByStatus(d.ordersByStatus || []);
        setTopCategories(d.topCategories || d.categoryRevenue || []);
      } catch (err) {
        toast.error('Failed to load reports');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="reports-page">
        <style>{PAGE_STYLES}</style>
        <AdminSidebar />
        <main className="reports-main">
          <div className="loading-box"><div className="spinner" /></div>
        </main>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <style>{PAGE_STYLES}</style>
      <AdminSidebar />

      <main className="reports-main">
        <div className="reports-content">

          <h1 className="page-heading">Reports & <span>Analytics</span></h1>
          <p className="page-sub">Platform-wide insights across revenue, users, orders and categories.</p>

          <div className="charts-grid">

            {/* Revenue by Month */}
            <ChartCard title="Revenue by Month" icon={DollarSign}>
              <RevenueChart data={revenueData} />
            </ChartCard>

            {/* User Growth */}
            <ChartCard
              title="User Growth"
              icon={Users}
              empty={userGrowth.length === 0}
              emptyText="No user growth data available"
            >
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowth} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid {...GRID_STYLE} />
                    <XAxis dataKey="month" tick={AXIS_TICK} axisLine={AXIS_LINE} tickLine={false} />
                    <YAxis tick={AXIS_TICK} axisLine={AXIS_LINE} tickLine={false} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: 'rgba(139,92,246,0.15)' }} />
                    <Legend wrapperStyle={{ fontSize: 12, color: 'rgba(167,139,250,0.6)', fontFamily: "'Outfit',sans-serif" }} iconType="circle" />
                    <Line
                      type="monotone" dataKey="users" name="New Users"
                      stroke="#7c3aed" strokeWidth={2}
                      dot={{ fill: '#7c3aed', r: 4, strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: '#a78bfa', strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            {/* Orders by Status */}
            <ChartCard
              title="Orders by Status"
              icon={ShoppingBag}
              empty={ordersByStatus.length === 0}
              emptyText="No order status data available"
            >
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ordersByStatus}
                      cx="50%" cy="50%"
                      innerRadius={65} outerRadius={105}
                      paddingAngle={4}
                      dataKey="count" nameKey="status"
                      label={({ status, count }) =>
                        `${status ? status.charAt(0).toUpperCase() + status.slice(1) : ''}: ${count}`
                      }
                      labelLine={{ stroke: 'rgba(167,139,250,0.25)' }}
                    >
                      {ordersByStatus.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={TOOLTIP_STYLE}
                      formatter={(value, name) => [value, name ? name.charAt(0).toUpperCase() + name.slice(1) : '']}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: 12, color: 'rgba(167,139,250,0.6)', fontFamily: "'Outfit',sans-serif" }}
                      iconType="circle"
                      formatter={(value) => value ? value.charAt(0).toUpperCase() + value.slice(1) : ''}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            {/* Top Categories by Revenue */}
            <ChartCard
              title="Top Categories by Revenue"
              icon={Grid3X3}
              empty={topCategories.length === 0}
              emptyText="No category revenue data available"
            >
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topCategories}
                    layout="vertical"
                    margin={{ top: 10, right: 20, left: 60, bottom: 0 }}
                  >
                    <CartesianGrid {...GRID_STYLE} horizontal={false} />
                    <XAxis
                      type="number"
                      tick={AXIS_TICK} axisLine={AXIS_LINE} tickLine={false}
                      tickFormatter={(v) => `Rs ${v.toLocaleString()}`}
                    />
                    <YAxis
                      type="category" dataKey="category" width={80}
                      tick={AXIS_TICK} axisLine={AXIS_LINE} tickLine={false}
                    />
                    <Tooltip
                      contentStyle={TOOLTIP_STYLE}
                      cursor={{ fill: 'rgba(124,58,237,0.06)' }}
                      formatter={(value) => [`Rs ${Number(value).toLocaleString()}`, 'Revenue']}
                    />
                    <Bar dataKey="revenue" name="Revenue" radius={[0, 6, 6, 0]} barSize={22}>
                      {topCategories.map((_, index) => (
                        <Cell key={`bar-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminReportsPage;