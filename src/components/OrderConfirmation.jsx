import React, { useState } from 'react';
import { FaCheckCircle, FaSpinner, FaMapMarkerAlt, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { apiFetch } from '../config/api.js';
import { trackPurchase } from '../utils/analytics.js';
import { paymentGatewayEmail } from '../utils/checkoutContact.js';

const ONLINE_PAYMENT_IDS = ['card', 'upi', 'netbanking'];
const PAYMENT_METHOD_LABELS = {
  card: 'Credit/Debit Card',
  upi: 'UPI',
  netbanking: 'Net Banking',
  cod: 'Cash on Delivery',
  wallet: 'Wallet',
  easebuzz: 'Online Payment',
};

const OrderConfirmation = ({
  cartItems,
  selectedAddress,
  totalAmount,
  couponCode = null,
  couponDiscount = 0,
  blessingCharge = 0,
  shippingCharges = 70,
  walletBalance = 0,
  useWallet = false,
  walletAmountToUse = 0,
  userId,
  userPhone,
  userName,
  paymentMethod,
  onOrderPlaced,
  orderData: initialOrderData,
}) => {
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(initialOrderData);
  const { clearCart } = useCart();

  const discountAmount = Number(couponDiscount || 0);
  const grossFinalAmount = Math.max(0, totalAmount - discountAmount) + shippingCharges + (Number(blessingCharge) || 0);
  const isOnlinePayment = ONLINE_PAYMENT_IDS.includes((paymentMethod || '').toLowerCase());
  const walletDeduction = useWallet
    ? Math.min(Number(walletAmountToUse) || 0, Number(walletBalance) || 0, grossFinalAmount)
    : 0;
  const isWalletApplied = walletDeduction > 0;
  const finalAmount = Math.max(0, grossFinalAmount - walletDeduction);
  const selectedMethodLabel =
    PAYMENT_METHOD_LABELS[String(paymentMethod || '').toLowerCase()] || 'UPI';

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }
    const gatewayEmail = paymentGatewayEmail(userPhone);
    if (isOnlinePayment && !gatewayEmail) {
      alert('A verified mobile number is required for online payment. Please sign in again.');
      return;
    }

    setLoading(true);

    try {
      const orderItems = cartItems.map(item => ({
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity
      }));

      if (isOnlinePayment) {
        const firstname = (selectedAddress.receiver_name || userName || 'Customer').trim() || 'Customer';
        const email = gatewayEmail;
        const phone = String(selectedAddress.receiver_phone || '').replace(/\D/g, '').slice(0, 10) || '0000000000';
        if (!email) {
          alert('A verified mobile number is required for online payment.');
          setLoading(false);
          return;
        }
        const initRes = await apiFetch('/api/payment/initiate', {
          method: 'POST',
          body: JSON.stringify({
            address_id: selectedAddress.id,
            items: orderItems,
            total_amount: totalAmount,
            discount_amount: discountAmount,
            coupon_code: couponCode,
            shipping_charges: shippingCharges,
            blessing_charge: Number(blessingCharge) || 0,
            final_amount: finalAmount,
            use_wallet: isWalletApplied,
            wallet_amount_to_use: walletDeduction,
            payment_method: paymentMethod,
            firstname,
            email,
            phone
          })
        });
        const initData = await initRes.json().catch(() => ({}));
        if (initData.success && initData.payment_url) {
          window.location.href = initData.payment_url;
          return;
        }
        alert(initData.message || 'Could not open payment page. Please try again or choose Cash on Delivery.');
        setLoading(false);
        return;
      }

      const orderPaymentMethod = paymentMethod || 'upi';
      const response = await apiFetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          address_id: selectedAddress.id,
          items: orderItems,
          total_amount: totalAmount,
          discount_amount: discountAmount,
          coupon_code: couponCode,
          shipping_charges: shippingCharges,
          blessing_charge: Number(blessingCharge) || 0,
          final_amount: finalAmount,
          use_wallet: isWalletApplied,
          wallet_amount_to_use: walletDeduction,
          payment_method: orderPaymentMethod,
          notes: Number(blessingCharge) > 0 ? `Special Blessing Service: +₹${Number(blessingCharge)}` : ''
        })
      });

      const text = await response.text();
      let result;
      try {
        result = text ? JSON.parse(text) : {};
      } catch {
        setLoading(false);
        alert(`Server error (${response.status}). Please try again.`);
        return;
      }

      if (!result.success) {
        const errorMsg = [result.error, result.message, result.hint].filter(Boolean).join('\n\n') || 'Failed to place order. Please try again.';
        alert(errorMsg);
        setLoading(false);
        return;
      }

      const rawOrder = result.data;
      const order = Array.isArray(rawOrder) ? rawOrder[0] : rawOrder;
      if (!order) {
        alert('Order was created but we could not read the response. Please check My Orders.');
        setLoading(false);
        return;
      }
      setOrderData(order);
      onOrderPlaced(order);
      clearCart();
      trackPurchase({
        transactionId: order.id,
        value: order.final_amount ?? finalAmount,
        items: orderItems,
      });
    } catch (error) {
      alert(error.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderData) {
    const amount = orderData.final_amount ?? orderData.total_amount ?? 0;
    return (
      <div className="text-center py-8">
        <div className="mb-6">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h3>
          <p className="text-gray-600">Your order has been confirmed and will be delivered soon.</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-600">Order Number:</span>
              <p className="text-lg font-bold text-primary">{orderData.order_number ?? '—'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Total Amount:</span>
              <p className="text-lg font-bold text-gray-900">₹{Number(amount).toLocaleString('en-IN')}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Payment Method:</span>
              <p className="text-gray-900">
                {orderData.payment_method === 'easebuzz'
                  ? 'Online Payment'
                  : orderData.payment_method === 'wallet'
                    ? 'Wallet'
                    : (orderData.payment_method ?? 'COD').toUpperCase()}
              </p>
            </div>
            {selectedAddress && (
              <div>
                <span className="text-sm font-medium text-gray-600">Delivery Address:</span>
                <p className="text-gray-900">
                  {selectedAddress.receiver_name}, {selectedAddress.receiver_phone}
                  <br />
                  {selectedAddress.address_line1}
                  {selectedAddress.address_line2 ? `, ${selectedAddress.address_line2}` : ''}
                  <br />
                  {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.postal_code}
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600">
          You will receive an order confirmation email shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Review Your Order</h3>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaShoppingBag className="text-primary" />
          Order Summary
        </h4>
        <div className="space-y-2">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
              </div>
              <p className="font-semibold text-gray-900">
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FaMapMarkerAlt className="text-primary" />
          Delivery Address
        </h4>
        {selectedAddress && (
          <div className="text-sm text-gray-700">
            <p className="font-medium">{selectedAddress.receiver_name}</p>
            <p>{selectedAddress.receiver_phone}</p>
            <p className="mt-2">
              {selectedAddress.address_line1}
              {selectedAddress.address_line2 && `, ${selectedAddress.address_line2}`}
            </p>
            <p>
              {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.postal_code}
            </p>
            <p>{selectedAddress.country}</p>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Price Breakdown</h4>
        <p className="mb-4 text-sm text-gray-600 rounded-lg border border-primary/15 bg-primary/5 px-3 py-2">
          Estimated delivery: <span className="font-semibold text-gray-800">3–7 business days</span> across India after dispatch.
        </p>
        <div className="space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Payment Method:</span>
            <span className="font-semibold">{selectedMethodLabel}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Subtotal:</span>
            <span>₹{totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Shipping:</span>
            <span>{`₹${shippingCharges.toLocaleString('en-IN')}`}</span>
          </div>
          {Number(blessingCharge) > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>Special Blessing Service:</span>
              <span>₹{Number(blessingCharge).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
          )}
          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Coupon ({couponCode || 'Applied'}):</span>
              <span>-₹{discountAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
          )}
          {walletDeduction > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Wallet used:</span>
              <span>-₹{walletDeduction.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
          )}
          <div className="border-t border-gray-300 pt-2 mt-2">
            <div className="flex justify-between text-lg font-bold text-primary">
              <span>Total:</span>
              <span>₹{finalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={loading || !selectedAddress}
        className="w-full px-6 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin" />
            Placing Order...
          </>
        ) : (
          <>
            <FaCheckCircle />
            Place Order
          </>
        )}
      </button>
    </div>
  );
};

export default OrderConfirmation;

