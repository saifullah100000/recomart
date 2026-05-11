import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = params.get('session_id');
        if (!sessionId) return;

        await api.get(`/payments/verify/${sessionId}`);
        toast.success('Payment verified successfully');
      } catch (err) {
        console.error(err);
      }
    };

    verifyPayment();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful 🎉
        </h1>

        <p className="text-gray-600 mb-6">
          Your order has been placed successfully.  
          You will receive updates shortly.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/orders')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            View Orders
          </button>

          <button
            onClick={() => navigate('/')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;