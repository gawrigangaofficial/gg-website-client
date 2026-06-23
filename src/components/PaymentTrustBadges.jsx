import React from 'react';
import { FaMobileAlt, FaCreditCard, FaUniversity, FaMoneyBillWave } from 'react-icons/fa';

const PAYMENT_METHODS = [
  { Icon: FaMobileAlt, label: 'UPI' },
  { Icon: FaCreditCard, label: 'Cards' },
  { Icon: FaUniversity, label: 'Net Banking', shortLabel: 'Net Bank' },
  { Icon: FaMoneyBillWave, label: 'COD' },
];

const PaymentTrustBadges = ({ compact = false, className = '' }) => {
  if (compact) {
    return (
      <div className={`flex w-full flex-col ${className}`}>
        <div className="grid w-full grid-cols-4 gap-1.5 sm:gap-2">
          {PAYMENT_METHODS.map(({ Icon, label, shortLabel }) => (
            <div
              key={label}
              className="flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-xl border border-stone-200/90 bg-stone-50/50 px-1 py-2.5 text-center sm:px-2 sm:py-3"
            >
              <Icon className="h-4 w-4 shrink-0 text-primary sm:h-[18px] sm:w-[18px]" aria-hidden />
              <span className="text-[10px] font-semibold leading-tight text-stone-700 sm:text-[11px]">
                <span className="sm:hidden">{shortLabel || label}</span>
                <span className="hidden sm:inline">{label}</span>
              </span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-center text-[10px] font-medium tracking-wide text-stone-500 sm:text-[11px]">
          Secure checkout · Secured by Easebuzz
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-gray-200 bg-gray-50/80 p-3 sm:p-4 ${className}`}>
      <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-600">
        Secure payments
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {PAYMENT_METHODS.map(({ Icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white bg-white px-3 py-2 text-xs font-semibold text-gray-800 shadow-sm"
          >
            <Icon className="text-primary" aria-hidden /> {label}
          </span>
        ))}
      </div>
      <p className="mt-3 text-center text-[11px] text-gray-500">Secured by Easebuzz</p>
    </div>
  );
};

export default PaymentTrustBadges;
