import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, KeyRound, ShieldCheck, ArrowLeft, Sparkles } from 'lucide-react';

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

  .otp-page {
    font-family: 'Outfit', sans-serif;
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(160deg, #0d0b1e 0%, #080613 100%);
    padding: 24px; position: relative; overflow: hidden;
  }
  .otp-page::before {
    content: '';
    position: fixed; top: -120px; left: -80px;
    width: 360px; height: 360px;
    background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .otp-page::after {
    content: '';
    position: fixed; bottom: -80px; right: -100px;
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(79,70,229,0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  .otp-card {
    position: relative; z-index: 1;
    width: 100%; max-width: 420px;
    background: linear-gradient(135deg, #110f22 0%, #0e0c1e 100%);
    border: 1px solid rgba(139,92,246,0.2);
    border-radius: 20px; padding: 36px 32px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.08);
  }

  /* Brand */
  .otp-brand {
    display: flex; flex-direction: column; align-items: center;
    gap: 6px; margin-bottom: 28px; text-decoration: none;
  }
  .otp-brand-badge {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(124,58,237,0.15); border: 1px solid rgba(139,92,246,0.25);
    border-radius: 20px; padding: 5px 12px;
    font-size: 11px; font-weight: 600; color: #a78bfa;
    letter-spacing: 0.05em; text-transform: uppercase;
    margin-bottom: 8px;
  }
  .otp-brand-name {
    font-size: 28px; font-weight: 700; color: #fff; letter-spacing: -0.03em;
  }
  .otp-brand-name span {
    background: linear-gradient(90deg, #a78bfa, #818cf8);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .otp-divider { border: none; border-top: 1px solid rgba(139,92,246,0.08); margin: 0 0 24px; }

  /* Icon + heading */
  .otp-icon-circle {
    width: 52px; height: 52px; border-radius: 14px;
    background: rgba(124,58,237,0.15); border: 1px solid rgba(139,92,246,0.25);
    display: flex; align-items: center; justify-content: center;
    color: #7c3aed; margin-bottom: 14px;
    transition: all 0.3s ease;
  }
  .otp-title {
    font-size: 20px; font-weight: 700; color: #fff;
    letter-spacing: -0.02em; margin: 0 0 6px;
  }
  .otp-title span {
    background: linear-gradient(90deg, #a78bfa, #818cf8);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .otp-sub {
    font-size: 13px; color: rgba(167,139,250,0.4);
    margin: 0 0 24px; line-height: 1.5;
  }

  /* Step dots */
  .step-indicator { display: flex; align-items: center; gap: 8px; margin-bottom: 24px; }
  .step-dot { width: 28px; height: 6px; border-radius: 3px; transition: all 0.3s ease; }
  .step-dot.active   { background: #7c3aed; box-shadow: 0 0 8px rgba(124,58,237,0.5); }
  .step-dot.inactive { background: rgba(139,92,246,0.15); }
  .step-label { font-size: 11px; font-weight: 600; color: rgba(167,139,250,0.4); text-transform: uppercase; letter-spacing: 0.06em; margin-left: 4px; }

  /* Field */
  .otp-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
  .otp-field-label { font-size: 11px; font-weight: 600; color: rgba(167,139,250,0.5); text-transform: uppercase; letter-spacing: 0.05em; }
  .otp-input-wrap { position: relative; }
  .otp-input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: rgba(167,139,250,0.35); pointer-events: none; }
  .otp-input {
    width: 100%; padding: 11px 14px 11px 38px;
    background: rgba(255,255,255,0.03); border: 1px solid rgba(139,92,246,0.18);
    border-radius: 11px; color: #ddd6fe;
    font-family: 'Outfit', sans-serif; font-size: 13px;
    outline: none; transition: all 0.2s ease; box-sizing: border-box;
  }
  .otp-input::placeholder { color: rgba(167,139,250,0.28); }
  .otp-input:focus {
    border-color: rgba(124,58,237,0.5);
    background: rgba(124,58,237,0.05);
    box-shadow: 0 0 0 3px rgba(124,58,237,0.08);
  }

  /* OTP input special */
  .otp-input.otp-code {
    font-family: 'JetBrains Mono', 'Courier New', monospace;
    font-size: 18px; font-weight: 600;
    letter-spacing: 0.3em; text-align: center;
    padding-left: 14px;
  }

  /* Button */
  .otp-btn {
    width: 100%; padding: 13px; border-radius: 12px; border: none; cursor: pointer;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    color: #fff; font-family: 'Outfit', sans-serif;
    font-size: 14px; font-weight: 700;
    transition: all 0.2s ease;
    box-shadow: 0 4px 16px rgba(124,58,237,0.35);
    margin-top: 6px;
  }
  .otp-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #6d28d9, #5b21b6);
    box-shadow: 0 6px 22px rgba(124,58,237,0.45);
    transform: translateY(-1px);
  }
  .otp-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* Footer links */
  .otp-footer-row { display: flex; align-items: center; justify-content: space-between; margin-top: 20px; }
  .otp-back {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 500; color: rgba(167,139,250,0.4);
    text-decoration: none; transition: color 0.15s ease;
  }
  .otp-back:hover { color: #a78bfa; }
  .otp-login-link {
    font-size: 12px; font-weight: 600; color: rgba(124,58,237,0.7);
    text-decoration: none; transition: color 0.15s ease;
  }
  .otp-login-link:hover { color: #a78bfa; }
`;

const LoginWithOTPPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {
    try {
      setLoading(true);
      await api.post('/auth/send-login-otp', { email });
      toast.success('OTP sent to your email');
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    try {
      setLoading(true);
      const response = await api.post('/auth/verify-login-otp', { email, otp });
      const responseData = response.data;

      // ✅ HANDLE BOTH RESPONSE STRUCTURES
      const authData = responseData.data || responseData;
      localStorage.setItem('accessToken', authData.accessToken);
      localStorage.setItem('refreshToken', authData.refreshToken);

      toast.success('Login successful');

      // ✅ FORCE FULL RELOAD
      window.location.href = '/';
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-page">
      <style>{PAGE_STYLES}</style>

      <div className="otp-card">

        {/* Brand */}
        <Link to="/" className="otp-brand">
          <div className="otp-brand-badge"><Sparkles size={11} /> AI-Powered Shopping</div>
          <div className="otp-brand-name">Reco<span>Mart</span></div>
        </Link>

        <hr className="otp-divider" />

        {/* Icon + heading */}
        <div className="otp-icon-circle">
          {step === 1 ? <Mail size={22} /> : <ShieldCheck size={22} />}
        </div>

        <h1 className="otp-title">
          {step === 1 ? <>Login <span>with OTP</span></> : <>Verify <span>Your OTP</span></>}
        </h1>
        <p className="otp-sub">
          {step === 1
            ? "Enter your email and we'll send a one-time login code."
            : `Enter the OTP sent to ${email}.`}
        </p>

        {/* Step dots */}
        <div className="step-indicator">
          <div className={`step-dot ${step === 1 ? 'active' : 'inactive'}`} />
          <div className={`step-dot ${step === 2 ? 'active' : 'inactive'}`} />
          <span className="step-label">Step {step} of 2</span>
        </div>

        {step === 1 ? (
          <>
            <div className="otp-field">
              <label className="otp-field-label">Email Address</label>
              <div className="otp-input-wrap">
                <Mail size={15} className="otp-input-icon" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendOTP()}
                  className="otp-input"
                />
              </div>
            </div>
            <button onClick={sendOTP} disabled={loading || !email} className="otp-btn">
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </>
        ) : (
          <>
            <div className="otp-field">
              <label className="otp-field-label">One-Time Password</label>
              <div className="otp-input-wrap">
                <input
                  type="text"
                  placeholder="• • • • • •"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && verifyOTP()}
                  className="otp-input otp-code"
                  maxLength={6}
                />
              </div>
            </div>
            <button onClick={verifyOTP} disabled={loading || !otp} className="otp-btn">
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </>
        )}

        <div className="otp-footer-row">
          <Link to="/login" className="otp-back">
            <ArrowLeft size={13} /> Back to Login
          </Link>
          {step === 2 && (
            <button
              type="button"
              onClick={() => { setStep(1); setOtp(''); }}
              className="otp-login-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Resend OTP
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default LoginWithOTPPage;