import ProductCard from './ProductCard';

const SkeletonCard = () => (
  <div
    className="rounded-2xl overflow-hidden animate-pulse"
    style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
    }}
  >
    {/* Image placeholder */}
    <div
      className="w-full h-48"
      style={{ background: 'rgba(255,255,255,0.06)' }}
    />

    <div className="p-4 space-y-3">
      {/* Title */}
      <div
        className="h-4 rounded-lg w-3/4"
        style={{ background: 'rgba(255,255,255,0.07)' }}
      />
      {/* Subtitle */}
      <div
        className="h-3 rounded-lg w-1/2"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      />
      {/* Stars */}
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-3.5 h-3.5 rounded"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          />
        ))}
      </div>
      {/* Price */}
      <div
        className="h-6 rounded-lg w-1/3"
        style={{ background: 'rgba(124,58,237,0.12)' }}
      />
      {/* Button */}
      <div
        className="h-10 rounded-xl"
        style={{ background: 'rgba(124,58,237,0.08)' }}
      />
    </div>
  </div>
);

const ProductGrid = ({ products = [], loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          style={{
            background: 'rgba(124,58,237,0.1)',
            border: '1px solid rgba(124,58,237,0.2)',
          }}
        >
          🛍️
        </div>
        <p
          className="text-lg font-semibold"
          style={{ color: '#6b7280' }}
        >
          No products found.
        </p>
        <p className="text-sm" style={{ color: '#4b5563' }}>
          Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;