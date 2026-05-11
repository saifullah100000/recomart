import React from 'react';

const statusStyles = {
  pending:   { background: 'rgba(234,179,8,0.12)',   color: '#facc15', border: '1px solid rgba(234,179,8,0.25)' },
  confirmed: { background: 'rgba(59,130,246,0.12)',  color: '#60a5fa', border: '1px solid rgba(59,130,246,0.25)' },
  packed:    { background: 'rgba(99,102,241,0.12)',  color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)' },
  shipped:   { background: 'rgba(124,58,237,0.12)',  color: '#a78bfa', border: '1px solid rgba(124,58,237,0.25)' },
  delivered: { background: 'rgba(34,197,94,0.12)',   color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)' },
  cancelled: { background: 'rgba(239,68,68,0.12)',   color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' },
};

const OrdersTable = ({ orders, onStatusUpdate }) => {
  const handleStatusChange = (orderId, newStatus) => {
    if (onStatusUpdate) onStatusUpdate(orderId, newStatus);
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          style={{
            background: 'rgba(124,58,237,0.1)',
            border: '1px solid rgba(124,58,237,0.2)',
          }}
        >
          📦
        </div>
        <p className="text-lg font-semibold" style={{ color: '#6b7280' }}>
          No orders yet
        </p>
        <p className="text-sm" style={{ color: '#4b5563' }}>
          Orders will appear here once customers start purchasing.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr
            style={{
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            {[
              { label: 'Order ID',  cls: '' },
              { label: 'Customer',  cls: '' },
              { label: 'Items',     cls: 'hidden sm:table-cell' },
              { label: 'Total',     cls: '' },
              { label: 'Status',    cls: '' },
              { label: 'Date',      cls: 'hidden md:table-cell' },
              { label: 'Actions',   cls: '' },
            ].map(({ label, cls }) => (
              <th
                key={label}
                className={`px-5 py-4 text-xs font-semibold uppercase tracking-widest ${cls}`}
                style={{ color: '#6b7280' }}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => {
            const orderId     = order._id || order.id || '';
            const shortId     = orderId.slice(-8);
            const itemsCount  = order.items?.length || order.itemsCount || 0;
            const customerName =
              order.customer?.name || order.user?.name || order.customerName || 'N/A';
            const status = order.status || 'pending';
            const date   = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric',
                })
              : '-';
            const badgeStyle = statusStyles[status] || statusStyles.pending;

            return (
              <tr
                key={orderId}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(124,58,237,0.06)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Order ID */}
                <td className="px-5 py-4">
                  <span
                    className="text-xs font-mono px-2 py-1 rounded-lg"
                    style={{
                      background: 'rgba(124,58,237,0.1)',
                      color: '#a78bfa',
                      border: '1px solid rgba(124,58,237,0.2)',
                    }}
                  >
                    #{shortId}
                  </span>
                </td>

                {/* Customer */}
                <td className="px-5 py-4">
                  <span className="text-sm font-semibold" style={{ color: '#f0eeff' }}>
                    {customerName}
                  </span>
                </td>

                {/* Items */}
                <td className="px-5 py-4 hidden sm:table-cell">
                  <span className="text-sm" style={{ color: '#9ca3af' }}>
                    {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
                  </span>
                </td>

                {/* Total */}
                <td className="px-5 py-4">
                  <span className="text-sm font-bold" style={{ color: '#a78bfa' }}>
                   Rs. {Number(order.totalAmount || order.total || 0).toLocaleString('en-IN')}
                  </span>
                </td>

                {/* Status badge */}
                <td className="px-5 py-4">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                    style={badgeStyle}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </td>

                {/* Date */}
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className="text-sm" style={{ color: '#6b7280' }}>{date}</span>
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) handleStatusChange(orderId, e.target.value);
                    }}
                    className="text-sm px-3 py-1.5 rounded-lg outline-none transition-all duration-200"
                    style={{
                      background: 'rgba(124,58,237,0.1)',
                      border: '1px solid rgba(124,58,237,0.25)',
                      color: '#a78bfa',
                      cursor: 'pointer',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.border = '1px solid rgba(124,58,237,0.5)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = '1px solid rgba(124,58,237,0.25)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <option value="" style={{ background: '#1a1535' }}>Update</option>
                    <option value="confirmed" style={{ background: '#1a1535' }}>Confirmed</option>
                    <option value="packed"    style={{ background: '#1a1535' }}>Packed</option>
                    <option value="shipped"   style={{ background: '#1a1535' }}>Shipped</option>
                    <option value="delivered" style={{ background: '#1a1535' }}>Delivered</option>
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;