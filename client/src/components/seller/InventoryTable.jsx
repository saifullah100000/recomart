import React from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Package } from 'lucide-react';

/* ── Status badge ── */
const StatusBadge = ({ qty }) => {
  let label, color, bg, glow, dot;
  if (qty > 10) {
    label = 'In Stock';
    color = '#4ade80'; bg = 'rgba(74,222,128,0.1)';
    glow  = 'rgba(74,222,128,0.5)'; dot = '#4ade80';
  } else if (qty > 0) {
    label = 'Low Stock';
    color = '#fbbf24'; bg = 'rgba(251,191,36,0.1)';
    glow  = 'rgba(251,191,36,0.5)'; dot = '#fbbf24';
  } else {
    label = 'Out of Stock';
    color = '#f87171'; bg = 'rgba(248,113,113,0.1)';
    glow  = 'rgba(248,113,113,0.5)'; dot = '#ef4444';
  }

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', borderRadius: 999,
      background: bg,
      border: `1px solid ${color}33`,
      fontSize: 11, fontWeight: 700, color,
      letterSpacing: '0.04em', whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: dot, boxShadow: `0 0 5px ${glow}`,
        flexShrink: 0,
      }} />
      {label}
    </span>
  );
};

/* ── Image cell ── */
const ProductThumb = ({ product }) => {
  const src = product.images?.[0]
    ? typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url
    : null;

  return (
    <div style={{
      width: 44, height: 44, borderRadius: 12, overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.08)',
      background: 'rgba(255,255,255,0.05)',
      flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {src
        ? <img src={src} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        : <Package style={{ width: 18, height: 18, color: 'rgba(255,255,255,0.2)' }} />
      }
    </div>
  );
};

/* ── Main component ── */
const InventoryTable = ({ products }) => {

  /* ── Empty state ── */
  if (!products || products.length === 0) {
    return (
      <>
        <style>{`.it-empty{padding:56px 24px;text-align:center;border-radius:20px;
          border:1px dashed rgba(255,255,255,.08);background:rgba(255,255,255,.02);}
          .it-empty-icon{width:52px;height:52px;border-radius:15px;background:rgba(255,255,255,.05);
          display:flex;align-items:center;justify-content:center;margin:0 auto 14px;}
        `}</style>
        <div className="it-empty">
          <div className="it-empty-icon">
            <Package style={{ width: 24, height: 24, color: 'rgba(255,255,255,0.18)' }} />
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>No products found</p>
          <p style={{ fontSize: 13, color: '#475569' }}>Start by adding your first product.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes it-fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

        /* ── Wrapper ── */
        .it-wrap {
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          overflow: hidden;
          position: relative;
        }
        .it-wrap::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        }

        /* ── Scroll container ── */
        .it-scroll {
          overflow-x: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(124,58,237,0.35) transparent;
        }
        .it-scroll::-webkit-scrollbar { height: 3px; }
        .it-scroll::-webkit-scrollbar-track { background: transparent; }
        .it-scroll::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.35); border-radius: 4px; }

        /* ── Table ── */
        .it-table { width: 100%; border-collapse: collapse; text-align: left; min-width: 640px; }

        /* Head */
        .it-thead tr {
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.025);
        }
        .it-th {
          padding: 13px 16px;
          font-size: 10px; font-weight: 700;
          color: #475569;
          letter-spacing: 0.07em; text-transform: uppercase;
          white-space: nowrap;
        }
        .it-th:first-child { padding-left: 20px; }
        .it-th:last-child  { padding-right: 20px; }

        /* Body rows */
        .it-tbody tr {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.18s;
          animation: it-fadeIn 0.35s ease both;
          position: relative;
        }
        .it-tbody tr:last-child { border-bottom: none; }
        .it-tbody tr:hover { background: rgba(255,255,255,0.04); }
        .it-tbody tr:hover .it-row-accent { opacity: 1; }

        /* Violet left accent on hover */
        .it-row-accent {
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, #7C3AED, #4F46E5);
          border-radius: 0 3px 3px 0;
          opacity: 0;
          transition: opacity 0.18s;
          pointer-events: none;
        }

        /* Cells */
        .it-td {
          padding: 14px 16px;
          vertical-align: middle;
        }
        .it-td:first-child { padding-left: 20px; }
        .it-td:last-child  { padding-right: 20px; }

        /* Product title */
        .it-title {
          font-size: 13px; font-weight: 600; color: #e2e8f0;
          letter-spacing: -0.01em;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          max-width: 200px; display: block;
        }

        /* Category */
        .it-cat {
          font-size: 12px; color: #64748b; font-weight: 500;
        }

        /* Price */
        .it-price {
          font-size: 13px; font-weight: 700; color: #F8FAFC; letter-spacing: -0.02em;
        }

        /* Stock qty */
        .it-stock-hi { font-size: 13px; font-weight: 700; color: #94a3b8; }
        .it-stock-lo { font-size: 13px; font-weight: 700; color: #f87171; }

        /* ── Action buttons ── */
        .it-actions { display: flex; align-items: center; gap: 6px; }

        .it-btn-edit {
          width: 32px; height: 32px; border-radius: 9px;
          border: 1px solid rgba(99,102,241,0.2);
          background: rgba(99,102,241,0.08);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #818cf8;
          transition: background 0.18s, border-color 0.18s, color 0.18s, transform 0.18s;
          text-decoration: none;
        }
        .it-btn-edit:hover {
          background: rgba(99,102,241,0.18);
          border-color: rgba(99,102,241,0.45);
          color: #a5b4fc;
          transform: scale(1.08);
        }

        .it-btn-del {
          width: 32px; height: 32px; border-radius: 9px;
          border: 1px solid rgba(239,68,68,0.18);
          background: rgba(239,68,68,0.07);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #f87171;
          transition: background 0.18s, border-color 0.18s, color 0.18s, transform 0.18s;
        }
        .it-btn-del:hover {
          background: rgba(239,68,68,0.16);
          border-color: rgba(239,68,68,0.4);
          color: #fca5a5;
          transform: scale(1.08);
        }

        /* Responsive hidden cols */
        @media (max-width: 767px) { .it-hide-md { display: none; } }
        @media (max-width: 539px) { .it-hide-sm { display: none; } }
      `}</style>

      <div className="it-wrap">
        <div className="it-scroll">
          <table className="it-table">

            {/* ── Head ── */}
            <thead className="it-thead">
              <tr>
                {['Image','Title','Category','Price','Stock','Status','Actions'].map((h, i) => (
                  <th
                    key={h}
                    className={`it-th${i === 2 ? ' it-hide-md' : i === 4 ? ' it-hide-sm' : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            {/* ── Body ── */}
            <tbody className="it-tbody">
              {products.map((product, idx) => (
                <tr key={product._id || product.id} style={{ animationDelay: `${idx * 45}ms` }}>
                  {/* Hover accent */}
                  <td style={{ position: 'relative', width: 0, padding: 0 }}>
                    <div className="it-row-accent" />
                  </td>

                  {/* Image */}
                  <td className="it-td">
                    <ProductThumb product={product} />
                  </td>

                  {/* Title */}
                  <td className="it-td">
                    <span className="it-title">{product.title}</span>
                  </td>

                  {/* Category */}
                  <td className="it-td it-hide-md">
                    <span className="it-cat">
                      {product.category?.name || product.category || '—'}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="it-td">
                   <span className="it-price">
  Rs. {Number(product.price).toLocaleString('en-IN')}
</span>
                  </td>

                  {/* Stock qty */}
                  <td className="it-td it-hide-sm">
                    <span className={product.stockQuantity <= 5 ? 'it-stock-lo' : 'it-stock-hi'}>
                      {product.stockQuantity}
                    </span>
                  </td>

                  {/* Status badge */}
                  <td className="it-td">
                    <StatusBadge qty={product.stockQuantity} />
                  </td>

                  {/* Actions */}
                  <td className="it-td">
                    <div className="it-actions">
                      <Link
                        to={`/seller/products/edit/${product._id || product.id}`}
                        className="it-btn-edit"
                        title="Edit product"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button className="it-btn-del" title="Delete product">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default InventoryTable;