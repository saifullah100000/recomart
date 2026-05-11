import React, { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import UsersTable from '../../components/admin/UsersTable';

const roleFilters = [
  { label: 'All', value: '' },
  { label: 'Customer', value: 'user' },
  { label: 'Seller', value: 'seller' },
  { label: 'Admin', value: 'admin' },
];

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;

      const { data } = await api.get('/admin/users', { params });
      const result = data.data || data;

      setUsers(result.users || []);
      setTotalPages(result.pagination?.totalPages || 1);
      setPage(result.pagination?.page || 1);
    } catch (err) {
      toast.error('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { setPage(1); }, [search, roleFilter]);

  const handleToggleStatus = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/status`);
      toast.success('User status updated');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user status');
      console.error(err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
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

      <main className="ml-64 p-8 w-full min-h-screen" style={{ background: 'transparent' }}>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
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
          <h1 className="text-3xl font-extrabold tracking-tight mt-2" style={{ color: '#f0eeff' }}>
            Manage{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #a78bfa, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Users
            </span>
          </h1>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
            Search, filter, and manage all registered users.
          </p>
        </div>

        {/* FILTERS ROW */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">

          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: '#6b7280' }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email…"
                className="w-full pl-10 pr-4 py-2.5 text-sm outline-none rounded-xl transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#f0eeff',
                  '::placeholder': { color: '#6b7280' },
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = '1px solid rgba(124,58,237,0.5)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </form>

          {/* Role Filter — pill tabs */}
          <div
            className="flex flex-wrap gap-1 p-1 rounded-xl w-fit"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            {roleFilters.map((filter) => {
              const isActive = roleFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  onClick={() => setRoleFilter(filter.value)}
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                  style={
                    isActive
                      ? {
                          background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                          color: '#ffffff',
                          boxShadow: '0 4px 15px rgba(124,58,237,0.4)',
                        }
                      : { background: 'transparent', color: '#9ca3af' }
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
        </div>

        {/* USERS TABLE CARD */}
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
              <div
                className="rounded-full h-10 w-10 animate-spin"
                style={{
                  border: '2px solid rgba(124,58,237,0.15)',
                  borderTop: '2px solid #7c3aed',
                }}
              />
              <p className="text-sm" style={{ color: '#6b7280' }}>
                Loading users…
              </p>
            </div>
          ) : (
            <UsersTable users={users} onToggleStatus={handleToggleStatus} />
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
                  if (page !== totalPages)
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.5)';
                }}
                onMouseLeave={(e) => {
                  if (page !== totalPages)
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(124,58,237,0.3)';
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

export default ManageUsersPage;