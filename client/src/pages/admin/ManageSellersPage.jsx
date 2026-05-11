import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import SellersTable from '../../components/admin/SellersTable';

const statusFilters = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Suspended', value: 'suspended' },
  { label: 'Rejected', value: 'rejected' },
];

const ManageSellersPage = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSellers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (activeFilter) params.status = activeFilter;

      const { data } = await api.get('/admin/sellers', { params });
      const result = data.data || data;

      setSellers(result.sellers || []);
      setTotalPages(result.pagination?.totalPages || 1);
      setPage(result.pagination?.page || 1);
    } catch (err) {
      toast.error('Failed to load sellers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, page]);

  useEffect(() => { fetchSellers(); }, [fetchSellers]);
  useEffect(() => { setPage(1); }, [activeFilter]);

  const handleApprove = async (sellerId, status) => {
    try {
      await api.put(`/admin/sellers/${sellerId}/approve`, { status });
      toast.success(`Seller ${status} successfully`);
      fetchSellers();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${status} seller`);
      console.error(err);
    }
  };

  return (
    <div
      className="flex"
      style={{
        background: 'linear-gradient(135deg, #0d0b1e 0%, #0f0c2a 40%, #080818 100%)',
        minHeight: '100vh',
      }}
    >
      <AdminSidebar />

      <main
        className="ml-64 p-8 w-full min-h-screen"
        style={{ background: 'transparent' }}
      >
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            {/* small accent pill */}
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{
                background: 'rgba(124, 58, 237, 0.18)',
                color: '#a78bfa',
                border: '1px solid rgba(124,58,237,0.35)',
                letterSpacing: '0.05em',
              }}
            >
              Admin Panel
            </span>
          </div>
          <h1
            className="text-3xl font-extrabold tracking-tight mt-2"
            style={{ color: '#f0eeff' }}
          >
            Manage{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #a78bfa, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Sellers
            </span>
          </h1>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
            Review, approve, and manage all registered sellers.
          </p>
        </div>

        {/* STATUS FILTER TABS */}
        <div
          className="flex flex-wrap gap-2 mb-6 p-1 rounded-xl w-fit"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {statusFilters.map((filter) => {
            const isActive = activeFilter === filter.value;
            return (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                style={
                  isActive
                    ? {
                        background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                        color: '#ffffff',
                        boxShadow: '0 4px 15px rgba(124,58,237,0.4)',
                      }
                    : {
                        background: 'transparent',
                        color: '#9ca3af',
                      }
                }
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#9ca3af';
                }}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* SELLERS TABLE CARD */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              {/* Custom spinner matching purple theme */}
              <div
                className="rounded-full h-10 w-10 animate-spin"
                style={{
                  border: '2px solid rgba(124,58,237,0.15)',
                  borderTop: '2px solid #7c3aed',
                }}
              />
              <p className="text-sm" style={{ color: '#6b7280' }}>
                Loading sellers…
              </p>
            </div>
          ) : (
            <SellersTable sellers={sellers} onApprove={handleApprove} />
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm" style={{ color: '#6b7280' }}>
              Page{' '}
              <span style={{ color: '#a78bfa', fontWeight: 600 }}>{page}</span>
              {' '}of{' '}
              <span style={{ color: '#a78bfa', fontWeight: 600 }}>{totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: page === 1 ? '#4b5563' : '#d1d5db',
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (page !== 1) {
                    e.currentTarget.style.background = 'rgba(124,58,237,0.15)';
                    e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)';
                    e.currentTarget.style.color = '#a78bfa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (page !== 1) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.color = '#d1d5db';
                  }
                }}
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                style={{
                  background: page === totalPages
                    ? 'rgba(255,255,255,0.03)'
                    : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                  border: '1px solid rgba(124,58,237,0.3)',
                  color: page === totalPages ? '#4b5563' : '#ffffff',
                  cursor: page === totalPages ? 'not-allowed' : 'pointer',
                  boxShadow: page === totalPages ? 'none' : '0 4px 15px rgba(124,58,237,0.3)',
                }}
                onMouseEnter={(e) => {
                  if (page !== totalPages) {
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (page !== totalPages) {
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(124,58,237,0.3)';
                  }
                }}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageSellersPage;