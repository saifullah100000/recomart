import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import formatDate from '../../utils/formatDate';

const statusFilters = [
  { label: 'All',       value: ''          },
  { label: 'Pending',   value: 'pending'   },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Shipped',   value: 'shipped'   },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

const orderStatusConfig = {
  pending:   { color: 'rgba(234,179,8,0.12)',  border: 'rgba(234,179,8,0.28)',  text: '#facc15' },
  confirmed: { color: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.28)', text: '#60a5fa' },
  packed:    { color: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.28)', text: '#818cf8' },
  shipped:   { color: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.3)',  text: '#a78bfa' },
  delivered: { color: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.28)',  text: '#4ade80' },
  cancelled: { color: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.28)', text: '#f87171' },
};

const paymentStatusConfig = {
  paid:     { color: 'rgba(34,197,94,0.15)',  border: 'rgba(34,197,94,0.3)',  text: '#4ade80' },
  pending:  { color: 'rgba(234,179,8,0.12)',  border: 'rgba(234,179,8,0.28)', text: '#facc15' },
  failed:   { color: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.28)', text: '#f87171' },
  refunded: { color: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)',text: '#94a3b8' },
};

const Badge = ({ cfg, label }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center',
    padding: '3px 10px', borderRadius: 20,
    fontSize: 11, fontWeight: 600, letterSpacing: '0.03em',
    background: cfg.color, border: `1px solid ${cfg.border}`, color: cfg.text,
    whiteSpace: 'nowrap',
  }}>{label}</span>
);

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  .orders-page { font-family: 'Outfit', sans-serif; display: flex; background: #09071a; min-height: 100vh; }

  .orders-main {
    margin-left: 256px; padding: 32px 28px;
    width: 100%; min-height: 100vh;
    background: linear-gradient(160deg, #0d0b1e 0%, #080613 100%);
    position: relative;
  }
  .orders-main::before {
    content: '';
    position: fixed; top: -100px; right: -100px;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .orders-content { position: relative; z-index: 1; }

  .page-heading { font-size: 24px; font-weight: 700; color: #fff; letter-spacing: -0.02em; margin: 0 0 6px; }
  .page-heading span { background: linear-gradient(90deg,#a78bfa,#818cf8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .page-sub { font-size: 13px; color: rgba(167,139,250,0.4); margin: 0 0 24px; }

  /* Filter pills */
  .filter-bar { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }

  .filter-pill {
    padding: 7px 16px; border-radius: 10px;
    font-size: 12px; font-weight: 600; letter-spacing: 0.02em;
    cursor: pointer; border: none; transition: all 0.18s ease;
    font-family: 'Outfit', sans-serif;
  }
  .filter-pill.inactive {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(139,92,246,0.15);
    color: rgba(167,139,250,0.5);
  }
  .filter-pill.inactive:hover {
    background: rgba(124,58,237,0.08);
    border-color: rgba(139,92,246,0.3);
    color: #a78bfa;
  }
  .filter-pill.active {
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    border: 1px solid rgba(124,58,237,0.4);
    color: #fff;
    box-shadow: 0 4px 14px rgba(124,58,237,0.3);
  }

  /* Table card */
  .table-card {
    background: linear-gradient(135deg, #110f22 0%, #0e0c1e 100%);
    border: 1px solid rgba(139,92,246,0.18);
    border-radius: 16px; overflow: hidden;
  }

  /* Table */
  .orders-tbl { width: 100%; border-collapse: collapse; text-align: left; }
  .orders-tbl thead tr { border-bottom: 1px solid rgba(139,92,246,0.12); }
  .orders-tbl th { padding: 12px 16px; font-size: 10px; font-weight: 600; color: rgba(167,139,250,0.45); letter-spacing: 0.09em; text-transform: uppercase; white-space: nowrap; }
  .orders-tbl tbody tr { border-bottom: 1px solid rgba(139,92,246,0.06); transition: background 0.15s ease; cursor: pointer; }
  .orders-tbl tbody tr:last-child { border-bottom: none; }
  .orders-tbl tbody tr:hover { background: rgba(124,58,237,0.06); }
  .orders-tbl td { padding: 13px 16px; vertical-align: middle; }

  .mono-id {
    font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 500;
    color: #7c3aed; background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.2);
    border-radius: 6px; padding: 2px 7px; display: inline-block;
  }
  .cell-primary { font-size: 13px; font-weight: 500; color: #ddd6fe; }
  .cell-muted   { font-size: 12px; color: rgba(167,139,250,0.4); }
  .cell-amount  { font-size: 13px; font-weight: 600; color: #e2e0f0; }

  /* Empty / loading */
  .center-box { display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 64px 24px; gap: 10px; }
  .empty-icon { width:52px;height:52px;border-radius:14px;background:rgba(124,58,237,0.1);border:1px solid rgba(139,92,246,0.2);display:flex;align-items:center;justify-content:center;color:rgba(124,58,237,0.5);margin-bottom:6px; }
  .empty-title { font-size:15px;font-weight:600;color:rgba(167,139,250,0.5);margin:0; }
  .empty-sub   { font-size:12px;color:rgba(167,139,250,0.3);margin:0; }

  .spinner { width:40px;height:40px;border-radius:50%;border:3px solid rgba(124,58,237,0.15);border-top-color:#7c3aed;animation:spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Pagination */
  .pagination { display:flex; align-items:center; justify-content:space-between; margin-top:20px; }
  .page-info { font-size:13px; color:rgba(167,139,250,0.4); }
  .page-info strong { color:#a78bfa; font-weight:600; }
  .page-btns { display:flex; gap:8px; }

  .page-btn {
    display:inline-flex; align-items:center; gap:5px;
    padding: 8px 16px; border-radius:10px;
    font-size:13px; font-weight:500; font-family:'Outfit',sans-serif;
    background:rgba(255,255,255,0.03); border:1px solid rgba(139,92,246,0.2);
    color:rgba(167,139,250,0.6); cursor:pointer; transition:all 0.15s ease;
  }
  .page-btn:not(:disabled):hover { background:rgba(124,58,237,0.1); border-color:rgba(139,92,246,0.35); color:#a78bfa; }
  .page-btn:disabled { opacity:0.3; cursor:not-allowed; }

  /* Modal */
  .modal-backdrop {
    position:fixed; inset:0; z-index:50;
    display:flex; align-items:center; justify-content:center;
    background:rgba(0,0,0,0.7);
    backdrop-filter: blur(6px);
  }
  .modal-box {
    background: linear-gradient(135deg, #14112a 0%, #0f0d20 100%);
    border: 1px solid rgba(139,92,246,0.25);
    border-radius: 18px; box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.1);
    max-width: 480px; width: 100%; margin: 16px;
    max-height: 80vh; overflow-y: auto;
  }
  .modal-header {
    display:flex; align-items:center; justify-content:space-between;
    padding: 20px 24px; border-bottom: 1px solid rgba(139,92,246,0.12);
  }
  .modal-title { font-size:16px; font-weight:700; color:#ddd6fe; margin:0; display:flex; align-items:center; gap:8px; }
  .modal-close-btn {
    width:32px;height:32px;display:flex;align-items:center;justify-content:center;
    background:rgba(255,255,255,0.04);border:1px solid rgba(139,92,246,0.15);
    border-radius:8px;color:rgba(167,139,250,0.5);cursor:pointer;transition:all 0.15s ease;
  }
  .modal-close-btn:hover { background:rgba(239,68,68,0.1);border-color:rgba(239,68,68,0.25);color:#f87171; }
  .modal-body { padding: 20px 24px; display:flex; flex-direction:column; gap:14px; }

  .detail-row { display:flex; justify-content:space-between; align-items:flex-start; }
  .detail-label { font-size:11px;font-weight:600;color:rgba(167,139,250,0.4);text-transform:uppercase;letter-spacing:0.07em; }
  .detail-value { font-size:13px;font-weight:500;color:#ddd6fe;text-align:right; }
  .detail-divider { border:none;border-top:1px solid rgba(139,92,246,0.08);margin:4px 0; }

  @media (max-width: 640px) { .hide-sm { display:none; } }
  @media (max-width: 768px) { .hide-md { display:none; } }
  @media (max-width: 1024px) { .hide-lg { display:none; } }
`;

const ManageOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (activeFilter) params.status = activeFilter;
      const { data } = await api.get('/admin/orders', { params });
      const result = data.data || data;
      setOrders(result.orders || []);
      setTotalPages(result.pagination?.totalPages || 1);
      setPage(result.pagination?.page || 1);
    } catch (err) {
      toast.error('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, activeFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => { setPage(1); }, [activeFilter]);

  const selId = selectedOrder ? (selectedOrder._id || selectedOrder.id || '') : '';

  return (
    <div className="orders-page">
      <style>{PAGE_STYLES}</style>
      <AdminSidebar />

      <main className="orders-main">
        <div className="orders-content">

          <h1 className="page-heading">Manage <span>Orders</span></h1>
          <p className="page-sub">Review, filter and track all customer orders.</p>

          {/* Filters */}
          <div className="filter-bar">
            {statusFilters.map((f) => (
              <button
                key={f.value}
                className={`filter-pill ${activeFilter === f.value ? 'active' : 'inactive'}`}
                onClick={() => setActiveFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Table card */}
          <div className="table-card">
            {loading ? (
              <div className="center-box"><div className="spinner" /></div>
            ) : orders.length === 0 ? (
              <div className="center-box">
                <div className="empty-icon"><ShoppingBag size={24} /></div>
                <p className="empty-title">No orders found</p>
                <p className="empty-sub">Try changing the filter above.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="orders-tbl">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th className="hide-sm">Items</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th className="hide-md">Status</th>
                      <th className="hide-lg">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      const orderId = order._id || order.id || '';
                      const paymentStatus = (order.paymentStatus || 'pending').toLowerCase();
                      const orderStatus = (order.status || 'pending').toLowerCase();
                      const pCfg = paymentStatusConfig[paymentStatus] || paymentStatusConfig.pending;
                      const oCfg = orderStatusConfig[orderStatus] || orderStatusConfig.pending;

                      return (
                        <tr key={orderId} onClick={() => setSelectedOrder(order)}>
                          <td><span className="mono-id">#{orderId.slice(-8)}</span></td>
                          <td><span className="cell-primary">{order.customer?.name || order.user?.name || order.customerName || 'N/A'}</span></td>
                          <td className="hide-sm"><span className="cell-muted">{order.items?.length || order.itemsCount || 0}</span></td>
                          <td><span className="cell-amount">Rs {Number(order.totalAmount || order.total || 0).toLocaleString()}</span></td>
                          <td><Badge cfg={pCfg} label={paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)} /></td>
                          <td className="hide-md"><Badge cfg={oCfg} label={orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)} /></td>
                          <td className="hide-lg"><span className="cell-muted">{order.createdAt ? formatDate(order.createdAt) : '—'}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <p className="page-info">Page <strong>{page}</strong> of <strong>{totalPages}</strong></p>
              <div className="page-btns">
                <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft size={15} /> Previous
                </button>
                <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  Next <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                <span className="mono-id">#{selId.slice(-8)}</span>
                Order Details
              </h2>
              <button className="modal-close-btn" onClick={() => setSelectedOrder(null)}>
                <X size={16} />
              </button>
            </div>

            <div className="modal-body">
              {/* Customer */}
              <div className="detail-row">
                <span className="detail-label">Customer</span>
                <span className="detail-value">{selectedOrder.customer?.name || selectedOrder.user?.name || selectedOrder.customerName || 'N/A'}</span>
              </div>
              <hr className="detail-divider" />

              {/* Total */}
              <div className="detail-row">
                <span className="detail-label">Total Amount</span>
                <span className="detail-value" style={{ color: '#e2e0f0', fontWeight: 700 }}>
                  Rs {Number(selectedOrder.totalAmount || selectedOrder.total || 0).toLocaleString()}
                </span>
              </div>
              <hr className="detail-divider" />

              {/* Payment */}
              <div className="detail-row">
                <span className="detail-label">Payment Status</span>
                <span className="detail-value">
                  {(() => {
                    const ps = (selectedOrder.paymentStatus || 'pending').toLowerCase();
                    const cfg = paymentStatusConfig[ps] || paymentStatusConfig.pending;
                    return <Badge cfg={cfg} label={ps.charAt(0).toUpperCase() + ps.slice(1)} />;
                  })()}
                </span>
              </div>
              <hr className="detail-divider" />

              {/* Order Status */}
              <div className="detail-row">
                <span className="detail-label">Order Status</span>
                <span className="detail-value">
                  {(() => {
                    const os = (selectedOrder.status || 'pending').toLowerCase();
                    const cfg = orderStatusConfig[os] || orderStatusConfig.pending;
                    return <Badge cfg={cfg} label={os.charAt(0).toUpperCase() + os.slice(1)} />;
                  })()}
                </span>
              </div>
              <hr className="detail-divider" />

              {/* Method */}
              <div className="detail-row">
                <span className="detail-label">Payment Method</span>
                <span className="detail-value">
                  {(selectedOrder.paymentMethod || selectedOrder.payment_method || selectedOrder.payment?.method || 'COD').toUpperCase()}
                </span>
              </div>
              <hr className="detail-divider" />

              {/* Items */}
              <div className="detail-row">
                <span className="detail-label">Items</span>
                <span className="detail-value">{selectedOrder.items?.length || selectedOrder.itemsCount || 0}</span>
              </div>
              <hr className="detail-divider" />

              {/* Date */}
              <div className="detail-row">
                <span className="detail-label">Placed On</span>
                <span className="detail-value">{selectedOrder.createdAt ? formatDate(selectedOrder.createdAt) : '—'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrdersPage;