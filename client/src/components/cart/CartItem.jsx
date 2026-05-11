import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ImageOff } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import formatPrice from '../../utils/formatPrice';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCartStore();
  const { product, quantity } = item;

  const primaryImage =
    product.images && product.images.length > 0 ? product.images[0].url : null;

  const handleUpdateQuantity = async (newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(product._id, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemove = async () => {
    try {
      await removeFromCart(product._id);
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  return (
    <div
      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(124,58,237,0.06)';
        e.currentTarget.style.borderColor = 'rgba(124,58,237,0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
      }}
    >
      {/* Product Image */}
      <div
        className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {primaryImage ? (
          <img src={primaryImage} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="w-8 h-8" style={{ color: '#4b5563' }} />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/products/${product.slug}`}
          className="text-sm font-semibold line-clamp-2 transition-colors duration-200"
          style={{ color: '#f0eeff' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#a78bfa'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#f0eeff'; }}
        >
          {product.name}
        </Link>
        <p className="text-sm mt-1" style={{ color: '#a78bfa' }}>
          {formatPrice(product.price)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div
        className="flex items-center gap-2 rounded-xl p-1"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <button
          onClick={() => handleUpdateQuantity(quantity - 1)}
          disabled={quantity <= 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200"
          style={{ color: '#9ca3af' }}
          onMouseEnter={(e) => {
            if (quantity > 1) {
              e.currentTarget.style.background = 'rgba(124,58,237,0.2)';
              e.currentTarget.style.color = '#a78bfa';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#9ca3af';
          }}
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <span
          className="w-8 text-center text-sm font-bold"
          style={{ color: '#f0eeff' }}
        >
          {quantity}
        </span>

        <button
          onClick={() => handleUpdateQuantity(quantity + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200"
          style={{ color: '#9ca3af' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(124,58,237,0.2)';
            e.currentTarget.style.color = '#a78bfa';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#9ca3af';
          }}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Line Total */}
      <div
        className="text-sm font-extrabold w-24 text-right"
        style={{ color: '#f0eeff' }}
      >
        {formatPrice(product.price * quantity)}
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className="p-2 rounded-lg transition-all duration-200 flex-shrink-0"
        style={{
          color: '#4b5563',
          background: 'transparent',
        }}
        title="Remove item"
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#f87171';
          e.currentTarget.style.background = 'rgba(239,68,68,0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#4b5563';
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CartItem;