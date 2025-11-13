/**
 * Input Validation Library
 * Provides validation functions for common input patterns
 */

/**
 * Email validation
 */
export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }
}

/**
 * Phone number validation (international format)
 */
export function validatePhone(phone: string): void {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""))) {
    throw new Error("Invalid phone number format");
  }
}

/**
 * URL validation
 */
export function validateUrl(url: string): void {
  try {
    new URL(url);
  } catch {
    throw new Error("Invalid URL format");
  }
}

/**
 * String length validation
 */
export function validateLength(
  value: string,
  min: number,
  max: number,
  fieldName: string = "Field"
): void {
  if (value.length < min) {
    throw new Error(`${fieldName} must be at least ${min} characters`);
  }
  if (value.length > max) {
    throw new Error(`${fieldName} must not exceed ${max} characters`);
  }
}

/**
 * Required field validation
 */
export function validateRequired(value: unknown, fieldName: string = "Field"): void {
  if (value === undefined || value === null || value === "") {
    throw new Error(`${fieldName} is required`);
  }
}

/**
 * Number range validation
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string = "Value"
): void {
  if (value < min || value > max) {
    throw new Error(`${fieldName} must be between ${min} and ${max}`);
  }
}

/**
 * Rating validation (1-5)
 */
export function validateRating(rating: number): void {
  validateRange(rating, 1, 5, "Rating");
  if (!Number.isInteger(rating)) {
    throw new Error("Rating must be a whole number");
  }
}

/**
 * Price validation (positive number)
 */
export function validatePrice(price: number, fieldName: string = "Price"): void {
  if (price < 0) {
    throw new Error(`${fieldName} cannot be negative`);
  }
  if (!Number.isFinite(price)) {
    throw new Error(`${fieldName} must be a valid number`);
  }
}

/**
 * Array validation
 */
export function validateArray(
  arr: unknown[],
  minLength: number,
  maxLength: number,
  fieldName: string = "Array"
): void {
  if (arr.length < minLength) {
    throw new Error(`${fieldName} must contain at least ${minLength} items`);
  }
  if (arr.length > maxLength) {
    throw new Error(`${fieldName} must not exceed ${maxLength} items`);
  }
}

/**
 * Enum validation
 */
export function validateEnum<T>(
  value: T,
  allowedValues: readonly T[],
  fieldName: string = "Value"
): void {
  if (!allowedValues.includes(value)) {
    throw new Error(
      `${fieldName} must be one of: ${allowedValues.join(", ")}`
    );
  }
}

/**
 * HTML/XSS sanitization check
 */
export function validateNoHtml(value: string, fieldName: string = "Field"): void {
  const htmlRegex = /<[^>]*>/g;
  if (htmlRegex.test(value)) {
    throw new Error(`${fieldName} cannot contain HTML tags`);
  }
}

/**
 * SQL injection pattern check
 */
export function validateNoSqlInjection(value: string, fieldName: string = "Field"): void {
  const sqlPatterns = [
    /(\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b)/i,
    /(--|;|\/\*|\*\/)/,
  ];

  for (const pattern of sqlPatterns) {
    if (pattern.test(value)) {
      throw new Error(`${fieldName} contains invalid characters`);
    }
  }
}

/**
 * Combined safe string validation
 */
export function validateSafeString(
  value: string,
  minLength: number,
  maxLength: number,
  fieldName: string = "Field"
): void {
  validateRequired(value, fieldName);
  validateLength(value, minLength, maxLength, fieldName);
  validateNoHtml(value, fieldName);
  validateNoSqlInjection(value, fieldName);
}

/**
 * File upload validation
 */
export interface FileValidationOptions {
  maxSizeBytes: number;
  allowedTypes: string[];
}

export function validateFileUpload(
  file: { size: number; type: string },
  options: FileValidationOptions
): void {
  if (file.size > options.maxSizeBytes) {
    throw new Error(
      `File size must not exceed ${options.maxSizeBytes / 1024 / 1024}MB`
    );
  }

  if (!options.allowedTypes.includes(file.type)) {
    throw new Error(
      `File type must be one of: ${options.allowedTypes.join(", ")}`
    );
  }
}

/**
 * Date validation
 */
export function validateFutureDate(timestamp: number, fieldName: string = "Date"): void {
  if (timestamp <= Date.now()) {
    throw new Error(`${fieldName} must be in the future`);
  }
}

export function validatePastDate(timestamp: number, fieldName: string = "Date"): void {
  if (timestamp >= Date.now()) {
    throw new Error(`${fieldName} must be in the past`);
  }
}
