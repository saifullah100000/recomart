import { useState, useEffect } from 'react';
import api from '../api/axios';

const useProducts = (params = {}) => {

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [pagination, setPagination] =
    useState({
      page: 1,
      totalPages: 1,
      total: 0
    });

  const fetchProducts = async (
    queryParams = params
  ) => {

    try {

      setLoading(true);

      const searchParams =
        new URLSearchParams();

      Object.entries(queryParams)
        .forEach(([key, value]) => {

          if (
            value !== undefined &&
            value !== null &&
            value !== ''
          ) {

            searchParams.set(
              key,
              value
            );
          }
        });

      // ✅ PAGINATED REQUEST
      const { data } = await api.get(
        `/products?${searchParams.toString()}`
      );

      // ✅ PRODUCTS
      setProducts(
        data.products || []
      );

      // ✅ FIXED PAGINATION
      setPagination({

        page:
          data.pagination?.page || 1,

        totalPages:
          data.pagination?.totalPages || 1,

        total:
          data.pagination?.total || 0
      });

      setError(null);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'Failed to fetch products'
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchProducts();

  }, [JSON.stringify(params)]);

  return {

    products,

    loading,

    error,

    pagination,

    refetch: fetchProducts
  };
};

export default useProducts;