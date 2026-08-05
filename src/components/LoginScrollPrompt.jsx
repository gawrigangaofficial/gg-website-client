import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Auth from '../Pages/Auth/Auth';

const DISMISSED_KEY = 'gg_login_scroll_prompt_dismissed';
const SCROLL_THRESHOLD_PERCENT = 10;

function isDismissed() {
  try {
    return sessionStorage.getItem(DISMISSED_KEY) === '1';
  } catch {
    return false;
  }
}

function dismissPrompt() {
  try {
    sessionStorage.setItem(DISMISSED_KEY, '1');
  } catch {
    /* ignore */
  }
}

function isAuthRoute(pathname) {
  return pathname === '/login' || pathname.startsWith('/auth');
}

function getScrollPercent() {
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  if (docHeight <= 0) return 0;
  return (window.scrollY / docHeight) * 100;
}

const LoginScrollPrompt = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (loading || isAuthenticated || isDismissed() || isAuthRoute(location.pathname)) {
      return undefined;
    }

    const maybeOpen = () => {
      if (hasTriggered.current || open) return;
      if (getScrollPercent() >= SCROLL_THRESHOLD_PERCENT) {
        hasTriggered.current = true;
        setOpen(true);
      }
    };

    window.addEventListener('scroll', maybeOpen, { passive: true });
    maybeOpen();

    return () => window.removeEventListener('scroll', maybeOpen);
  }, [loading, isAuthenticated, location.pathname, open]);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleLater = () => {
    dismissPrompt();
    setOpen(false);
  };

  const handleSuccess = () => {
    dismissPrompt();
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-110 flex items-center justify-center bg-black/55 p-3 backdrop-blur-sm sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-scroll-prompt-title"
    >
      <div className="relative flex w-full max-w-5xl max-h-[92vh] flex-col">
        <div className="mb-3 flex shrink-0 items-center justify-between gap-3 px-1">
          <p id="login-scroll-prompt-title" className="text-sm font-medium text-white sm:text-base">
            Sign in to save your wishlist, track orders &amp; get member offers
          </p>
          <button
            type="button"
            onClick={handleLater}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25"
            aria-label="Close login prompt"
          >
            <FaTimes aria-hidden />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl">
          <Auth embedded onSuccess={handleSuccess} onDismiss={handleLater} />
        </div>

        <div className="mt-3 flex shrink-0 justify-center">
          <button
            type="button"
            onClick={handleLater}
            className="rounded-full border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/20"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScrollPrompt;
