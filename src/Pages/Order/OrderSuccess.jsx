import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../config/api.js';
import { trackPurchase } from '../../utils/analytics.js';

const REDIRECT_DELAY_MS = 2500;

const PARTY_COLORS = ['#f97316', '#22c55e', '#eab308', '#ec4899', '#8b5cf6', '#06b6d4', '#ef4444'];
const CONFETTI_COUNT = 55;

function ConfettiBurst() {
  const pieces = useMemo(() =>
    Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 2 + Math.random() * 1.5,
      color: PARTY_COLORS[i % PARTY_COLORS.length],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 720 - 360,
      shape: Math.random() > 0.5 ? 'rect' : 'circle'
    })), []
  );

  return (
    <div className="confetti-container" aria-hidden="true">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            width: p.shape === 'rect' ? `${p.size * 0.6}px` : `${p.size}px`,
            height: `${p.size}px`,
            ['--rotation']: `${p.rotation}deg`
          }}
        />
      ))}
    </div>
  );
}

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const { userId } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(!!orderId);
  const [showModal, setShowModal] = useState(true);
  const purchaseTracked = useRef(false);

  useEffect(() => {
    if (!order || purchaseTracked.current) return;
    purchaseTracked.current = true;
    trackPurchase({
      transactionId: order.id,
      value: order.final_amount,
      items: order.order_items || [],
    });
  }, [order]);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (!cancelled && data.success && data.data) setOrder(data.data);
      } catch {
        if (!cancelled) setOrder(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [orderId]);

  useEffect(() => {
    if (!showModal) return;
    const t = setTimeout(() => setShowModal(false), REDIRECT_DELAY_MS);
    return () => clearTimeout(t);
  }, [showModal]);

  const address = order?.addresses ? (Array.isArray(order.addresses) ? order.addresses[0] : order.addresses) : null;

  return (
    <div className="min-h-screen bg-[#FFFAEB] px-4 py-12">
      {/* Payment success modal with party animation */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden">
          <ConfettiBurst />
          <div className="payment-success-card bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center relative z-10">
            <div className="success-icon-wrap">
              <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4 success-icon" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2 payment-title">Payment Successful!</h2>
            <p className="text-gray-600 text-sm mb-6">
              Redirecting to order confirmation...
            </p>
            <div className="flex justify-center">
              <div className="w-full max-w-[200px] h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full progress-fill"
                  style={{ animation: 'shrink 2.5s linear forwards', width: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order confirmation (same style as OrderConfirmation success) */}
      <div className="max-w-lg mx-auto text-center">
        {!showModal && (
          <>
            <div className="mb-6">
              <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
              <p className="text-gray-600">Your order has been confirmed and will be delivered soon.</p>
            </div>

            {loading && (
              <div className="flex justify-center gap-2 text-gray-500 py-8">
                <FaSpinner className="animate-spin text-xl" />
                <span>Loading order details...</span>
              </div>
            )}

            {!loading && order && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Order Number:</span>
                    <p className="text-lg font-bold text-primary">{order.order_number ?? '—'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Total Amount:</span>
                    <p className="text-lg font-bold text-gray-900">₹{Number(order.final_amount ?? order.total_amount ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Payment Method:</span>
                    <p className="text-gray-900">Online Payment</p>
                  </div>
                  {address && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Delivery Address:</span>
                      <p className="text-gray-900">
                        {address.receiver_name}, {address.receiver_phone}
                        <br />
                        {address.address_line1}
                        {address.address_line2 ? `, ${address.address_line2}` : ''}
                        <br />
                        {address.city}, {address.state} - {address.postal_code}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!loading && orderId && !order && !userId && (
              <p className="text-gray-500 mb-6">Log in to see order details.</p>
            )}

            {!loading && (
              <p className="text-sm text-gray-600 mb-6">
                You will receive an order confirmation email shortly.
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {orderId && userId && (
                <Link
                  to="/profile"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  View my orders
                </Link>
              )}
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium border-2 border-primary text-primary hover:bg-primary/5 transition-colors"
              >
                Continue shopping
              </Link>
            </div>
          </>
        )}
      </div>

      <style>{`
        .confetti-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }
        .confetti-piece {
          position: absolute;
          top: -20px;
          box-shadow: 0 0 6px rgba(0,0,0,0.2);
          animation: confetti-fall linear forwards;
          transform-origin: center center;
        }
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(var(--rotation));
            opacity: 0.3;
          }
        }
        .payment-success-card {
          animation: card-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes card-pop {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .success-icon-wrap {
          animation: icon-bounce 0.6s ease-out 0.2s both;
        }
        .success-icon {
          filter: drop-shadow(0 4px 12px rgba(34, 197, 94, 0.4));
          animation: check-pulse 1.5s ease-in-out 0.8s infinite;
        }
        @keyframes icon-bounce {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.15);
          }
          70% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes check-pulse {
          0%, 100% {
            filter: drop-shadow(0 4px 12px rgba(34, 197, 94, 0.4));
          }
          50% {
            filter: drop-shadow(0 6px 20px rgba(34, 197, 94, 0.6));
          }
        }
        .payment-title {
          animation: title-in 0.4s ease-out 0.3s both;
        }
        @keyframes title-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .progress-fill {
          animation: shrink 2.5s linear forwards;
        }
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default OrderSuccess;
