import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../config/api.js';

const ViewDetails = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/orders/${orderId}` } } });
      return;
    }
    if (!orderId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (!cancelled) {
          if (data.success && data.data) setOrder(data.data);
          else setError(data.message || 'Failed to load order');
        }
      } catch (e) {
        if (!cancelled) setError('Failed to load order');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [orderId, user, authLoading, navigate]);

  const address = order?.addresses
    ? (Array.isArray(order.addresses) ? order.addresses[0] : order.addresses)
    : null;

  const subtotal = Number(order?.total_amount || 0);
  const discount = Number(order?.discount_amount || 0);
  const shipping = Number(order?.shipping_charges || 0);
  const finalAmount = Number(order?.final_amount ?? order?.total_amount ?? 0);
  const expectedWithoutBlessing = subtotal - discount + shipping;

  // Prefer explicit note marker; fallback to amount delta when final > expected.
  const blessingFromNotesMatch = String(order?.notes || '').match(
    /Special Blessing Service:\s*\+₹?\s*([0-9]+(?:\.[0-9]{1,2})?)/i,
  );
  const blessingFromNotes = blessingFromNotesMatch ? Number(blessingFromNotesMatch[1]) : 0;
  const delta = Math.max(0, Number((finalAmount - expectedWithoutBlessing).toFixed(2)));
  const blessingCharge = blessingFromNotes > 0 ? blessingFromNotes : delta;

  const statusClass = (status) => {
    const s = (status || '').toLowerCase();
    if (['pending', 'processing'].includes(s)) return 'text-amber-600';
    if (['shipped'].includes(s)) return 'text-blue-600';
    if (['delivered', 'completed', 'paid'].includes(s)) return 'text-green-600';
    if (['cancelled', 'failed'].includes(s)) return 'text-red-600';
    return 'text-gray-600';
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFAEB]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFAEB] py-4 px-3 sm:py-6 sm:px-4 overflow-x-hidden">
      <div className="max-w-xl mx-auto min-w-0">
        <button
          type="button"
          onClick={() => navigate('/profile', { state: { openOrdersTab: true } })}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary font-medium mb-6 sm:mb-8 transition-colors py-2 -ml-2 min-h-[44px] min-w-[44px] sm:min-w-0 rounded-lg touch-manipulation"
          aria-label="Back to Profile"
        >
          <FaArrowLeft className="shrink-0" />
          Back to Profile
        </button>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 gap-4">
            <FaSpinner className="text-4xl text-primary animate-spin" />
            <p className="text-gray-600 text-sm sm:text-base">Loading order details...</p>
          </div>
        )}

        {error && !order && (
          <div className="text-center py-10 sm:py-12 px-2">
            <p className="text-red-600 mb-6 text-sm sm:text-base">{error}</p>
            <button
              type="button"
              onClick={() => navigate('/profile', { state: { openOrdersTab: true } })}
              className="min-h-[44px] px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium touch-manipulation"
            >
              Back to My Orders
            </button>
          </div>
        )}

        {!loading && order && (
          <article className="space-y-0 min-w-0">
            {/* Top: order id + meta */}
            <div className="pb-4 sm:pb-6 border-b border-gray-200/80">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight wrap-break-word">
                Order {order.order_number}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1.5 sm:gap-3 mt-3">
                <span className={`text-sm font-medium capitalize ${statusClass(order.order_status)}`}>
                  Status: {order.order_status || '—'}
                </span>
                <span className="hidden sm:inline text-gray-400">·</span>
                <span className={`text-sm font-medium capitalize ${statusClass(order.payment_status)}`}>
                  Payment: {order.payment_status || '—'}
                </span>
                <span className="hidden sm:inline text-gray-400">·</span>
                <span className="text-sm text-gray-600">
                  Payment mode: {order.payment_method === 'easebuzz'
                    ? 'Online Payment'
                    : order.payment_method === 'wallet'
                      ? 'Wallet'
                      : (order.payment_method || '—').toUpperCase()}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="py-4 sm:py-6 border-b border-gray-200/80">
              <h2 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">
                Items
              </h2>
              <ul className="space-y-3">
                {(order.order_items || []).map((item, idx) => (
                  <li
                    key={item.id || idx}
                    className="flex justify-between items-start gap-2 sm:gap-4 min-w-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm sm:text-base wrap-break-word">{item.product_name}</p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                        {item.quantity} × ₹{Number(item.product_price).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <span className="font-semibold text-gray-900 shrink-0 text-sm sm:text-base whitespace-nowrap">
                      ₹{Number(item.subtotal ?? item.product_price * item.quantity).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price summary */}
            <div className="py-4 sm:py-6 border-b border-gray-200/80">
              <h2 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">
                Price summary
              </h2>
              <dl className="space-y-2 text-sm sm:text-base">
                <div className="flex justify-between gap-4 text-gray-700">
                  <dt className="min-w-0">Subtotal</dt>
                  <dd className="shrink-0 whitespace-nowrap">₹{subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</dd>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between gap-4 text-green-600">
                    <dt className="min-w-0">Discount</dt>
                    <dd className="shrink-0 whitespace-nowrap">- ₹{discount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</dd>
                  </div>
                )}
                {order.shipping_charges != null && (
                  <div className="flex justify-between gap-4 text-gray-700">
                    <dt className="min-w-0">Shipping</dt>
                    <dd className="shrink-0 whitespace-nowrap">
                      {shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `₹${shipping.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
                      )}
                    </dd>
                  </div>
                )}
                {blessingCharge > 0 && (
                  <div className="flex justify-between gap-4 text-gray-700">
                    <dt className="min-w-0">Special Blessing Service</dt>
                    <dd className="shrink-0 whitespace-nowrap">₹{blessingCharge.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4 text-lg font-bold text-primary pt-2 mt-2">
                  <dt className="min-w-0">Total</dt>
                  <dd className="shrink-0 whitespace-nowrap">₹{finalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</dd>
                </div>
              </dl>
            </div>

            {/* Delivery address */}
            {address && (
              <div className="py-4 sm:py-6 border-b border-gray-200/80">
                <h2 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">
                  Delivery address
                </h2>
                <address className="text-gray-700 not-italic text-sm sm:text-base wrap-break-word">
                  <p className="font-semibold text-gray-900">{address.receiver_name}</p>
                  <p><a href={`tel:${address.receiver_phone}`} className="hover:text-primary">{address.receiver_phone}</a></p>
                  <p className="mt-2">
                    {address.address_line1}
                    {address.address_line2 ? `, ${address.address_line2}` : ''}
                  </p>
                  <p>
                    {address.city}, {address.state} - {address.postal_code}
                  </p>
                  <p>{address.country}</p>
                </address>
              </div>
            )}

            <div className="pt-6 sm:pt-8">
              <button
                type="button"
                onClick={() => navigate('/profile', { state: { openOrdersTab: true } })}
                className="w-full sm:w-auto min-h-[48px] sm:min-h-[44px] px-6 sm:px-8 py-3.5 sm:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold touch-manipulation"
              >
                Back to My Orders
              </button>
            </div>
          </article>
        )}
      </div>
    </div>
  );
};

export default ViewDetails;
