import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingBag,
  Grid3X3,
  FileBarChart,
  ArrowLeft,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

const navLinks = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Users', icon: Users, path: '/admin/users' },
  { label: 'Sellers', icon: Store, path: '/admin/sellers' },
  { label: 'Products', icon: Package, path: '/admin/products' },
  { label: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
  { label: 'Categories', icon: Grid3X3, path: '/admin/categories' },
  { label: 'Reports', icon: FileBarChart, path: '/admin/reports' },
];

const AdminSidebar = () => {
  const location = useLocation();
  const [hoveredPath, setHoveredPath] = useState(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

        .admin-sidebar {
          font-family: 'Outfit', sans-serif;
          position: fixed;
          left: 0;
          top: 0;
          height: 100%;
          width: 256px;
          background: linear-gradient(180deg, #0d0b1a 0%, #100e22 60%, #0a0914 100%);
          border-right: 1px solid rgba(139, 92, 246, 0.12);
          display: flex;
          flex-direction: column;
          z-index: 40;
          overflow: hidden;
        }

        /* Ambient glow orb */
        .admin-sidebar::before {
          content: '';
          position: absolute;
          top: -80px;
          left: -60px;
          width: 240px;
          height: 240px;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.18) 0%, transparent 70%);
          pointer-events: none;
        }

        .admin-sidebar::after {
          content: '';
          position: absolute;
          bottom: 60px;
          right: -80px;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Header */
        .sidebar-header {
          padding: 24px 20px 20px;
          border-bottom: 1px solid rgba(139, 92, 246, 0.1);
          position: relative;
        }

        .logo-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.25), rgba(79, 70, 229, 0.15));
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 10px;
          padding: 6px 12px;
          margin-bottom: 14px;
        }

        .logo-badge span {
          font-size: 11px;
          font-weight: 500;
          color: #a78bfa;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .logo-badge svg {
          color: #7c3aed;
        }

        .sidebar-title {
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .sidebar-title span {
          background: linear-gradient(90deg, #a78bfa, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .sidebar-subtitle {
          font-size: 12px;
          color: rgba(167, 139, 250, 0.5);
          margin-top: 3px;
          font-weight: 400;
        }

        /* Nav */
        .sidebar-nav {
          flex: 1;
          padding: 16px 12px;
          overflow-y: auto;
          scrollbar-width: none;
        }

        .sidebar-nav::-webkit-scrollbar { display: none; }

        .nav-section-label {
          font-size: 10px;
          font-weight: 600;
          color: rgba(139, 92, 246, 0.4);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0 12px;
          margin-bottom: 8px;
          margin-top: 4px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-radius: 12px;
          margin-bottom: 3px;
          text-decoration: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .nav-link-text {
          font-size: 14px;
          font-weight: 500;
          flex: 1;
        }

        .nav-link-arrow {
          opacity: 0;
          transform: translateX(-4px);
          transition: all 0.2s ease;
          color: #7c3aed;
        }

        /* Inactive */
        .nav-link.inactive {
          color: rgba(167, 139, 250, 0.55);
        }

        .nav-link.inactive:hover {
          background: rgba(124, 58, 237, 0.08);
          color: rgba(167, 139, 250, 0.9);
          border: none;
        }

        .nav-link.inactive:hover .nav-link-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        /* Active */
        .nav-link.active {
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.35), rgba(79, 70, 229, 0.2));
          border: 1px solid rgba(139, 92, 246, 0.3);
          color: #ffffff;
          box-shadow: 0 4px 24px rgba(124, 58, 237, 0.2), inset 0 1px 0 rgba(255,255,255,0.06);
        }

        .nav-link.active .nav-link-arrow {
          opacity: 1;
          transform: translateX(0);
          color: #a78bfa;
        }

        /* Active glow line */
        .nav-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 60%;
          background: linear-gradient(180deg, #7c3aed, #6d28d9);
          border-radius: 0 2px 2px 0;
        }

        /* Icon wrapper */
        .nav-icon-wrap {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .nav-link.inactive .nav-icon-wrap {
          background: rgba(139, 92, 246, 0.08);
        }

        .nav-link.inactive:hover .nav-icon-wrap {
          background: rgba(124, 58, 237, 0.15);
        }

        .nav-link.active .nav-icon-wrap {
          background: rgba(124, 58, 237, 0.3);
        }

        /* Footer */
        .sidebar-footer {
          padding: 12px;
          border-top: 1px solid rgba(139, 92, 246, 0.1);
          position: relative;
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-radius: 12px;
          text-decoration: none;
          color: rgba(167, 139, 250, 0.45);
          transition: all 0.2s ease;
          font-size: 13px;
          font-weight: 500;
        }

        .back-link:hover {
          background: rgba(124, 58, 237, 0.08);
          color: rgba(167, 139, 250, 0.8);
        }

        .back-icon-wrap {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: rgba(139, 92, 246, 0.08);
          transition: all 0.2s ease;
        }

        .back-link:hover .back-icon-wrap {
          background: rgba(124, 58, 237, 0.18);
        }

        /* Dot indicator */
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 6px #22c55e;
          margin-left: auto;
          flex-shrink: 0;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* Noise texture overlay */
        .noise-overlay {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.3;
        }
      `}</style>

      <aside className="admin-sidebar">
        <div className="noise-overlay" />

        {/* Header */}
        <div className="sidebar-header">
          <div className="logo-badge">
            <Sparkles size={12} />
            <span>Admin Panel</span>
          </div>
          <div className="sidebar-title">
            Reco<span>Mart</span>
          </div>
          <div className="sidebar-subtitle">Management Console</div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          {navLinks.map(({ label, icon: Icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`nav-link ${isActive ? 'active' : 'inactive'}`}
                onMouseEnter={() => setHoveredPath(path)}
                onMouseLeave={() => setHoveredPath(null)}
              >
                <div className="nav-icon-wrap">
                  <Icon size={16} />
                </div>
                <span className="nav-link-text">{label}</span>
                <ChevronRight size={14} className="nav-link-arrow" />
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <Link to="/" className="back-link">
            <div className="back-icon-wrap">
              <ArrowLeft size={14} />
            </div>
            <span>Back to Store</span>
            <div className="status-dot" />
          </Link>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;