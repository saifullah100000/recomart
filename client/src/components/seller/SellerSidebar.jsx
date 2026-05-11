import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  BarChart3,
  User,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

const navLinks = [
  { label: 'Dashboard',   icon: LayoutDashboard, path: '/seller/dashboard' },
  { label: 'Products',    icon: Package,         path: '/seller/products' },
  { label: 'Add Product', icon: PlusCircle,      path: '/seller/products/add' },
  { label: 'Orders',      icon: ShoppingBag,     path: '/seller/orders' },
  { label: 'Analytics',   icon: BarChart3,       path: '/seller/analytics' },
  { label: 'Profile',     icon: User,            path: '/seller/profile' },
];

const SellerSidebar = () => {
  const location = useLocation();

  return (
    <aside
      className="fixed left-0 top-0 h-full w-64 flex flex-col z-40"
      style={{
        background: 'linear-gradient(180deg, #0f0c2a 0%, #0a0818 100%)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Brand */}
      <div
        className="px-5 py-5 flex items-center gap-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            boxShadow: '0 4px 12px rgba(124,58,237,0.4)',
          }}
        >
          <Sparkles size={16} color="#fff" />
        </div>
        <div>
          <p className="text-sm font-extrabold tracking-tight" style={{ color: '#f0eeff' }}>
            RecoMart
          </p>
          <p className="text-xs" style={{ color: '#6b7280' }}>
            Seller Portal
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {navLinks.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200"
              style={
                isActive
                  ? {
                      background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(109,40,217,0.15))',
                      border: '1px solid rgba(124,58,237,0.35)',
                      color: '#f0eeff',
                      boxShadow: '0 2px 12px rgba(124,58,237,0.2)',
                    }
                  : {
                      background: 'transparent',
                      border: '1px solid transparent',
                      color: '#6b7280',
                    }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = '#d1d5db';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#6b7280';
                }
              }}
            >
              {/* Icon container */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: isActive
                    ? 'rgba(124,58,237,0.3)'
                    : 'rgba(255,255,255,0.04)',
                }}
              >
                <Icon size={16} color={isActive ? '#a78bfa' : 'currentColor'} />
              </div>
              <span className="text-sm font-medium">{label}</span>

              {/* Active indicator pill */}
              {isActive && (
                <div
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: '#a78bfa' }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-3 py-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200"
          style={{
            background: 'transparent',
            border: '1px solid transparent',
            color: '#6b7280',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.color = '#d1d5db';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#6b7280';
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <ArrowLeft size={16} />
          </div>
          <span className="text-sm font-medium">Back to Store</span>
        </Link>
      </div>
    </aside>
  );
};

export default SellerSidebar;