import { useState, useRef } from 'react';
import api from '../../api/axios';
import ProductCard from '../../components/product/ProductCard';
import { Sparkles, Upload, X, ScanSearch, Wand2, ImagePlus } from 'lucide-react';

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const VS_STYLE_ID = 'vs-styles';
if (typeof document !== 'undefined' && !document.getElementById(VS_STYLE_ID)) {
  const tag = document.createElement('style');
  tag.id = VS_STYLE_ID;
  tag.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

    .vs-root {
      min-height: 100vh;
      background: #080b1a;
      font-family: 'DM Sans', sans-serif;
      color: #e2e8f0;
      position: relative;
      overflow-x: hidden;
    }

    /* Ambient orbs */
    .vs-orb {
      position: fixed;
      border-radius: 50%;
      pointer-events: none;
      filter: blur(110px);
      z-index: 0;
    }
    .vs-orb-1 {
      width: 550px; height: 550px;
      background: radial-gradient(circle, rgba(109,40,217,0.16) 0%, transparent 65%);
      top: -150px; left: -150px;
    }
    .vs-orb-2 {
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 65%);
      bottom: -80px; right: -80px;
    }

    /* Grid */
    .vs-grid-bg {
      position: fixed; inset: 0; z-index: 0; pointer-events: none;
      background-image:
        linear-gradient(rgba(139,92,246,0.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(139,92,246,0.035) 1px, transparent 1px);
      background-size: 48px 48px;
    }

    .vs-inner {
      position: relative; z-index: 1;
      max-width: 1000px;
      margin: 0 auto;
      padding: 3.5rem 1.5rem 6rem;
    }

    /* ── Header ── */
    .vs-header { text-align: center; margin-bottom: 3rem; }
    .vs-badge {
      display: inline-flex; align-items: center; gap: 0.4rem;
      padding: 0.3rem 0.9rem;
      background: rgba(139,92,246,0.12);
      border: 1px solid rgba(139,92,246,0.28);
      border-radius: 999px;
      font-size: 0.7rem; color: #a78bfa;
      letter-spacing: 0.09em; text-transform: uppercase; font-weight: 500;
      margin-bottom: 1rem;
    }
    .vs-title {
      font-family: 'Syne', sans-serif;
      font-size: clamp(1.8rem, 4vw, 2.75rem);
      font-weight: 800; color: #f1f5f9;
      line-height: 1.1; margin: 0 0 1rem;
    }
    .vs-title span {
      background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .vs-subtitle {
      font-size: 0.95rem; color: #475569;
      max-width: 520px; margin: 0 auto;
      line-height: 1.75; font-weight: 300;
    }

    /* ── How it works chips ── */
    .vs-steps {
      display: flex; flex-wrap: wrap; justify-content: center;
      gap: 0.65rem; margin-top: 1.5rem;
    }
    .vs-step {
      display: flex; align-items: center; gap: 0.4rem;
      padding: 0.3rem 0.85rem;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 8px;
      font-size: 0.74rem; color: #475569;
    }
    .vs-step-num {
      width: 18px; height: 18px; border-radius: 50%;
      background: rgba(139,92,246,0.2);
      border: 1px solid rgba(139,92,246,0.3);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.6rem; color: #a78bfa; font-weight: 700;
      flex-shrink: 0;
    }

    /* ── Upload card ── */
    .vs-card {
      position: relative;
      background: rgba(12,15,30,0.85);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(139,92,246,0.2);
      border-radius: 20px;
      padding: 2.5rem 2rem;
      margin-bottom: 3rem;
      box-shadow: 0 20px 64px rgba(0,0,0,0.45);
    }
    .vs-card::before {
      content: '';
      position: absolute;
      top: 0; left: 15%; right: 15%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(139,92,246,0.55), transparent);
    }

    /* Drop zone */
    .vs-dropzone {
      border: 2px dashed rgba(139,92,246,0.25);
      border-radius: 14px;
      padding: 3rem 2rem;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.25s, background 0.25s;
      background: rgba(139,92,246,0.03);
      position: relative;
    }
    .vs-dropzone:hover,
    .vs-dropzone.drag-over {
      border-color: rgba(139,92,246,0.55);
      background: rgba(139,92,246,0.07);
    }
    .vs-dropzone-icon {
      width: 60px; height: 60px;
      border-radius: 16px;
      background: rgba(139,92,246,0.1);
      border: 1px solid rgba(139,92,246,0.2);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1rem;
      color: #7c3aed;
    }
    .vs-dropzone-title {
      font-family: 'Syne', sans-serif;
      font-size: 1rem; font-weight: 700; color: #e2e8f0;
      margin-bottom: 0.4rem;
    }
    .vs-dropzone-sub { font-size: 0.78rem; color: #334155; font-weight: 300; }
    .vs-browse-label {
      display: inline-flex; align-items: center; gap: 0.4rem;
      margin-top: 1.25rem;
      padding: 0.55rem 1.25rem;
      background: rgba(139,92,246,0.12);
      border: 1px solid rgba(139,92,246,0.28);
      border-radius: 9px;
      font-size: 0.8rem; color: #a78bfa; font-weight: 500;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s;
    }
    .vs-browse-label:hover {
      background: rgba(139,92,246,0.2);
      border-color: rgba(139,92,246,0.45);
    }

    /* Preview area */
    .vs-preview-wrap {
      display: flex; flex-direction: column; align-items: center; gap: 1.25rem;
    }
    .vs-preview-img-wrap {
      position: relative;
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid rgba(139,92,246,0.3);
      box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04);
      max-width: 320px; width: 100%;
    }
    .vs-preview-img { width: 100%; display: block; object-fit: cover; max-height: 280px; }
    .vs-preview-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(8,11,26,0.5) 0%, transparent 50%);
      pointer-events: none;
    }
    .vs-clear-btn {
      position: absolute; top: 0.6rem; right: 0.6rem;
      width: 28px; height: 28px;
      border-radius: 50%;
      background: rgba(8,11,26,0.7);
      border: 1px solid rgba(255,255,255,0.1);
      backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      color: #94a3b8; cursor: pointer;
      transition: color 0.15s, background 0.15s;
    }
    .vs-clear-btn:hover { color: #f87171; background: rgba(239,68,68,0.15); }

    /* Analyse button */
    .vs-analyse-btn {
      display: flex; align-items: center; justify-content: center;
      gap: 0.5rem;
      padding: 0.85rem 2.5rem;
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      border: none; border-radius: 12px;
      color: #fff; font-size: 0.92rem; font-weight: 500;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.2s;
      box-shadow: 0 4px 24px rgba(124,58,237,0.4);
    }
    .vs-analyse-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
    .vs-analyse-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Loading shimmer overlay */
    .vs-analyse-btn.loading {
      background: linear-gradient(135deg, #6d28d9, #4338ca);
      animation: vs-btn-pulse 1.5s ease-in-out infinite;
    }
    @keyframes vs-btn-pulse {
      0%, 100% { box-shadow: 0 4px 24px rgba(124,58,237,0.4); }
      50%       { box-shadow: 0 4px 40px rgba(124,58,237,0.65); }
    }

    /* Spinner */
    .vs-spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: vs-spin 0.7s linear infinite;
      flex-shrink: 0;
    }
    @keyframes vs-spin { to { transform: rotate(360deg); } }

    /* ── Results section ── */
    .vs-results-header {
      display: flex; align-items: center; gap: 0.75rem;
      margin-bottom: 1.75rem;
      animation: vs-fade-up 0.4s ease;
    }
    @keyframes vs-fade-up {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .vs-results-title {
      font-family: 'Syne', sans-serif;
      font-size: 1.3rem; font-weight: 800; color: #f1f5f9; margin: 0;
    }
    .vs-results-count {
      display: inline-flex; align-items: center; gap: 0.35rem;
      padding: 0.2rem 0.65rem;
      background: rgba(139,92,246,0.1);
      border: 1px solid rgba(139,92,246,0.2);
      border-radius: 6px;
      font-size: 0.7rem; color: #a78bfa; font-weight: 500;
    }
    .vs-results-line {
      flex: 1; height: 1px;
      background: linear-gradient(90deg, rgba(139,92,246,0.25), transparent);
    }
    .vs-results-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      animation: vs-fade-up 0.5s ease 0.1s both;
    }
    @media (min-width: 640px)  { .vs-results-grid { grid-template-columns: repeat(3, 1fr); gap: 1.25rem; } }
    @media (min-width: 1024px) { .vs-results-grid { grid-template-columns: repeat(4, 1fr); gap: 1.5rem; } }
  `;
  document.head.appendChild(tag);
}

/* ─── Component ──────────────────────────────────────────────────────────── */
const VisualStylePage = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setProducts([]);
  };

  const handleImageChange = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const clearImage = () => {
    setImage(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview('');
    setProducts([]);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!image) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', image);
      const { data } = await api.post('/visual-style/room', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProducts(data?.data?.products || data?.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vs-root">
      <div className="vs-orb vs-orb-1" />
      <div className="vs-orb vs-orb-2" />
      <div className="vs-grid-bg" />

      <div className="vs-inner">

        {/* ── Header ── */}
        <div className="vs-header">
          <div className="vs-badge"><Sparkles size={10} /> AI-Powered</div>
          <h1 className="vs-title">
            Visual <span>Style</span> Finder
          </h1>
          <p className="vs-subtitle">
            Upload your room, outfit, desk setup, or aesthetic photo and discover perfectly matching products — instantly.
          </p>
          <div className="vs-steps">
            {['Upload a photo', 'AI analyses the style', 'Discover matching products'].map((s, i) => (
              <span key={i} className="vs-step">
                <span className="vs-step-num">{i + 1}</span>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* ── Upload card ── */}
        <div className="vs-card">
          {!preview ? (
            /* Drop zone */
            <div
              className={`vs-dropzone ${dragOver ? 'drag-over' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <div className="vs-dropzone-icon">
                <ImagePlus size={26} />
              </div>
              <p className="vs-dropzone-title">Drop your photo here</p>
              <p className="vs-dropzone-sub">PNG, JPG, WEBP up to 10MB</p>
              <label className="vs-browse-label" onClick={(e) => e.stopPropagation()}>
                <Upload size={13} />
                Browse files
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          ) : (
            /* Preview + analyse */
            <div className="vs-preview-wrap">
              <div className="vs-preview-img-wrap">
                <img src={preview} alt="Preview" className="vs-preview-img" />
                <div className="vs-preview-overlay" />
                <button className="vs-clear-btn" onClick={clearImage} aria-label="Remove image">
                  <X size={13} />
                </button>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`vs-analyse-btn ${loading ? 'loading' : ''}`}
              >
                {loading ? (
                  <><span className="vs-spinner" /> Analysing your style…</>
                ) : (
                  <><Wand2 size={16} /> Find Matching Products</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* ── Results ── */}
        {products.length > 0 && (
          <div>
            <div className="vs-results-header">
              <ScanSearch size={18} color="#7c3aed" />
              <h2 className="vs-results-title">Matching Products</h2>
              <span className="vs-results-count"><Sparkles size={9} /> {products.length} found</span>
              <div className="vs-results-line" />
            </div>

            <div className="vs-results-grid">
              {products.map((item, index) => (
                <ProductCard
                  key={item?.product?._id || item?._id || index}
                  product={item?.product || item}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualStylePage;