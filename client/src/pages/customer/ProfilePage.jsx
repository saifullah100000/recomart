import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  User, Mail, Phone, Camera, Lock,
  MapPin, Plus, Pencil, Trash2, Save, X, ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
import Loader from '../../components/common/Loader';

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

  .profile-page {
    font-family: 'Outfit', sans-serif;
    max-width: 720px; margin: 0 auto;
    padding: 40px 24px;
  }

  /* ── Page header ── */
  .profile-heading {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 32px;
  }
  .profile-heading-icon {
    width: 42px; height: 42px; border-radius: 12px;
    background: rgba(124,58,237,0.15); border: 1px solid rgba(139,92,246,0.25);
    display: flex; align-items: center; justify-content: center; color: #7c3aed;
  }
  .profile-heading h1 {
    font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.02em; margin: 0;
  }
  .profile-heading h1 span {
    background: linear-gradient(90deg,#a78bfa,#818cf8);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  /* ── Section card ── */
  .section-card {
    background: linear-gradient(135deg, #110f22 0%, #0e0c1e 100%);
    border: 1px solid rgba(139,92,246,0.18);
    border-radius: 16px; padding: 24px;
    margin-bottom: 20px; position: relative; overflow: hidden;
  }
  .section-card::before {
    content: '';
    position: absolute; top: -50px; right: -50px;
    width: 160px; height: 160px;
    background: radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  .section-title {
    display: flex; align-items: center; gap: 9px;
    font-size: 13px; font-weight: 600; color: #a78bfa;
    letter-spacing: 0.06em; text-transform: uppercase;
    margin-bottom: 22px;
  }
  .section-title-icon {
    width: 28px; height: 28px; border-radius: 8px;
    background: rgba(124,58,237,0.15); border: 1px solid rgba(139,92,246,0.2);
    display: flex; align-items: center; justify-content: center; color: #7c3aed;
    flex-shrink: 0;
  }

  /* ── Avatar ── */
  .avatar-row { display: flex; align-items: center; gap: 18px; margin-bottom: 24px; }
  .avatar-wrap { position: relative; flex-shrink: 0; }
  .avatar-circle {
    width: 80px; height: 80px; border-radius: 50%;
    overflow: hidden;
    border: 2px solid rgba(139,92,246,0.3);
    background: rgba(124,58,237,0.08);
    display: flex; align-items: center; justify-content: center;
  }
  .avatar-circle img { width: 100%; height: 100%; object-fit: cover; }
  .avatar-circle .avatar-placeholder { color: rgba(167,139,250,0.4); }
  .avatar-cam-btn {
    position: absolute; bottom: -2px; right: -2px;
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    border: 2px solid #0e0c1e;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.15s ease;
    color: #fff;
  }
  .avatar-cam-btn:hover { transform: scale(1.1); }
  .avatar-meta-name { font-size: 14px; font-weight: 600; color: #ddd6fe; }
  .avatar-meta-hint { font-size: 12px; color: rgba(167,139,250,0.4); margin-top: 3px; }

  /* ── Form grid ── */
  .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
  @media (max-width: 600px) {
    .form-grid-2 { grid-template-columns: 1fr; }
    .form-grid-3 { grid-template-columns: 1fr; }
  }
  .col-span-2 { grid-column: span 2; }
  @media (max-width: 600px) { .col-span-2 { grid-column: span 1; } }

  /* ── Form field ── */
  .field { display: flex; flex-direction: column; gap: 5px; }
  .field-label { font-size: 11px; font-weight: 600; color: rgba(167,139,250,0.5); letter-spacing: 0.05em; text-transform: uppercase; }
  .field-input-wrap { position: relative; }
  .field-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: rgba(167,139,250,0.35); pointer-events: none; }

  .theme-input {
    width: 100%; padding: 10px 12px;
    background: rgba(255,255,255,0.03); border: 1px solid rgba(139,92,246,0.18);
    border-radius: 10px; color: #ddd6fe;
    font-family: 'Outfit', sans-serif; font-size: 13px;
    outline: none; transition: all 0.2s ease; box-sizing: border-box;
  }
  .theme-input.with-icon { padding-left: 36px; }
  .theme-input::placeholder { color: rgba(167,139,250,0.28); }
  .theme-input:focus { border-color: rgba(124,58,237,0.45); background: rgba(124,58,237,0.05); box-shadow: 0 0 0 3px rgba(124,58,237,0.08); }
  .theme-input.readonly { background: rgba(255,255,255,0.02); border-color: rgba(139,92,246,0.1); color: rgba(167,139,250,0.35); cursor: not-allowed; }

  .field-error { font-size: 11px; color: #f87171; }

  /* ── Buttons ── */
  .btn-primary {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 20px; border-radius: 10px;
    background: linear-gradient(135deg, #7c3aed, #6d28d9); border: none;
    color: #fff; font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.2s ease;
    box-shadow: 0 4px 14px rgba(124,58,237,0.3);
    margin-top: 18px;
  }
  .btn-primary:hover { background: linear-gradient(135deg, #6d28d9, #5b21b6); box-shadow: 0 6px 18px rgba(124,58,237,0.4); transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .btn-dark {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 20px; border-radius: 10px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(139,92,246,0.2);
    color: rgba(167,139,250,0.8); font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.2s ease; margin-top: 18px;
  }
  .btn-dark:hover { background: rgba(124,58,237,0.1); border-color: rgba(139,92,246,0.35); color: #a78bfa; }
  .btn-dark:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-ghost {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: 9px;
    background: rgba(255,255,255,0.02); border: 1px solid rgba(139,92,246,0.15);
    color: rgba(167,139,250,0.5); font-family: 'Outfit', sans-serif; font-size: 12px; font-weight: 500;
    cursor: pointer; transition: all 0.15s ease;
  }
  .btn-ghost:hover { background: rgba(124,58,237,0.07); color: #a78bfa; }

  /* ── Address list ── */
  .address-item {
    display: flex; align-items: flex-start; justify-content: space-between;
    padding: 14px 16px; border-radius: 12px;
    border: 1px solid rgba(139,92,246,0.1);
    background: rgba(124,58,237,0.04);
    margin-bottom: 10px; transition: border-color 0.15s ease;
  }
  .address-item:hover { border-color: rgba(139,92,246,0.22); }
  .address-label { font-size: 12px; font-weight: 700; color: #a78bfa; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 5px; }
  .address-line { font-size: 12px; color: rgba(167,139,250,0.5); line-height: 1.6; }
  .address-phone { font-size: 12px; color: rgba(167,139,250,0.35); margin-top: 4px; }

  .address-actions { display: flex; gap: 4px; flex-shrink: 0; margin-left: 12px; }
  .addr-btn {
    width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
    border: none; border-radius: 8px; cursor: pointer; transition: all 0.15s ease;
  }
  .addr-edit { background: rgba(124,58,237,0.1); color: rgba(167,139,250,0.6); }
  .addr-edit:hover { background: rgba(124,58,237,0.2); color: #a78bfa; }
  .addr-del { background: rgba(239,68,68,0.07); color: rgba(248,113,113,0.5); }
  .addr-del:hover { background: rgba(239,68,68,0.18); color: #f87171; }

  .empty-address { text-align: center; padding: 24px; font-size: 13px; color: rgba(167,139,250,0.3); }

  /* ── Address form ── */
  .address-form-box {
    background: rgba(124,58,237,0.04); border: 1px solid rgba(139,92,246,0.15);
    border-radius: 12px; padding: 18px; margin-top: 4px;
  }
  .address-form-title { font-size: 12px; font-weight: 600; color: #a78bfa; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 16px; }
  .address-form-btns { display: flex; gap: 8px; margin-top: 14px; }

  /* ── Add address link ── */
  .add-addr-btn {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 600; color: #7c3aed;
    background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.2);
    border-radius: 8px; padding: 6px 12px;
    cursor: pointer; transition: all 0.15s ease;
  }
  .add-addr-btn:hover { background: rgba(124,58,237,0.18); color: #a78bfa; }

  .section-header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
`;

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressLoading, setAddressLoading] = useState(true);

  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors, isSubmitting: profileSubmitting }, reset: resetProfile } = useForm({ defaultValues: { fullName: '', email: '', phone: '' } });

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors, isSubmitting: passwordSubmitting }, reset: resetPassword, watch: watchPassword } = useForm({ defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' } });

  const { register: registerAddress, handleSubmit: handleAddressSubmit, formState: { errors: addressErrors, isSubmitting: addressSubmitting }, reset: resetAddress, setValue: setAddressValue } = useForm({ defaultValues: { label: '', street: '', city: '', state: '', zipCode: '', country: 'Pakistan', phone: '' } });

  useEffect(() => {
    if (user) {
      resetProfile({ fullName: user.fullName || '', email: user.email || '', phone: user.phone || '' });
      setAvatarPreview(user.avatar?.url || null);
    }
  }, [user, resetProfile]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await api.get('/users/addresses');
        setAddresses(data.addresses || []);
      } catch { setAddresses([]); }
      finally { setAddressLoading(false); }
    };
    fetchAddresses();
  }, []);

  const onProfileSubmit = async (formData) => {
    try {
      const payload = new FormData();
      payload.append('fullName', formData.fullName);
      payload.append('phone', formData.phone);
      if (avatarFile) payload.append('avatar', avatarFile);
      const { data } = await api.put('/users/profile', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser(data.user);
      toast.success('Profile updated successfully');
    } catch (error) { toast.error(error.response?.data?.message || 'Failed to update profile'); }
  };

  const onPasswordSubmit = async (formData) => {
    if (formData.newPassword !== formData.confirmNewPassword) { toast.error('Passwords do not match'); return; }
    try {
      await api.put('/users/password', { currentPassword: formData.currentPassword, newPassword: formData.newPassword });
      toast.success('Password changed successfully');
      resetPassword();
    } catch (error) { toast.error(error.response?.data?.message || 'Failed to change password'); }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const onAddressSubmit = async (formData) => {
    try {
      if (editingAddress) {
        const { data } = await api.put(`/users/addresses/${editingAddress._id}`, formData);
        setAddresses(prev => prev.map(a => a._id === editingAddress._id ? data.address : a));
        toast.success('Address updated');
      } else {
        const { data } = await api.post('/users/addresses', formData);
        setAddresses(prev => [...prev, data.address]);
        toast.success('Address added');
      }
      resetAddress(); setShowAddressForm(false); setEditingAddress(null);
    } catch (error) { toast.error(error.response?.data?.message || 'Failed to save address'); }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address); setShowAddressForm(true);
    Object.entries(address).forEach(([key, value]) => {
      if (['label', 'street', 'city', 'state', 'zipCode', 'country', 'phone'].includes(key)) setAddressValue(key, value);
    });
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await api.delete(`/users/addresses/${addressId}`);
      setAddresses(prev => prev.filter(a => a._id !== addressId));
      toast.success('Address deleted');
    } catch (error) { toast.error(error.response?.data?.message || 'Failed to delete address'); }
  };

  const cancelAddressForm = () => { setShowAddressForm(false); setEditingAddress(null); resetAddress(); };
  const newPassword = watchPassword('newPassword');

  return (
    <div className="profile-page">
      <style>{PAGE_STYLES}</style>

      {/* Header */}
      <div className="profile-heading">
        <div className="profile-heading-icon"><User size={20} /></div>
        <h1>My <span>Profile</span></h1>
      </div>

      {/* ── Profile Info ── */}
      <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="section-card">
        <div className="section-title">
          <div className="section-title-icon"><User size={13} /></div>
          Profile Information
        </div>

        <div className="avatar-row">
          <div className="avatar-wrap">
            <div className="avatar-circle">
              {avatarPreview
                ? <img src={avatarPreview} alt="Avatar" />
                : <User size={32} className="avatar-placeholder" />
              }
            </div>
            <label className="avatar-cam-btn">
              <Camera size={13} />
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" style={{ display: 'none' }} />
            </label>
          </div>
          <div>
            <div className="avatar-meta-name">{user?.fullName || '—'}</div>
            <div className="avatar-meta-hint">Upload a profile picture (JPG, PNG)</div>
          </div>
        </div>

        <div className="form-grid-2" style={{ marginBottom: 0 }}>
          <div className="field">
            <label className="field-label">Full Name</label>
            <div className="field-input-wrap">
              <User size={14} className="field-icon" />
              <input type="text" {...registerProfile('fullName', { required: 'Full name is required' })} className="theme-input with-icon" />
            </div>
            {profileErrors.fullName && <span className="field-error">{profileErrors.fullName.message}</span>}
          </div>

          <div className="field">
            <label className="field-label">Email</label>
            <div className="field-input-wrap">
              <Mail size={14} className="field-icon" />
              <input type="email" {...registerProfile('email')} readOnly className="theme-input with-icon readonly" />
            </div>
          </div>

          <div className="field col-span-2">
            <label className="field-label">Phone</label>
            <div className="field-input-wrap">
              <Phone size={14} className="field-icon" />
              <input type="text" {...registerProfile('phone')} placeholder="+92 300 1234567" className="theme-input with-icon" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={profileSubmitting} className="btn-primary">
          <Save size={14} /> {profileSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* ── Change Password ── */}
      <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="section-card">
        <div className="section-title">
          <div className="section-title-icon"><ShieldCheck size={13} /></div>
          Change Password
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 400 }}>
          {[
            { name: 'currentPassword', label: 'Current Password', rules: { required: 'Current password is required' }, error: passwordErrors.currentPassword },
            { name: 'newPassword', label: 'New Password', rules: { required: 'New password is required', minLength: { value: 6, message: 'Minimum 6 characters' } }, error: passwordErrors.newPassword },
            { name: 'confirmNewPassword', label: 'Confirm New Password', rules: { required: 'Please confirm your password', validate: v => v === newPassword || 'Passwords do not match' }, error: passwordErrors.confirmNewPassword },
          ].map(({ name, label, rules, error }) => (
            <div key={name} className="field">
              <label className="field-label">{label}</label>
              <input type="password" {...registerPassword(name, rules)} className="theme-input" />
              {error && <span className="field-error">{error.message}</span>}
            </div>
          ))}
        </div>

        <button type="submit" disabled={passwordSubmitting} className="btn-dark">
          <Lock size={14} /> {passwordSubmitting ? 'Changing...' : 'Change Password'}
        </button>
      </form>

      {/* ── Addresses ── */}
      <div className="section-card">
        <div className="section-header-row">
          <div className="section-title" style={{ marginBottom: 0 }}>
            <div className="section-title-icon"><MapPin size={13} /></div>
            Saved Addresses
          </div>
          {!showAddressForm && (
            <button type="button" className="add-addr-btn" onClick={() => { resetAddress(); setEditingAddress(null); setShowAddressForm(true); }}>
              <Plus size={13} /> Add Address
            </button>
          )}
        </div>

        {addressLoading ? (
          <Loader size="sm" />
        ) : (
          <>
            {addresses.length === 0 && !showAddressForm && (
              <div className="empty-address">No saved addresses yet.</div>
            )}

            {addresses.map((address) => (
              <div key={address._id} className="address-item">
                <div>
                  <div className="address-label">{address.label}</div>
                  <div className="address-line">{address.street}</div>
                  <div className="address-line">{address.city}, {address.state} {address.zipCode}</div>
                  <div className="address-line">{address.country}</div>
                  {address.phone && <div className="address-phone">{address.phone}</div>}
                </div>
                <div className="address-actions">
                  <button type="button" className="addr-btn addr-edit" onClick={() => handleEditAddress(address)} title="Edit"><Pencil size={13} /></button>
                  <button type="button" className="addr-btn addr-del" onClick={() => handleDeleteAddress(address._id)} title="Delete"><Trash2 size={13} /></button>
                </div>
              </div>
            ))}

            {showAddressForm && (
              <form onSubmit={handleAddressSubmit(onAddressSubmit)} className="address-form-box">
                <div className="address-form-title">{editingAddress ? 'Edit Address' : 'New Address'}</div>

                <div className="form-grid-2" style={{ marginBottom: 12 }}>
                  <div className="field">
                    <label className="field-label">Label</label>
                    <input type="text" {...registerAddress('label', { required: 'Label is required' })} placeholder="e.g. Home, Office" className="theme-input" />
                    {addressErrors.label && <span className="field-error">{addressErrors.label.message}</span>}
                  </div>
                  <div className="field">
                    <label className="field-label">Phone</label>
                    <input type="text" {...registerAddress('phone', { required: 'Phone is required' })} placeholder="+92 300 1234567" className="theme-input" />
                    {addressErrors.phone && <span className="field-error">{addressErrors.phone.message}</span>}
                  </div>
                </div>

                <div className="field" style={{ marginBottom: 12 }}>
                  <label className="field-label">Street Address</label>
                  <input type="text" {...registerAddress('street', { required: 'Street is required' })} placeholder="123 Main Street" className="theme-input" />
                  {addressErrors.street && <span className="field-error">{addressErrors.street.message}</span>}
                </div>

                <div className="form-grid-3" style={{ marginBottom: 12 }}>
                  {[
                    { name: 'city', label: 'City', placeholder: 'Lahore', rules: { required: 'City is required' } },
                    { name: 'state', label: 'State / Province', placeholder: 'Punjab', rules: { required: 'State is required' } },
                    { name: 'zipCode', label: 'Zip Code', placeholder: '54000', rules: { required: 'Zip code is required' } },
                  ].map(({ name, label, placeholder, rules }) => (
                    <div key={name} className="field">
                      <label className="field-label">{label}</label>
                      <input type="text" {...registerAddress(name, rules)} placeholder={placeholder} className="theme-input" />
                      {addressErrors[name] && <span className="field-error">{addressErrors[name].message}</span>}
                    </div>
                  ))}
                </div>

                <div className="field" style={{ marginBottom: 0 }}>
                  <label className="field-label">Country</label>
                  <input type="text" {...registerAddress('country')} className="theme-input" />
                </div>

                <div className="address-form-btns">
                  <button type="submit" disabled={addressSubmitting} className="btn-primary" style={{ marginTop: 0 }}>
                    <Save size={13} /> {addressSubmitting ? 'Saving...' : editingAddress ? 'Update Address' : 'Save Address'}
                  </button>
                  <button type="button" onClick={cancelAddressForm} className="btn-ghost">
                    <X size={13} /> Cancel
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;