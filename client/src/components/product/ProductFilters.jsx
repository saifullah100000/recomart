import { useState, useEffect } from 'react';
import { Star, SlidersHorizontal, X } from 'lucide-react';
import api from '../../api/axios';
import { SORT_OPTIONS } from '../../utils/constants';

const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#f0eeff',
  borderRadius: '10px',
};

const inputFocus = (e) => {
  e.currentTarget.style.border = '1px solid rgba(124,58,237,0.5)';
  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)';
};

const inputBlur = (e) => {
  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)';
  e.currentTarget.style.boxShadow = 'none';
};

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
};

const SectionLabel = ({ children }) => (
  <label
    className="block text-xs font-semibold uppercase tracking-widest mb-2"
    style={{ color: '#6b7280' }}
  >
    {children}
  </label>
);

const ProductFilters = ({ filters = {}, onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [localFilters, setLocalFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    brand: '',
    sort: 'newest',
    ...filters,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data.categories || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setLocalFilters((prev) => ({ ...prev, ...filters }));
  }, [filters]);

  const handleChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    const cleanedFilters = {};
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        cleanedFilters[key] = value;
      }
    });
    onFilterChange(cleanedFilters);
  };

  const handleClear = () => {
    const cleared = {
      category: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      brand: '',
      sort: 'newest',
    };
    setLocalFilters(cleared);
    onFilterChange({});
  };

  const renderStarButtons = () =>
    [5, 4, 3, 2, 1].map((star) => {
      const isActive = localFilters.rating === star;
      return (
        <button
          key={star}
          onClick={() => handleChange('rating', isActive ? '' : star)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all duration-200"
          style={
            isActive
              ? {
                  background: 'rgba(250,204,21,0.12)',
                  border: '1px solid rgba(250,204,21,0.4)',
                  color: '#facc15',
                }
              : {
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#9ca3af',
                }
          }
          onMouseEnter={(e) => {
            if (!isActive) {
              e.currentTarget.style.borderColor = 'rgba(250,204,21,0.3)';
              e.currentTarget.style.color = '#fde68a';
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = '#9ca3af';
            }
          }}
        >
          {[...Array(star)].map((_, i) => (
            <Star
              key={i}
              className="w-3.5 h-3.5"
              style={{
                fill: isActive ? '#facc15' : '#6b7280',
                color: isActive ? '#facc15' : '#6b7280',
              }}
            />
          ))}
          <span className="ml-1 text-xs font-medium">& Up</span>
        </button>
      );
    });

  const inputCls = 'w-full px-3 py-2 text-sm outline-none transition-all duration-200';

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" style={{ color: '#a78bfa' }} />
          <h3 className="font-extrabold tracking-tight" style={{ color: '#f0eeff' }}>
            Filters
          </h3>
        </div>
        <button
          onClick={handleClear}
          className="flex items-center gap-1 text-xs font-semibold transition-all duration-200"
          style={{ color: '#6b7280' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; }}
        >
          <X className="w-3.5 h-3.5" />
          Clear All
        </button>
      </div>

      <div className="space-y-5">

        {/* Divider helper */}
        {[
          /* CATEGORY */
          <div key="category">
            <SectionLabel>Category</SectionLabel>
            <select
              value={localFilters.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className={inputCls}
              style={selectStyle}
              onFocus={inputFocus}
              onBlur={inputBlur}
            >
              <option value="" style={{ background: '#1a1535' }}>All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.slug} style={{ background: '#1a1535' }}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>,

          /* PRICE RANGE */
          <div key="price">
            <SectionLabel>Price Range</SectionLabel>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={localFilters.minPrice}
                onChange={(e) => handleChange('minPrice', e.target.value)}
                className={inputCls}
                style={inputStyle}
                onFocus={inputFocus}
                onBlur={inputBlur}
                min="0"
              />
              <span style={{ color: '#4b5563', flexShrink: 0 }}>—</span>
              <input
                type="number"
                placeholder="Max"
                value={localFilters.maxPrice}
                onChange={(e) => handleChange('maxPrice', e.target.value)}
                className={inputCls}
                style={inputStyle}
                onFocus={inputFocus}
                onBlur={inputBlur}
                min="0"
              />
            </div>
          </div>,

          /* RATING */
          <div key="rating">
            <SectionLabel>Rating</SectionLabel>
            <div className="flex flex-wrap gap-2">{renderStarButtons()}</div>
          </div>,

          /* BRAND */
          <div key="brand">
            <SectionLabel>Brand</SectionLabel>
            <input
              type="text"
              placeholder="Search brand…"
              value={localFilters.brand}
              onChange={(e) => handleChange('brand', e.target.value)}
              className={inputCls}
              style={inputStyle}
              onFocus={inputFocus}
              onBlur={inputBlur}
            />
          </div>,

          /* SORT */
          <div key="sort">
            <SectionLabel>Sort By</SectionLabel>
            <select
              value={localFilters.sort}
              onChange={(e) => handleChange('sort', e.target.value)}
              className={inputCls}
              style={selectStyle}
              onFocus={inputFocus}
              onBlur={inputBlur}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value} style={{ background: '#1a1535' }}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>,
        ].reduce((acc, el, i, arr) => {
          acc.push(el);
          if (i < arr.length - 1) {
            acc.push(
              <div
                key={`divider-${i}`}
                style={{ height: 1, background: 'rgba(255,255,255,0.06)' }}
              />
            );
          }
          return acc;
        }, [])}

        {/* Apply Button */}
        <button
          onClick={handleApply}
          className="w-full text-sm font-semibold py-2.5 rounded-xl transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            color: '#ffffff',
            boxShadow: '0 4px 15px rgba(124,58,237,0.4)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(124,58,237,0.6)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(124,58,237,0.4)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;