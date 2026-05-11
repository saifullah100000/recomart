import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, UserPlus, Sparkles, User, Store, Mail, Lock, Building2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

/* ─── Schema (unchanged) ─────────────────────────────────────────────────── */
const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    role: z.enum(['customer', 'seller']),
    businessName: z.string().optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine(
    (d) => {
      if (d.role === 'seller') return d.businessName && d.businessName.trim().length >= 2;
      return true;
    },
    { message: 'Business name is required for sellers', path: ['businessName'] }
  );

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const RG_STYLE_ID = 'rg-styles';
if (typeof document !== 'undefined' && !document.getElementById(RG_STYLE_ID)) {
  const tag = document.createElement('style');
  tag.id = RG_STYLE_ID;
  tag.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

    .rg-root {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2.5rem 1rem;
      background: #080b1a;
      font-family: 'DM Sans', sans-serif;
      position: relative;
      overflow: hidden;
    }

    /* Ambient blobs */
    .rg-blob {
      position: fixed;
      border-radius: 50%;
      pointer-events: none;
      filter: blur(100px);
      z-index: 0;
    }
    .rg-blob-1 {
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(109,40,217,0.18) 0%, transparent 65%);
      top: -150px; left: -150px;
    }
    .rg-blob-2 {
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 65%);
      bottom: -100px; right: -100px;
    }

    /* Grid texture */
    .rg-grid {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background-image:
        linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px);
      background-size: 48px 48px;
    }

    /* ── Card ── */
    .rg-card {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 440px;
      background: rgba(12, 15, 30, 0.85);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(139,92,246,0.2);
      border-radius: 20px;
      padding: 2.25rem 2rem;
      box-shadow: 0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04);
    }

    /* Top accent line */
    .rg-card::before {
      content: '';
      position: absolute;
      top: 0; left: 10%; right: 10%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent);
      border-radius: 0 0 4px 4px;
    }

    /* ── Header ── */
    .rg-header { text-align: center; margin-bottom: 1.75rem; }
    .rg-logo {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      text-decoration: none;
      margin-bottom: 1rem;
    }
    .rg-logo-icon {
      width: 34px; height: 34px;
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 3px 14px rgba(124,58,237,0.4);
    }
    .rg-logo-text {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: 1.35rem;
      color: #f1f5f9;
      letter-spacing: -0.02em;
    }
    .rg-logo-accent {
      background: linear-gradient(135deg, #a78bfa, #60a5fa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .rg-headline {
      font-family: 'Syne', sans-serif;
      font-size: 1.2rem;
      font-weight: 700;
      color: #f1f5f9;
      margin: 0 0 0.3rem;
    }
    .rg-sub { font-size: 0.8rem; color: #475569; font-weight: 300; }

    /* ── Role switcher ── */
    .rg-switcher {
      display: flex;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 12px;
      padding: 4px;
      margin-bottom: 1.5rem;
      gap: 4px;
    }
    .rg-role-btn {
      flex: 1;
      display: flex; align-items: center; justify-content: center;
      gap: 0.4rem;
      padding: 0.55rem 0.5rem;
      border-radius: 9px;
      font-size: 0.82rem;
      font-weight: 500;
      font-family: 'DM Sans', sans-serif;
      border: none;
      cursor: pointer;
      transition: background 0.2s, color 0.2s, box-shadow 0.2s;
      color: #475569;
      background: transparent;
    }
    .rg-role-btn.active {
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      color: #fff;
      box-shadow: 0 3px 12px rgba(124,58,237,0.3);
    }
    .rg-role-btn:not(.active):hover { color: #94a3b8; background: rgba(255,255,255,0.04); }

    /* ── Form ── */
    .rg-form { display: flex; flex-direction: column; gap: 1.1rem; }

    .rg-field { display: flex; flex-direction: column; gap: 0.35rem; }
    .rg-label {
      font-size: 0.75rem;
      font-weight: 500;
      color: #64748b;
      letter-spacing: 0.04em;
    }

    /* Input wrapper */
    .rg-input-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }
    .rg-input-icon {
      position: absolute;
      left: 0.85rem;
      color: #334155;
      pointer-events: none;
      transition: color 0.2s;
      z-index: 1;
    }
    .rg-input-wrap:focus-within .rg-input-icon { color: #7c3aed; }

    .rg-input {
      width: 100%;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      padding: 0.65rem 0.9rem 0.65rem 2.5rem;
      font-size: 0.85rem;
      color: #e2e8f0;
      font-family: 'DM Sans', sans-serif;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    }
    .rg-input::placeholder { color: #1e293b; }
    .rg-input:focus {
      border-color: rgba(139,92,246,0.5);
      box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
      background: rgba(255,255,255,0.06);
    }
    .rg-input.error { border-color: rgba(239,68,68,0.45); }
    .rg-input.error:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.1); }

    /* Password toggle */
    .rg-eye {
      position: absolute;
      right: 0.85rem;
      background: transparent;
      border: none;
      cursor: pointer;
      color: #334155;
      display: flex; align-items: center;
      padding: 2px;
      transition: color 0.15s;
    }
    .rg-eye:hover { color: #94a3b8; }

    /* Error message */
    .rg-error {
      font-size: 0.72rem;
      color: #f87171;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }
    .rg-error::before {
      content: '⚠';
      font-size: 0.65rem;
    }

    /* ── Submit button ── */
    .rg-submit {
      width: 100%;
      display: flex; align-items: center; justify-content: center;
      gap: 0.5rem;
      padding: 0.8rem 1.5rem;
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      border: none;
      border-radius: 11px;
      color: #fff;
      font-size: 0.88rem;
      font-weight: 500;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.2s;
      box-shadow: 0 4px 20px rgba(124,58,237,0.35);
      margin-top: 0.35rem;
    }
    .rg-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
    .rg-submit:disabled { opacity: 0.5; cursor: not-allowed; }

    /* ── Footer link ── */
    .rg-footer {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.8rem;
      color: #334155;
    }
    .rg-footer a {
      color: #a78bfa;
      font-weight: 500;
      text-decoration: none;
      transition: color 0.15s;
    }
    .rg-footer a:hover { color: #c4b5fd; }

    /* Divider */
    .rg-divider {
      height: 1px;
      background: rgba(255,255,255,0.05);
      margin: 1.5rem 0 1.25rem;
    }
  `;
  document.head.appendChild(tag);
}

/* ─── Component ──────────────────────────────────────────────────────────── */
const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'customer' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };
      if (formData.role === 'seller') payload.businessName = formData.businessName;
      const data = await registerUser(payload);
      toast.success('Account created successfully!');
      navigate(data.user?.role === 'seller' ? '/seller/dashboard' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const Field = ({ id, label, icon: Icon, error, children }) => (
    <div className="rg-field">
      <label htmlFor={id} className="rg-label">{label}</label>
      <div className="rg-input-wrap">
        <Icon size={14} className="rg-input-icon" />
        {children}
      </div>
      {error && <p className="rg-error">{error.message}</p>}
    </div>
  );

  return (
    <div className="rg-root">
      <div className="rg-blob rg-blob-1" />
      <div className="rg-blob rg-blob-2" />
      <div className="rg-grid" />

      <div className="rg-card">
        {/* Header */}
        <div className="rg-header">
          <Link to="/" className="rg-logo">
            <span className="rg-logo-icon"><Sparkles size={16} color="#fff" /></span>
            <span className="rg-logo-text">Reco<span className="rg-logo-accent">Mart</span></span>
          </Link>
          <h1 className="rg-headline">Create your account</h1>
          <p className="rg-sub">Join 200K+ shoppers discovering amazing products</p>
        </div>

        {/* Role switcher */}
        <div className="rg-switcher">
          <button
            type="button"
            className={`rg-role-btn ${selectedRole === 'customer' ? 'active' : ''}`}
            onClick={() => setValue('role', 'customer', { shouldValidate: true })}
          >
            <User size={13} /> Customer
          </button>
          <button
            type="button"
            className={`rg-role-btn ${selectedRole === 'seller' ? 'active' : ''}`}
            onClick={() => setValue('role', 'seller', { shouldValidate: true })}
          >
            <Store size={13} /> Seller
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="rg-form">

          <Field id="fullName" label="Full Name" icon={User} error={errors.fullName}>
            <input
              id="fullName"
              type="text"
              {...register('fullName')}
              className={`rg-input ${errors.fullName ? 'error' : ''}`}
              placeholder="John Doe"
            />
          </Field>

          <Field id="email" label="Email Address" icon={Mail} error={errors.email}>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`rg-input ${errors.email ? 'error' : ''}`}
              placeholder="you@example.com"
            />
          </Field>

          {selectedRole === 'seller' && (
            <Field id="businessName" label="Business Name" icon={Building2} error={errors.businessName}>
              <input
                id="businessName"
                type="text"
                {...register('businessName')}
                className={`rg-input ${errors.businessName ? 'error' : ''}`}
                placeholder="Your Business Name"
              />
            </Field>
          )}

          <Field id="password" label="Password" icon={Lock} error={errors.password}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className={`rg-input ${errors.password ? 'error' : ''}`}
              placeholder="Min. 6 characters"
              style={{ paddingRight: '2.5rem' }}
            />
            <button type="button" className="rg-eye" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </Field>

          <Field id="confirmPassword" label="Confirm Password" icon={Lock} error={errors.confirmPassword}>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              className={`rg-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Repeat your password"
            />
          </Field>

          <button type="submit" disabled={isSubmitting} className="rg-submit">
            {isSubmitting
              ? <><span className="rg-spinner" style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block', animation:'ldr-spin 0.7s linear infinite' }} /> Creating account…</>
              : <><UserPlus size={15} /> Create Account</>}
          </button>
        </form>

        <div className="rg-divider" />

        <p className="rg-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in <ArrowRight size={11} style={{ display:'inline', verticalAlign:'middle' }} /></Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;