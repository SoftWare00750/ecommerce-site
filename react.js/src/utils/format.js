// src/utils/format.js

/**
 * Format a number as Nigerian Naira.
 * e.g. 850000 → "₦850,000"
 */
export function formatPrice(amount) {
  return `₦${Number(amount).toLocaleString()}`;
}

/**
 * Format a card number with spaces every 4 digits.
 * e.g. "1234567890123456" → "1234 5678 9012 3456"
 */
export function formatCardNumber(raw) {
  return raw.replace(/\D/g, "").substring(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

/**
 * Format a card expiry as "MM / YY".
 */
export function formatExpiry(raw) {
  let v = raw.replace(/\D/g, "").substring(0, 4);
  if (v.length >= 3) v = v.slice(0, 2) + " / " + v.slice(2);
  return v;
}