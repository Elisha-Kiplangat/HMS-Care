import * as crypto from 'crypto';

/**
 * Pseudonymizes sensitive patient identifiers (e.g., MRN, national ID, email)
 * using HMAC-SHA256 with a tenant-specific or system secret key.
 */
export function pseudonymizeIdentifier(identifier: string, secretKey: string): string {
  if (!identifier) return '';
  return crypto.createHmac('sha256', secretKey).update(identifier.trim().toLowerCase()).digest('hex');
}

/**
 * Anonymizes patient dates by shifting or truncating to month/year.
 */
export function anonymizeDateOfBirth(date: Date | string): string {
  if (!date) return '';
  const d = new Date(date);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-01`;
}
