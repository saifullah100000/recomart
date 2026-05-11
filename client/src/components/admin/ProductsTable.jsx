import React from 'react';
import { CheckCircle, XCircle, Package } from 'lucide-react';

const statusConfig = {
  approved: { color: 'rgba(34,197,94,0.15)',  border: 'rgba(34,197,94,0.3)',  text: '#4ade80', label: 'Approved' },
  pending:  { color: 'rgba(234,179,8,0.12)',  border: 'rgba(234,179,8,0.28)', text: '#facc15', label: 'Pending'  },
  rejected: { color: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.28)', text: '#f87171', label: 'Rejected' },
};

const ProductsTable = ({ products, onApprove }) => {
  if (!products || products.length === 0) {
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
            <Package size={24} />
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'rgba(167,139,250,0.5)', margin: 0 }}>No products found</p>
          <p style={{ fontSize: 12, color: 'rgba(167,139,250,0.3)', margin: 0 }}>Products will appear here once added.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&display=swap');

        .products-table-wrap {
          font-family: 'Outfit', sans-serif;
          overflow-x: auto;
        }

        .products-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .products-table thead tr {
          border-bottom: 1px solid rgba(139,92,246,0.12);
        }

        .products-table th {
          padding: 12px 16px;
          font-size: 10px;
          font-weight: 600;
          color: rgba(167,139,250,0.45);
          letter-spacing: 0.09em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .products-table tbody tr {
          border-bottom: 1px solid rgba(139,92,246,0.06);
          transition: background 0.15s ease;
        }

        .products-table tbody tr:last-child { border-bottom: none; }
        .products-table tbody tr:hover { background: rgba(124,58,237,0.05); }

        .products-table td {
          padding: 12px 16px;
          vertical-align: middle;
        }

        /* Product image */
        .product-img-wrap {
          width: 44px; height: 44px;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(139,92,246,0.18);
          background: rgba(124,58,237,0.08);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .product-img-wrap img {
          width: 100%; height: 100%;
          object-fit: cover;
        }

        .product-img-placeholder {
          font-size: 10px;
          color: rgba(167,139,250,0.35);
          text-align: center;
          line-height: 1.2;
        }

        /* Text cells */
        .product-title {
          font-size: 13px;
          font-weight: 500;
          color: #ddd6fe;
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: block;
        }

        .cell-muted {
          font-size: 12px;
          color: rgba(167,139,250,0.45);
        }

        .price-cell {
          font-size: 13px;
          font-weight: 600;
          color: #e2e0f0;
        }

        /* Action buttons */
        .action-btn {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .approve-btn {
          background: rgba(34,197,94,0.08);
          color: rgba(74,222,128,0.6);
        }
        .approve-btn:not(:disabled):hover {
          background: rgba(34,197,94,0.2);
          color: #4ade80;
          box-shadow: 0 0 10px rgba(34,197,94,0.2);
        }
        .approve-btn:disabled {
          color: #4ade80;
          background: rgba(34,197,94,0.15);
          cursor: default;
          opacity: 0.7;
        }

        .reject-btn {
          background: rgba(239,68,68,0.08);
          color: rgba(248,113,113,0.5);
        }
        .reject-btn:not(:disabled):hover {
          background: rgba(239,68,68,0.18);
          color: #f87171;
          box-shadow: 0 0 10px rgba(239,68,68,0.15);
        }
        .reject-btn:disabled {
          color: #f87171;
          background: rgba(239,68,68,0.12);
          cursor: default;
          opacity: 0.7;
        }

        @media (max-width: 640px) { .hide-sm { display: none; } }
        @media (max-width: 768px) { .hide-md { display: none; } }
      `}</style>

      <div className="products-table-wrap">
        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th className="hide-sm">Seller</th>
              <th className="hide-md">Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const productId = product._id || product.id;
              const status =
                product.isApproved === true  ? 'approved' :
                product.isApproved === false ? 'pending'  :
                product.status || 'pending';

              const cfg = statusConfig[status] || statusConfig.pending;
              const imgSrc = product.images?.[0]
                ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url)
                : null;

              return (
                <tr key={productId}>
                  <td>
                    <div className="product-img-wrap">
                      {imgSrc
                        ? <img src={imgSrc} alt={product.title} />
                        : <span className="product-img-placeholder">No<br/>img</span>
                      }
                    </div>
                  </td>

                  <td>
                    <span className="product-title" title={product.title}>{product.title}</span>
                  </td>

                  <td className="hide-sm">
                    <span className="cell-muted">
                      {product.seller?.businessName || product.seller?.name || product.sellerName || '—'}
                    </span>
                  </td>

                  <td className="hide-md">
                    <span className="cell-muted">
                      {product.category?.name || product.category || '—'}
                    </span>
                  </td>

                  <td>
                    <span className="price-cell">${Number(product.price).toFixed(2)}</span>
                  </td>

                  <td>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center',
                      padding: '3px 10px', borderRadius: 20,
                      fontSize: 11, fontWeight: 600, letterSpacing: '0.03em',
                      background: cfg.color, border: `1px solid ${cfg.border}`, color: cfg.text,
                      whiteSpace: 'nowrap',
                    }}>
                      {cfg.label}
                    </span>
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button
                        className="action-btn approve-btn"
                        onClick={() => onApprove && onApprove(productId, true)}
                        disabled={status === 'approved'}
                        title="Approve"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button
                        className="action-btn reject-btn"
                        onClick={() => onApprove && onApprove(productId, false)}
                        disabled={status === 'rejected'}
                        title="Reject"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProductsTable;