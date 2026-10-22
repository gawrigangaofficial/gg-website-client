import React, { useEffect, useState } from 'react';
import { FaCreditCard, FaUniversity, FaMobileAlt, FaMoneyBillWave } from 'react-icons/fa';
import { trackAddPaymentInfo } from '../utils/analytics.js';
import PaymentTrustBadges from './PaymentTrustBadges';
import { DEFAULT_DELIVERY_CHARGES, resolveShippingAmount, shippingForPaymentMethod } from '../utils/deliveryCharges.js';
import { COD_CONFIRMATION_AMOUNT, codPayNowAmount } from '../utils/codAdvance.js';

const PaymentOptions = ({
  baseAmount,
  cartItems = [],
  deliveryCharges = DEFAULT_DELIVERY_CHARGES,
  selectedMethod: selectedMethodProp = '',
  onPaymentSelect,
}) => {
  const [selectedMethod, setSelectedMethod] = useState(selectedMethodProp);

  useEffect(() => {
    setSelectedMethod(selectedMethodProp || '');
  }, [selectedMethodProp]);
  const shippingFor = (methodId) => resolveShippingAmount(deliveryCharges, methodId, methodId === 'cod' ? 120 : 70);
  const reasonFor = (methodId) => {
    const row = shippingForPaymentMethod(deliveryCharges, methodId);
    return row && !row.is_standard ? row.reason_message : null;
  };
  const totalFor = (methodId) => Number(baseAmount || 0) + shippingFor(methodId);
  const codShipping = shippingFor('cod');
  const codTotal = totalFor('cod');
  const codPayNow = codPayNowAmount(codTotal);
  const codDescription = codTotal <= COD_CONFIRMATION_AMOUNT
    ? `Pay ₹${codPayNow.toLocaleString('en-IN')} now to confirm. Nothing is due on delivery (Shipping ₹${codShipping.toLocaleString('en-IN')})`
    : `Pay ₹${COD_CONFIRMATION_AMOUNT} now to confirm. The rest is collected on delivery (Shipping ₹${codShipping.toLocaleString('en-IN')})`;

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: FaCreditCard,
      description: 'Pay using your credit or debit card'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: FaMobileAlt,
      description: 'Pay using UPI (PhonePe, Google Pay, etc.)'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: FaUniversity,
      description: 'Pay using your bank account'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: FaMoneyBillWave,
      description: codDescription
    }
  ];

  const handleSelect = (methodId) => {
    setSelectedMethod(methodId);
    onPaymentSelect(methodId);
    const orderItems = cartItems.map((item) => ({
      product_id: item.id,
      product_name: item.name,
      product_price: item.price,
      quantity: item.quantity,
    }));
    trackAddPaymentInfo(totalFor(methodId), orderItems, methodId);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
        <span className="text-sm text-stone-600">Before shipping</span>
        <span className="text-lg font-bold text-stone-900">
          ₹{Number(baseAmount || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </span>
      </div>

      <div className="space-y-2">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          const reason = reasonFor(method.id);

          return (
            <div
              key={method.id}
              onClick={() => handleSelect(method.id)}
              className={`cursor-pointer rounded-2xl border-2 bg-white p-3 shadow-sm transition-all ${
                isSelected
                  ? 'border-primary'
                  : 'border-transparent hover:border-stone-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-xl p-2.5 ${
                  isSelected ? 'bg-primary text-white' : 'bg-stone-100 text-stone-600'
                }`}>
                  <Icon className="text-base" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-stone-900">{method.name}</h4>
                  <p className="text-xs text-stone-500">{method.description}</p>
                  <p className="mt-1 text-xs font-medium text-stone-700">
                    Shipping ₹{shippingFor(method.id).toLocaleString('en-IN')} · ₹{totalFor(method.id).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </p>
                  {reason ? (
                    <p className="mt-1 text-xs font-medium text-amber-800">{reason}</p>
                  ) : null}
                </div>
                {isSelected && (
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <PaymentTrustBadges className="mt-2" />

    </div>
  );
};

export default PaymentOptions;
