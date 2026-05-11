import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Plus, Check } from 'lucide-react';

const addressSchema = z.object({
  label: z.string().min(1, 'Label is required').max(50),
  street: z.string().min(1, 'Street address is required').max(200),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State/Province is required').max(100),
  zipCode: z.string().min(1, 'Zip code is required').max(20),
  country: z.string().min(1, 'Country is required').max(100),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[\d\s+\-()]+$/, 'Invalid phone number'),
});

/* ── reusable input style helpers ── */
const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#f0eeff',
  borderRadius: '10px',
};

const inputFocus = (e) => {
  e.currentTarget.style.border = '1px solid rgba(124,58,237,0.5)';
  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)';
};
const inputBlur = (e) => {
  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)';
  e.currentTarget.style.boxShadow = 'none';
};

const Field = ({ label, error, children }) => (
  <div>
    <label
      className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
      style={{ color: '#6b7280' }}
    >
      {label}
    </label>
    {children}
    {error && (
      <p className="text-xs mt-1" style={{ color: '#f87171' }}>
        {error}
      </p>
    )}
  </div>
);

const AddressForm = ({ addresses = [], selectedAddress, onSelect, onAddNew }) => {
  const [showNewForm, setShowNewForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Pakistan',
      phone: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await onAddNew(data);
      reset();
      setShowNewForm(false);
    } catch (err) {
      console.error('Address submit error:', err);
    }
  };

  /* shared className for all text inputs */
  const inputCls =
    'w-full px-3 py-2 text-sm outline-none transition-all duration-200';

  return (
    <div className="space-y-4">
      {/* Section heading */}
      <h3
        className="text-lg font-extrabold flex items-center gap-2"
        style={{ color: '#f0eeff' }}
      >
        <MapPin className="w-5 h-5" style={{ color: '#a78bfa' }} />
        Shipping Address
      </h3>

      {/* ── Saved Addresses ── */}
      {addresses.length > 0 && (
        <div className="space-y-2">
          {addresses.filter(Boolean).map((address) => {
            const isSelected = selectedAddress === address._id;
            return (
              <label
                key={address._id}
                className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200"
                style={{
                  background: isSelected
                    ? 'rgba(124,58,237,0.1)'
                    : 'rgba(255,255,255,0.03)',
                  border: isSelected
                    ? '1px solid rgba(124,58,237,0.45)'
                    : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: isSelected
                    ? '0 0 0 1px rgba(124,58,237,0.2)'
                    : 'none',
                }}
              >
                {/* Custom radio */}
                <div
                  className="mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-200"
                  style={{
                    border: isSelected
                      ? '2px solid #7c3aed'
                      : '2px solid rgba(255,255,255,0.2)',
                    background: isSelected
                      ? 'rgba(124,58,237,0.2)'
                      : 'transparent',
                  }}
                  onClick={() => onSelect(address._id)}
                >
                  {isSelected && (
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: '#a78bfa' }}
                    />
                  )}
                </div>

                <div className="flex-1 text-sm" onClick={() => onSelect(address._id)}>
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: '#f0eeff' }}>
                      {address.label}
                    </span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5" style={{ color: '#a78bfa' }} />
                    )}
                  </div>
                  <p className="mt-0.5" style={{ color: '#9ca3af' }}>{address.street}</p>
                  <p style={{ color: '#9ca3af' }}>
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p style={{ color: '#9ca3af' }}>{address.country}</p>
                  <p className="mt-1" style={{ color: '#6b7280' }}>{address.phone}</p>
                </div>
              </label>
            );
          })}
        </div>
      )}

      {/* ── Add New Address Button ── */}
      {!showNewForm && (
        <button
          type="button"
          onClick={() => setShowNewForm(true)}
          className="flex items-center gap-2 text-sm font-semibold transition-all duration-200"
          style={{ color: '#a78bfa' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#c4b5fd'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#a78bfa'; }}
        >
          <Plus className="w-4 h-4" />
          Add New Address
        </button>
      )}

      {/* ── New Address Form ── */}
      {showNewForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl p-5 space-y-4"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          }}
        >
          <h4
            className="text-sm font-bold uppercase tracking-widest"
            style={{ color: '#a78bfa' }}
          >
            New Address
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Label" error={errors.label?.message}>
              <input
                type="text"
                {...register('label')}
                placeholder="e.g. Home, Office"
                className={inputCls}
                style={inputStyle}
                onFocus={inputFocus}
                onBlur={inputBlur}
              />
            </Field>

            <Field label="Phone" error={errors.phone?.message}>
              <input
                type="text"
                {...register('phone')}
                placeholder="+92 300 1234567"
                className={inputCls}
                style={inputStyle}
                onFocus={inputFocus}
                onBlur={inputBlur}
              />
            </Field>
          </div>

          <Field label="Street Address" error={errors.street?.message}>
            <input
              type="text"
              {...register('street')}
              placeholder="123 Main Street"
              className={inputCls}
              style={inputStyle}
              onFocus={inputFocus}
              onBlur={inputBlur}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="City" error={errors.city?.message}>
              <input
                type="text"
                {...register('city')}
                placeholder="Lahore"
                className={inputCls}
                style={inputStyle}
                onFocus={inputFocus}
                onBlur={inputBlur}
              />
            </Field>

            <Field label="State / Province" error={errors.state?.message}>
              <input
                type="text"
                {...register('state')}
                placeholder="Punjab"
                className={inputCls}
                style={inputStyle}
                onFocus={inputFocus}
                onBlur={inputBlur}
              />
            </Field>

            <Field label="Zip Code" error={errors.zipCode?.message}>
              <input
                type="text"
                {...register('zipCode')}
                placeholder="54000"
                className={inputCls}
                style={inputStyle}
                onFocus={inputFocus}
                onBlur={inputBlur}
              />
            </Field>
          </div>

          <Field label="Country" error={errors.country?.message}>
            <input
              type="text"
              {...register('country')}
              className={inputCls}
              style={inputStyle}
              onFocus={inputFocus}
              onBlur={inputBlur}
            />
          </Field>

          {/* Action buttons */}
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold rounded-xl transition-all duration-200"
              style={{
                background: isSubmitting
                  ? 'rgba(124,58,237,0.3)'
                  : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                color: '#ffffff',
                boxShadow: isSubmitting ? 'none' : '0 4px 15px rgba(124,58,237,0.35)',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting)
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.55)';
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting)
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(124,58,237,0.35)';
              }}
            >
              {isSubmitting ? 'Saving…' : 'Save Address'}
            </button>

            <button
              type="button"
              onClick={() => { setShowNewForm(false); reset(); }}
              className="px-5 py-2 text-sm font-semibold rounded-xl transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#9ca3af',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.09)';
                e.currentTarget.style.color = '#e5e7eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.color = '#9ca3af';
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddressForm;