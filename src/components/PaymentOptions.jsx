import React, { useState } from 'react';
import { FaCreditCard, FaUniversity, FaMobileAlt, FaMoneyBillWave } from 'react-icons/fa';
import { trackAddPaymentInfo } from '../utils/analytics.js';
import PaymentTrustBadges from './PaymentTrustBadges';
import { DEFAULT_DELIVERY_CHARGES, resolveShippingAmount, shippingForPaymentMethod } from '../utils/deliveryCharges.js';

const PaymentOptions = ({
  baseAmount,
  cartItems = [],
  deliveryCharges = DEFAULT_DELIVERY_CHARGES,
  onPaymentSelect,
}) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const shippingFor = (methodId) => resolveShippingAmount(deliveryCharges, methodId, methodId === 'cod' ? 120 : 70);
  const reasonFor = (methodId) => {
    const row = shippingForPaymentMethod(deliveryCharges, methodId);
    return row && !row.is_standard ? row.reason_message : null;
  };
  const totalFor = (methodId) => Number(baseAmount || 0) + shippingFor(methodId);
  const codShipping = shippingFor('cod');

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
      description: `Pay when your order is delivered (Shipping ₹${codShipping.toLocaleString('en-IN')})`
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
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Select Payment Method</h3>
      
      <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Base Amount (without shipping):</span>
          <span className="text-2xl font-bold text-primary">
            ₹{Number(baseAmount || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          const reason = reasonFor(method.id);

          return (
            <div
              key={method.id}
              onClick={() => handleSelect(method.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${
                  isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Icon className="text-xl" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{method.name}</h4>
                  <p className="text-sm text-gray-600">{method.description}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Shipping: ₹{shippingFor(method.id).toLocaleString('en-IN')} | Total: ₹{totalFor(method.id).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </p>
                  {reason ? (
                    <p className="mt-1 text-xs font-medium text-amber-800">{reason}</p>
                  ) : null}
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-white"></div>
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
