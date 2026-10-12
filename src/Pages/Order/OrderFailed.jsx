import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { FaTimesCircle, FaShoppingCart } from 'react-icons/fa';

const REDIRECT_DELAY_MS = 2500;

const OrderFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = searchParams.get('order_id');
  const reason = searchParams.get('reason') || 'payment_failed';
  const [showModal, setShowModal] = useState(true);

  const messages = {
    payment_failed: 'The payment could not be completed. You can try again or choose Cash on Delivery.',
    hash_mismatch: 'We could not verify the payment response. Please contact support if you were charged.',
    invalid_callback: 'Invalid payment response. Please try again or use Cash on Delivery.',
    no_draft: 'Payment response was incomplete. Please try again or use Cash on Delivery.',
    draft_not_found: 'We could not find your order session. Please place the order again.',
    order_create_failed: 'Payment succeeded but we could not create your order. Please contact support with your payment details.',
    error: 'Something went wrong. Please try again or choose Cash on Delivery.'
  };

  useEffect(() => {
    if (!showModal) return;
    const t = setTimeout(() => {
      navigate('/cart', { replace: true, state: { backgroundLocation: location } });
    }, REDIRECT_DELAY_MS);
    return () => clearTimeout(t);
  }, [showModal, navigate, location]);

  return (
    <div className="min-h-screen py-12 px-4 bg-linear-to-br from-red-50/30 to-white">
      {/* Payment failed modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center">
            <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Failed</h2>
            <p className="text-gray-600 text-sm mb-6">
              {messages[reason] || messages.payment_failed}
            </p>
            <p className="text-gray-500 text-xs mb-6">
              Redirecting to cart...
            </p>
            <div className="flex justify-center">
              <div className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-400 rounded-full"
                  style={{ width: '100%', animation: 'shrink 2.5s linear forwards' }}
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-center">
              <button
                onClick={() => navigate('/cart', { replace: true, state: { backgroundLocation: location } })}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium bg-primary text-white hover:bg-primary/90 transition-colors text-sm"
              >
                <FaShoppingCart />
                Go to cart now
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default OrderFailed;
