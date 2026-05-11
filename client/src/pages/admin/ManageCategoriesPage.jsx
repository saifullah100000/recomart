import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import CategoryManager from '../../components/admin/CategoryManager';

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

  .categories-page { font-family: 'Outfit', sans-serif; display: flex; background: #09071a; min-height: 100vh; }

  .categories-main {
    margin-left: 256px; padding: 32px 28px;
    width: 100%; min-height: 100vh;
    background: linear-gradient(160deg, #0d0b1e 0%, #080613 100%);
    position: relative;
  }
  .categories-main::before {
    content: '';
    position: fixed; top: -100px; right: -100px;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .categories-content { position: relative; z-index: 1; }

  .page-heading { font-size: 24px; font-weight: 700; color: #fff; letter-spacing: -0.02em; margin: 0 0 6px; }
  .page-heading span { background: linear-gradient(90deg,#a78bfa,#818cf8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .page-sub { font-size: 13px; color: rgba(167,139,250,0.4); margin: 0 0 24px; }

  .loading-box { display:flex; align-items:center; justify-content:center; height: 260px; }
  .spinner { width:40px;height:40px;border-radius:50%;border:3px solid rgba(124,58,237,0.15);border-top-color:#7c3aed;animation:spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const ManageCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/categories');
      const result = data.data || data;
      setCategories(result.categories || result);
    } catch (err) {
      toast.error('Failed to load categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleAdd = async (categoryData) => {
    try {
      await api.post('/categories', categoryData);
      toast.success('Category added successfully');
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add category');
      console.error(err);
    }
  };

  const handleEdit = async (categoryId, categoryData) => {
    try {
      await api.put(`/categories/${categoryId}`, categoryData);
      toast.success('Category updated successfully');
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update category');
      console.error(err);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/categories/${categoryId}`);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
      console.error(err);
    }
  };

  return (
    <div className="categories-page">
      <style>{PAGE_STYLES}</style>
      <AdminSidebar />

      <main className="categories-main">
        <div className="categories-content">

          <h1 className="page-heading">Manage <span>Categories</span></h1>
          <p className="page-sub">Add, edit, and organize your product category tree.</p>

          {loading ? (
            <div className="loading-box"><div className="spinner" /></div>
          ) : (
            <CategoryManager
              categories={categories}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

        </div>
      </main>
    </div>
  );
};

export default ManageCategoriesPage;