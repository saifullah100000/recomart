import { useState } from 'react';
import { ImageOff, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

const ProductImageGallery = ({ images = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const currentImage = images[selectedIndex]?.url || null;
  const total = images.length;

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const goPrev = (e) => {
    e.stopPropagation();
    setSelectedIndex((i) => (i - 1 + total) % total);
  };

  const goNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((i) => (i + 1) % total);
  };

  /* ── Empty state ── */
  if (total === 0) {
    return (
      <>
        <style>{`
          .pig-empty {
            width: 100%;
            aspect-ratio: 1;
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.07);
            background: rgba(255,255,255,0.04);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
          }
        `}</style>
        <div className="pig-empty">
          <ImageOff style={{ width: 48, height: 48, color: 'rgba(255,255,255,0.15)' }} />
          <span style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>No images available</span>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes pig-fade {
          from { opacity: 0; transform: scale(0.98); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes pig-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }

        /* ── Main viewer ── */
        .pig-viewer {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          overflow: hidden;
          cursor: zoom-in;
        }
        .pig-viewer.zoomed { cursor: crosshair; }

        /* Ambient glow behind image */
        .pig-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(ellipse 70% 70% at 50% 50%, rgba(124,58,237,0.07) 0%, transparent 70%);
          z-index: 0;
        }

        /* Top rail line */
        .pig-viewer::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
          z-index: 3;
        }

        .pig-img {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.18s ease, opacity 0.22s ease;
        }
        .pig-img.changing { opacity: 0; }

        /* ── Zoom hint ── */
        .pig-zoom-hint {
          position: absolute;
          bottom: 12px;
          right: 12px;
          z-index: 4;
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          border-radius: 8px;
          background: rgba(10,15,30,0.75);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(8px);
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          pointer-events: none;
          transition: opacity 0.2s;
        }
        .pig-viewer:hover .pig-zoom-hint { opacity: 0; }

        /* ── Image counter ── */
        .pig-counter {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 4;
          padding: 4px 10px;
          border-radius: 8px;
          background: rgba(10,15,30,0.7);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(8px);
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.04em;
          pointer-events: none;
        }

        /* ── Nav arrows ── */
        .pig-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 4;
          width: 36px;
          height: 36px;
          border-radius: 11px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(10,15,30,0.7);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #cbd5e1;
          transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s;
          opacity: 0;
        }
        .pig-viewer:hover .pig-nav { opacity: 1; }
        .pig-nav:hover {
          background: rgba(124,58,237,0.25);
          border-color: rgba(124,58,237,0.4);
          color: #e2e8f0;
          transform: translateY(-50%) scale(1.08);
        }
        .pig-nav-prev { left: 10px; }
        .pig-nav-next { right: 10px; }

        /* ── Dot indicators ── */
        .pig-dots {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 4;
          display: flex;
          align-items: center;
          gap: 5px;
          pointer-events: none;
        }
        .pig-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.25);
          transition: background 0.2s, transform 0.2s, width 0.2s;
        }
        .pig-dot.active {
          background: #7C3AED;
          width: 16px;
          border-radius: 3px;
          box-shadow: 0 0 6px rgba(124,58,237,0.6);
        }

        /* ── Thumbnails ── */
        .pig-thumbs {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 4px;
          scrollbar-width: thin;
          scrollbar-color: rgba(124,58,237,0.4) transparent;
          margin-top: 14px;
        }
        .pig-thumbs::-webkit-scrollbar { height: 3px; }
        .pig-thumbs::-webkit-scrollbar-track { background: transparent; }
        .pig-thumbs::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.4); border-radius: 4px; }

        .pig-thumb {
          flex-shrink: 0;
          width: 68px;
          height: 68px;
          border-radius: 13px;
          overflow: hidden;
          border: 1.5px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.04);
          cursor: pointer;
          position: relative;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .pig-thumb:hover {
          border-color: rgba(255,255,255,0.18);
          transform: translateY(-2px);
        }
        .pig-thumb.active {
          border-color: #7C3AED;
          box-shadow: 0 0 0 1px rgba(124,58,237,0.4), 0 4px 16px rgba(124,58,237,0.3);
          transform: translateY(-2px);
        }
        .pig-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        /* Active thumb glow overlay */
        .pig-thumb.active::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(124,58,237,0.12);
          pointer-events: none;
        }
      `}</style>

      <div>
        {/* ── Main viewer ── */}
        <div
          className={`pig-viewer${isZoomed ? ' zoomed' : ''}`}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => { setIsZoomed(false); setZoomPosition({ x: 50, y: 50 }); }}
          onMouseMove={handleMouseMove}
        >
          {/* Ambient glow */}
          <div className="pig-glow" />

          {/* Image */}
          <img
            key={selectedIndex}
            src={currentImage}
            alt={`Product image ${selectedIndex + 1}`}
            className="pig-img"
            style={
              isZoomed
                ? { transform: 'scale(2.2)', transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }
                : {}
            }
          />

          {/* Counter */}
          {total > 1 && (
            <div className="pig-counter">{selectedIndex + 1} / {total}</div>
          )}

          {/* Zoom hint */}
          <div className="pig-zoom-hint">
            <ZoomIn style={{ width: 11, height: 11 }} />
            Hover to zoom
          </div>

          {/* Nav arrows — only when multiple images */}
          {total > 1 && (
            <>
              <button className="pig-nav pig-nav-prev" onClick={goPrev} aria-label="Previous image">
                <ChevronLeft style={{ width: 18, height: 18 }} />
              </button>
              <button className="pig-nav pig-nav-next" onClick={goNext} aria-label="Next image">
                <ChevronRight style={{ width: 18, height: 18 }} />
              </button>
            </>
          )}

          {/* Dot indicators */}
          {total > 1 && total <= 8 && (
            <div className="pig-dots">
              {images.map((_, i) => (
                <div key={i} className={`pig-dot${i === selectedIndex ? ' active' : ''}`} />
              ))}
            </div>
          )}
        </div>

        {/* ── Thumbnails ── */}
        {total > 1 && (
          <div className="pig-thumbs">
            {images.map((image, index) => (
              <button
                key={index}
                className={`pig-thumb${index === selectedIndex ? ' active' : ''}`}
                onClick={() => setSelectedIndex(index)}
                aria-label={`View image ${index + 1}`}
              >
                <img src={image.url} alt={`Thumbnail ${index + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ProductImageGallery;