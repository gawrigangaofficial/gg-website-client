import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import AddressForm from './AddressForm';
import PaymentOptions from './PaymentOptions';
import OrderConfirmation from './OrderConfirmation';
import OtpInput from './OtpInput';
import { useAuth } from '../context/AuthContext';
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
  embedded = false,
  onExplore,
  onOrderConfirmed,
}) => {
  const { sendPhoneOtp, verifyPhoneOtp } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpLength, setOtpLength] = useState(6);
  const [otpBusy, setOtpBusy] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [verifiedPhone, setVerifiedPhone] = useState('');
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

  useEffect(() => {
    if (!isOpen) return;
    const digits = String(userPhone || '').replace(/\D/g, '').slice(-10);
    setCheckoutPhone(/^[6-9]\d{9}$/.test(digits) ? digits : '');
  }, [isOpen, userPhone]);

  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    if (!isOpen || embedded) return undefined;
    const frame = requestAnimationFrame(() => setPanelOpen(true));
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      setPanelOpen(false);
    };
  }, [isOpen, embedded]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !orderData) handleClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, checkoutPhone, selectedAddress, orderData, cartItems, totalAmount, userName]);

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

  const phoneDigits = String(checkoutPhone || '').replace(/\D/g, '').slice(0, 10);
  const phoneIsValid = /^[6-9]\d{9}$/.test(phoneDigits);
  const isLoggedIn = Boolean(userId);

  const handleNext = async () => {
    if (currentStep === 1 && paymentMethod) {
      if (isLoggedIn) {
        if (phoneIsValid) setVerifiedPhone(phoneDigits);
        setCurrentStep(4);
        return;
      }
      setCurrentStep(2);
      return;
    }
    if (currentStep === 2 && phoneIsValid) {
      setCheckoutPhone(phoneDigits);
      if (verifiedPhone === phoneDigits) {
        setCurrentStep(4);
        return;
      }
      setOtpBusy(true);
      setOtpError('');
      const { data, error } = await sendPhoneOtp(phoneDigits);
      setOtpBusy(false);
      if (error) {
        setOtpError(error.message || 'Could not send OTP');
        return;
      }
      if (typeof data?.otp_length === 'number' && data.otp_length > 0) {
        setOtpLength(data.otp_length);
      }
      setOtp('');
      setCurrentStep(3);
      return;
    }
    if (currentStep === 3) {
      const code = otp.replace(/\D/g, '');
      if (code.length !== otpLength) return;
      setOtpBusy(true);
      setOtpError('');
      const { error } = await verifyPhoneOtp(phoneDigits, code);
      setOtpBusy(false);
      if (error) {
        setOtpError(error.message || 'Invalid OTP');
        return;
      }
      setVerifiedPhone(phoneDigits);
      setCurrentStep(4);
      return;
    }
    if (currentStep === 4 && selectedAddress) {
      setCurrentStep(5);
    }
  };

  const handleResendOtp = async () => {
    if (!phoneIsValid || otpBusy) return;
    setOtpBusy(true);
    setOtpError('');
    const { data, error } = await sendPhoneOtp(phoneDigits);
    setOtpBusy(false);
    if (error) {
      setOtpError(error.message || 'Could not resend OTP');
      return;
    }
    if (typeof data?.otp_length === 'number' && data.otp_length > 0) {
      setOtpLength(data.otp_length);
    }
    setOtp('');
  };

  const handleBack = () => {
    if (orderData) return;
    if (currentStep === 4 && isLoggedIn) {
      setCurrentStep(1);
      return;
    }
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleOrderPlaced = (order) => {
    setOrderData(order);
    onOrderConfirmed?.();
  };

  const handleExplore = () => {
    if (onExplore) {
      onExplore();
      return;
    }
    window.location.assign('/');
  };

  const handleClose = () => {
    if (orderData) return;
    if (!orderData && cartItems?.length) {
      const phone = String(checkoutPhone || selectedAddress?.receiver_phone || '').replace(/\D/g, '').slice(0, 10);
      if (/^[6-9]\d{9}$/.test(phone)) {
        const items = cartItems.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          product_price: item.price,
          quantity: item.quantity,
        }));
        apiFetch('/api/abandoned-carts', {
          method: 'POST',
          body: JSON.stringify({
            phone_number: phone,
            full_name: selectedAddress?.receiver_name || userName || null,
            items,
            cart_total: Number(totalAmount) || 0,
          }),
        }).catch(() => {});
      }
    }
    setCurrentStep(1);
    setCheckoutPhone('');
    setOtp('');
    setOtpError('');
    setVerifiedPhone('');
    setOtpBusy(false);
    setSelectedAddress(null);
    setOrderData(null);
    setPaymentMethod('');
    onClose();
  };

  if (!isOpen) return null;

  const steps = isLoggedIn
    ? [
        { number: 1, title: 'Method' },
        { number: 4, title: 'Address' },
        { number: 5, title: 'Pay' },
      ]
    : [
        { number: 1, title: 'Method' },
        { number: 2, title: 'Number' },
        { number: 3, title: 'OTP' },
        { number: 4, title: 'Address' },
        { number: 5, title: 'Pay' },
      ];
  const flowIndex = Math.max(0, steps.findIndex((step) => step.number === currentStep));

  const canProceed = () => {
    if (otpBusy) return false;
    if (currentStep === 1) return paymentMethod !== '';
    if (currentStep === 2) return phoneIsValid;
    if (currentStep === 3) return otp.replace(/\D/g, '').length === otpLength;
    if (currentStep === 4) return selectedAddress !== null;
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

  const stepTitles = {
    1: 'Payment options',
    2: 'Mobile number',
    3: 'OTP',
    4: 'Address',
    5: 'Payment',
  };

  const panel = (
    <div className="gg-cream flex h-full min-h-0 w-full flex-1 flex-col">
      <header className="gg-flow-bar border-b border-orange-100 px-4 py-3.5">
        <div className="flex items-center gap-3">
          {!orderData && (
            <button
              type="button"
              onClick={currentStep === 1 ? handleClose : handleBack}
              className="rounded-full p-1.5 text-stone-800 transition-colors hover:bg-white"
              aria-label={currentStep === 1 ? 'Back to cart' : 'Back'}
            >
              <FaArrowLeft className="text-base" />
            </button>
          )}
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              {orderData ? 'Order confirmed' : stepTitles[currentStep]}
            </h2>
            {!orderData && (
              <p className="text-[11px] text-stone-500">Step {flowIndex + 1} of {steps.length}</p>
            )}
          </div>
        </div>
        {!orderData && (
        <div className="mt-3 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
          {steps.map((step) => {
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            return (
              <div key={step.number}>
                <div className={`h-1 rounded-full ${isActive || isCompleted ? 'bg-primary' : 'bg-stone-200'}`} />
                <p className={`mt-1 text-[11px] font-semibold ${isActive ? 'text-stone-900' : isCompleted ? 'text-primary' : 'text-stone-400'}`}>
                  {step.title}
                </p>
              </div>
            );
          })}
        </div>
        )}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {currentStep === 1 && (
          <PaymentOptions
            baseAmount={baseAmount}
            cartItems={cartItems}
            deliveryCharges={deliveryCharges}
            selectedMethod={paymentMethod}
            onPaymentSelect={(method) => {
              setPaymentMethod(method);
            }}
          />
        )}

        {currentStep === 2 && (
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-stone-600">
              We will use this number for delivery updates.
            </p>
            <label htmlFor="checkout-phone" className="mt-4 block text-sm font-medium text-stone-700">
              Phone number
            </label>
            <div className="mt-1 flex overflow-hidden rounded-xl border border-stone-200 focus-within:ring-2 focus-within:ring-primary">
              <span className="flex items-center bg-stone-50 px-3 text-sm font-medium text-stone-600">+91</span>
              <input
                id="checkout-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
                value={checkoutPhone}
                onChange={(e) => {
                  const next = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setCheckoutPhone(next);
                  if (next !== verifiedPhone) setVerifiedPhone('');
                }}
                placeholder="10-digit mobile number"
                className="w-full bg-white px-3 py-3 text-base outline-none"
              />
            </div>
            {checkoutPhone.length > 0 && !phoneIsValid && (
              <p className="mt-2 text-xs text-red-600">Enter a valid 10-digit mobile number.</p>
            )}
            {otpError && (
              <p className="mt-2 text-xs text-red-600">{otpError}</p>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm text-stone-600">
              Enter the OTP sent to <span className="font-semibold text-stone-900">+91 {phoneDigits}</span>
            </p>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="mt-1 text-xs font-semibold text-primary"
            >
              Change number
            </button>
            <div className="mt-4">
              <OtpInput
                length={otpLength}
                value={otp}
                onChange={setOtp}
                disabled={otpBusy}
                autoFocus
              />
            </div>
            {otpError && (
              <p className="mt-3 text-xs text-red-600">{otpError}</p>
            )}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={otpBusy}
              className="mt-4 text-sm font-semibold text-primary disabled:opacity-50"
            >
              Resend OTP
            </button>
          </div>
        )}

        {currentStep === 4 && (
          <AddressForm
            addresses={addresses}
            selectedAddress={selectedAddress}
            onSelectAddress={handleAddressSelect}
            onAddressCreated={handleAddressCreated}
            userId={userId}
            checkoutPhone={phoneDigits}
          />
        )}

        {currentStep === 5 && (
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
            userPhone={phoneDigits || userPhone}
            userName={userName}
            paymentMethod={paymentMethod}
            onOrderPlaced={handleOrderPlaced}
            onExplore={handleExplore}
            orderData={orderData}
          />
        )}
      </div>

      {currentStep < 5 && (
        <footer className="border-t border-orange-100 bg-[#FFFAEB] px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed()}
            className={`w-full rounded-xl px-5 py-3 text-base font-semibold shadow-md ${
              canProceed()
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'cursor-not-allowed bg-stone-200 text-stone-400 shadow-none'
            }`}
          >
            {otpBusy
              ? currentStep === 3 ? 'Verifying…' : 'Sending…'
              : currentStep === 2
                ? 'Send OTP'
                : currentStep === 3
                  ? 'Verify'
                  : 'Continue'}
          </button>
        </footer>
      )}
    </div>
  );

  if (embedded) return panel;

  return (
    <div className="fixed inset-0 z-[150]" role="dialog" aria-modal="true" aria-label="Checkout">
      <button
        type="button"
        className={`absolute inset-0 bg-black/45 transition-opacity duration-300 ${panelOpen ? 'opacity-100' : 'opacity-0'}`}
        aria-label="Close checkout"
        onClick={orderData ? undefined : handleClose}
        disabled={Boolean(orderData)}
      />
      <aside
        className={`absolute inset-y-0 right-0 flex w-full shadow-2xl transition-transform duration-300 ease-out sm:w-[440px] ${
          panelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {panel}
      </aside>
    </div>
  );
};

export default CheckoutModal;
