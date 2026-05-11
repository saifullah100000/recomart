import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pencil, Trash2, Plus, ChevronRight, FolderOpen, Sparkles, FolderTree } from 'lucide-react';

const CategoryManager = ({ categories, onAdd, onEdit, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [expandedIds, setExpandedIds] = useState(new Set());

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { name: '', description: '', parent: '' } });

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    setValue: setEditValue,
    formState: { errors: editErrors },
  } = useForm();

  const onAddSubmit = (data) => { onAdd && onAdd(data); reset(); };

  const startEdit = (category) => {
    setEditingId(category._id || category.id);
    setEditValue('name', category.name);
    setEditValue('description', category.description || '');
    setEditValue('parent', category.parent || '');
  };

  const onEditSubmit = (data) => { onEdit && onEdit(editingId, data); setEditingId(null); resetEdit(); };
  const cancelEdit = () => { setEditingId(null); resetEdit(); };

  const toggleExpand = (id) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const buildTree = (items) => {
    const map = {};
    const roots = [];
    items.forEach((item) => { map[item._id || item.id] = { ...item, children: [] }; });
    items.forEach((item) => {
      const id = item._id || item.id;
      const parentId = item.parent?._id || item.parent;
      if (parentId && map[parentId]) map[parentId].children.push(map[id]);
      else roots.push(map[id]);
    });
    return roots;
  };

  const tree = categories ? buildTree(categories) : [];

  const renderCategory = (category, depth = 0) => {
    const catId = category._id || category.id;
    const isEditing = editingId === catId;
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedIds.has(catId);

    return (
      <div key={catId}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        `}</style>
        <div
          className="cat-row"
          style={{ paddingLeft: `${20 + depth * 28}px` }}
        >
          <button
            className={`expand-btn ${hasChildren ? 'visible' : 'invisible'}`}
            onClick={() => hasChildren && toggleExpand(catId)}
            type="button"
          >
            <ChevronRight
              size={14}
              style={{
                transform: isExpanded ? 'rotate(90deg)' : 'none',
                transition: 'transform 0.2s ease',
                color: 'rgba(167,139,250,0.5)'
              }}
            />
          </button>

          <div className="folder-icon-wrap" style={{ marginLeft: depth > 0 ? 0 : 0 }}>
            <FolderOpen size={14} style={{ color: depth === 0 ? '#7c3aed' : 'rgba(167,139,250,0.5)' }} />
          </div>

          {isEditing ? (
            <form onSubmit={handleEditSubmit(onEditSubmit)} className="edit-form">
              <input
                {...registerEdit('name', { required: true })}
                className="theme-input"
                placeholder="Category name"
              />
              <input
                {...registerEdit('description')}
                className="theme-input"
                placeholder="Description"
              />
              <button type="submit" className="btn-save">Save</button>
              <button type="button" onClick={cancelEdit} className="btn-cancel">Cancel</button>
            </form>
          ) : (
            <>
              <div className="cat-info">
                <span className="cat-name">{category.name}</span>
                {category.description && (
                  <span className="cat-desc">{category.description}</span>
                )}
                {hasChildren && (
                  <span className="child-badge">{category.children.length}</span>
                )}
              </div>
              <div className="cat-actions">
                <button onClick={() => startEdit(category)} className="action-btn edit-btn" title="Edit">
                  <Pencil size={13} />
                </button>
                <button onClick={() => onDelete && onDelete(catId)} className="action-btn delete-btn" title="Delete">
                  <Trash2 size={13} />
                </button>
              </div>
            </>
          )}
        </div>
        {hasChildren && isExpanded &&
          category.children.map((child) => renderCategory(child, depth + 1))}
      </div>
    );
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .cat-manager {
          font-family: 'Outfit', sans-serif;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ── Add Form Card ── */
        .add-card {
          background: linear-gradient(135deg, #110f22 0%, #0e0c1e 100%);
          border: 1px solid rgba(139, 92, 246, 0.18);
          border-radius: 16px;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        .add-card::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 180px; height: 180px;
          background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #a78bfa;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 18px;
        }

        .card-title-icon {
          width: 28px; height: 28px;
          background: rgba(124,58,237,0.2);
          border: 1px solid rgba(139,92,246,0.25);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: #7c3aed;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }

        @media (max-width: 768px) {
          .form-grid { grid-template-columns: 1fr; }
        }

        .theme-input {
          width: 100%;
          padding: 10px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(139,92,246,0.18);
          border-radius: 10px;
          color: #e2e0f0;
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          outline: none;
          transition: all 0.2s ease;
        }

        .theme-input::placeholder { color: rgba(167,139,250,0.35); }

        .theme-input:focus {
          border-color: rgba(124,58,237,0.5);
          background: rgba(124,58,237,0.06);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.08);
        }

        select.theme-input option {
          background: #1a1730;
          color: #e2e0f0;
        }

        .error-msg {
          color: #f87171;
          font-size: 11px;
          margin-top: 4px;
        }

        .btn-add {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          border: none;
          border-radius: 10px;
          color: #ffffff;
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 16px rgba(124,58,237,0.3);
        }

        .btn-add:hover {
          background: linear-gradient(135deg, #6d28d9, #5b21b6);
          box-shadow: 0 6px 20px rgba(124,58,237,0.4);
          transform: translateY(-1px);
        }

        /* ── Tree Card ── */
        .tree-card {
          background: linear-gradient(135deg, #110f22 0%, #0e0c1e 100%);
          border: 1px solid rgba(139, 92, 246, 0.18);
          border-radius: 16px;
          overflow: hidden;
        }

        .tree-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(139,92,246,0.1);
        }

        .tree-header-icon {
          width: 30px; height: 30px;
          background: rgba(124,58,237,0.15);
          border: 1px solid rgba(139,92,246,0.2);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: #7c3aed;
        }

        .tree-header-title {
          font-size: 13px;
          font-weight: 600;
          color: #a78bfa;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .tree-count {
          margin-left: auto;
          font-size: 11px;
          color: rgba(167,139,250,0.4);
          background: rgba(124,58,237,0.1);
          border: 1px solid rgba(139,92,246,0.15);
          border-radius: 20px;
          padding: 2px 10px;
        }

        /* ── Category Row ── */
        .cat-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(139,92,246,0.06);
          transition: background 0.15s ease;
          position: relative;
        }

        .cat-row:last-child { border-bottom: none; }

        .cat-row:hover {
          background: rgba(124,58,237,0.05);
        }

        .expand-btn {
          width: 20px; height: 20px;
          display: flex; align-items: center; justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          flex-shrink: 0;
          border-radius: 4px;
          transition: background 0.15s ease;
        }

        .expand-btn:hover { background: rgba(124,58,237,0.12); }
        .expand-btn.invisible { visibility: hidden; pointer-events: none; }

        .folder-icon-wrap {
          width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(124,58,237,0.08);
          border-radius: 7px;
          flex-shrink: 0;
        }

        .cat-info {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }

        .cat-name {
          font-size: 13px;
          font-weight: 500;
          color: #ddd6fe;
        }

        .cat-desc {
          font-size: 11px;
          color: rgba(167,139,250,0.4);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .child-badge {
          font-size: 10px;
          font-weight: 600;
          color: #7c3aed;
          background: rgba(124,58,237,0.15);
          border: 1px solid rgba(124,58,237,0.25);
          border-radius: 20px;
          padding: 1px 8px;
          flex-shrink: 0;
        }

        .cat-actions {
          display: flex;
          align-items: center;
          gap: 4px;
          opacity: 0;
          transition: opacity 0.15s ease;
        }

        .cat-row:hover .cat-actions { opacity: 1; }

        .action-btn {
          width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center;
          border: none;
          border-radius: 7px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .edit-btn {
          background: rgba(124,58,237,0.1);
          color: #a78bfa;
        }
        .edit-btn:hover {
          background: rgba(124,58,237,0.22);
          color: #c4b5fd;
        }

        .delete-btn {
          background: rgba(239,68,68,0.08);
          color: rgba(248,113,113,0.7);
        }
        .delete-btn:hover {
          background: rgba(239,68,68,0.18);
          color: #f87171;
        }

        /* ── Edit Form (inline) ── */
        .edit-form {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .edit-form .theme-input { flex: 1; min-width: 100px; }

        .btn-save {
          padding: 7px 14px;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          border: none;
          border-radius: 8px;
          color: #fff;
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }
        .btn-save:hover { opacity: 0.85; }

        .btn-cancel {
          padding: 7px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(139,92,246,0.15);
          border-radius: 8px;
          color: rgba(167,139,250,0.6);
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }
        .btn-cancel:hover { background: rgba(124,58,237,0.08); color: #a78bfa; }

        /* ── Empty State ── */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 56px 24px;
          gap: 10px;
        }

        .empty-icon {
          width: 52px; height: 52px;
          background: rgba(124,58,237,0.1);
          border: 1px solid rgba(139,92,246,0.2);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          color: rgba(124,58,237,0.5);
          margin-bottom: 6px;
        }

        .empty-title {
          font-size: 15px;
          font-weight: 600;
          color: rgba(167,139,250,0.5);
        }

        .empty-sub {
          font-size: 12px;
          color: rgba(167,139,250,0.3);
        }
      `}</style>

      <div className="cat-manager">
        {/* Add Form */}
        <div className="add-card">
          <div className="card-title">
            <div className="card-title-icon"><Plus size={14} /></div>
            Add New Category
          </div>
          <form onSubmit={handleSubmit(onAddSubmit)}>
            <div className="form-grid">
              <div>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="theme-input"
                  placeholder="Category name"
                />
                {errors.name && <p className="error-msg">{errors.name.message}</p>}
              </div>
              <div>
                <input
                  {...register('description')}
                  className="theme-input"
                  placeholder="Description (optional)"
                />
              </div>
              <div>
                <select {...register('parent')} className="theme-input">
                  <option value="">No parent (top-level)</option>
                  {categories && categories.map((cat) => (
                    <option key={cat._id || cat.id} value={cat._id || cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="btn-add">
              <Plus size={15} />
              Add Category
            </button>
          </form>
        </div>

        {/* Tree */}
        <div className="tree-card">
          <div className="tree-header">
            <div className="tree-header-icon"><FolderTree size={15} /></div>
            <span className="tree-header-title">Category Tree</span>
            {categories && (
              <span className="tree-count">{categories.length} total</span>
            )}
          </div>

          {tree.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><FolderOpen size={24} /></div>
              <p className="empty-title">No categories yet</p>
              <p className="empty-sub">Add your first category above.</p>
            </div>
          ) : (
            tree.map((category) => renderCategory(category))
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryManager;