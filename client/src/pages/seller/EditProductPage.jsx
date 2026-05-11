import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PencilLine, AlertCircle } from 'lucide-react';
import api from '../../api/axios';
import SellerSidebar from '../../components/seller/SellerSidebar';
import ProductForm from '../../components/seller/ProductForm';

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const EP_STYLE_ID = 'ep-styles';
if (typeof document !== 'undefined' && !document.getElementById(EP_STYLE_ID)) {
  const tag = document.createElement('style');
  tag.id = EP_STYLE_ID;
  tag.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

    .ep-root {
      min-height: 100vh;
      background: #080b1a;
      font-family: 'DM Sans', sans-serif;
      color: #e2e8f0;
      position: relative;
      overflow-x: hidden;
    }

    /* Ambient orbs */
    .ep-orb {
      position: fixed;
      border-radius: 50%;
      pointer-events: none;
      filter: blur(110px);
      z-index: 0;
    }
    .ep-orb-1 {
      width: 550px; height: 550px;
      background: radial-gradient(circle, rgba(109,40,217,0.16) 0%, transparent 65%);
      top: -150px; left: -150px;
    }
    .ep-orb-2 {
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 65%);
      bottom: -80px; right: -80px;
    }

    /* Grid */
    .ep-grid-bg {
      position: fixed; inset: 0; z-index: 0; pointer-events: none;
      background-image:
        linear-gradient(rgba(139,92,246,0.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(139,92,246,0.035) 1px, transparent 1px);
      background-size: 48px 48px;
    }

    /* Main */
    .ep-main {
      position: relative; z-index: 1;
      margin-left: 256px;
      padding: 3rem 2rem 6rem;
      min-height: 100vh;
    }

    /* ── Header ── */
    .ep-header { margin-bottom: 2.5rem; }
    .ep-badge {
      display: inline-flex; align-items: center; gap: 0.4rem;
      padding: 0.3rem 0.9rem;
      background: rgba(139,92,246,0.12);
      border: 1px solid rgba(139,92,246,0.28);
      border-radius: 999px;
      font-size: 0.7rem; color: #a78bfa;
      letter-spacing: 0.09em; text-transform: uppercase; font-weight: 500;
      margin-bottom: 0.75rem;
    }
    .ep-title {
      font-family: 'Syne', sans-serif;
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 800; color: #f1f5f9;
      line-height: 1.15; margin: 0 0 0.5rem;
    }
    .ep-title span {
      background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .ep-subtitle {
      font-size: 0.88rem; color: #475569;
      font-weight: 300; line-height: 1.7;
    }

    /* ── Loading state ── */
    .ep-loading-wrap {
      display: flex; align-items: center; justify-content: center;
      height: 60vh;
    }
    .ep-spinner {
      width: 44px; height: 44px;
      border: 3px solid rgba(139,92,246,0.15);
      border-top-color: #7c3aed;
      border-radius: 50%;
      animation: ep-spin 0.8s linear infinite;
    }
    @keyframes ep-spin { to { transform: rotate(360deg); } }

    /* ── Not found state ── */
    .ep-not-found {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; gap: 1rem;
      height: 50vh;
      text-align: center;
    }
    .ep-not-found-icon {
      width: 64px; height: 64px;
      border-radius: 18px;
      background: rgba(239,68,68,0.08);
      border: 1px solid rgba(239,68,68,0.2);
      display: flex; align-items: center; justify-content: center;
      color: #f87171;
    }
    .ep-not-found-title {
      font-family: 'Syne', sans-serif;
      font-size: 1.1rem; font-weight: 700; color: #f1f5f9;
    }
    .ep-not-found-sub {
      font-size: 0.83rem; color: #475569; font-weight: 300;
    }

    /* ── Main card ── */
    .ep-card {
      position: relative;
      background: rgba(12,15,30,0.85);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(139,92,246,0.2);
      border-radius: 20px;
      padding: 2.5rem 2rem;
      box-shadow: 0 20px 64px rgba(0,0,0,0.45);
      animation: ep-fade-up 0.4s ease;
    }
    .ep-card::before {
      content: '';
      position: absolute;
      top: 0; left: 15%; right: 15%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(139,92,246,0.55), transparent);
    }

    @keyframes ep-fade-up {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ── ProductForm overrides ── */
    .ep-card input,
    .ep-card textarea,
    .ep-card select {
      background: rgba(255,255,255,0.04) !important;
      border: 1px solid rgba(139,92,246,0.2) !important;
      border-radius: 10px !important;
      color: #e2e8f0 !important;
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.88rem !important;
      transition: border-color 0.2s, box-shadow 0.2s !important;
    }
    .ep-card input:focus,
    .ep-card textarea:focus,
    .ep-card select:focus {
      outline: none !important;
      border-color: rgba(139,92,246,0.55) !important;
      box-shadow: 0 0 0 3px rgba(139,92,246,0.1) !important;
    }
    .ep-card input::placeholder,
    .ep-card textarea::placeholder {
      color: #334155 !important;
    }
    .ep-card label {
      color: #94a3b8 !important;
      font-size: 0.8rem !important;
      font-weight: 500 !important;
      letter-spacing: 0.03em !important;
    }
    .ep-card select option {
      background: #0f1220 !important;
      color: #e2e8f0 !important;
    }
    .ep-card button[type="submit"] {
      background: linear-gradient(135deg, #7c3aed, #4f46e5) !important;
      border: none !important;
      border-radius: 12px !important;
      color: #fff !important;
      font-family: 'DM Sans', sans-serif !important;
      font-weight: 500 !important;
      font-size: 0.92rem !important;
      padding: 0.85rem 2rem !important;
      cursor: pointer !important;
      transition: opacity 0.2s, transform 0.2s !important;
      box-shadow: 0 4px 24px rgba(124,58,237,0.4) !important;
    }
    .ep-card button[type="submit"]:hover:not(:disabled) {
      opacity: 0.9 !important;
      transform: translateY(-1px) !important;
    }
    .ep-card button[type="submit"]:disabled {
      opacity: 0.5 !important;
      cursor: not-allowed !important;
    }
    .ep-card hr {
      border-color: rgba(139,92,246,0.12) !important;
      margin: 1.5rem 0 !important;
    }

    /* Scrollbar */
    .ep-root ::-webkit-scrollbar { width: 6px; }
    .ep-root ::-webkit-scrollbar-track { background: transparent; }
    .ep-root ::-webkit-scrollbar-thumb {
      background: rgba(139,92,246,0.2);
      border-radius: 3px;
    }
    .ep-root ::-webkit-scrollbar-thumb:hover {
      background: rgba(139,92,246,0.4);
    }
  `;
  document.head.appendChild(tag);
}

/* ─── Component ──────────────────────────────────────────────────────────── */
const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product || data.data || data);
      } catch (err) {
        toast.error('Failed to load product');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const imageFiles = formData.getAll('images');
      let newImageUrls = [];

      if (imageFiles.length > 0 && imageFiles[0] instanceof File) {
        const uploadData = new FormData();
        imageFiles.forEach((file) => uploadData.append('images', file));

        const { data: uploadRes } = await api.post('/upload/images', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        newImageUrls = uploadRes.urls || uploadRes.images || uploadRes.data?.urls || [];
      }

      const productPayload = {};
      for (const [key, value] of formData.entries()) {
        if (key === 'images') continue;
        if (key === 'specifications') {
          productPayload[key] = JSON.parse(value);
        } else {
          productPayload[key] = value;
        }
      }

      const existingImages = product?.images
        ? product.images.map((img) => (typeof img === 'string' ? img : img.url))
        : [];
      productPayload.images = [...existingImages, ...newImageUrls];

      await api.put(`/products/${id}`, productPayload);
      toast.success('Product updated successfully!');
      navigate('/seller/products');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update product';
      toast.error(message);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="ep-root">
        <div className="ep-orb ep-orb-1" />
        <div className="ep-orb ep-orb-2" />
        <div className="ep-grid-bg" />
        <SellerSidebar />
        <main className="ep-main">
          <div className="ep-loading-wrap">
            <div className="ep-spinner" />
          </div>
        </main>
      </div>
    );
  }

  /* ── Not found ── */
  if (!product) {
    return (
      <div className="ep-root">
        <div className="ep-orb ep-orb-1" />
        <div className="ep-orb ep-orb-2" />
        <div className="ep-grid-bg" />
        <SellerSidebar />
        <main className="ep-main">
          <div className="ep-not-found">
            <div className="ep-not-found-icon">
              <AlertCircle size={28} />
            </div>
            <p className="ep-not-found-title">Product Not Found</p>
            <p className="ep-not-found-sub">This product may have been removed or doesn't exist.</p>
          </div>
        </main>
      </div>
    );
  }

  /* ── Main ── */
  return (
    <div className="ep-root">
      <div className="ep-orb ep-orb-1" />
      <div className="ep-orb ep-orb-2" />
      <div className="ep-grid-bg" />

      <SellerSidebar />

      <main className="ep-main">

        {/* ── Header ── */}
        <div className="ep-header">
          <div className="ep-badge">
            <PencilLine size={10} />
            Seller Dashboard
          </div>
          <h1 className="ep-title">
            Edit <span>Product</span>
          </h1>
          <p className="ep-subtitle">
            Update your product details below. Changes will be reflected immediately after saving.
          </p>
        </div>

        {/* ── Form Card ── */}
        <div className="ep-card">
          <ProductForm
            initialData={product}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
          />
        </div>

      </main>
    </div>
  );
};

export default EditProductPage;