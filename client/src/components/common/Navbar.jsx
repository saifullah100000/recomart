import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Sparkles,
  LayoutDashboard,
  Package,
  ClipboardList,
  BarChart2,
  Users,
  Tag,
} from 'lucide-react';

import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import SearchBar from './SearchBar';

/* ─── Role menus ─────────────────────────────────────────────────────────── */
const roleMenus = {
  customer: [
    { label: 'Dashboard',  path: '/dashboard',  Icon: LayoutDashboard },
    { label: 'My Orders',  path: '/orders',      Icon: ClipboardList   },
    { label: 'Wishlist',   path: '/wishlist',    Icon: Heart           },
    { label: 'Profile',    path: '/profile',     Icon: User            },
  ],
  seller: [
    { label: 'Dashboard',   path: '/seller/dashboard',  Icon: LayoutDashboard },
    { label: 'My Products', path: '/seller/products',   Icon: Package         },
    { label: 'Orders',      path: '/seller/orders',     Icon: ClipboardList   },
    { label: 'Analytics',   path: '/seller/analytics',  Icon: BarChart2       },
    { label: 'Profile',     path: '/profile',           Icon: User            },
  ],
  admin: [
    { label: 'Dashboard',  path: '/admin/dashboard',  Icon: LayoutDashboard },
    { label: 'Users',      path: '/admin/users',      Icon: Users           },
    { label: 'Sellers',    path: '/admin/sellers',    Icon: User            },
    { label: 'Products',   path: '/admin/products',   Icon: Package         },
    { label: 'Orders',     path: '/admin/orders',     Icon: ClipboardList   },
    { label: 'Categories', path: '/admin/categories', Icon: Tag             },
  ],
};

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const NAV_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

  /* ── Nav shell ── */
  .nb-nav {
    position: sticky;
    top: 0;
    z-index: 200;
    font-family: 'DM Sans', sans-serif;
  }

  /* Glass backdrop */
  .nb-bar {
    background: rgba(8, 11, 26, 0.72);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border-bottom: 1px solid rgba(139, 92, 246, 0.15);
    box-shadow: 0 1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.35);
    transition: background 0.3s;
  }
  .nb-bar:hover {
    background: rgba(8, 11, 26, 0.85);
  }

  /* Thin top accent line */
  .nb-accent-line {
    height: 1px;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(124,58,237,0.6) 30%,
      rgba(99,102,241,0.5) 60%,
      transparent 100%
    );
  }

  .nb-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1.5rem;
    display: flex;
    align-items: center;
    height: 64px;
    gap: 1.5rem;
  }

  /* ── Logo ── */
  .nb-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.25rem;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-shrink: 0;
    letter-spacing: -0.02em;
    color: #f1f5f9;
    transition: opacity 0.2s;
  }
  .nb-logo:hover { opacity: 0.85; }
  .nb-logo-accent {
    background: linear-gradient(135deg, #a78bfa, #60a5fa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .nb-logo-icon {
    width: 28px; height: 28px;
    background: linear-gradient(135deg, #7c3aed, #4f46e5);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 12px rgba(124,58,237,0.4);
  }

  /* ── Search ── */
  .nb-search {
    flex: 1;
    max-width: 480px;
    display: none;
  }
  @media (min-width: 768px) { .nb-search { display: block; } }

  /* ── Desktop links ── */
  .nb-links {
    display: none;
    align-items: center;
    gap: 0.25rem;
    margin-left: auto;
  }
  @media (min-width: 768px) { .nb-links { display: flex; } }

  .nb-link {
    position: relative;
    padding: 0.4rem 0.75rem;
    font-size: 0.85rem;
    font-weight: 500;
    color: #94a3b8;
    text-decoration: none;
    border-radius: 8px;
    transition: color 0.2s, background 0.2s;
    white-space: nowrap;
  }
  .nb-link::after {
    content: '';
    position: absolute;
    bottom: 2px; left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: calc(100% - 1.5rem);
    height: 1.5px;
    background: linear-gradient(90deg, #7c3aed, #60a5fa);
    border-radius: 2px;
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  .nb-link:hover {
    color: #e2e8f0;
    background: rgba(255,255,255,0.04);
  }
  .nb-link:hover::after,
  .nb-link.nb-active::after {
    transform: translateX(-50%) scaleX(1);
  }
  .nb-link.nb-active { color: #c4b5fd; }

  /* Visual AI special badge link */
  .nb-link-ai {
    color: #a78bfa;
    border: 1px solid rgba(139,92,246,0.25);
    background: rgba(139,92,246,0.08);
  }
  .nb-link-ai:hover {
    background: rgba(139,92,246,0.16);
    color: #c4b5fd;
    border-color: rgba(139,92,246,0.4);
  }

  /* ── Icon buttons ── */
  .nb-icon-btn {
    position: relative;
    width: 38px; height: 38px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 10px;
    color: #94a3b8;
    text-decoration: none;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: color 0.2s, background 0.2s;
    flex-shrink: 0;
  }
  .nb-icon-btn:hover {
    color: #e2e8f0;
    background: rgba(255,255,255,0.06);
  }

  /* Cart badge */
  .nb-badge {
    position: absolute;
    top: 3px; right: 3px;
    min-width: 17px; height: 17px;
    padding: 0 3px;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: #fff;
    font-size: 0.62rem;
    font-weight: 700;
    border-radius: 999px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 6px rgba(239,68,68,0.5);
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Avatar / user button ── */
  .nb-user-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.3rem 0.65rem 0.3rem 0.35rem;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 999px;
    color: #94a3b8;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .nb-user-btn:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(139,92,246,0.35);
    color: #e2e8f0;
  }
  .nb-avatar {
    width: 28px; height: 28px;
    border-radius: 50%;
    object-fit: cover;
    border: 1.5px solid rgba(139,92,246,0.4);
  }
  .nb-avatar-placeholder {
    width: 28px; height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #7c3aed, #4f46e5);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .nb-username {
    font-size: 0.8rem;
    font-weight: 500;
    max-width: 90px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .nb-chevron {
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
    flex-shrink: 0;
  }
  .nb-chevron.open { transform: rotate(180deg); }

  /* ── Dropdown ── */
  .nb-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    min-width: 200px;
    background: rgba(12, 15, 30, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(139,92,246,0.2);
    border-radius: 14px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04);
    overflow: hidden;
    animation: nb-drop-in 0.2s cubic-bezier(0.16,1,0.3,1) forwards;
    transform-origin: top right;
  }
  @keyframes nb-drop-in {
    from { opacity: 0; transform: scale(0.92) translateY(-8px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  /* Dropdown header */
  .nb-drop-header {
    padding: 0.85rem 1rem 0.7rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .nb-drop-role {
    display: inline-block;
    padding: 0.15rem 0.55rem;
    background: rgba(139,92,246,0.15);
    border: 1px solid rgba(139,92,246,0.25);
    border-radius: 6px;
    font-size: 0.65rem;
    color: #a78bfa;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 500;
    margin-bottom: 0.3rem;
  }
  .nb-drop-name {
    font-size: 0.85rem;
    font-weight: 500;
    color: #e2e8f0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Dropdown items */
  .nb-drop-item {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.6rem 1rem;
    font-size: 0.82rem;
    color: #94a3b8;
    text-decoration: none;
    background: transparent;
    border: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s, color 0.15s;
  }
  .nb-drop-item:hover {
    background: rgba(139,92,246,0.1);
    color: #c4b5fd;
  }
  .nb-drop-item svg { flex-shrink: 0; opacity: 0.7; }
  .nb-drop-divider {
    height: 1px;
    background: rgba(255,255,255,0.06);
    margin: 0.25rem 0;
  }
  .nb-drop-logout {
    color: #f87171;
  }
  .nb-drop-logout:hover {
    background: rgba(239,68,68,0.1);
    color: #fca5a5;
  }

  /* ── Auth buttons ── */
  .nb-login-btn {
    padding: 0.45rem 1rem;
    font-size: 0.82rem;
    font-weight: 500;
    color: #94a3b8;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 9px;
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }
  .nb-login-btn:hover {
    color: #e2e8f0;
    border-color: rgba(139,92,246,0.4);
    background: rgba(139,92,246,0.06);
  }
  .nb-register-btn {
    padding: 0.45rem 1rem;
    font-size: 0.82rem;
    font-weight: 500;
    color: #fff;
    background: linear-gradient(135deg, #7c3aed, #4f46e5);
    border-radius: 9px;
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 3px 14px rgba(124,58,237,0.35);
    transition: opacity 0.2s, transform 0.2s;
  }
  .nb-register-btn:hover { opacity: 0.9; transform: translateY(-1px); }

  /* ── Mobile menu ── */
  .nb-mobile-search {
    display: block;
    padding: 0.5rem 1.5rem 0.75rem;
    border-top: 1px solid rgba(255,255,255,0.04);
    background: rgba(8,11,26,0.9);
  }
  @media (min-width: 768px) { .nb-mobile-search { display: none; } }

  .nb-mobile-menu {
    background: rgba(8, 11, 26, 0.96);
    backdrop-filter: blur(24px);
    border-top: 1px solid rgba(139,92,246,0.15);
    animation: nb-slide-down 0.28s cubic-bezier(0.16,1,0.3,1) forwards;
  }
  @keyframes nb-slide-down {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .nb-mobile-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0.75rem 1.5rem 1.25rem;
  }

  .nb-mobile-link {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.7rem 0.75rem;
    font-size: 0.9rem;
    font-weight: 500;
    color: #94a3b8;
    text-decoration: none;
    border-radius: 10px;
    transition: color 0.15s, background 0.15s;
  }
  .nb-mobile-link:hover,
  .nb-mobile-link.nb-active {
    color: #c4b5fd;
    background: rgba(139,92,246,0.1);
  }

  .nb-mobile-user {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    margin: 0.5rem 0;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
  }
  .nb-mobile-user-info { min-width: 0; }
  .nb-mobile-username {
    font-size: 0.88rem;
    font-weight: 500;
    color: #e2e8f0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .nb-mobile-role {
    font-size: 0.68rem;
    color: #a78bfa;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 500;
  }

  .nb-mobile-divider {
    height: 1px;
    background: rgba(255,255,255,0.06);
    margin: 0.5rem 0;
  }

  .nb-mobile-auth {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    padding-top: 0.5rem;
  }
  .nb-mobile-login-btn {
    padding: 0.65rem;
    text-align: center;
    font-size: 0.85rem;
    font-weight: 500;
    color: #94a3b8;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    text-decoration: none;
    transition: color 0.2s, border-color 0.2s;
  }
  .nb-mobile-login-btn:hover { color: #e2e8f0; border-color: rgba(139,92,246,0.4); }
  .nb-mobile-register-btn {
    padding: 0.65rem;
    text-align: center;
    font-size: 0.85rem;
    font-weight: 500;
    color: #fff;
    background: linear-gradient(135deg, #7c3aed, #4f46e5);
    border-radius: 10px;
    text-decoration: none;
    box-shadow: 0 3px 12px rgba(124,58,237,0.3);
  }

  /* Mobile only */
  .nb-mobile-only { display: flex; }
  @media (min-width: 768px) { .nb-mobile-only { display: none; } }
`;

/* ─── Component ──────────────────────────────────────────────────────────── */
const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated, logout } = useAuthStore();
  const { itemCount } = useCartStore();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/login');
  };

  const menuItems = roleMenus[user?.role] || roleMenus.customer;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: NAV_STYLES }} />

      <nav className="nb-nav">
        {/* Top accent line */}
        <div className="nb-accent-line" />

        <div className="nb-bar">
          <div className="nb-inner">

            {/* ── Logo ── */}
            <Link to="/" className="nb-logo">
              <span className="nb-logo-icon">
                <Sparkles size={14} color="#fff" />
              </span>
              Reco<span className="nb-logo-accent">Mart</span>
            </Link>

            {/* ── Search ── */}
            <div className="nb-search">
              <SearchBar />
            </div>

            {/* ── Desktop links ── */}
            <div className="nb-links">
              <Link to="/" className={`nb-link ${isActive('/') ? 'nb-active' : ''}`}>
                Home
              </Link>
              <Link to="/products" className={`nb-link ${isActive('/products') ? 'nb-active' : ''}`}>
                Products
              </Link>
              <Link to="/visual-style" className={`nb-link nb-link-ai ${isActive('/visual-style') ? 'nb-active' : ''}`}>
                <Sparkles size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                Visual AI
              </Link>

              {/* Cart */}
              <Link to="/cart" className="nb-icon-btn" style={{ marginLeft: '0.25rem' }}>
                <ShoppingCart size={18} />
                {itemCount > 0 && (
                  <span className="nb-badge">{itemCount > 99 ? '99+' : itemCount}</span>
                )}
              </Link>

              {isAuthenticated ? (
                <>
                  {/* Wishlist */}
                  <Link to="/wishlist" className="nb-icon-btn">
                    <Heart size={18} />
                  </Link>

                  {/* User dropdown */}
                  <div ref={dropdownRef} style={{ position: 'relative' }}>
                    <button
                      className="nb-user-btn"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="nb-avatar" />
                      ) : (
                        <div className="nb-avatar-placeholder">
                          <User size={13} color="#fff" />
                        </div>
                      )}
                      <span className="nb-username">{user?.name}</span>
                      <ChevronDown size={13} className={`nb-chevron ${dropdownOpen ? 'open' : ''}`} />
                    </button>

                    {dropdownOpen && (
                      <div className="nb-dropdown">
                        {/* Header */}
                        <div className="nb-drop-header">
                          <div className="nb-drop-role">{user?.role || 'customer'}</div>
                          <div className="nb-drop-name">{user?.name}</div>
                        </div>

                        {/* Menu items */}
                        <div style={{ padding: '0.35rem 0' }}>
                          {menuItems.map(({ label, path, Icon }) => (
                            <Link
                              key={path}
                              to={path}
                              className="nb-drop-item"
                              onClick={() => setDropdownOpen(false)}
                            >
                              <Icon size={14} />
                              {label}
                            </Link>
                          ))}
                        </div>

                        <div className="nb-drop-divider" />

                        <button onClick={handleLogout} className="nb-drop-item nb-drop-logout">
                          <LogOut size={14} />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.25rem' }}>
                  <Link to="/login" className="nb-login-btn">Login</Link>
                  <Link to="/register" className="nb-register-btn">Register</Link>
                </div>
              )}
            </div>

            {/* ── Mobile right controls ── */}
            <div className="nb-mobile-only" style={{ marginLeft: 'auto', alignItems: 'center', gap: '0.25rem' }}>
              <Link to="/cart" className="nb-icon-btn">
                <ShoppingCart size={18} />
                {itemCount > 0 && (
                  <span className="nb-badge">{itemCount > 99 ? '99+' : itemCount}</span>
                )}
              </Link>
              <button
                className="nb-icon-btn"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile search bar */}
        <div className="nb-mobile-search">
          <SearchBar />
        </div>

        {/* ── Mobile menu panel ── */}
        {mobileOpen && (
          <div className="nb-mobile-menu">
            <div className="nb-mobile-inner">

              {/* Nav links */}
              <Link to="/" className={`nb-mobile-link ${isActive('/') ? 'nb-active' : ''}`}>
                Home
              </Link>
              <Link to="/products" className={`nb-mobile-link ${isActive('/products') ? 'nb-active' : ''}`}>
                Products
              </Link>
              <Link to="/visual-style" className={`nb-mobile-link ${isActive('/visual-style') ? 'nb-active' : ''}`} style={{ color: '#a78bfa' }}>
                <Sparkles size={15} />
                Visual AI
              </Link>

              {isAuthenticated ? (
                <>
                  <div className="nb-mobile-divider" />

                  {/* User card */}
                  <div className="nb-mobile-user">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="nb-avatar" style={{ width: 36, height: 36 }} />
                    ) : (
                      <div className="nb-avatar-placeholder" style={{ width: 36, height: 36 }}>
                        <User size={16} color="#fff" />
                      </div>
                    )}
                    <div className="nb-mobile-user-info">
                      <div className="nb-mobile-username">{user?.name}</div>
                      <div className="nb-mobile-role">{user?.role || 'customer'}</div>
                    </div>
                  </div>

                  {/* Role menu */}
                  {menuItems.map(({ label, path, Icon }) => (
                    <Link key={path} to={path} className="nb-mobile-link" style={{ paddingLeft: '1rem' }}>
                      <Icon size={15} style={{ opacity: 0.6 }} />
                      {label}
                    </Link>
                  ))}

                  <div className="nb-mobile-divider" />

                  <button onClick={handleLogout} className="nb-mobile-link" style={{ color: '#f87171', width: '100%', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <LogOut size={15} style={{ opacity: 0.8 }} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="nb-mobile-divider" />
                  <div className="nb-mobile-auth">
                    <Link to="/login" className="nb-mobile-login-btn">Login</Link>
                    <Link to="/register" className="nb-mobile-register-btn">Register</Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;