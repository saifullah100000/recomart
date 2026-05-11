import React from 'react';
import { ShoppingBag, CreditCard, Banknote } from 'lucide-react';

const paymentStatusConfig = {
  paid:     { label: 'Paid',     color: 'rgba(34,197,94,0.15)',  border: 'rgba(34,197,94,0.3)',  text: '#4ade80' },
  pending:  { label: 'Pending',  color: 'rgba(234,179,8,0.12)',  border: 'rgba(234,179,8,0.28)', text: '#facc15' },
  failed:   { label: 'Failed',   color: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.28)', text: '#f87171' },
  refunded: { label: 'Refunded', color: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)',text: '#94a3b8' },
};

const orderStatusConfig = {
  pending:   { label: 'Pending',   color: 'rgba(234,179,8,0.12)',   border: 'rgba(234,179,8,0.28)',   text: '#facc15' },
  confirmed: { label: 'Confirmed', color: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.28)',  text: '#60a5fa' },
  packed:    { label: 'Packed',    color: 'rgba(99,102,241,0.12)',  border: 'rgba(99,102,241,0.28)',  text: '#818cf8' },
  shipped:   { label: 'Shipped',   color: 'rgba(139,92,246,0.15)',  border: 'rgba(139,92,246,0.3)',   text: '#a78bfa' },
  delivered: { label: 'Delivered', color: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.28)',   text: '#4ade80' },
  cancelled: { label: 'Cancelled', color: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.28)',   text: '#f87171' },
};

const Badge = ({ config }) => (
  <span style={{
    display: 'inline-flex',
    alignItems: 'center',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.03em',
    background: config.color,
    border: `1px solid ${config.border}`,
    color: config.text,
    whiteSpace: 'nowrap',
  }}>
    {config.label}
  </span>
);

const OrdersTable = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&display=swap');`}</style>
        <div style={{
          fontFamily: "'Outfit', sans-serif",
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '64px 24px', gap: '12px',
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(139,92,246,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(124,58,237,0.5)', marginBottom: 6,
          }}>
            <ShoppingBag size={24} />
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'rgba(167,139,250,0.5)', margin: 0 }}>No orders found</p>
          <p style={{ fontSize: 12, color: 'rgba(167,139,250,0.3)', margin: 0 }}>Orders will appear here once placed.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .orders-table-wrap {
          font-family: 'Outfit', sans-serif;
          overflow-x: auto;
        }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .orders-table thead tr {
          border-bottom: 1px solid rgba(139,92,246,0.12);
        }

        .orders-table th {
          padding: 12px 16px;
          font-size: 10px;
          font-weight: 600;
          color: rgba(167,139,250,0.45);
          letter-spacing: 0.09em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .orders-table tbody tr {
          border-bottom: 1px solid rgba(139,92,246,0.06);
          transition: background 0.15s ease;
        }

        .orders-table tbody tr:last-child {
          border-bottom: none;
        }

        .orders-table tbody tr:hover {
          background: rgba(124,58,237,0.05);
        }

        .orders-table td {
          padding: 13px 16px;
          vertical-align: middle;
        }

        .order-id {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 500;
          color: #7c3aed;
          background: rgba(124,58,237,0.1);
          border: 1px solid rgba(124,58,237,0.2);
          border-radius: 6px;
          padding: 3px 8px;
          display: inline-block;
          letter-spacing: 0.02em;
        }

        .customer-name {
          font-size: 13px;
          font-weight: 500;
          color: #ddd6fe;
        }

        .items-count {
          font-size: 13px;
          color: rgba(167,139,250,0.5);
        }

        .total-amount {
          font-size: 13px;
          font-weight: 600;
          color: #e2e0f0;
        }

        .method-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 8px;
        }

        .method-stripe {
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.25);
          color: #818cf8;
        }

        .method-cod {
          background: rgba(148,163,184,0.08);
          border: 1px solid rgba(148,163,184,0.15);
          color: rgba(148,163,184,0.7);
        }

        .date-cell {
          font-size: 12px;
          color: rgba(167,139,250,0.35);
        }

        @media (max-width: 640px) {
          .hide-sm { display: none; }
        }
        @media (max-width: 768px) {
          .hide-md { display: none; }
        }
        @media (max-width: 1024px) {
          .hide-lg { display: none; }
        }
      `}</style>

      <div className="orders-table-wrap">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th className="hide-sm">Items</th>
              <th>Total</th>
              <th>Method</th>
              <th>Payment</th>
              <th className="hide-md">Status</th>
              <th className="hide-lg">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const orderId = order._id || order.id || '';
              const shortId = orderId.slice(-8);
              const customerName = order.customer?.name || order.user?.name || order.customerName || 'N/A';
              const itemsCount = order.items?.length || order.itemsCount || 0;

              const paymentStatus = (typeof order.paymentStatus === 'string'
                ? order.paymentStatus.toLowerCase() : 'pending');

              const orderStatus = (order.status || 'pending').toLowerCase();
              const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-';

              const rawMethod = (order.paymentMethod || order.payment_method || order.payment?.method || 'cod').toLowerCase();
              const isStripe = rawMethod === 'stripe';

              const pConfig = paymentStatusConfig[paymentStatus] || paymentStatusConfig.pending;
              const oConfig = orderStatusConfig[orderStatus] || orderStatusConfig.pending;

              return (
                <tr key={orderId}>
                  <td><span className="order-id">#{shortId}</span></td>
                  <td><span className="customer-name">{customerName}</span></td>
                  <td className="hide-sm"><span className="items-count">{itemsCount}</span></td>
                  <td><span className="total-amount">${Number(order.totalAmount || order.total || 0).toFixed(2)}</span></td>
                  <td>
                    <span className={`method-pill ${isStripe ? 'method-stripe' : 'method-cod'}`}>
                      {isStripe ? <CreditCard size={11} /> : <Banknote size={11} />}
                      {isStripe ? 'Stripe' : 'COD'}
                    </span>
                  </td>
                  <td><Badge config={pConfig} /></td>
                  <td className="hide-md"><Badge config={oConfig} /></td>
                  <td className="hide-lg"><span className="date-cell">{date}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default OrdersTable;