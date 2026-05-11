import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, PackagePlus, Tag, Percent } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import SellerSidebar from '../../components/seller/SellerSidebar';
import ProductForm from '../../components/seller/ProductForm';

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const AP_STYLE_ID = 'ap-styles';
if (typeof document !== 'undefined' && !document.getElementById(AP_STYLE_ID)) {
  const tag = document.createElement('style');
  tag.id = AP_STYLE_ID;
  tag.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

    .ap-root {
      min-height: 100vh;
      background: #080b1a;
      font-family: 'DM Sans', sans-serif;
      color: #e2e8f0;
      position: relative;
      overflow-x: hidden;
    }

    /* Ambient orbs */
    .ap-orb {
      position: fixed;
      border-radius: 50%;
      pointer-events: none;
      filter: blur(110px);
      z-index: 0;
    }
    .ap-orb-1 {
      width: 550px; height: 550px;
      background: radial-gradient(circle, rgba(109,40,217,0.16) 0%, transparent 65%);
      top: -150px; left: -150px;
    }
    .ap-orb-2 {
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 65%);
      bottom: -80px; right: -80px;
    }

    /* Grid */
    .ap-grid-bg {
      position: fixed; inset: 0; z-index: 0; pointer-events: none;
      background-image:
        linear-gradient(rgba(139,92,246,0.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(139,92,246,0.035) 1px, transparent 1px);
      background-size: 48px 48px;
    }

    /* Main content wrapper (accounts for sidebar) */
    .ap-main {
      position: relative; z-index: 1;
      margin-left: 256px;
      padding: 3rem 2rem 6rem;
      min-height: 100vh;
    }

    /* ── Header ── */
    .ap-header { margin-bottom: 2.5rem; }
    .ap-badge {
      display: inline-flex; align-items: center; gap: 0.4rem;
      padding: 0.3rem 0.9rem;
      background: rgba(139,92,246,0.12);
      border: 1px solid rgba(139,92,246,0.28);
      border-radius: 999px;
      font-size: 0.7rem; color: #a78bfa;
      letter-spacing: 0.09em; text-transform: uppercase; font-weight: 500;
      margin-bottom: 0.75rem;
    }
    .ap-title {
      font-family: 'Syne', sans-serif;
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 800; color: #f1f5f9;
      line-height: 1.15; margin: 0 0 0.5rem;
    }
    .ap-title span {
      background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .ap-subtitle {
      font-size: 0.88rem; color: #475569;
      font-weight: 300; line-height: 1.7;
    }

    /* ── AI Result banner ── */
    .ap-ai-banner {
      position: relative;
      background: rgba(109,40,217,0.08);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(139,92,246,0.3);
      border-radius: 16px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.75rem;
      animation: ap-fade-up 0.4s ease;
      overflow: hidden;
    }
    .ap-ai-banner::before {
      content: '';
      position: absolute;
      top: 0; left: 10%; right: 10%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent);
    }
    .ap-ai-banner-header {
      display: flex; align-items: center; gap: 0.5rem;
      margin-bottom: 0.85rem;
    }
    .ap-ai-banner-title {
      font-family: 'Syne', sans-serif;
      font-size: 0.85rem; font-weight: 700; color: #c4b5fd;
    }
    .ap-ai-tags { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; }
    .ap-ai-category {
      display: inline-flex; align-items: center; gap: 0.35rem;
      padding: 0.3rem 0.85rem;
      background: rgba(139,92,246,0.2);
      border: 1px solid rgba(139,92,246,0.35);
      border-radius: 999px;
      font-size: 0.78rem; color: #c4b5fd; font-weight: 500;
    }
    .ap-ai-confidence {
      display: inline-flex; align-items: center; gap: 0.3rem;
      font-size: 0.72rem; color: #64748b;
    }
    .ap-ai-tag {
      display: inline-flex; align-items: center;
      padding: 0.2rem 0.65rem;
      background: rgba(59,130,246,0.1);
      border: 1px solid rgba(59,130,246,0.2);
      border-radius: 999px;
      font-size: 0.7rem; color: #93c5fd; font-weight: 500;
    }

    /* ── Main card ── */
    .ap-card {
      position: relative;
      background: rgba(12,15,30,0.85);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(139,92,246,0.2);
      border-radius: 20px;
      padding: 2.5rem 2rem;
      box-shadow: 0 20px 64px rgba(0,0,0,0.45);
    }
    .ap-card::before {
      content: '';
      position: absolute;
      top: 0; left: 15%; right: 15%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(139,92,246,0.55), transparent);
    }

    /* ── Animations ── */
    @keyframes ap-fade-up {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ── Override ProductForm internals to match dark theme ── */
    .ap-card input,
    .ap-card textarea,
    .ap-card select {
      background: rgba(255,255,255,0.04) !important;
      border: 1px solid rgba(139,92,246,0.2) !important;
      border-radius: 10px !important;
      color: #e2e8f0 !important;
      font-family: 'DM Sans', sans-serif !important;
      font-size: 0.88rem !important;
      transition: border-color 0.2s, box-shadow 0.2s !important;
    }
    .ap-card input:focus,
    .ap-card textarea:focus,
    .ap-card select:focus {
      outline: none !important;
      border-color: rgba(139,92,246,0.55) !important;
      box-shadow: 0 0 0 3px rgba(139,92,246,0.1) !important;
    }
    .ap-card input::placeholder,
    .ap-card textarea::placeholder {
      color: #334155 !important;
    }
    .ap-card label {
      color: #94a3b8 !important;
      font-size: 0.8rem !important;
      font-weight: 500 !important;
      letter-spacing: 0.03em !important;
    }
    .ap-card select option {
      background: #0f1220 !important;
      color: #e2e8f0 !important;
    }

    /* Submit button inside ProductForm */
    .ap-card button[type="submit"] {
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
    .ap-card button[type="submit"]:hover:not(:disabled) {
      opacity: 0.9 !important;
      transform: translateY(-1px) !important;
    }
    .ap-card button[type="submit"]:disabled {
      opacity: 0.5 !important;
      cursor: not-allowed !important;
    }

    /* Section dividers inside form */
    .ap-card hr {
      border-color: rgba(139,92,246,0.12) !important;
      margin: 1.5rem 0 !important;
    }

    /* Scrollbar */
    .ap-root ::-webkit-scrollbar { width: 6px; }
    .ap-root ::-webkit-scrollbar-track { background: transparent; }
    .ap-root ::-webkit-scrollbar-thumb {
      background: rgba(139,92,246,0.2);
      border-radius: 3px;
    }
    .ap-root ::-webkit-scrollbar-thumb:hover {
      background: rgba(139,92,246,0.4);
    }
  `;
  document.head.appendChild(tag);
}

/* ─── Component ──────────────────────────────────────────────────────────── */
const AddProductPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const imageFiles = formData.getAll('images');
      let imageUrls = [];

      if (imageFiles.length > 0 && imageFiles[0] instanceof File) {
        const uploadData = new FormData();
        imageFiles.forEach((file) => uploadData.append('images', file));

        const { data: uploadRes } = await api.post('/upload/images', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrls = uploadRes.urls || uploadRes.images || uploadRes.data?.urls || [];
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
      productPayload.images = imageUrls;

      const { data } = await api.post('/products', productPayload);
      const product = data.product || data.data || data;

      if (product.aiCategory || product.aiClassification) {
        setAiResult({
          category: product.aiCategory || product.aiClassification?.category,
          confidence: product.aiConfidence || product.aiClassification?.confidence,
          tags: product.tags || product.aiClassification?.tags || [],
        });
      }

      toast.success('Product created successfully!');
      setTimeout(() => navigate('/seller/products'), 1500);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create product';
      toast.error(message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ap-root">
      {/* Background layers */}
      <div className="ap-orb ap-orb-1" />
      <div className="ap-orb ap-orb-2" />
      <div className="ap-grid-bg" />

      {/* Sidebar */}
      <SellerSidebar />

      {/* Main content */}
      <main className="ap-main">

        {/* ── Header ── */}
        <div className="ap-header">
          <div className="ap-badge">
            <PackagePlus size={10} />
            Seller Dashboard
          </div>
          <h1 className="ap-title">
            Add New <span>Product</span>
          </h1>
          <p className="ap-subtitle">
            Fill in the details below — our AI will automatically classify and tag your product.
          </p>
        </div>

        {/* ── AI Classification Result ── */}
        {aiResult && (
          <div className="ap-ai-banner">
            <div className="ap-ai-banner-header">
              <Sparkles size={14} color="#a78bfa" />
              <span className="ap-ai-banner-title">AI Classification Result</span>
            </div>
            <div className="ap-ai-tags">
              {aiResult.category && (
                <span className="ap-ai-category">
                  <Tag size={11} />
                  {aiResult.category}
                </span>
              )}
              {aiResult.confidence && (
                <span className="ap-ai-confidence">
                  <Percent size={10} />
                  {Math.round(aiResult.confidence * 100)}% confidence
                </span>
              )}
              {aiResult.tags?.map((tag, i) => (
                <span key={i} className="ap-ai-tag">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* ── Form Card ── */}
        <div className="ap-card">
          <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

      </main>
    </div>
  );
};

export default AddProductPage;