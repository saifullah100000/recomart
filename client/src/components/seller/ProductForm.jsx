import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Upload, Loader2, Sparkles, X } from 'lucide-react';
import api from '../../api/axios';

const productSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be positive'),
  compareAtPrice: z.coerce.number().positive().optional().or(z.literal('')),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().min(1, 'Brand is required'),
  stockQuantity: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  specifications: z.array(
    z.object({
      key: z.string().min(1, 'Key is required'),
      value: z.string().min(1, 'Value is required'),
    })
  ),
});

/* ── shared style helpers ── */
const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#f0eeff',
  borderRadius: '10px',
};
const onFocus = (e) => {
  e.currentTarget.style.border = '1px solid rgba(124,58,237,0.5)';
  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)';
};
const onBlur = (e) => {
  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)';
  e.currentTarget.style.boxShadow = 'none';
};
const inputCls = 'w-full px-4 py-2.5 text-sm outline-none transition-all duration-200';
const labelCls = 'block text-xs font-semibold uppercase tracking-widest mb-1.5';

const FieldLabel = ({ children }) => (
  <label className={labelCls} style={{ color: '#6b7280' }}>{children}</label>
);
const FieldError = ({ msg }) =>
  msg ? <p className="text-xs mt-1" style={{ color: '#f87171' }}>{msg}</p> : null;

/* register helper – merges dark styles with react-hook-form ref */
const styledInput = (regProps) => ({
  ...regProps,
  className: inputCls,
  style: inputStyle,
  onFocus,
  onBlur,
});

