import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, KeyRound, Lock, ShieldCheck, ArrowLeft } from 'lucide-react';

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

  .fp-page {
    font-family: 'Outfit', sans-serif;
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(160deg, #0d0b1e 0%, #080613 100%);
    padding: 24px;
    position: relative; overflow: hidden;
  }

  /* Ambient orbs */
  .fp-page::before {
    content: '';
    position: fixed; top: -120px; left: -80px;
    width: 360px; height: 360px;
    background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .fp-page::after {
    content: '';
    position: fixed; bottom: -80px; right: -100px;
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(79,70,229,0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  /* Card */
  .fp-card {
    position: relative; z-index: 1;
    width: 100%; max-width: 420px;
    background: linear-gradient(135deg, #110f22 0%, #0e0c1e 100%);
    border: 1px solid rgba(139,92,246,0.2);
    border-radius: 20px; padding: 36px 32px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.08);
  }

  /* Badge */
  .fp-badge {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(124,58,237,0.15); border: 1px solid rgba(139,92,246,0.25);
    border-radius: 20px; padding: 5px 12px;
    font-size: 11px; font-weight: 600; color: #a78bfa;
    letter-spacing: 0.05em; text-transform: uppercase;
    margin-bottom: 20px;
  }

  /* Icon circle */
  .fp-icon-circle {
    width: 56px; height: 56px; border-radius: 16px;
    background: rgba(124,58,237,0.15); border: 1px solid rgba(139,92,246,0.25);
    display: flex; align-items: center; justify-content: center;
    color: #7c3aed; margin-bottom: 16px;
  }

  /* Heading */
  .fp-title {
    font-size: 22px; font-weight: 700; color: #fff;
    letter-spacing: -0.02em; margin: 0 0 6px;
  }
  .fp-title span {
    background: linear-gradient(90deg, #a78bfa, #818cf8);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .fp-sub {
    font-size: 13px; color: rgba(167,139,250,0.4);
    margin: 0 0 28px; line-height: 1.5;
  }

  /* Step indicator */
  .step-indicator {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 24px;
  }
  .step-dot {
    width: 28px; height: 6px; border-radius: 3px;
    transition: all 0.3s ease;
  }
  .step-dot.active   { background: #7c3aed; box-shadow: 0 0 8px rgba(124,58,237,0.5); }
  .step-dot.inactive { background: rgba(139,92,246,0.15); }
  .step-label {
    font-size: 11px; font-weight: 600; color: rgba(167,139,250,0.4);
    text-transform: uppercase; letter-spacing: 0.06em; margin-left: 4px;
  }

  /* Field */
  .fp-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
  .fp-field-label {
    font-size: 11px; font-weight: 600; color: rgba(167,139,250,0.5);
    text-transform: uppercase; letter-spacing: 0.05em;
  }
  .fp-input-wrap { position: relative; }
  .fp-input-icon {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    color: rgba(167,139,250,0.35); pointer-events: none;
  }
  .fp-input {
    width: 100%; padding: 11px 14px 11px 38px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(139,92,246,0.18);
    border-radius: 11px; color: #ddd6fe;
    font-family: 'Outfit', sans-serif; font-size: 13px;
    outline: none; transition: all 0.2s ease; box-sizing: border-box;
  }
  .fp-input::placeholder { color: rgba(167,139,250,0.28); }
  .fp-input:focus {
    border-color: rgba(124,58,237,0.5);
    background: rgba(124,58,237,0.05);
    box-shadow: 0 0 0 3px rgba(124,58,237,0.08);
  }

  /* Button */
  .fp-btn {
    width: 100%; padding: 13px;
    border-radius: 12px; border: none; cursor: pointer;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    color: #fff; font-family: 'Outfit', sans-serif;
    font-size: 14px; font-weight: 700;
    transition: all 0.2s ease;
    box-shadow: 0 4px 16px rgba(124,58,237,0.35);
    margin-top: 6px;
  }
  .fp-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #6d28d9, #5b21b6);
    box-shadow: 0 6px 22px rgba(124,58,237,0.45);
    transform: translateY(-1px);
  }
  .fp-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* Back link */
  .fp-back {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 500; color: rgba(167,139,250,0.4);
    text-decoration: none; margin-top: 18px;
    transition: color 0.15s ease;
  }
  .fp-back:hover { color: #a78bfa; }

  /* Divider */
  .fp-divider { border: none; border-top: 1px solid rgba(139,92,246,0.08); margin: 20px 0 0; }
`;

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {
    try {
      setLoading(true);
      await api.post('/auth/send-reset-otp', { email });
      toast.success('OTP sent to your email');
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    try {
      setLoading(true);
      await api.post('/auth/reset-password', { email, otp, newPassword });
      toast.success('Password reset successful');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Reset password failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-page">
      <style>{PAGE_STYLES}</style>

      <div className="fp-card">
        {/* Badge */}
        <div className="fp-badge">
          <ShieldCheck size={12} /> Account Recovery
        </div>

        {/* Icon + heading */}
        <div className="fp-icon-circle">
          {step === 1 ? <Mail size={24} /> : <KeyRound size={24} />}
        </div>

        <h1 className="fp-title">
          {step === 1 ? <>Forgot <span>Password?</span></> : <>Reset <span>Password</span></>}
        </h1>
        <p className="fp-sub">
          {step === 1
            ? "Enter your email and we'll send you a one-time password."
            : `Enter the OTP sent to ${email} and choose a new password.`}
        </p>

        {/* Step indicator */}
        <div className="step-indicator">
          <div className={`step-dot ${step === 1 ? 'active' : 'inactive'}`} />
          <div className={`step-dot ${step === 2 ? 'active' : 'inactive'}`} />
          <span className="step-label">Step {step} of 2</span>
        </div>

        {step === 1 ? (
          <>
            <div className="fp-field">
              <label className="fp-field-label">Email Address</label>
              <div className="fp-input-wrap">
                <Mail size={15} className="fp-input-icon" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="fp-input"
                  onKeyDown={(e) => e.key === 'Enter' && sendOTP()}
                />
              </div>
            </div>

            <button onClick={sendOTP} disabled={loading || !email} className="fp-btn">
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </>
        ) : (
          <>
            <div className="fp-field">
              <label className="fp-field-label">One-Time Password</label>
              <div className="fp-input-wrap">
                <KeyRound size={15} className="fp-input-icon" />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="fp-input"
                />
              </div>
            </div>

            <div className="fp-field">
              <label className="fp-field-label">New Password</label>
              <div className="fp-input-wrap">
                <Lock size={15} className="fp-input-icon" />
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="fp-input"
                  onKeyDown={(e) => e.key === 'Enter' && resetPassword()}
                />
              </div>
            </div>

            <button onClick={resetPassword} disabled={loading || !otp || !newPassword} className="fp-btn">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </>
        )}

        <hr className="fp-divider" />
        <div style={{ textAlign: 'center' }}>
          <Link to="/login" className="fp-back">
            <ArrowLeft size={13} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;