import React, { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import ProductsTable from '../../components/admin/ProductsTable';

const statusFilters = [
  { label: 'All',              value: ''         },
  { label: 'Pending Approval', value: 'pending'  },
  { label: 'Approved',         value: 'approved' },
];

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

  .products-page { font-family: 'Outfit', sans-serif; display: flex; background: #09071a; min-height: 100vh; }

  .products-main {
    margin-left: 256px; padding: 32px 28px;
    width: 100%; min-height: 100vh;
    background: linear-gradient(160deg, #0d0b1e 0%, #080613 100%);
    position: relative;
  }
  .products-main::before {
    content: '';
    position: fixed; top: -100px; right: -100px;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .products-content { position: relative; z-index: 1; }

  .page-heading { font-size: 24px; font-weight: 700; color: #fff; letter-spacing: -0.02em; margin: 0 0 6px; }
  .page-heading span { background: linear-gradient(90deg,#a78bfa,#818cf8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .page-sub { font-size: 13px; color: rgba(167,139,250,0.4); margin: 0 0 24px; }

  /* ── Toolbar ── */
  .toolbar {
    display: flex; flex-wrap: wrap;
    align-items: center; gap: 12px;
    margin-bottom: 20px;
  }

  /* Search */
  .search-wrap {
    position: relative; flex: 1; min-width: 220px; max-width: 380px;
  }
  .search-icon {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    color: rgba(167,139,250,0.4); pointer-events: none;
  }
  .search-input {
    width: 100%; padding: 10px 14px 10px 38px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(139,92,246,0.18);
    border-radius: 10px;
    color: #ddd6fe; font-family: 'Outfit', sans-serif; font-size: 13px;
    outline: none; transition: all 0.2s ease;
  }
  .search-input::placeholder { color: rgba(167,139,250,0.3); }
  .search-input:focus {
    border-color: rgba(124,58,237,0.45);
    background: rgba(124,58,237,0.05);
    box-shadow: 0 0 0 3px rgba(124,58,237,0.08);
  }

  /* Filter pills */
  .filter-group { display: flex; flex-wrap: wrap; gap: 8px; }
  .filter-pill {
    padding: 8px 16px; border-radius: 10px;
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

  /* Loading */
  .loading-box { display:flex; align-items:center; justify-content:center; height: 260px; }
  .spinner { width:40px;height:40px;border-radius:50%;border:3px solid rgba(124,58,237,0.15);border-top-color:#7c3aed;animation:spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Pagination */
  .pagination { display:flex; align-items:center; justify-content:space-between; margin-top: 20px; }
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
`;

const ManageProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (statusFilter === 'approved') params.isApproved = true;
      if (statusFilter === 'pending')  params.isApproved = false;

      const { data } = await api.get('/admin/products', { params });
      const result = data.data || data;
      setProducts(result.products || []);
      setTotalPages(result.pagination?.totalPages || 1);
      setPage(result.pagination?.page || 1);
    } catch (err) {
      toast.error('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const handleApprove = async (productId, isApproved) => {
    try {
      await api.put(`/admin/products/${productId}/approve`, { isApproved });
      toast.success(isApproved ? 'Product approved successfully' : 'Product rejected successfully');
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${isApproved ? 'approve' : 'reject'} product`);
      console.error(err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  return (
    <div className="products-page">
      <style>{PAGE_STYLES}</style>
      <AdminSidebar />

      <main className="products-main">
        <div className="products-content">

          <h1 className="page-heading">Manage <span>Products</span></h1>
          <p className="page-sub">Approve, reject and search all marketplace products.</p>

          {/* Toolbar */}
          <div className="toolbar">
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="search-wrap">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product title..."
                className="search-input"
              />
            </form>

            {/* Status filters */}
            <div className="filter-group">
              {statusFilters.map((filter) => (
                <button
                  key={filter.value}
                  className={`filter-pill ${statusFilter === filter.value ? 'active' : 'inactive'}`}
                  onClick={() => setStatusFilter(filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products Table */}
          <div className="table-card">
            {loading ? (
              <div className="loading-box"><div className="spinner" /></div>
            ) : (
              <ProductsTable products={products} onApprove={handleApprove} />
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <p className="page-info">Page <strong>{page}</strong> of <strong>{totalPages}</strong></p>
              <div className="page-btns">
                <button
                  className="page-btn"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft size={15} /> Previous
                </button>
                <button
                  className="page-btn"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default ManageProductsPage;