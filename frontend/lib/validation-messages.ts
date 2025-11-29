/**
 * Validation Messages
 * WCAG 2.2 Success Criterion 3.3.3 (Error Suggestion) - Level AA
 *
 * Provides helpful error messages with suggestions for fixing input errors.
 * Messages follow best practices for accessibility and user experience.
 */

export const validationMessages = {
  email: {
    required: "Email address is required",
    invalid: "Please enter a valid email address (e.g., user@example.com)",
    exists: "This email is already registered. Try logging in instead.",
  },

  password: {
    required: "Password is required",
    minLength: "Password must be at least 8 characters long",
    maxLength: "Password must be no more than 128 characters",
    pattern: "Password must include at least one letter and one number",
    weak: "Password is too weak. Try adding special characters (!@#$%)",
    mismatch: "Passwords do not match. Please re-enter your password.",
  },

  username: {
    required: "Username is required",
    minLength: "Username must be at least 3 characters",
    maxLength: "Username must be no more than 20 characters",
    pattern: "Username can only contain letters, numbers, and underscores",
    exists: "This username is taken. Try adding numbers or underscores.",
  },

  name: {
    required: "Name is required",
    minLength: "Name must be at least 2 characters",
    pattern: "Name can only contain letters, spaces, and hyphens",
  },

  phone: {
    required: "Phone number is required",
    invalid: "Please enter a valid phone number (e.g., (555) 123-4567)",
    pattern: "Phone number must be 10 digits",
  },

  url: {
    required: "URL is required",
    invalid: "Please enter a valid URL (e.g., https://example.com)",
    protocol: "URL must start with http:// or https://",
  },

  date: {
    required: "Date is required",
    invalid: "Please enter a valid date",
    past: "Date cannot be in the past",
    future: "Date cannot be in the future",
    range: "Date must be between {min} and {max}",
  },

  file: {
    required: "Please select a file",
    size: "File size must be less than {max}MB",
    type: "File type must be {types}",
    maxFiles: "You can upload a maximum of {max} files",
  },

  number: {
    required: "This field is required",
    min: "Value must be at least {min}",
    max: "Value must be no more than {max}",
    integer: "Value must be a whole number",
    positive: "Value must be positive",
  },

  text: {
    required: "This field is required",
    minLength: "Must be at least {min} characters",
    maxLength: "Must be no more than {max} characters",
  },

  general: {
    required: "This field is required",
    invalid: "Please check your input and try again",
    server: "An error occurred. Please try again later.",
    network: "Network error. Please check your connection.",
  },
} as const;

/**
 * Format validation message with dynamic values
 *
 * @example
 * formatMessage(validationMessages.number.min, { min: 10 })
 * // Returns: "Value must be at least 10"
 */
export function formatMessage(
  message: string,
  params?: Record<string, string | number>
): string {
  if (!params) return message;

  return Object.entries(params).reduce(
    (msg, [key, value]) => msg.replace(`{${key}}`, String(value)),
    message
  );
}

/**
 * Get field-specific validation message
 *
 * @example
 * getValidationMessage('email', 'invalid')
 * // Returns: "Please enter a valid email address (e.g., user@example.com)"
 */
export function getValidationMessage(
  field: keyof typeof validationMessages,
  type: string,
  params?: Record<string, string | number>
): string {
  const fieldMessages = validationMessages[field];
  if (!fieldMessages) return validationMessages.general.invalid;

  const message = fieldMessages[type as keyof typeof fieldMessages];
  if (!message) return validationMessages.general.invalid;

  return formatMessage(message, params);
}

/**
 * Helper texts for common form fields
 * Provides guidance to users before they make errors
 */
export const helperTexts = {
  email: "We'll never share your email with anyone else",
  password: "Use at least 8 characters with a mix of letters and numbers",
  passwordConfirm: "Re-enter your password to confirm",
  username: "3-20 characters, letters, numbers, and underscores only",
  phone: "Include your area code",
  url: "Must start with http:// or https://",
  date: "Format: MM/DD/YYYY",
  file: {
    image: "Accepted formats: JPG, PNG, WEBP (max 5MB)",
    document: "Accepted formats: PDF, DOC, DOCX (max 10MB)",
    any: "Drag and drop or click to upload",
  },
} as const;
