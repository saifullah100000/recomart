const LOADER_STYLE_ID = 'ldr-styles';
if (typeof document !== 'undefined' && !document.getElementById(LOADER_STYLE_ID)) {
  const tag = document.createElement('style');
  tag.id = LOADER_STYLE_ID;
  tag.textContent = `
    .ldr-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    /* Outer ring — slow purple */
    .ldr-ring {
      position: relative;
      border-radius: 50%;
      border-style: solid;
      border-color: rgba(139,92,246,0.15);
      border-top-color: #7c3aed;
      animation: ldr-spin 0.9s cubic-bezier(0.5,0.1,0.5,0.9) infinite;
      flex-shrink: 0;
    }

    /* Inner ring — fast blue, counter-spin */
    .ldr-ring::after {
      content: '';
      position: absolute;
      border-radius: 50%;
      border-style: solid;
      border-color: transparent;
      border-bottom-color: #60a5fa;
      animation: ldr-spin-rev 0.6s linear infinite;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
    }

    /* Glow dot at spinner head */
    .ldr-ring::before {
      content: '';
      position: absolute;
      border-radius: 50%;
      background: #a78bfa;
      top: 0; left: 50%;
      transform: translateX(-50%);
      box-shadow: 0 0 6px 2px rgba(167,139,250,0.6);
    }

    @keyframes ldr-spin     { to { transform: rotate(360deg);  } }
    @keyframes ldr-spin-rev { to { transform: translate(-50%,-50%) rotate(-360deg); } }

    /* Sizes */
    .ldr-sm { width: 24px;  height: 24px;  border-width: 2px; }
    .ldr-sm::after  { width: 10px; height: 10px; border-width: 1.5px; }
    .ldr-sm::before { width: 4px;  height: 4px; }

    .ldr-md { width: 40px;  height: 40px;  border-width: 3px; }
    .ldr-md::after  { width: 18px; height: 18px; border-width: 2px; }
    .ldr-md::before { width: 5px;  height: 5px; }

    .ldr-lg { width: 64px;  height: 64px;  border-width: 4px; }
    .ldr-lg::after  { width: 28px; height: 28px; border-width: 3px; }
    .ldr-lg::before { width: 7px;  height: 7px; }
  `;
  document.head.appendChild(tag);
}

const Loader = ({ size = 'md' }) => {
  const s = ['sm', 'md', 'lg'].includes(size) ? size : 'md';
  return (
    <div className="ldr-wrap">
      <div className={`ldr-ring ldr-${s}`} />
    </div>
  );
};

export default Loader;