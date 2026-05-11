import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const statusStyles = {
  approved: {
    background: 'rgba(34,197,94,0.12)',
    color: '#4ade80',
    border: '1px solid rgba(34,197,94,0.25)',
  },
  pending: {
    background: 'rgba(234,179,8,0.12)',
    color: '#facc15',
    border: '1px solid rgba(234,179,8,0.25)',
  },
  rejected: {
    background: 'rgba(239,68,68,0.12)',
    color: '#f87171',
    border: '1px solid rgba(239,68,68,0.25)',
  },
  suspended: {
    background: 'rgba(249,115,22,0.12)',
    color: '#fb923c',
    border: '1px solid rgba(249,115,22,0.25)',
  },
};

const SellersTable = ({ sellers, onApprove }) => {
  if (!sellers || sellers.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg" style={{ color: '#6b7280' }}>
          No sellers found
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
            {['Business Name', 'Owner', 'Status', 'Total Sales', 'Revenue', 'Actions'].map(
              (col, i) => (
                <th
                  key={col}
                  className={`px-5 py-4 text-xs font-semibold uppercase tracking-widest ${
                    i === 1 ? 'hidden sm:table-cell' : ''
                  } ${i === 3 || i === 4 ? 'hidden md:table-cell' : ''}`}
                  style={{ color: '#6b7280' }}
                >
                  {col}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody>
          {sellers.map((seller) => {
            const sellerId = seller._id || seller.id;
            const status = seller.status || 'pending';
            const isPending = status === 'pending';
            const badgeStyle = statusStyles[status] || statusStyles.pending;

            return (
              <tr
                key={sellerId}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(124,58,237,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {/* Business Name */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar initial */}
                    <div
                      className="flex items-center justify-center rounded-lg text-sm font-bold flex-shrink-0"
                      style={{
                        width: 36,
                        height: 36,
                        background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                        color: '#fff',
                        boxShadow: '0 2px 8px rgba(124,58,237,0.35)',
                      }}
                    >
                      {(seller.businessName || seller.shopName || '?')
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: '#f0eeff' }}
                    >
                      {seller.businessName || seller.shopName || '-'}
                    </span>
                  </div>
                </td>

                {/* Owner */}
                <td className="px-5 py-4 hidden sm:table-cell">
                  <span className="text-sm" style={{ color: '#9ca3af' }}>
                    {seller.owner?.name ||
                      seller.user?.name ||
                      seller.ownerName ||
                      '-'}
                  </span>
                </td>

                {/* Status Badge */}
                <td className="px-5 py-4">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                    style={badgeStyle}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </td>

                {/* Total Sales */}
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className="text-sm" style={{ color: '#d1d5db' }}>
                    {seller.totalSales != null
                      ? seller.totalSales.toLocaleString()
                      : '0'}
                  </span>
                </td>

                {/* Revenue */}
                <td className="px-5 py-4 hidden md:table-cell">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: '#a78bfa' }}
                  >
                    ${Number(seller.revenue || 0).toLocaleString()}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          onApprove && onApprove(sellerId, 'approved')
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200"
                        style={{
                          background: 'rgba(34,197,94,0.12)',
                          color: '#4ade80',
                          border: '1px solid rgba(34,197,94,0.25)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            'rgba(34,197,94,0.22)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            'rgba(34,197,94,0.12)';
                        }}
                      >
                        <CheckCircle size={13} />
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          onApprove && onApprove(sellerId, 'rejected')
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200"
                        style={{
                          background: 'rgba(239,68,68,0.12)',
                          color: '#f87171',
                          border: '1px solid rgba(239,68,68,0.25)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            'rgba(239,68,68,0.22)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            'rgba(239,68,68,0.12)';
                        }}
                      >
                        <XCircle size={13} />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm" style={{ color: '#4b5563' }}>
                      —
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SellersTable;