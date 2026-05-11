import { CreditCard, Banknote, Check } from 'lucide-react';

const paymentOptions = [
  {
    value: 'stripe',
    label: 'Pay with Card (Stripe)',
    icon: CreditCard,
    description: 'Secure payment via Stripe',
  },
  {
    value: 'cod',
    label: 'Cash on Delivery',
    icon: Banknote,
    description: 'Pay when you receive your order',
  },
];

const PaymentForm = ({ paymentMethod, onChange }) => {
  return (
    <div className="space-y-4">
      <h3
        className="text-lg font-extrabold flex items-center gap-2"
        style={{ color: '#f0eeff' }}
      >
        <CreditCard className="w-5 h-5" style={{ color: '#a78bfa' }} />
        Payment Method
      </h3>

      <div className="space-y-2">
        {paymentOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = paymentMethod === option.value;

          return (
            <label
              key={option.value}
              className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200"
              style={{
                background: isSelected
                  ? 'rgba(124,58,237,0.1)'
                  : 'rgba(255,255,255,0.03)',
                border: isSelected
                  ? '1px solid rgba(124,58,237,0.45)'
                  : '1px solid rgba(255,255,255,0.08)',
                boxShadow: isSelected ? '0 0 0 1px rgba(124,58,237,0.2)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }
              }}
            >
              {/* Custom radio */}
              <div
                className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-200"
                style={{
                  border: isSelected
                    ? '2px solid #7c3aed'
                    : '2px solid rgba(255,255,255,0.2)',
                  background: isSelected ? 'rgba(124,58,237,0.2)' : 'transparent',
                }}
                onClick={() => onChange(option.value)}
              >
                {isSelected && (
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: '#a78bfa' }}
                  />
                )}
              </div>

              {/* Icon */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: isSelected
                    ? 'rgba(124,58,237,0.2)'
                    : 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{ color: isSelected ? '#a78bfa' : '#6b7280' }}
                />
              </div>

              {/* Text */}
              <div className="flex-1" onClick={() => onChange(option.value)}>
                <span
                  className="text-sm font-semibold"
                  style={{ color: isSelected ? '#f0eeff' : '#d1d5db' }}
                >
                  {option.label}
                </span>
                <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
                  {option.description}
                </p>
              </div>

              {/* Selected checkmark */}
              {isSelected && (
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#a78bfa' }} />
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentForm;