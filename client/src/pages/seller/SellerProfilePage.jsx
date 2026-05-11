import React, { useState, useEffect } from 'react';
import { Upload, Loader2, Store, CreditCard, Sparkles, ImagePlus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import SellerSidebar from '../../components/seller/SellerSidebar';

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const SPR_STYLE_ID = 'spr-styles';
if (typeof document !== 'undefined' && !document.getElementById(SPR_STYLE_ID)) {
  const tag = document.createElement('style');
  tag.id = SPR_STYLE_ID;
  tag.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

    .spr-root {
      min-height: 100vh;
      background: #080b1a;
      font-family: 'DM Sans', sans-serif;
      color: #e2e8f0;
      position: relative;
      overflow-x: hidden;
    }

    /* Orbs */
    .spr-orb {
      position: fixed; border-radius: 50%;
      pointer-events: none; filter: blur(110px); z-index: 0;
    }
    .spr-orb-1 {
      width: 550px; height: 550px;
      background: radial-gradient(circle, rgba(109,40,217,0.16) 0%, transparent 65%);
      top: -150px; left: -150px;
    }
    .spr-orb-2 {
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 65%);
      bottom: -80px; right: -80px;
    }

    /* Grid */
    .spr-grid-bg {
      position: fixed; inset: 0; z-index: 0; pointer-events: none;
      background-image:
        linear-gradient(rgba(139,92,246,0.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(139,92,246,0.035) 1px, transparent 1px);
      background-size: 48px 48px;
    }

    /* Main */
    .spr-main {
      position: relative; z-index: 1;
      margin-left: 256px;
      padding: 3rem 2rem 6rem;
      min-height: 100vh;
    }

    /* ── Header ── */
    .spr-header { margin-bottom: 2.5rem; }
    .spr-badge {
      display: inline-flex; align-items: center; gap: 0.4rem;
      padding: 0.3rem 0.9rem;
      background: rgba(139,92,246,0.12);
      border: 1px solid rgba(139,92,246,0.28);
      border-radius: 999px;
      font-size: 0.7rem; color: #a78bfa;
      letter-spacing: 0.09em; text-transform: uppercase; font-weight: 500;
      margin-bottom: 0.75rem;
    }
    .spr-title {
      font-family: 'Syne', sans-serif;
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 800; color: #f1f5f9;
      line-height: 1.15; margin: 0 0 0.35rem;
    }
    .spr-title span {
      background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .spr-subtitle {
      font-size: 0.85rem; color: #475569;
      font-weight: 300; line-height: 1.6;
    }

    /* ── Loading ── */
    .spr-loading-wrap {
      display: flex; align-items: center; justify-content: center;
      height: 60vh;
    }
    .spr-spinner {
      width: 44px; height: 44px;
      border: 3px solid rgba(139,92,246,0.15);
      border-top-color: #7c3aed;
      border-radius: 50%;
      animation: spr-spin 0.8s linear infinite;
    }
    @keyframes spr-spin { to { transform: rotate(360deg); } }

    /* ── Glass card ── */
    .spr-card {
      position: relative;
      background: rgba(12,15,30,0.85);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(139,92,246,0.2);
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 20px 64px rgba(0,0,0,0.45);
      margin-bottom: 1.5rem;
      animation: spr-fade-up 0.4s ease both;
    }
    .spr-card::before {
      content: '';
      position: absolute;
      top: 0; left: 15%; right: 15%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(139,92,246,0.55), transparent);
    }

    /* Card section header */
    .spr-section-header {
      display: flex; align-items: center; gap: 0.65rem;
      margin-bottom: 1.75rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(139,92,246,0.1);
    }
    .spr-section-icon {
      width: 36px; height: 36px;
      border-radius: 10px;
      background: rgba(139,92,246,0.1);
      border: 1px solid rgba(139,92,246,0.2);
      display: flex; align-items: center; justify-content: center;
      color: #7c3aed; flex-shrink: 0;
    }
    .spr-section-title {
      font-family: 'Syne', sans-serif;
      font-size: 1rem; font-weight: 700; color: #f1f5f9;
    }

    /* ── Form fields ── */
    .spr-form-group { margin-bottom: 1.25rem; }
    .spr-form-group:last-child { margin-bottom: 0; }
    .spr-label {
      display: block;
      font-size: 0.78rem; font-weight: 500;
      color: #94a3b8; letter-spacing: 0.03em;
      margin-bottom: 0.5rem;
    }
    .spr-input,
    .spr-textarea {
      width: 100%;
      padding: 0.7rem 1rem;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(139,92,246,0.2);
      border-radius: 10px;
      color: #e2e8f0;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.88rem;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
    }
    .spr-input::placeholder,
    .spr-textarea::placeholder { color: #334155; }
    .spr-input:focus,
    .spr-textarea:focus {
      border-color: rgba(139,92,246,0.55);
      box-shadow: 0 0 0 3px rgba(139,92,246,0.1);
    }
    .spr-textarea { resize: vertical; min-height: 100px; }

    /* 2-col grid for bank fields */
    .spr-grid-2 {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.25rem;
    }
    @media (min-width: 768px) {
      .spr-grid-2 { grid-template-columns: 1fr 1fr; }
      .spr-col-span-2 { grid-column: span 2; }
    }

    /* ── Image upload areas ── */
    .spr-logo-row {
      display: flex; align-items: center; gap: 1.25rem;
      flex-wrap: wrap;
    }
    .spr-logo-preview {
      width: 80px; height: 80px;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid rgba(139,92,246,0.3);
      flex-shrink: 0;
    }
    .spr-logo-preview img { width: 100%; height: 100%; object-fit: cover; }
    .spr-logo-placeholder {
      width: 80px; height: 80px;
      border-radius: 12px;
      border: 2px dashed rgba(139,92,246,0.25);
      background: rgba(139,92,246,0.04);
      display: flex; align-items: center; justify-content: center;
      color: #334155; flex-shrink: 0;
    }

    .spr-banner-preview {
      width: 100%; height: 160px;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid rgba(139,92,246,0.3);
      margin-bottom: 0.85rem;
    }
    .spr-banner-preview img { width: 100%; height: 100%; object-fit: cover; }
    .spr-banner-placeholder {
      width: 100%; height: 160px;
      border-radius: 12px;
      border: 2px dashed rgba(139,92,246,0.25);
      background: rgba(139,92,246,0.04);
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 0.4rem; color: #334155;
      margin-bottom: 0.85rem;
    }
    .spr-banner-placeholder span { font-size: 0.78rem; font-weight: 300; }

    /* File pick button */
    .spr-file-btn {
      display: inline-flex; align-items: center; gap: 0.4rem;
      padding: 0.45rem 1rem;
      background: rgba(139,92,246,0.1);
      border: 1px solid rgba(139,92,246,0.28);
      border-radius: 9px;
      font-size: 0.78rem; color: #a78bfa; font-weight: 500;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s;
    }
    .spr-file-btn:hover {
      background: rgba(139,92,246,0.18);
      border-color: rgba(139,92,246,0.45);
    }

    /* ── Submit button ── */
    .spr-submit-btn {
      width: 100%;
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
      padding: 0.9rem 2rem;
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      border: none; border-radius: 12px;
      color: #fff; font-size: 0.92rem; font-weight: 500;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.2s;
      box-shadow: 0 4px 24px rgba(124,58,237,0.4);
      animation: spr-fade-up 0.4s ease 0.25s both;
    }
    .spr-submit-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
    .spr-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .spr-submit-btn.saving {
      animation: spr-btn-pulse 1.5s ease-in-out infinite;
    }
    @keyframes spr-btn-pulse {
      0%, 100% { box-shadow: 0 4px 24px rgba(124,58,237,0.4); }
      50%       { box-shadow: 0 4px 40px rgba(124,58,237,0.65); }
    }

    /* Spin for Loader2 */
    .spr-spin-icon { animation: spr-spin 0.7s linear infinite; }

    @keyframes spr-fade-up {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Scrollbar */
    .spr-root ::-webkit-scrollbar { width: 6px; }
    .spr-root ::-webkit-scrollbar-track { background: transparent; }
    .spr-root ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.2); border-radius: 3px; }
    .spr-root ::-webkit-scrollbar-thumb:hover { background: rgba(139,92,246,0.4); }
  `;
  document.head.appendChild(tag);
}

/* ─── Component ──────────────────────────────────────────────────────────── */
const SellerProfilePage = () => {
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [profile, setProfile]       = useState({
    businessName: '', shopDescription: '', shopLogo: '', shopBanner: '',
    bankDetails: { accountTitle: '', accountNumber: '', bankName: '' },
  });
  const [logoFile, setLogoFile]         = useState(null);
  const [logoPreview, setLogoPreview]   = useState('');
  const [bannerFile, setBannerFile]     = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/seller/dashboard');
        const d = data.data || data;
        const p = d.profile || d.vendor || d;

        setProfile({
          businessName:    p.businessName    || p.shopName    || '',
          shopDescription: p.shopDescription || p.description || '',
          shopLogo:        p.shopLogo        || p.logo        || '',
          shopBanner:      p.shopBanner      || p.banner      || '',
          bankDetails: {
            accountTitle:  p.bankDetails?.accountTitle  || '',
            accountNumber: p.bankDetails?.accountNumber || '',
            bankName:      p.bankDetails?.bankName      || '',
          },
        });

        if (p.shopLogo   || p.logo)   setLogoPreview(p.shopLogo   || p.logo);
        if (p.shopBanner || p.banner) setBannerPreview(p.shopBanner || p.banner);
      } catch (err) {
        toast.error('Failed to load profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) { setLogoFile(file); setLogoPreview(URL.createObjectURL(file)); }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) { setBannerFile(file); setBannerPreview(URL.createObjectURL(file)); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('bank.')) {
      const field = name.split('.')[1];
      setProfile((prev) => ({ ...prev, bankDetails: { ...prev.bankDetails, [field]: value } }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let shopLogo   = profile.shopLogo;
      let shopBanner = profile.shopBanner;

      if (logoFile) {
        const fd = new FormData();
        fd.append('images', logoFile);
        const { data: r } = await api.post('/upload/images', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        const urls = r.urls || r.images || r.data?.urls || [];
        if (urls.length) shopLogo = urls[0];
      }

      if (bannerFile) {
        const fd = new FormData();
        fd.append('images', bannerFile);
        const { data: r } = await api.post('/upload/images', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        const urls = r.urls || r.images || r.data?.urls || [];
        if (urls.length) shopBanner = urls[0];
      }

      await api.put('/seller/profile', {
        businessName: profile.businessName,
        shopDescription: profile.shopDescription,
        shopLogo, shopBanner,
        bankDetails: profile.bankDetails,
      });

      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="spr-root">
        <div className="spr-orb spr-orb-1" />
        <div className="spr-orb spr-orb-2" />
        <div className="spr-grid-bg" />
        <SellerSidebar />
        <main className="spr-main">
          <div className="spr-loading-wrap"><div className="spr-spinner" /></div>
        </main>
      </div>
    );
  }

  return (
    <div className="spr-root">
      <div className="spr-orb spr-orb-1" />
      <div className="spr-orb spr-orb-2" />
      <div className="spr-grid-bg" />

      <SellerSidebar />

      <main className="spr-main">

        {/* ── Header ── */}
        <div className="spr-header">
          <div className="spr-badge"><Sparkles size={10} /> Seller Dashboard</div>
          <h1 className="spr-title">Seller <span>Profile</span></h1>
          <p className="spr-subtitle">Update your shop info, branding, and payment details.</p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* ── Shop Information ── */}
          <div className="spr-card" style={{ animationDelay: '0.05s' }}>
            <div className="spr-section-header">
              <div className="spr-section-icon"><Store size={17} /></div>
              <span className="spr-section-title">Shop Information</span>
            </div>

            <div className="spr-form-group">
              <label className="spr-label">Business Name</label>
              <input
                type="text" name="businessName"
                value={profile.businessName} onChange={handleChange}
                className="spr-input" placeholder="Your business name"
              />
            </div>

            <div className="spr-form-group">
              <label className="spr-label">Shop Description</label>
              <textarea
                name="shopDescription"
                value={profile.shopDescription} onChange={handleChange}
                className="spr-textarea" placeholder="Describe your shop..."
              />
            </div>

            {/* Logo */}
            <div className="spr-form-group">
              <label className="spr-label">Shop Logo</label>
              <div className="spr-logo-row">
                {logoPreview ? (
                  <div className="spr-logo-preview">
                    <img src={logoPreview} alt="Shop Logo" />
                  </div>
                ) : (
                  <div className="spr-logo-placeholder"><Upload size={22} /></div>
                )}
                <label className="spr-file-btn">
                  <ImagePlus size={13} /> Choose File
                  <input type="file" accept="image/*" onChange={handleLogoChange} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            {/* Banner */}
            <div className="spr-form-group">
              <label className="spr-label">Shop Banner</label>
              {bannerPreview ? (
                <div className="spr-banner-preview">
                  <img src={bannerPreview} alt="Shop Banner" />
                </div>
              ) : (
                <div className="spr-banner-placeholder">
                  <Upload size={22} />
                  <span>Upload banner image</span>
                </div>
              )}
              <label className="spr-file-btn">
                <ImagePlus size={13} /> Choose File
                <input type="file" accept="image/*" onChange={handleBannerChange} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          {/* ── Bank Details ── */}
          <div className="spr-card" style={{ animationDelay: '0.12s' }}>
            <div className="spr-section-header">
              <div className="spr-section-icon"><CreditCard size={17} /></div>
              <span className="spr-section-title">Bank Details</span>
            </div>

            <div className="spr-grid-2">
              <div>
                <label className="spr-label">Account Title</label>
                <input
                  type="text" name="bank.accountTitle"
                  value={profile.bankDetails.accountTitle} onChange={handleChange}
                  className="spr-input" placeholder="Account holder name"
                />
              </div>
              <div>
                <label className="spr-label">Bank Name</label>
                <input
                  type="text" name="bank.bankName"
                  value={profile.bankDetails.bankName} onChange={handleChange}
                  className="spr-input" placeholder="Bank name"
                />
              </div>
              <div className="spr-col-span-2">
                <label className="spr-label">Account Number</label>
                <input
                  type="text" name="bank.accountNumber"
                  value={profile.bankDetails.accountNumber} onChange={handleChange}
                  className="spr-input" placeholder="Account number / IBAN"
                />
              </div>
            </div>
          </div>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={saving}
            className={`spr-submit-btn ${saving ? 'saving' : ''}`}
          >
            {saving ? (
              <><Loader2 size={18} className="spr-spin-icon" /> Saving…</>
            ) : (
              'Update Profile'
            )}
          </button>

        </form>
      </main>
    </div>
  );
};

export default SellerProfilePage;