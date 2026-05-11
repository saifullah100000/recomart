import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import AddressForm from '../../components/checkout/AddressForm';
import PaymentForm from '../../components/checkout/PaymentForm';
import OrderSummary from '../../components/checkout/OrderSummary';
import Loader from '../../components/common/Loader';

const FREE_SHIPPING_THRESHOLD = 5000;
const SHIPPING_FEE = 200;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, total, fetchCart, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  const subtotal = total;
  const shippingFee = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const orderTotal = subtotal + shippingFee;

  useEffect(() => {
    const init = async () => {
      try {
        await fetchCart();
        const { data } = await api.get('/users/addresses');
        const addrs = data.addresses || [];
        setAddresses(addrs);
        if (addrs.length > 0) setSelectedAddress(addrs[0]._id);
      } catch (error) {
        console.error('Failed to load checkout data:', error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [fetchCart]);

  const handleAddNewAddress = async (addressData) => {
    try {
      const { data } = await api.post('/users/addresses', addressData);
      const newAddress = data.address;
      setAddresses((prev) => [...prev, newAddress]);
      setSelectedAddress(newAddress._id);
      toast.success('Address added');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) { toast.error('Please select a shipping address'); return; }
    if (items.length === 0) { toast.error('Your cart is empty'); return; }

    setPlacing(true);
    try {
      const selectedAddr = addresses.find((a) => a._id === selectedAddress);
      const shippingAddress = {
        street: selectedAddr.street,
        city: selectedAddr.city,
        state: selectedAddr.state,
        zipCode: selectedAddr.zipCode,
        country: selectedAddr.country,
        phone: selectedAddr.phone || '03000000000',
      };

      const { data } = await api.post('/orders', { shippingAddress, paymentMethod });

      if (paymentMethod === 'stripe') {
        const { data: sessionData } = await api.post('/payments/create-checkout-session', {
          orderId: data.order._id,
        });
        window.location.href = sessionData.sessionUrl;
        return;
      }

      await clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${data.order._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: 'linear-gradient(135deg, #0d0b1e 0%, #0f0c2a 40%, #080818 100%)' }}
      >
        <Loader size="lg" />
      </div>
    );
  }

  /* ── Empty Cart ── */
  if (items.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center"
        style={{ background: 'linear-gradient(135deg, #0d0b1e 0%, #0f0c2a 40%, #080818 100%)' }}
      >
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6"
          style={{
            background: 'rgba(124,58,237,0.1)',
            border: '1px solid rgba(124,58,237,0.2)',
            boxShadow: '0 8px 32px rgba(124,58,237,0.15)',
          }}
        >
          <ShieldCheck className="w-10 h-10" style={{ color: '#a78bfa' }} />
        </div>
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: '#f0eeff' }}>
          Nothing to Checkout
        </h1>
        <p className="text-sm mb-8" style={{ color: '#6b7280' }}>
          Your cart is empty. Add some items first.
        </p>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            color: '#ffffff',
            boxShadow: '0 4px 15px rgba(124,58,237,0.4)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(124,58,237,0.6)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(124,58,237,0.4)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Browse Products
        </button>
      </div>
    );
  }

  /* ── Main Checkout ── */
  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #0d0b1e 0%, #0f0c2a 40%, #080818 100%)' }}
    >
      <div className="container mx-auto px-4 py-8">

        {/* Page Header */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(124,58,237,0.25)',
            }}
          >
            <ShieldCheck className="w-5 h-5" style={{ color: '#a78bfa' }} />
          </div>
          <h1
            className="text-2xl md:text-3xl font-extrabold tracking-tight"
            style={{ color: '#f0eeff' }}
          >
            Checkout
          </h1>

          <button
            onClick={() => navigate(-1)}
            className="ml-auto flex items-center gap-1.5 text-xs font-semibold transition-all duration-200"
            style={{ color: '#6b7280' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#a78bfa'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Address + Payment */}
          <div className="lg:col-span-2 space-y-4">

            {/* Address card */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <AddressForm
                addresses={addresses}
                selectedAddress={selectedAddress}
                onSelect={setSelectedAddress}
                onAddNew={handleAddNewAddress}
              />
            </div>

            {/* Payment card */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <PaymentForm paymentMethod={paymentMethod} onChange={setPaymentMethod} />
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-3">
              <OrderSummary
                items={items}
                subtotal={subtotal}
                shippingFee={shippingFee}
                total={orderTotal}
                paymentMethod={paymentMethod}
                onPlaceOrder={handlePlaceOrder}
              />

              {/* Placing overlay */}
              {placing && (
                <div
                  className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl"
                  style={{
                    background: 'rgba(124,58,237,0.1)',
                    border: '1px solid rgba(124,58,237,0.2)',
                  }}
                >
                  <Loader size="sm" />
                  <p className="text-sm font-medium" style={{ color: '#a78bfa' }}>
                    Processing your order…
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;