import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import Loader from './Loader';

const PR_STYLE_ID = 'pr-styles';
if (typeof document !== 'undefined' && !document.getElementById(PR_STYLE_ID)) {
  const tag = document.createElement('style');
  tag.id = PR_STYLE_ID;
  tag.textContent = `
    .pr-screen {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #080b1a;
      position: relative;
      overflow: hidden;
      gap: 1.25rem;
    }

    /* Ambient glow */
    .pr-screen::before {
      content: '';
      position: absolute;
      width: 500px; height: 500px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(109,40,217,0.15) 0%, transparent 65%);
      filter: blur(80px);
      pointer-events: none;
    }

    /* Grid texture */
    .pr-screen::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px);
      background-size: 48px 48px;
      pointer-events: none;
    }

    .pr-label {
      position: relative;
      z-index: 1;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.78rem;
      color: #334155;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      animation: pr-fade-pulse 1.8s ease-in-out infinite;
    }

    @keyframes pr-fade-pulse {
      0%, 100% { opacity: 0.5; }
      50%       { opacity: 1;   }
    }
  `;
  document.head.appendChild(tag);
}

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="pr-screen">
        <Loader size="lg" />
        <span className="pr-label">Authenticating…</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;