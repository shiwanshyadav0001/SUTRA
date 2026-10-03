/**
 * Deterministic formatting helpers for SUTRA.
 * Guarantees 100% byte-for-byte identical output between SSR (Node.js) and Client (all browsers)
 * with zero locale drift, zero timezone variance, and zero hydration mismatches.
 */

/**
 * Formats a number using the deterministic Indian numbering convention (Lakh / Crore: XX,XX,XXX).
 *
 * Example:
 * 1648295 -> "16,48,295"
 * 218000  -> "2,18,000"
 * 10000000 -> "1,00,00,000"
 */
export function formatIndianNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '0';
  const num = typeof value === 'string' ? Number(value.replace(/,/g, '')) : value;
  if (isNaN(num)) return String(value);

  const isNegative = num < 0;
  const absNum = Math.abs(num);
  const parts = absNum.toString().split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] !== undefined ? `.${parts[1]}` : '';

  if (integerPart.length <= 3) {
    return (isNegative ? '-' : '') + integerPart + decimalPart;
  }

  const lastThree = integerPart.slice(-3);
  const otherNumbers = integerPart.slice(0, -3);
  const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');

  return (isNegative ? '-' : '') + formattedOther + ',' + lastThree + decimalPart;
}

/**
 * Formats a number using standard 3-digit comma convention (X,XXX,XXX).
 */
export function formatStandardNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '0';
  const num = typeof value === 'string' ? Number(value.replace(/,/g, '')) : value;
  if (isNaN(num)) return String(value);

  const isNegative = num < 0;
  const absNum = Math.abs(num);
  const parts = absNum.toString().split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] !== undefined ? `.${parts[1]}` : '';

  const formatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return (isNegative ? '-' : '') + formatted + decimalPart;
}

/**
 * Default deterministic formatter for SUTRA governance metrics.
 * Default is Indian numbering convention (en-IN).
 */
export function formatDeterministicNumber(
  value: number | string | null | undefined,
  system: 'indian' | 'standard' = 'indian'
): string {
  return system === 'indian' ? formatIndianNumber(value) : formatStandardNumber(value);
}

/**
 * Formats an amount in INR Crores deterministically.
 */
export function formatDeterministicCrores(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return '₹0.00 Cr';
  const num = typeof value === 'string' ? Number(value) : value;
  if (isNaN(num)) return `₹${value} Cr`;
  return `₹${num.toFixed(2)} Cr`;
}

/**
 * Month names for deterministic date formatting
 */
const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Formats a date deterministically as "DD Mon YYYY" (e.g. "15 Oct 2025") in UTC/IST
 * without browser-specific locale or timezone shifts.
 */
export function formatDeterministicDate(dateInput: Date | string | number): string {
  const d = typeof dateInput === 'object' && dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(d.getTime())) return 'N/A';

  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = MONTH_NAMES[d.getUTCMonth()];
  const year = d.getUTCFullYear();

  return `${day} ${month} ${year}`;
}

/**
 * Formats a Date object as "DD Mon YYYY • HH:mm IST" deterministically in Indian Standard Time (UTC+5:30).
 */
export function formatDeterministicIST(dateInput: Date = new Date()): string {
  const d = typeof dateInput === 'object' && dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(d.getTime())) return 'N/A';

  // IST is UTC + 5 hours 30 minutes
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  const istTime = new Date(utc + (3600000 * 5.5));

  const day = String(istTime.getDate()).padStart(2, '0');
  const month = MONTH_NAMES[istTime.getMonth()];
  const year = istTime.getFullYear();
  const hours = String(istTime.getHours()).padStart(2, '0');
  const minutes = String(istTime.getMinutes()).padStart(2, '0');

  return `${day} ${month} ${year} • ${hours}:${minutes} IST`;
}