const ProductForm = ({ initialData, onSubmit, isLoading }) => {
  const [categories, setCategories] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
      ? {
          title: initialData.title || '',
          description: initialData.description || '',
          price: initialData.price || '',
          compareAtPrice: initialData.compareAtPrice || '',
          category: initialData.category || '',
          brand: initialData.brand || '',
          stockQuantity: initialData.stockQuantity || 0,
          specifications: initialData.specifications || [],
        }
      : {
          title: '', description: '', price: '', compareAtPrice: '',
          category: '', brand: '', stockQuantity: 0, specifications: [],
        },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'specifications' });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data.categories || data || []);
      } catch (err) {
        console.error('Failed to fetch categories', err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialData?.images) {
      setImagePreviews(initialData.images.map((img) => (typeof img === 'string' ? img : img.url)));
    }
  }, [initialData]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (imagePreviews.length + files.length > 5) { alert('Maximum 5 images allowed'); return; }
    setImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'specifications') formData.append(key, JSON.stringify(value));
      else if (value !== '' && value !== undefined) formData.append(key, value);
    });
    imageFiles.forEach((file) => formData.append('images', file));
    onSubmit(formData);
  };

  /* section divider */
  const Divider = () => (
    <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
  );

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">

      {/* AI Classification Badge */}
      {initialData?.aiCategory && (
        <div
          className="flex items-center gap-2 p-3 rounded-xl"
          style={{
            background: 'rgba(124,58,237,0.1)',
            border: '1px solid rgba(124,58,237,0.3)',
          }}
        >
          <Sparkles size={16} style={{ color: '#a78bfa' }} />
          <span className="text-sm font-semibold" style={{ color: '#c4b5fd' }}>
            AI Classification: {initialData.aiCategory}
          </span>
          {initialData.aiConfidence && (
            <span
              className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{
                background: 'rgba(124,58,237,0.2)',
                color: '#a78bfa',
                border: '1px solid rgba(124,58,237,0.3)',
              }}
            >
              {Math.round(initialData.aiConfidence * 100)}% confidence
            </span>
          )}
        </div>
      )}

      {/* Auto-generated Tags */}
      {initialData?.tags && initialData.tags.length > 0 && (
        <div>
          <FieldLabel>Auto-Generated Tags</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {initialData.tags.map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full"
                style={{
                  background: 'rgba(59,130,246,0.12)',
                  color: '#60a5fa',
                  border: '1px solid rgba(59,130,246,0.25)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <Divider />

      {/* Title */}
      <div>
        <FieldLabel>Title</FieldLabel>
        <input type="text" {...styledInput(register('title'))} placeholder="Product title" />
        <FieldError msg={errors.title?.message} />
      </div>

      {/* Description */}
      <div>
        <FieldLabel>Description</FieldLabel>
        <textarea
          {...styledInput(register('description'))}
          rows={4}
          placeholder="Product description"
          style={{ ...inputStyle, resize: 'vertical' }}
        />
        <FieldError msg={errors.description?.message} />
      </div>

      <Divider />

      {/* Price & Compare At Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Price</FieldLabel>
          <input type="number" step="0.01" {...styledInput(register('price'))} placeholder="0.00" />
          <FieldError msg={errors.price?.message} />
        </div>
        <div>
          <FieldLabel>Compare At Price (optional)</FieldLabel>
          <input type="number" step="0.01" {...styledInput(register('compareAtPrice'))} placeholder="0.00" />
          <FieldError msg={errors.compareAtPrice?.message} />
        </div>
      </div>

      {/* Category & Brand */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Category</FieldLabel>
          <select {...styledInput(register('category'))} style={{ ...inputStyle, cursor: 'pointer' }}>
            <option value="" style={{ background: '#1a1535' }}>Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id || cat.id} value={cat._id || cat.id} style={{ background: '#1a1535' }}>
                {cat.name}
              </option>
            ))}
          </select>
          <FieldError msg={errors.category?.message} />
        </div>
        <div>
          <FieldLabel>Brand</FieldLabel>
          <input type="text" {...styledInput(register('brand'))} placeholder="Brand name" />
          <FieldError msg={errors.brand?.message} />
        </div>
      </div>

      {/* Stock Quantity */}
      <div>
        <FieldLabel>Stock Quantity</FieldLabel>
        <input type="number" {...styledInput(register('stockQuantity'))} placeholder="0" />
        <FieldError msg={errors.stockQuantity?.message} />
      </div>

      <Divider />

      {/* Specifications */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <FieldLabel>Specifications</FieldLabel>
          <button
            type="button"
            onClick={() => append({ key: '', value: '' })}
            className="inline-flex items-center gap-1 text-xs font-semibold transition-all duration-200"
            style={{ color: '#a78bfa' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#c4b5fd'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#a78bfa'; }}
          >
            <Plus size={14} />
            Add Row
          </button>
        </div>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <input
                {...styledInput(register(`specifications.${index}.key`))}
                placeholder="Key (e.g. Weight)"
              />
              <input
                {...styledInput(register(`specifications.${index}.value`))}
                placeholder="Value (e.g. 1.5kg)"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-2 rounded-lg transition-all duration-200 flex-shrink-0"
                style={{ color: '#4b5563', background: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#f87171';
                  e.currentTarget.style.background = 'rgba(239,68,68,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#4b5563';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {fields.length === 0 && (
            <p className="text-sm italic" style={{ color: '#4b5563' }}>
              No specifications added yet.
            </p>
          )}
        </div>
      </div>

      <Divider />

      {/* Images */}
      <div>
        <FieldLabel>Images (max 5)</FieldLabel>
        <div className="flex flex-wrap gap-3">
          {imagePreviews.map((src, index) => (
            <div
              key={index}
              className="relative w-24 h-24 rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-0.5 rounded-full transition-all duration-200"
                style={{ background: 'rgba(239,68,68,0.85)', color: '#fff' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.85)'; }}
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {imagePreviews.length < 5 && (
            <label
              className="w-24 h-24 flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all duration-200"
              style={{
                border: '2px dashed rgba(124,58,237,0.3)',
                background: 'rgba(124,58,237,0.05)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(124,58,237,0.6)';
                e.currentTarget.style.background = 'rgba(124,58,237,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)';
                e.currentTarget.style.background = 'rgba(124,58,237,0.05)';
              }}
            >
              <Upload size={18} style={{ color: '#a78bfa' }} />
              <span className="text-xs mt-1" style={{ color: '#a78bfa' }}>Upload</span>
              <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200"
        style={{
          background: isLoading
            ? 'rgba(124,58,237,0.3)'
            : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
          color: '#ffffff',
          boxShadow: isLoading ? 'none' : '0 4px 15px rgba(124,58,237,0.4)',
          cursor: isLoading ? 'not-allowed' : 'pointer',
        }}
        onMouseEnter={(e) => {
          if (!isLoading) e.currentTarget.style.boxShadow = '0 6px 24px rgba(124,58,237,0.6)';
        }}
        onMouseLeave={(e) => {
          if (!isLoading) e.currentTarget.style.boxShadow = '0 4px 15px rgba(124,58,237,0.4)';
        }}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Saving…
          </>
        ) : (
          <>{initialData ? 'Update Product' : 'Create Product'}</>
        )}
      </button>
    </form>
  );
};

export default ProductForm;