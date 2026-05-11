import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, LogIn, Mail, Lock, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

const loginSchema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

  .login-page {
    font-family: 'Outfit', sans-serif;
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(160deg, #0d0b1e 0%, #080613 100%);
    padding: 24px; position: relative; overflow: hidden;
  }
  .login-page::before {
    content: '';
    position: fixed; top: -120px; left: -80px;
    width: 360px; height: 360px;
    background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .login-page::after {
    content: '';
    position: fixed; bottom: -80px; right: -100px;
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(79,70,229,0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  /* Card */
  .login-card {
    position: relative; z-index: 1;
    width: 100%; max-width: 420px;
    background: linear-gradient(135deg, #110f22 0%, #0e0c1e 100%);
    border: 1px solid rgba(139,92,246,0.2);
    border-radius: 20px; padding: 36px 32px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.08);
  }

  /* Brand */
  .login-brand {
    display: flex; flex-direction: column; align-items: center;
    gap: 6px; margin-bottom: 28px; text-decoration: none;
  }
  .login-brand-badge {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(124,58,237,0.15); border: 1px solid rgba(139,92,246,0.25);
    border-radius: 20px; padding: 5px 12px;
    font-size: 11px; font-weight: 600; color: #a78bfa;
    letter-spacing: 0.05em; text-transform: uppercase;
    margin-bottom: 8px;
  }
  .login-brand-name {
    font-size: 28px; font-weight: 700; color: #fff;
    letter-spacing: -0.03em;
  }
  .login-brand-name span {
    background: linear-gradient(90deg, #a78bfa, #818cf8);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .login-brand-sub {
    font-size: 13px; color: rgba(167,139,250,0.4); margin: 0;
  }

  /* Divider */
  .login-divider { border: none; border-top: 1px solid rgba(139,92,246,0.08); margin: 24px 0; }

  /* Field */
  .login-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
  .login-field-label {
    font-size: 11px; font-weight: 600; color: rgba(167,139,250,0.5);
    text-transform: uppercase; letter-spacing: 0.05em;
  }
  .login-input-wrap { position: relative; }
  .login-input-icon {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    color: rgba(167,139,250,0.35); pointer-events: none;
  }
  .login-input-icon-right {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    color: rgba(167,139,250,0.35); cursor: pointer; background: none; border: none; padding: 0;
    display: flex; align-items: center;
    transition: color 0.15s ease;
  }
  .login-input-icon-right:hover { color: #a78bfa; }

  .login-input {
    width: 100%; padding: 11px 14px 11px 38px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(139,92,246,0.18);
    border-radius: 11px; color: #ddd6fe;
    font-family: 'Outfit', sans-serif; font-size: 13px;
    outline: none; transition: all 0.2s ease; box-sizing: border-box;
  }
  .login-input::placeholder { color: rgba(167,139,250,0.28); }
  .login-input:focus {
    border-color: rgba(124,58,237,0.5);
    background: rgba(124,58,237,0.05);
    box-shadow: 0 0 0 3px rgba(124,58,237,0.08);
  }
  .login-input.error-border { border-color: rgba(239,68,68,0.4); }
  .login-input.pr-10 { padding-right: 40px; }

  .field-error { font-size: 11px; color: #f87171; }

  /* Forgot link */
  .forgot-link {
    font-size: 12px; font-weight: 500; color: rgba(124,58,237,0.7);
    text-decoration: none; transition: color 0.15s ease;
    display: block; text-align: right; margin-bottom: 20px;
  }
  .forgot-link:hover { color: #a78bfa; }

  /* Submit btn */
  .login-btn {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 13px; border-radius: 12px; border: none; cursor: pointer;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    color: #fff; font-family: 'Outfit', sans-serif;
    font-size: 14px; font-weight: 700;
    transition: all 0.2s ease;
    box-shadow: 0 4px 16px rgba(124,58,237,0.35);
    margin-bottom: 12px;
  }
  .login-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #6d28d9, #5b21b6);
    box-shadow: 0 6px 22px rgba(124,58,237,0.45);
    transform: translateY(-1px);
  }
  .login-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* OTP btn */
  .otp-btn {
    width: 100%; display: flex; align-items: center; justify-content: center;
    padding: 12px; border-radius: 12px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(139,92,246,0.2);
    color: rgba(167,139,250,0.6);
    font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600;
    text-decoration: none; transition: all 0.2s ease;
  }
  .otp-btn:hover {
    background: rgba(124,58,237,0.08);
    border-color: rgba(139,92,246,0.35);
    color: #a78bfa;
  }

  /* Footer text */
  .login-footer {
    text-align: center; font-size: 13px;
    color: rgba(167,139,250,0.35); margin-top: 20px;
  }
  .login-footer a {
    color: #7c3aed; font-weight: 600; text-decoration: none;
    transition: color 0.15s ease;
  }
  .login-footer a:hover { color: #a78bfa; }
`;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      const data = await login(formData.email, formData.password);
      toast.success('Welcome back!');
      const role = data.user?.role;
      if (role === 'admin')        navigate('/admin/dashboard');
      else if (role === 'seller')  navigate('/seller/dashboard');
      else                         navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <style>{PAGE_STYLES}</style>

      <div className="login-card">

        {/* Brand */}
        <Link to="/" className="login-brand">
          <div className="login-brand-badge"><Sparkles size={11} /> AI-Powered Shopping</div>
          <div className="login-brand-name">Reco<span>Mart</span></div>
          <p className="login-brand-sub">Sign in to your account</p>
        </Link>

        <hr className="login-divider" />

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Email */}
          <div className="login-field">
            <label className="login-field-label">Email Address</label>
            <div className="login-input-wrap">
              <Mail size={15} className="login-input-icon" />
              <input
                id="email" type="email"
                {...register('email')}
                placeholder="you@example.com"
                className={`login-input${errors.email ? ' error-border' : ''}`}
              />
            </div>
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </div>

          {/* Password */}
          <div className="login-field">
            <label className="login-field-label">Password</label>
            <div className="login-input-wrap">
              <Lock size={15} className="login-input-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Enter your password"
                className={`login-input pr-10${errors.password ? ' error-border' : ''}`}
              />
              <button type="button" className="login-input-icon-right" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password.message}</span>}
          </div>

          {/* Forgot */}
          <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>

          {/* Submit */}
          <button type="submit" disabled={isSubmitting} className="login-btn">
            <LogIn size={16} />
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        {/* OTP Login */}
        <Link to="/login-otp" className="otp-btn">Login with OTP</Link>

        <p className="login-footer">
          Don't have an account?{' '}
          <Link to="/register">Create an account</Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;