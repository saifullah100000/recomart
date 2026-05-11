export const ORDER_STATUSES = {
  pending: { label: 'Pending', color: 'text-yellow-600 bg-yellow-50' },
  confirmed: { label: 'Confirmed', color: 'text-blue-600 bg-blue-50' },
  packed: { label: 'Packed', color: 'text-indigo-600 bg-indigo-50' },
  shipped: { label: 'Shipped', color: 'text-purple-600 bg-purple-50' },
  delivered: { label: 'Delivered', color: 'text-green-600 bg-green-50' },
  cancelled: { label: 'Cancelled', color: 'text-red-600 bg-red-50' },
  refund_requested: { label: 'Refund Requested', color: 'text-orange-600 bg-orange-50' },
  refunded: { label: 'Refunded', color: 'text-gray-600 bg-gray-100' }
};

export const PAYMENT_STATUSES = {
  pending: { label: 'Pending', color: 'text-yellow-600' },
  paid: { label: 'Paid', color: 'text-green-600' },
  failed: { label: 'Failed', color: 'text-red-600' },
  refunded: { label: 'Refunded', color: 'text-gray-600' }
};

export const SELLER_STATUSES = {
  pending: { label: 'Pending', color: 'text-yellow-600 bg-yellow-50' },
  approved: { label: 'Approved', color: 'text-green-600 bg-green-50' },
  suspended: { label: 'Suspended', color: 'text-red-600 bg-red-50' },
  rejected: { label: 'Rejected', color: 'text-gray-600 bg-gray-100' }
};

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' }
];
