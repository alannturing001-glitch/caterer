import { sanitize } from './sanitize';

/**
 * Sanitize form data before sending to API
 * @param formData - Form data object
 * @returns Sanitized form data
 */
export function sanitizeFormData(formData: any): any {
  if (!formData) return formData;

  const sanitized = { ...formData };

  // Sanitize text fields
  if (sanitized.title) sanitized.title = sanitize(sanitized.title);
  if (sanitized.name) sanitized.name = sanitize(sanitized.name);
  if (sanitized.companyName) sanitized.companyName = sanitize(sanitized.companyName);
  if (sanitized.description) sanitized.description = sanitize(sanitized.description);
  if (sanitized.bio) sanitized.bio = sanitize(sanitized.bio);
  if (sanitized.firstName) sanitized.firstName = sanitize(sanitized.firstName);
  if (sanitized.lastName) sanitized.lastName = sanitize(sanitized.lastName);
  if (sanitized.email) sanitized.email = sanitize(sanitized.email);
  if (sanitized.eventName) sanitized.eventName = sanitize(sanitized.eventName);
  if (sanitized.location) sanitized.location = sanitize(sanitized.location);
  if (sanitized.specialRequests) sanitized.specialRequests = sanitize(sanitized.specialRequests);
  if (sanitized.dietaryRestrictions) sanitized.dietaryRestrictions = sanitize(sanitized.dietaryRestrictions);
  if (sanitized.serviceArea) sanitized.serviceArea = sanitize(sanitized.serviceArea);

  return sanitized;
}

export default sanitizeFormData;
