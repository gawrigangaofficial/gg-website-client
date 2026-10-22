export const COD_CONFIRMATION_AMOUNT = 100;

const COD_ADVANCE_NOTE =
  /COD advance paid ₹([\d.]+)\. Collect ₹([\d.]+) on delivery\./;

export function codPayNowAmount(amountDue) {
  const due = Math.max(0, Number(amountDue) || 0);
  const rounded = Math.round(due * 100) / 100;
  return Math.min(COD_CONFIRMATION_AMOUNT, rounded);
}

export function parseCodAdvanceNote(notes) {
  const match = String(notes || '').match(COD_ADVANCE_NOTE);
  if (!match) return null;
  const paidNow = Number(match[1]);
  const collectOnDelivery = Number(match[2]);
  if (!Number.isFinite(paidNow) || !Number.isFinite(collectOnDelivery)) return null;
  return { paidNow, collectOnDelivery };
}
