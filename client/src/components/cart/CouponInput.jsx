import { useState } from 'react';
import { Tag } from 'lucide-react';
import toast from 'react-hot-toast';

const CouponInput = () => {
  const [couponCode, setCouponCode] = useState('');

  const handleApply = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    toast('Coupon feature coming soon', { icon: '🎟️' });
    setCouponCode('');
  };

  return (
    <form
      onSubmit={handleApply}
      className="rounded-2xl p-4"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <label
        className="flex items-center gap-2 text-sm font-semibold mb-3"
        style={{ color: '#a78bfa' }}
      >
        <Tag className="w-4 h-4" />
        Coupon Code
      </label>

      <div className="flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter coupon code"
          className="flex-1 px-3 py-2 text-sm rounded-xl outline-none transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#f0eeff',
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = '1px solid rgba(124,58,237,0.5)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            color: '#ffffff',
            boxShadow: '0 4px 15px rgba(124,58,237,0.35)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.55)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(124,58,237,0.35)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Apply
        </button>
      </div>
    </form>
  );
};

export default CouponInput;