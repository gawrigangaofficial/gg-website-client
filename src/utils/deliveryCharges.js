import { apiFetch } from '../config/api.js';

export const DEFAULT_DELIVERY_CHARGES = {
  prepaid: {
    payment_type: 'prepaid',
    amount: 70,
    is_standard: true,
    reason_code: null,
    reason_message: null,
  },
  cod: {
    payment_type: 'cod',
    amount: 120,
    is_standard: true,
    reason_code: null,
    reason_message: null,
  },
};

function normalizeRow(row, fallbackType) {
  const fallback = DEFAULT_DELIVERY_CHARGES[fallbackType];
  if (!row) return { ...fallback };
  const isStandard = row.is_standard !== false;
  return {
    payment_type: row.payment_type || fallbackType,
    amount: Number.isFinite(Number(row.amount)) ? Number(row.amount) : fallback.amount,
    is_standard: isStandard,
    reason_code: isStandard ? null : row.reason_code || null,
    reason_message: isStandard ? null : row.reason_message || null,
  };
}

export async function fetchDeliveryCharges() {
  try {
    const response = await apiFetch('/api/delivery-charges');
    const payload = await response.json();
    if (!response.ok || !payload?.success) {
      throw new Error(payload?.message || 'Failed to load delivery charges');
    }
    const list = Array.isArray(payload.data) ? payload.data : [];
    const prepaid = normalizeRow(
      list.find((r) => String(r.payment_type).toLowerCase() === 'prepaid'),
      'prepaid',
    );
    const cod = normalizeRow(
      list.find((r) => String(r.payment_type).toLowerCase() === 'cod'),
      'cod',
    );
    return { prepaid, cod };
  } catch {
    return {
      prepaid: { ...DEFAULT_DELIVERY_CHARGES.prepaid },
      cod: { ...DEFAULT_DELIVERY_CHARGES.cod },
    };
  }
}

export function shippingForPaymentMethod(settings, paymentMethod) {
  const isCod = String(paymentMethod || '').toLowerCase() === 'cod';
  return isCod ? settings?.cod : settings?.prepaid;
}

export function resolveShippingAmount(settings, paymentMethod, fallback = 70) {
  const row = shippingForPaymentMethod(settings, paymentMethod);
  const amount = Number(row?.amount);
  return Number.isFinite(amount) && amount >= 0 ? amount : fallback;
}
