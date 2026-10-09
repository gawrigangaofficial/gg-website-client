import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { initAnalytics, trackPageView } from '../utils/analytics';

const NOTICE_DISMISSED_KEY = 'gg_cookie_notice_dismissed';

function isNoticeDismissed() {
  try {
    return localStorage.getItem(NOTICE_DISMISSED_KEY) === '1';
  } catch {
    return false;
  }
}

function dismissNotice() {
  try {
    localStorage.setItem(NOTICE_DISMISSED_KEY, '1');
  } catch {
    /* ignore */
  }
}

/**
 * Loads GA4 + Meta Pixel immediately on every visit (no opt-in required).
 * Optional notice is informational only — dismissing it does not affect tracking.
 */
const CookieConsent = () => {
  const [visible, setVisible] = useState(() => !isNoticeDismissed());
  const location = useLocation();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  const handleDismiss = () => {
    dismissNotice();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-[calc(4.25rem+env(safe-area-inset-bottom))] left-0 right-0 z-100 border-t border-white/10 bg-gray-900/95 p-4 text-white shadow-2xl md:bottom-0 md:p-6"
      role="dialog"
      aria-labelledby="cookie-notice-title"
    >
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 text-sm md:text-base leading-relaxed">
          <h2 id="cookie-notice-title" className="font-semibold text-base mb-1">
            Cookies &amp; analytics
          </h2>
          <p className="text-white/90">
            We use cookies and analytics (Google Analytics and Meta Pixel) to understand traffic,
            measure ads, and improve the store. See our{' '}
            <Link to="/privacy-policy" className="underline hover:text-white">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
