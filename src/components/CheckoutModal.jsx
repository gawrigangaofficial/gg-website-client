import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FaTimes, FaMapMarkerAlt, FaCreditCard, FaCheckCircle, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import AddressForm from './AddressForm';
import PaymentOptions from './PaymentOptions';
import OrderConfirmation from './OrderConfirmation';
import { apiFetch } from '../config/api.js';
import { trackBeginCheckout } from '../utils/analytics.js';
import {
  DEFAULT_DELIVERY_CHARGES,
  fetchDeliveryCharges,
  resolveShippingAmount,
  shippingForPaymentMethod,
} from '../utils/deliveryCharges.js';

const CheckoutModal = ({
  isOpen,
  onClose,
  cartItems,
  totalAmount,
  couponCode = null,
  couponDiscount = 0,
  blessingCharge = 0,
  walletBalance = 0,
  useWallet = false,
  walletAmountToUse = 0,
  userId,
  userPhone,
  userName,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orderData, setOrderData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [deliveryCharges, setDeliveryCharges] = useState(DEFAULT_DELIVERY_CHARGES);
  const initiateCheckoutTrackedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return undefined;
    let cancelled = false;
    fetchDeliveryCharges().then((settings) => {
      if (!cancelled) setDeliveryCharges(settings);
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const checkoutTrackingValue = useMemo(() => {
    const baseAmount =
      Math.max(0, Number(totalAmount || 0) - Number(couponDiscount || 0)) +
      Number(blessingCharge || 0);
    const prepaidShipping = resolveShippingAmount(deliveryCharges, 'upi', 70);
    const payableAmount = baseAmount + prepaidShipping;
    const walletApplicableAmount = useWallet
      ? Math.min(Number(walletAmountToUse) || 0, Number(walletBalance) || 0, payableAmount)
      : 0;
    return Math.max(0, payableAmount - walletApplicableAmount);
  }, [totalAmount, couponDiscount, blessingCharge, useWallet, walletAmountToUse, walletBalance, deliveryCharges]);

  useEffect(() => {
    if (!isOpen) {
      initiateCheckoutTrackedRef.current = false;
      return;
    }
    if (initiateCheckoutTrackedRef.current || !cartItems?.length) return;

    initiateCheckoutTrackedRef.current = true;
    const orderItems = cartItems.map((item) => ({
      product_id: item.id,
      product_name: item.name,
      product_price: item.price,
      quantity: item.quantity,
    }));
    trackBeginCheckout(checkoutTrackingValue, orderItems);
  }, [isOpen, cartItems, checkoutTrackingValue]);

  // Fetch user addresses
  useEffect(() => {
    if (isOpen && userId) {
      fetchAddresses();
    }
  }, [isOpen, userId]);

  const fetchAddresses = async () => {
    try {
      const response = await apiFetch(`/api/addresses/user/${userId}`);
      const result = await response.json();
      if (result.success) {
        setAddresses(result.data || []);
        // Set default address if available
        const defaultAddress = result.data?.find(addr => addr.is_default);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
      }
    } catch (error) {
      // Silently fail - user can add address manually
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const handleAddressCreated = (newAddress) => {
    setAddresses([...addresses, newAddress]);
    setSelectedAddress(newAddress);
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedAddress) {
      if (payableAfterWallet <= 0) {
        setPaymentMethod(useWallet && walletApplicableAmount > 0 ? 'wallet' : 'upi');
        setCurrentStep(3);
      } else {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleOrderPlaced = (order) => {
    setOrderData(order);
  };

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedAddress(null);
    setOrderData(null);
    setPaymentMethod('');
    onClose();
  };

  if (!isOpen) return null;

  const steps = [
    { number: 1, title: 'Address', icon: FaMapMarkerAlt },
    { number: 2, title: 'Payment', icon: FaCreditCard },
    { number: 3, title: 'Confirm', icon: FaCheckCircle }
  ];

  const canProceed = () => {
    if (currentStep === 1) return selectedAddress !== null;
    if (currentStep === 2) return paymentMethod !== '';
    return false;
  };

  const activeShipping = shippingForPaymentMethod(deliveryCharges, paymentMethod || 'upi');
  const shippingCharges = resolveShippingAmount(deliveryCharges, paymentMethod || 'upi', 70);
  const shippingReason =
    activeShipping && !activeShipping.is_standard ? activeShipping.reason_message : null;
  const baseAmount =
    Math.max(0, Number(totalAmount || 0) - Number(couponDiscount || 0)) +
    Number(blessingCharge || 0);
  const payableAmount = baseAmount + shippingCharges;
  const walletApplicableAmount = useWallet
    ? Math.min(Number(walletAmountToUse) || 0, Number(walletBalance) || 0, payableAmount)
    : 0;
  const payableAfterWallet = Math.max(0, payableAmount - walletApplicableAmount);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-primary">Checkout</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <React.Fragment key={step.number}>
                  <div className="flex items-center flex-1">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                      isActive
                        ? 'bg-primary border-primary text-white'
                        : isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <FaCheckCircle className="text-lg" />
                      ) : (
                        <StepIcon className="text-lg" />
                      )}
                    </div>
                    <div className="ml-3 hidden sm:block">
                      <div className={`text-sm font-medium ${
                        isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        Step {step.number}
                      </div>
                      <div className={`text-xs ${
                        isActive ? 'text-primary' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 1 && (
            <AddressForm
              addresses={addresses}
              selectedAddress={selectedAddress}
              onSelectAddress={handleAddressSelect}
              onAddressCreated={handleAddressCreated}
              userId={userId}
            />
          )}

          {currentStep === 2 && (
            <PaymentOptions
              baseAmount={baseAmount}
              cartItems={cartItems}
              deliveryCharges={deliveryCharges}
              onPaymentSelect={(method) => {
                setPaymentMethod(method);
              }}
            />
          )}

          {currentStep === 3 && (
            <OrderConfirmation
              cartItems={cartItems}
              selectedAddress={selectedAddress}
              totalAmount={totalAmount}
              couponCode={couponCode}
              couponDiscount={couponDiscount}
              blessingCharge={blessingCharge}
              walletBalance={walletBalance}
              useWallet={useWallet}
              walletAmountToUse={walletApplicableAmount}
              shippingCharges={shippingCharges}
              shippingReason={shippingReason}
              userId={userId}
              userPhone={userPhone}
              userName={userName}
              paymentMethod={paymentMethod}
              onOrderPlaced={handleOrderPlaced}
              orderData={orderData}
            />
          )}
        </div>

        {/* Footer Navigation */}
        {currentStep < 3 && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaChevronLeft />
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                canProceed()
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continue
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
