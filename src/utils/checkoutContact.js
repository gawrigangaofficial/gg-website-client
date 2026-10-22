/**
 * Payment gateways expect an email field. Auth is phone-only; we send a deterministic
 * placeholder derived from the verified mobile (not shown in profile as "email").
 */
export function paymentGatewayEmail(phoneNumber) {
  const digits = String(phoneNumber || '').replace(/\D/g, '');
  const last10 =
    digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits.slice(-10);
  if (/^[6-9]\d{9}$/.test(last10)) {
    return `${last10}@checkout.gawriganga.com`;
  }
  return '';
}
