import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FaTimes, FaWhatsapp, FaChevronLeft } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../config/api';
import { useToast } from './Toaster';
import Auth from '../Pages/Auth/Auth';
import { trackLead } from '../utils/analytics.js';
import { categoryDisplayName, getGuidanceCopy } from '../utils/guidanceCopy.js';

function normalizePhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '').slice(0, 10);
  return digits;
}

const ProductGuidanceWidget = () => {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const location = useLocation();
  const toast = useToast();

  const [loginGateOpen, setLoginGateOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [loginSkipped, setLoginSkipped] = useState(false);

  const [uiLanguage, setUiLanguage] = useState('en');
  const [step, setStep] = useState('language');

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);

  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [subcategory, setSubcategory] = useState('');

  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const copy = useMemo(() => getGuidanceCopy(uiLanguage), [uiLanguage]);
  const phoneValid = normalizePhone(guestPhone).length === 10;

  const resetFlow = useCallback(() => {
    setStep('language');
    setUiLanguage('en');
    setCategoryId('');
    setCategoryName('');
    setSubcategory('');
    setSubcategories([]);
    setGuestName('');
    setGuestPhone('');
    setPhoneTouched(false);
    setLoginSkipped(false);
  }, []);

  const closeAll = useCallback(() => {
    setLoginGateOpen(false);
    setPanelOpen(false);
    resetFlow();
  }, [resetFlow]);

  const openGuidancePanel = useCallback(() => {
    setPanelOpen(true);
    setStep('language');
  }, []);

  const handleBadgeClick = () => {
    if (authLoading) return;
    if (isAuthenticated) {
      openGuidancePanel();
      return;
    }
    setLoginGateOpen(true);
  };

  const handleLoginSuccess = () => {
    setLoginGateOpen(false);
    setLoginSkipped(false);
    openGuidancePanel();
  };

  const handleSkipLogin = () => {
    setLoginSkipped(true);
    setLoginGateOpen(false);
    openGuidancePanel();
  };

  useEffect(() => {
    if (!panelOpen || step !== 'category') return undefined;
    let cancelled = false;

    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const res = await apiFetch('/api/guidance-requests/categories');
        const payload = await res.json();
        if (!cancelled && res.ok && payload?.success) {
          setCategories(Array.isArray(payload.data) ? payload.data : []);
        }
      } catch {
        if (!cancelled) setCategories([]);
      } finally {
        if (!cancelled) setCategoriesLoading(false);
      }
    };

    loadCategories();
    return () => {
      cancelled = true;
    };
  }, [panelOpen, step]);

  useEffect(() => {
    if (!panelOpen || step !== 'subcategory' || !categoryName) return undefined;
    let cancelled = false;

    const loadSubcategories = async () => {
      setSubcategoriesLoading(true);
      try {
        const params = new URLSearchParams({ category: categoryName });
        const res = await apiFetch(`/api/products/filters?${params.toString()}`);
        const payload = await res.json();
        const list =
          res.ok && payload?.success && Array.isArray(payload.data?.subcategories)
            ? payload.data.subcategories.filter(Boolean)
            : [];
        if (!cancelled) setSubcategories(list);
      } catch {
        if (!cancelled) setSubcategories([]);
      } finally {
        if (!cancelled) setSubcategoriesLoading(false);
      }
    };

    loadSubcategories();
    return () => {
      cancelled = true;
    };
  }, [panelOpen, step, categoryName]);

  useEffect(() => {
    if (!loginGateOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [loginGateOpen]);

  const submitRequest = async () => {
    if (submitting) return;

    const needsGuestPhone = !isAuthenticated && loginSkipped;
    if (needsGuestPhone && !phoneValid) {
      setPhoneTouched(true);
      return;
    }

    setSubmitting(true);
    try {
      const body = {
        language: uiLanguage,
        category_id: categoryId,
        category_name: categoryName,
        subcategory,
        login_skipped: loginSkipped,
        page_path: location.pathname + location.search,
      };

      if (needsGuestPhone) {
        body.guest_phone = normalizePhone(guestPhone);
        if (guestName.trim()) body.guest_name = guestName.trim();
      }

      const res = await apiFetch('/api/guidance-requests', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const payload = await res.json();

      if (!res.ok || !payload?.success) {
        throw new Error(payload?.message || copy.submitError);
      }

      trackLead({
        content_name: 'Product guidance request',
        source: 'whatsapp_badge',
        category: categoryName,
        subcategory,
        language: uiLanguage,
      });

      setStep('success');
    } catch (error) {
      toast.error(error?.message || copy.submitError);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLanguageNext = (lang) => {
    setUiLanguage(lang);
    setStep('category');
  };

  const handleCategoryNext = () => {
    if (!categoryId || !categoryName) return;
    setSubcategory('');
    setStep('subcategory');
  };

  const handleSubcategoryNext = () => {
    if (!subcategory) return;
    if (!isAuthenticated && loginSkipped) {
      setStep('contact');
      return;
    }
    submitRequest();
  };

  const panelTitle = () => {
    if (step === 'language') return copy.stepLanguage;
    if (step === 'category') return copy.stepCategory;
    if (step === 'subcategory') return copy.stepSubcategory;
    if (step === 'contact') return copy.stepContact;
    return copy.successTitle;
  };

  const panelHint = () => {
    if (step === 'language') return copy.stepLanguageHint;
    if (step === 'category') return copy.stepCategoryHint;
    if (step === 'subcategory') return copy.stepSubcategoryHint;
    if (step === 'contact') return copy.stepContactHint;
    return copy.successMessage;
  };

  const canGoBack = step === 'category' || step === 'subcategory' || step === 'contact';

  const handleBack = () => {
    if (step === 'contact') {
      setStep('subcategory');
      return;
    }
    if (step === 'subcategory') {
      setStep('category');
      setSubcategory('');
      return;
    }
    if (step === 'category') {
      setStep('language');
      setCategoryId('');
      setCategoryName('');
    }
  };

  return (
    <>
      {!panelOpen && !loginGateOpen ? (
        <button
          type="button"
          onClick={handleBadgeClick}
          aria-label={copy.badgeAria}
          className="fixed bottom-5 right-4 z-120 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg transition-all duration-300 hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
        >
          <FaWhatsapp className="text-2xl" aria-hidden />
          <span className="hidden text-sm font-semibold sm:inline">{copy.badge}</span>
        </button>
      ) : null}

      {loginGateOpen ? (
        <div
          className="fixed inset-0 z-130 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="guidance-login-title"
        >
          <div className="relative flex w-full max-w-5xl max-h-[92vh] flex-col">
            <div className="mb-3 flex shrink-0 items-center justify-between gap-3 px-1">
              <div>
                <p id="guidance-login-title" className="text-sm font-semibold text-white sm:text-base">
                  {getGuidanceCopy('en').loginTitle}
                </p>
                <p className="mt-0.5 text-xs text-white/80 sm:text-sm">
                  {getGuidanceCopy('en').loginSubtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={closeAll}
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25"
                aria-label={getGuidanceCopy('en').close}
              >
                <FaTimes aria-hidden />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl">
              <Auth embedded onSuccess={handleLoginSuccess} onDismiss={closeAll} />
            </div>

            <div className="mt-2 flex shrink-0 justify-end px-1">
              <button
                type="button"
                onClick={handleSkipLogin}
                className="text-[10px] text-white/45 underline-offset-2 hover:text-white/60 hover:underline sm:text-[11px]"
              >
                {getGuidanceCopy('en').skipLogin}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {panelOpen ? (
        <div className="fixed bottom-5 right-4 z-130 w-[min(100vw-2rem,22rem)]">
          <div
            className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl ring-1 ring-black/5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="guidance-panel-title"
          >
            <div className="flex items-start justify-between gap-2 border-b border-stone-100 bg-[#FFFAEB] px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {canGoBack ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="rounded-full p-1 text-stone-500 hover:bg-stone-100"
                      aria-label={copy.back}
                    >
                      <FaChevronLeft aria-hidden />
                    </button>
                  ) : null}
                  <h2 id="guidance-panel-title" className="truncate text-sm font-bold text-stone-900">
                    {panelTitle()}
                  </h2>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-stone-600">{panelHint()}</p>
              </div>
              <button
                type="button"
                onClick={closeAll}
                className="shrink-0 rounded-full p-1.5 text-stone-500 hover:bg-stone-100"
                aria-label={copy.close}
              >
                <FaTimes aria-hidden />
              </button>
            </div>

            <div className="max-h-[min(60vh,28rem)] overflow-y-auto px-4 py-4">
              {step === 'language' ? (
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { code: 'en', label: copy.langEnglish },
                    { code: 'hi', label: copy.langHindi },
                  ].map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => handleLanguageNext(item.code)}
                      className="rounded-xl border border-stone-200 bg-white px-3 py-4 text-sm font-semibold text-stone-800 transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              ) : null}

              {step === 'category' ? (
                <div className="space-y-2">
                  {categoriesLoading ? (
                    <p className="text-sm text-stone-500">{copy.loadingCategories}</p>
                  ) : (
                    <div className="space-y-2">
                      {categories.map((cat) => {
                        const selected = categoryId === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setCategoryId(cat.id);
                              setCategoryName(cat.name);
                            }}
                            className={`w-full rounded-xl border px-3 py-3 text-left text-sm font-medium transition ${
                              selected
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-stone-200 text-stone-800 hover:border-primary/30 hover:bg-stone-50'
                            }`}
                          >
                            {categoryDisplayName(cat.name, uiLanguage)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleCategoryNext}
                    disabled={!categoryId || categoriesLoading}
                    className="mt-3 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {copy.next}
                  </button>
                </div>
              ) : null}

              {step === 'subcategory' ? (
                <div className="space-y-2">
                  {subcategoriesLoading ? (
                    <p className="text-sm text-stone-500">{copy.loadingSubcategories}</p>
                  ) : subcategories.length === 0 ? (
                    <p className="text-sm text-stone-500">{copy.noSubcategories}</p>
                  ) : (
                    <div className="space-y-2">
                      {subcategories.map((item) => {
                        const selected = subcategory === item;
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setSubcategory(item)}
                            className={`w-full rounded-xl border px-3 py-3 text-left text-sm font-medium transition ${
                              selected
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-stone-200 text-stone-800 hover:border-primary/30 hover:bg-stone-50'
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleSubcategoryNext}
                    disabled={!subcategory || subcategoriesLoading || submitting}
                    className="mt-3 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting
                      ? copy.submitting
                      : !isAuthenticated && loginSkipped
                        ? copy.next
                        : copy.submit}
                  </button>
                </div>
              ) : null}

              {step === 'contact' ? (
                <div className="space-y-3">
                  <div>
                    <label htmlFor="guidance-guest-name" className="mb-1 block text-xs font-semibold text-stone-700">
                      {copy.nameOptional}
                    </label>
                    <input
                      id="guidance-guest-name"
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="guidance-guest-phone" className="mb-1 block text-xs font-semibold text-stone-700">
                      {copy.phone}
                    </label>
                    <input
                      id="guidance-guest-phone"
                      type="tel"
                      inputMode="numeric"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(normalizePhone(e.target.value))}
                      onBlur={() => setPhoneTouched(true)}
                      placeholder="9876543210"
                      className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    {phoneTouched && !phoneValid ? (
                      <p className="mt-1 text-xs font-medium text-red-600">{copy.phoneError}</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={submitRequest}
                    disabled={submitting || !phoneValid}
                    className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? copy.submitting : copy.submit}
                  </button>
                </div>
              ) : null}

              {step === 'success' ? (
                <div className="py-2 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">
                    ✓
                  </div>
                  <p className="text-sm leading-relaxed text-stone-700">{copy.successMessage}</p>
                  <button
                    type="button"
                    onClick={closeAll}
                    className="mt-4 w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50"
                  >
                    {copy.close}
                  </button>
                </div>
              ) : null}
            </div>

            {isAuthenticated && user?.phone_number && step !== 'success' && step !== 'language' ? (
              <div className="border-t border-stone-100 bg-stone-50 px-4 py-2 text-[11px] text-stone-500">
                {uiLanguage === 'hi'
                  ? `संपर्क: ${user.phone_number}`
                  : `We will contact you at ${user.phone_number}`}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ProductGuidanceWidget;
