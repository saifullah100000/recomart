import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Camera, X, Sparkles, ArrowRight } from 'lucide-react';
import useDebounce from '../../hooks/useDebounce';
import api from '../../api/axios';

/* ─── Singleton style injection ──────────────────────────────────────────── */
const SB_STYLE_ID = 'sb-styles';
if (typeof document !== 'undefined' && !document.getElementById(SB_STYLE_ID)) {
  const tag = document.createElement('style');
  tag.id = SB_STYLE_ID;
  tag.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');

    .sb-wrap {
      position: relative;
      flex: 1;
      max-width: 520px;
      margin: 0 1rem;
      font-family: 'DM Sans', sans-serif;
    }

    /* ── Input row ── */
    .sb-row {
      display: flex;
      align-items: stretch;
      height: 40px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.09);
      border-radius: 12px;
      overflow: hidden;
      transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
    }
    .sb-row:focus-within {
      border-color: rgba(139,92,246,0.5);
      box-shadow: 0 0 0 3px rgba(124,58,237,0.1), 0 4px 20px rgba(0,0,0,0.25);
      background: rgba(255,255,255,0.07);
    }

    /* Search icon */
    .sb-icon {
      display: flex; align-items: center;
      padding: 0 0.65rem 0 0.9rem;
      color: #475569;
      flex-shrink: 0;
      transition: color 0.2s;
      pointer-events: none;
    }
    .sb-row:focus-within .sb-icon { color: #a78bfa; }

    /* Input */
    .sb-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      font-size: 0.83rem;
      color: #e2e8f0;
      font-family: 'DM Sans', sans-serif;
      font-weight: 400;
      padding: 0;
      min-width: 0;
    }
    .sb-input::placeholder { color: #334155; }

    /* Clear button */
    .sb-clear {
      display: flex; align-items: center;
      padding: 0 0.5rem;
      color: #334155;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: color 0.2s;
      flex-shrink: 0;
    }
    .sb-clear:hover { color: #94a3b8; }

    /* Separator */
    .sb-sep {
      width: 1px;
      background: rgba(255,255,255,0.07);
      margin: 6px 0;
      flex-shrink: 0;
    }

    /* Camera button */
    .sb-camera {
      display: flex; align-items: center; justify-content: center;
      padding: 0 0.7rem;
      background: transparent;
      border: none;
      cursor: pointer;
      color: #1e293b;
      transition: color 0.2s, background 0.2s;
      flex-shrink: 0;
      gap: 0.3rem;
      font-size: 0.72rem;
      font-family: 'DM Sans', sans-serif;
      font-weight: 500;
    }
    .sb-camera:hover { color: #a78bfa; background: rgba(139,92,246,0.08); }
    .sb-camera.has-image { color: #a78bfa; }

    /* Search button */
    .sb-btn {
      display: flex; align-items: center; justify-content: center;
      padding: 0 0.9rem;
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      border: none;
      cursor: pointer;
      color: #fff;
      font-size: 0.78rem;
      font-weight: 500;
      font-family: 'DM Sans', sans-serif;
      gap: 0.3rem;
      transition: opacity 0.2s;
      flex-shrink: 0;
      white-space: nowrap;
    }
    .sb-btn:hover { opacity: 0.88; }

    /* ── Image preview strip ── */
    .sb-preview {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      margin-top: 0.6rem;
      padding: 0.5rem 0.75rem;
      background: rgba(139,92,246,0.08);
      border: 1px solid rgba(139,92,246,0.2);
      border-radius: 10px;
      animation: sb-fade-in 0.2s ease;
    }
    .sb-preview-img {
      width: 36px; height: 36px;
      border-radius: 7px;
      object-fit: cover;
      border: 1px solid rgba(139,92,246,0.3);
      flex-shrink: 0;
    }
    .sb-preview-text {
      font-size: 0.75rem;
      color: #94a3b8;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
      min-width: 0;
    }
    .sb-preview-label {
      font-size: 0.65rem;
      color: #a78bfa;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      flex-shrink: 0;
    }
    .sb-preview-clear {
      background: transparent;
      border: none;
      cursor: pointer;
      color: #475569;
      display: flex; align-items: center;
      padding: 2px;
      transition: color 0.15s;
      flex-shrink: 0;
    }
    .sb-preview-clear:hover { color: #f87171; }

    /* ── Suggestions dropdown ── */
    .sb-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      left: 0; right: 0;
      z-index: 200;
      background: rgba(10,13,28,0.97);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(139,92,246,0.2);
      border-radius: 14px;
      box-shadow: 0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04);
      overflow: hidden;
      animation: sb-drop-in 0.18s cubic-bezier(0.16,1,0.3,1);
    }
    @keyframes sb-drop-in {
      from { opacity: 0; transform: translateY(-8px) scale(0.98); }
      to   { opacity: 1; transform: translateY(0)   scale(1);     }
    }
    @keyframes sb-fade-in {
      from { opacity: 0; transform: translateY(-4px); }
      to   { opacity: 1; transform: translateY(0);    }
    }

    .sb-drop-header {
      padding: 0.55rem 0.9rem 0.4rem;
      font-size: 0.65rem;
      color: #334155;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-weight: 500;
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }

    .sb-suggestion {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.6rem 0.9rem;
      cursor: pointer;
      transition: background 0.15s;
    }
    .sb-suggestion:hover { background: rgba(139,92,246,0.1); }
    .sb-suggestion:hover .sb-sug-arrow { opacity: 1; transform: translateX(0); }

    .sb-sug-icon {
      width: 26px; height: 26px;
      border-radius: 7px;
      background: rgba(139,92,246,0.1);
      border: 1px solid rgba(139,92,246,0.15);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      color: #7c3aed;
    }
    .sb-sug-text {
      font-size: 0.82rem;
      color: #94a3b8;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .sb-sug-arrow {
      color: #4c1d95;
      opacity: 0;
      transform: translateX(-4px);
      transition: opacity 0.15s, transform 0.15s;
      flex-shrink: 0;
    }

    /* Loading state */
    .sb-loading {
      padding: 1rem 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 0.8rem;
      color: #475569;
    }
    .sb-spinner {
      width: 14px; height: 14px;
      border: 1.5px solid rgba(139,92,246,0.2);
      border-top-color: #7c3aed;
      border-radius: 50%;
      animation: sb-spin 0.7s linear infinite;
      flex-shrink: 0;
    }
    @keyframes sb-spin { to { transform: rotate(360deg); } }

    /* Visual AI indicator on camera btn */
    .sb-ai-dot {
      width: 5px; height: 5px;
      border-radius: 50%;
      background: #a78bfa;
      animation: sb-ai-pulse 2s ease-in-out infinite;
    }
    @keyframes sb-ai-pulse {
      0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(167,139,250,0.4); }
      50%       { opacity: 0.7; box-shadow: 0 0 0 4px rgba(167,139,250,0); }
    }
  `;
  document.head.appendChild(tag);
}

/* ─── Component ──────────────────────────────────────────────────────────── */
const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const fileInputRef = useRef(null);

  /* Fetch suggestions */
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery || debouncedQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      setIsLoading(true);
      try {
        const { data } = await api.get(`/search/suggestions?q=${encodeURIComponent(debouncedQuery)}`);
        setSuggestions(data.suggestions || []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuggestions();
  }, [debouncedQuery]);

  /* Click outside */
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Clean up object URL */
  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query?.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const text = typeof suggestion === 'string'
      ? suggestion
      : suggestion.title || suggestion.name || '';
    setQuery(text);
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(text)}`);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleVisualSearch = async () => {
    if (!selectedImage) return;
    const formData = new FormData();
    formData.append('image', selectedImage);
    try {
      const { data } = await api.post('/search/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (data.products?.length > 0) {
        navigate('/search?visual=true', { state: { products: data.products, analysis: data.analysis } });
      } else if (data.query) {
        navigate(`/search?q=${encodeURIComponent(data.query)}`);
      }
    } catch (err) {
      console.error('Visual search failed:', err);
    } finally {
      clearImage();
    }
  };

  const clearQuery = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const resolvedText = (s) =>
    typeof s === 'string' ? s : s.title || s.name || '';

  return (
    <div ref={wrapperRef} className="sb-wrap">

      {/* ── Input row ── */}
      <form onSubmit={handleSubmit}>
        <div className="sb-row">

          {/* Search icon */}
          <span className="sb-icon">
            <Search size={15} />
          </span>

          {/* Text input */}
          <input
            type="text"
            className="sb-input"
            value={query || ''}
            onChange={(e) => setQuery(e.target.value || '')}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Search products..."
            autoComplete="off"
          />

          {/* Clear */}
          {query && (
            <button type="button" className="sb-clear" onClick={clearQuery} aria-label="Clear">
              <X size={13} />
            </button>
          )}

          <div className="sb-sep" />

          {/* Camera / Visual AI */}
          <button
            type="button"
            className={`sb-camera ${selectedImage ? 'has-image' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            title="Search by image"
          >
            <Camera size={14} />
            {selectedImage
              ? <span className="sb-ai-dot" />
              : null}
          </button>

          <div className="sb-sep" />

          {/* Search / Visual Search */}
          <button
            type={selectedImage ? 'button' : 'submit'}
            className="sb-btn"
            onClick={selectedImage ? handleVisualSearch : undefined}
          >
            {selectedImage ? (
              <>
                <Sparkles size={12} />
                AI Search
              </>
            ) : (
              <>
                <ArrowRight size={13} />
                Search
              </>
            )}
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          style={{ display: 'none' }}
        />
      </form>

      {/* ── Image preview strip ── */}
      {selectedImage && previewUrl && (
        <div className="sb-preview">
          <img src={previewUrl} alt="Preview" className="sb-preview-img" />
          <span className="sb-preview-text">{selectedImage.name}</span>
          <span className="sb-preview-label">
            <Sparkles size={9} style={{ display: 'inline', marginRight: 3 }} />
            Visual AI
          </span>
          <button type="button" className="sb-preview-clear" onClick={clearImage} aria-label="Remove image">
            <X size={13} />
          </button>
        </div>
      )}

      {/* ── Suggestions ── */}
      {(showSuggestions && suggestions.length > 0) || (isLoading && query.length >= 2) ? (
        <div className="sb-dropdown">
          {isLoading ? (
            <div className="sb-loading">
              <span className="sb-spinner" />
              Finding suggestions…
            </div>
          ) : (
            <>
              <div className="sb-drop-header">Suggestions</div>
              {suggestions.map((s, i) => {
                const text = resolvedText(s);
                return (
                  <div
                    key={i}
                    className="sb-suggestion"
                    onClick={() => handleSuggestionClick(s)}
                  >
                    <span className="sb-sug-icon">
                      <Search size={11} />
                    </span>
                    <span className="sb-sug-text">{text}</span>
                    <ArrowRight size={12} className="sb-sug-arrow" />
                  </div>
                );
              })}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default SearchBar;