import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaArrowLeft, FaGem, FaShippingFast, FaHeart } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toaster';
import { trackLogin } from '../../utils/analytics.js';
import OtpInput from '../../components/OtpInput.jsx';
import ggLogo from '../../assets/gglogo.svg';

const TRUST_POINTS = [
  {
    Icon: FaGem,
    title: 'Authentic Rudraksha & more',
    desc: 'Blessed products devotees trust, with clear quality you can feel.',
  },
  {
    Icon: FaShippingFast,
    title: 'Across India',
    desc: 'Careful packing and reliable delivery to your doorstep.',
  },
  {
    Icon: FaHeart,
    title: 'The Gawri Ganga family',
    desc: 'Guidance and care for your spiritual journey with us.',
  },
];

const Auth = ({ embedded = false, onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpLength, setOtpLength] = useState(6);
  const [loading, setLoading] = useState(false);
  const { sendPhoneOtp, verifyPhoneOtp } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = embedded
    ? location.pathname + location.search
    : location.state?.from?.pathname || '/';

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const digits = phoneNumber.replace(/\D/g, '');
    if (digits.length !== 10) {
      toast.error('Enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await sendPhoneOtp(digits);
      if (error) {
        toast.error(error.message || 'Failed to send OTP');
      } else {
        setOtpRequested(true);
        setOtp('');
        if (typeof data?.otp_length === 'number' && data.otp_length > 0) {
          setOtpLength(data.otp_length);
        }
        toast.success('OTP sent to your phone');
      }
    } catch (_error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const code = otp.replace(/\D/g, '');
    if (code.length !== otpLength) {
      toast.error(`Enter the ${otpLength}-digit OTP`);
      return;
    }
    const digits = phoneNumber.replace(/\D/g, '');
    setLoading(true);
    try {
      const { error } = await verifyPhoneOtp(digits, code);
      if (error) {
        toast.error(error.message || 'Failed to verify OTP');
      } else {
        trackLogin('otp');
        toast.success('You are signed in');
        if (onSuccess) {
          onSuccess();
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (_error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPhone = () => {
    setOtpRequested(false);
    setOtp('');
  };

  const setPhoneDigits = (raw) => {
    setPhoneNumber(raw.replace(/\D/g, '').slice(0, 10));
  };

  const authCard = (
    <div
      className={`w-full overflow-hidden rounded-2xl bg-white shadow-2xl shadow-orange-950/10 ring-1 ring-primary/15 sm:rounded-3xl lg:flex ${
        embedded ? '' : 'max-w-5xl lg:min-h-[min(640px,calc(100vh-8rem))]'
      }`}
    >
          {/* Brand column — browns flow into site primary */}
          <aside className={`relative flex flex-col justify-between gap-6 bg-linear-to-br from-[#2a1d18] via-[#4a2d1c] to-[#8f4518] px-5 py-7 text-white sm:gap-8 sm:px-10 sm:py-12 ${embedded ? 'hidden sm:flex lg:w-[46%] lg:shrink-0 lg:py-14' : 'lg:w-[46%] lg:shrink-0 lg:py-14'}`}>
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_100%_0%,rgba(255,145,77,0.45),transparent_50%)]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_0%_100%,rgba(255,145,77,0.22),transparent_45%)]"
              aria-hidden
            />
            <div className="relative">
              <Link
                to="/"
                className="inline-block rounded-lg outline-none transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1d18]"
              >
                <img src={ggLogo} alt="Gawri Ganga" className="h-16 w-auto sm:h-20 md:h-24" />
              </Link>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#ffd8bc]">
                Purity · Power · Protection
              </p>
              <h1 className="mt-3 font-heading text-xl font-bold leading-snug text-white sm:text-3xl">
                Welcome to Gawri Ganga
              </h1>
              <p className="mt-2 max-w-sm text-xs leading-relaxed text-[#fdeeda]/95 sm:text-base">
                Authentic Rudraksha, malas, aura sprays & spiritual accessories sanctified with care for devotees
                across India.
              </p>
            </div>

            <ul className="relative hidden gap-3 sm:grid sm:grid-cols-3 lg:grid-cols-1 lg:gap-4">
              {TRUST_POINTS.map(({ Icon, title, desc }) => (
                <li
                  key={title}
                  className="rounded-2xl border border-primary/25 bg-black/25 p-3.5 shadow-inner shadow-black/20 backdrop-blur-md sm:p-4"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-md shadow-orange-950/30">
                    <Icon className="text-sm" aria-hidden />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-white">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#fdeeda]/88">{desc}</p>
                </li>
              ))}
            </ul>
          </aside>

          {/* Form column — warm white, ties to left via orange accents */}
          <div className="flex flex-1 flex-col justify-center border-t border-orange-100/90 bg-linear-to-br from-white via-[#FFFCFA] to-[#FFF6EE] px-4 py-8 sm:px-10 sm:py-12 lg:border-l lg:border-t-0 lg:border-orange-100 lg:px-12 lg:py-14">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-6 sm:mb-8">
                <h2 className="font-heading text-xl font-bold text-primary sm:text-3xl">
                  {otpRequested ? 'Verify your number' : 'Sign in with OTP'}
                </h2>
                <p className="mt-2 text-xs text-stone-600 sm:text-base">
                  {otpRequested
                    ? 'Enter the OTP we sent to your mobile.'
                    : 'Enter any valid mobile number - we will send a one-time code.'}
                </p>
              </div>

              {!otpRequested ? (
                <form onSubmit={handleSendOtp} className="space-y-5 sm:space-y-6">
                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-stone-500">
                      Mobile number
                    </label>
                    <div className="flex overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm shadow-orange-900/5 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25">
                      <span className="flex shrink-0 items-center border-r border-orange-100 bg-[#FFF4EC] px-3 text-sm font-semibold text-[#6b4423]">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneDigits(e.target.value)}
                        className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3.5 text-base text-stone-900 outline-none placeholder:text-stone-400"
                        placeholder="10-digit number"
                        required
                        autoComplete="tel"
                        inputMode="numeric"
                        maxLength={10}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-primary py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/35 transition hover:bg-[#ff8533] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
                  >
                    {loading ? 'Sending…' : 'Send OTP'}
                  </button>

                  <p className="text-center text-xs leading-relaxed text-stone-500">
                    By continuing you agree to our{' '}
                    <Link to="/terms-and-conditions" className="font-medium text-primary underline-offset-2 hover:underline">
                      Terms &amp; Conditions
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy-policy" className="font-medium text-primary underline-offset-2 hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-8">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="text-stone-600">
                      Code sent to{' '}
                      <span className="font-semibold text-stone-900">+91 {phoneNumber}</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleEditPhone}
                      className="font-semibold text-primary hover:underline"
                    >
                      Change number
                    </button>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-center text-sm font-medium text-stone-700">
                      Enter {otpLength}-digit code
                    </label>
                    <OtpInput
                      length={otpLength}
                      value={otp}
                      onChange={setOtp}
                      disabled={loading}
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.replace(/\D/g, '').length !== otpLength}
                    className="w-full rounded-xl bg-primary py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/35 transition hover:bg-[#ff8533] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
                  >
                    {loading ? 'Verifying…' : 'Sign in'}
                  </button>
                </form>
              )}
            </div>
          </div>
    </div>
  );

  if (embedded) {
    return authCard;
  }

  return (
    <div className="relative min-h-screen bg-linear-to-b from-[#FFF7F0] via-[#FAF4EF] to-[#EDE5DD]">
      <Link
        to="/"
        className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-sm font-medium text-stone-700 shadow-sm ring-1 ring-orange-100/90 backdrop-blur-sm transition hover:bg-[#FFF5EE] hover:text-primary hover:ring-primary/25 sm:left-6 sm:top-6"
      >
        <FaArrowLeft className="text-xs text-primary/70" aria-hidden />
        Home
      </Link>

      <div className="flex min-h-screen items-center justify-center px-3 pb-8 pt-16 sm:px-6 sm:pb-12 sm:pt-20 lg:px-8 lg:py-12">
        {authCard}
      </div>
    </div>
  );
};

export default Auth;
