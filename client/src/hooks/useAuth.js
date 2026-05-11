import useAuthStore from '../store/authStore';

const useAuth = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin: user?.role === 'admin',
    isSeller: user?.role === 'seller',
    isCustomer: user?.role === 'customer'
  };
};

export default useAuth;
