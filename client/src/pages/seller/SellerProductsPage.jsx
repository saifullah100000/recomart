import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle, ChevronLeft, ChevronRight,
  Package, Sparkles, AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import SellerSidebar from '../../components/seller/SellerSidebar';
import InventoryTable from '../../components/seller/InventoryTable';

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const SP_STYLE_ID = 'sp-styles';
if (typeof document !== 'undefined' && !document.getElementById(SP_STYLE_ID)) {
  const tag = document.createElement('style');
  tag.id = SP_STYLE_ID;
  tag.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

    .sp-root {
      min-height: 100vh;
      background: #080b1a;
      font-family: 'DM Sans', sans-serif;
      color: #e2e8f0;
      position: relative;
      overflow-x: hidden;
    }

    /* ── Orbs ── */
    .sp-orb {
      position: fixed; border-radius: 50%;
      pointer-events: none; filter: blur(110px); z-index: 0;
    }
    .sp-orb-1 {
      width: 550px; height: 550px;
      background: radial-gradient(circle, rgba(109,40,217,0.16) 0%, transparent 65%);
      top: -150px; left: -150px;
    }
    .sp-orb-2 {
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 65%);
      bottom: -80px; right: -80px;
    }

    /* ── Grid ── */
    .sp-grid-bg {
      position: fixed; inset: 0; z-index: 0; pointer-events: none;
      background-image:
        linear-gradient(rgba(139,92,246,0.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(139,92,246,0.035) 1px, transparent 1px);
      background-size: 48px 48px;
    }

    /* ── Main ── */
    .sp-main {
      position: relative; z-index: 1;
      margin-left: 256px;
      padding: 3rem 2rem 6rem;
      min-height: 100vh;
    }

    /* ── Top bar ── */
    .sp-topbar {
      display: flex; align-items: flex-end;
      justify-content: space-between;
      flex-wrap: wrap; gap: 1.25rem;
      margin-bottom: 2rem;
    }
    .sp-badge {
      display: inline-flex; align-items: center; gap: 0.4rem;
      padding: 0.3rem 0.9rem;
      background: rgba(139,92,246,0.12);
      border: 1px solid rgba(139,92,246,0.28);
      border-radius: 999px;
      font-size: 0.7rem; color: #a78bfa;
      letter-spacing: 0.09em; text-transform: uppercase; font-weight: 500;
      margin-bottom: 0.75rem;
    }
    .sp-title {
      font-family: 'Syne', sans-serif;
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 800; color: #f1f5f9;
      line-height: 1.15; margin: 0 0 0.35rem;
    }
    .sp-title span {
      background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .sp-subtitle { font-size: 0.85rem; color: #475569; font-weight: 300; line-height: 1.6; }

    /* Add button */
    .sp-add-btn {
      display: inline-flex; align-items: center; gap: 0.5rem;
      padding: 0.65rem 1.35rem;
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      border: none; border-radius: 12px;
      color: #fff; font-size: 0.85rem; font-weight: 500;
      font-family: 'DM Sans', sans-serif;
      text-decoration: none; cursor: pointer; white-space: nowrap;
      transition: opacity 0.2s, transform 0.2s;
      box-shadow: 0 4px 20px rgba(124,58,237,0.4);
    }
    .sp-add-btn:hover { opacity: 0.9; transform: translateY(-1px); }

    /* ── Controls ── */
    .sp-controls { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.5rem; }
    .sp-filter-select {
      padding: 0.65rem 1rem;
      background: rgba(12,15,30,0.85);
      border: 1px solid rgba(139,92,246,0.2);
      border-radius: 12px; color: #cbd5e1;
      font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
      outline: none; cursor: pointer; transition: border-color 0.2s;
    }
    .sp-filter-select:focus { border-color: rgba(139,92,246,0.5); }
    .sp-filter-select option { background: #0f1220; color: #e2e8f0; }

    /* ── Glass card ── */
    .sp-card {
      position: relative;
      background: rgba(12,15,30,0.85);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(139,92,246,0.2);
      border-radius: 20px;
      box-shadow: 0 20px 64px rgba(0,0,0,0.45);
      overflow: hidden;
      animation: sp-fade-up 0.4s ease both;
    }
    .sp-card::before {
      content: ''; position: absolute; top: 0; left: 15%; right: 15%; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(139,92,246,0.55), transparent);
      z-index: 1;
    }
    .sp-card-header {
      display: flex; align-items: center; gap: 0.65rem;
      padding: 1.25rem 1.75rem;
      border-bottom: 1px solid rgba(139,92,246,0.1);
    }
    .sp-card-icon {
      width: 34px; height: 34px; border-radius: 10px;
      background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.2);
      display: flex; align-items: center; justify-content: center;
      color: #7c3aed; flex-shrink: 0;
    }
    .sp-card-title { font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 700; color: #f1f5f9; }
    .sp-card-line { flex: 1; height: 1px; background: linear-gradient(90deg, rgba(139,92,246,0.2), transparent); }

    /* Table overrides */
    .sp-card table { width: 100%; border-collapse: collapse; }
    .sp-card thead tr { border-bottom: 1px solid rgba(139,92,246,0.12); }
    .sp-card th {
      padding: 0.65rem 1rem; font-size: 0.68rem; font-weight: 600;
      color: #475569; text-transform: uppercase; letter-spacing: 0.08em;
      text-align: left; background: transparent;
    }
    .sp-card tbody tr { border-bottom: 1px solid rgba(255,255,255,0.03); transition: background 0.15s; }
    .sp-card tbody tr:hover { background: rgba(139,92,246,0.05); }
    .sp-card td { padding: 0.75rem 1rem; font-size: 0.83rem; color: #cbd5e1; background: transparent; }
    .sp-card select {
      background: rgba(255,255,255,0.04) !important; border: 1px solid rgba(139,92,246,0.2) !important;
      border-radius: 8px !important; color: #e2e8f0 !important;
      font-family: 'DM Sans', sans-serif !important; font-size: 0.78rem !important;
      padding: 0.3rem 0.6rem !important;
    }
    .sp-card select option { background: #0f1220 !important; color: #e2e8f0 !important; }

    /* ── Loading ── */
    .sp-loading-wrap { display: flex; align-items: center; justify-content: center; height: 16rem; }
    .sp-spinner {
      width: 40px; height: 40px;
      border: 3px solid rgba(139,92,246,0.15); border-top-color: #7c3aed;
      border-radius: 50%; animation: sp-spin 0.8s linear infinite;
    }
    @keyframes sp-spin { to { transform: rotate(360deg); } }

    /* ── Pagination ── */
    .sp-pagination { display: flex; align-items: center; justify-content: center; gap: 0.4rem; margin-top: 1.75rem; }
    .sp-page-btn {
      display: flex; align-items: center; justify-content: center;
      min-width: 36px; height: 36px; padding: 0 0.65rem;
      border-radius: 10px; font-size: 0.8rem; font-weight: 500;
      font-family: 'DM Sans', sans-serif; cursor: pointer;
      border: 1px solid rgba(139,92,246,0.15);
      background: rgba(12,15,30,0.6); color: #475569;
      transition: background 0.2s, border-color 0.2s, color 0.2s;
    }
    .sp-page-btn:hover:not(:disabled) {
      background: rgba(139,92,246,0.08); border-color: rgba(139,92,246,0.3); color: #94a3b8;
    }
    .sp-page-btn.active {
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      border-color: transparent; color: #fff;
      box-shadow: 0 2px 12px rgba(124,58,237,0.4);
    }
    .sp-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }

    /* ── Delete modal ── */
    .sp-modal-backdrop {
      position: fixed; inset: 0; z-index: 50;
      display: flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.7); backdrop-filter: blur(6px);
      animation: sp-fade-in 0.2s ease;
    }
    .sp-modal {
      position: relative;
      background: rgba(12,15,30,0.97); backdrop-filter: blur(32px);
      border: 1px solid rgba(239,68,68,0.25); border-radius: 20px;
      padding: 2rem; max-width: 380px; width: 100%; margin: 1rem;
      box-shadow: 0 24px 80px rgba(0,0,0,0.6);
      animation: sp-fade-up 0.25s ease;
    }
    .sp-modal::before {
      content: ''; position: absolute; top: 0; left: 10%; right: 10%; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(239,68,68,0.45), transparent);
    }
    .sp-modal-icon {
      width: 48px; height: 48px; border-radius: 14px;
      background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2);
      display: flex; align-items: center; justify-content: center;
      color: #f87171; margin-bottom: 1.25rem;
    }
    .sp-modal-title { font-family: 'Syne', sans-serif; font-size: 1.05rem; font-weight: 800; color: #f1f5f9; margin-bottom: 0.6rem; }
    .sp-modal-body { font-size: 0.84rem; color: #475569; line-height: 1.7; font-weight: 300; margin-bottom: 1.75rem; }
    .sp-modal-body strong { color: #94a3b8; font-weight: 500; }
    .sp-modal-actions { display: flex; align-items: center; justify-content: flex-end; gap: 0.75rem; }
    .sp-modal-cancel {
      padding: 0.6rem 1.25rem; border-radius: 10px;
      font-size: 0.83rem; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer;
      background: rgba(255,255,255,0.04); border: 1px solid rgba(139,92,246,0.2); color: #94a3b8;
      transition: background 0.2s, border-color 0.2s;
    }
    .sp-modal-cancel:hover { background: rgba(139,92,246,0.08); border-color: rgba(139,92,246,0.35); color: #c4b5fd; }
    .sp-modal-delete {
      padding: 0.6rem 1.25rem; border-radius: 10px;
      font-size: 0.83rem; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer;
      background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: #f87171;
      transition: background 0.2s, border-color 0.2s;
    }
    .sp-modal-delete:hover { background: rgba(239,68,68,0.25); border-color: rgba(239,68,68,0.5); }

    @keyframes sp-fade-up {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes sp-fade-in { from { opacity: 0; } to { opacity: 1; } }

    /* Scrollbar */
    .sp-root ::-webkit-scrollbar { width: 6px; }
    .sp-root ::-webkit-scrollbar-track { background: transparent; }
    .sp-root ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.2); border-radius: 3px; }
    .sp-root ::-webkit-scrollbar-thumb:hover { background: rgba(139,92,246,0.4); }
  `;
  document.head.appendChild(tag);
}

/* ─── Component ──────────────────────────────────────────────────────────── */
const SellerProductsPage = () => {
  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage]   = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [deleteModal, setDeleteModal]   = useState({ open: false, productId: null, productTitle: '' });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit: 10 };
      if (statusFilter) params.status = statusFilter;

      const { data } = await api.get('/products/seller/my-products', { params });
      const result = data.data || data;

      setProducts(result.products || []);
      setTotalPages(result.pagination?.totalPages || 1);
      setCurrentPage(result.pagination?.page || 1);
    } catch (err) {
      toast.error('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter]);

  /* Debounced fetch */
  useEffect(() => {
    const t = setTimeout(() => { fetchProducts(); }, 400);
    return () => clearTimeout(t);
  }, [fetchProducts, statusFilter, currentPage]);

  const handleDelete = async () => {
    try {
      await api.delete(`/products/${deleteModal.productId}`);
      toast.success('Product deleted successfully');
      setDeleteModal({ open: false, productId: null, productTitle: '' });
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const closeModal = () => setDeleteModal({ open: false, productId: null, productTitle: '' });

  return (
    <div className="sp-root">
      <div className="sp-orb sp-orb-1" />
      <div className="sp-orb sp-orb-2" />
      <div className="sp-grid-bg" />

      <SellerSidebar />

      <main className="sp-main">

        {/* ── Top bar ── */}
        <div className="sp-topbar">
          <div>
            <div className="sp-badge"><Sparkles size={10} /> Seller Dashboard</div>
            <h1 className="sp-title">My <span>Products</span></h1>
            <p className="sp-subtitle">Manage your product listings, inventory, and status.</p>
          </div>
          <Link to="/seller/products/add" className="sp-add-btn">
            <PlusCircle size={17} /> Add Product
          </Link>
        </div>

        {/* ── Filter ── */}
        <div className="sp-controls">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="sp-filter-select"
          >
            <option value="">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* ── Products Card ── */}
        <div className="sp-card">
          <div className="sp-card-header">
            <div className="sp-card-icon"><Package size={16} /></div>
            <span className="sp-card-title">Product Listings</span>
            <div className="sp-card-line" />
          </div>

          {loading ? (
            <div className="sp-loading-wrap"><div className="sp-spinner" /></div>
          ) : (
            <InventoryTable
              products={products}
              onDelete={(productId, title) =>
                setDeleteModal({ open: true, productId, productTitle: title })
              }
            />
          )}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="sp-pagination">
            <button className="sp-page-btn" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`sp-page-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button className="sp-page-btn" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* ── Delete Modal ── */}
        {deleteModal.open && (
          <div className="sp-modal-backdrop">
            <div className="sp-modal">
              <div className="sp-modal-icon"><AlertTriangle size={22} /></div>
              <h3 className="sp-modal-title">Delete Product</h3>
              <p className="sp-modal-body">
                Are you sure you want to delete{' '}
                <strong>"{deleteModal.productTitle}"</strong>?
                This action cannot be undone.
              </p>
              <div className="sp-modal-actions">
                <button className="sp-modal-cancel" onClick={closeModal}>Cancel</button>
                <button className="sp-modal-delete" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default SellerProductsPage;