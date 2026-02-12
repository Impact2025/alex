import DOMPurify from 'dompurify'

/**
 * Sanitize text input to prevent XSS attacks
 * @param {string} input - The text to sanitize
 * @param {object} options - DOMPurify configuration options
 * @returns {string} Sanitized text
 */
export const sanitizeTextInput = (input, options = {}) => {
  if (!input || typeof input !== 'string') {
    return ''
  }

  // Default configuration: strip all HTML tags
  const defaultConfig = {
    ALLOWED_TAGS: [], // No HTML tags allowed by default
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true, // Keep text content, remove tags
    ...options
  }

  return DOMPurify.sanitize(input.trim(), defaultConfig)
}

/**
 * Sanitize HTML content (for cases where HTML is needed)
 * @param {string} html - The HTML to sanitize
 * @param {object} options - DOMPurify configuration options
 * @returns {string} Sanitized HTML
 */
export const sanitizeHTML = (html, options = {}) => {
  if (!html || typeof html !== 'string') {
    return ''
  }

  // Allow basic formatting tags but strip dangerous elements
  const defaultConfig = {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
    ...options
  }

  return DOMPurify.sanitize(html, defaultConfig)
}

/**
 * Validate and sanitize email address
 * @param {string} email - Email to validate
 * @returns {object} { isValid: boolean, sanitized: string, error: string }
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, sanitized: '', error: 'Email is verplicht' }
  }

  // Sanitize first
  const sanitized = sanitizeTextInput(email).toLowerCase()

  // Basic email regex (RFC 5322 simplified)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  if (!emailRegex.test(sanitized)) {
    return { isValid: false, sanitized, error: 'Ongeldig email formaat' }
  }

  // Check length constraints
  if (sanitized.length > 254) {
    return { isValid: false, sanitized, error: 'Email te lang (max 254 tekens)' }
  }

  // Check for common typos in domain
  const commonDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com']
  const domain = sanitized.split('@')[1]
  const suspiciousDomains = commonDomains.map(d => d.replace('.com', '.con'))

  if (suspiciousDomains.includes(domain)) {
    const suggestion = domain.replace('.con', '.com')
    return {
      isValid: false,
      sanitized,
      error: `Bedoelde je ${sanitized.replace(domain, suggestion)}?`
    }
  }

  return { isValid: true, sanitized, error: '' }
}

/**
 * Sanitize and validate number input with range
 * @param {number|string} value - The number to validate
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {object} { isValid: boolean, value: number, error: string }
 */
export const sanitizeNumberInput = (value, min = 0, max = 100) => {
  // Convert to number
  const num = Number(value)

  // Check if it's a valid number
  if (isNaN(num) || !isFinite(num)) {
    return { isValid: false, value: min, error: 'Ongeldige numerieke waarde' }
  }

  // Clamp to range
  const clamped = Math.max(min, Math.min(max, num))

  // Check if clamping was needed
  if (clamped !== num) {
    return {
      isValid: false,
      value: clamped,
      error: `Waarde moet tussen ${min} en ${max} zijn`
    }
  }

  return { isValid: true, value: clamped, error: '' }
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} { isValid: boolean, strength: string, errors: string[] }
 */
export const validatePassword = (password) => {
  const errors = []
  let strength = 'weak'

  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      strength: 'none',
      errors: ['Wachtwoord is verplicht']
    }
  }

  // Length check
  if (password.length < 6) {
    errors.push('Minimaal 6 tekens')
  }
  if (password.length < 8) {
    errors.push('Voor extra beveiliging: gebruik minimaal 8 tekens')
  }

  // Strength scoring
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  if (score >= 4) strength = 'strong'
  else if (score >= 2) strength = 'medium'

  // Common patterns check
  const commonPatterns = ['123456', 'password', 'qwerty', 'abc123', '111111']
  if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
    errors.push('Gebruik geen veelvoorkomende patronen')
    strength = 'weak'
  }

  return {
    isValid: errors.length === 0 || (errors.length === 1 && errors[0].includes('extra beveiliging')),
    strength,
    errors
  }
}

/**
 * Sanitize URL to prevent javascript: and data: URIs
 * @param {string} url - URL to sanitize
 * @returns {object} { isValid: boolean, sanitized: string, error: string }
 */
export const sanitizeURL = (url) => {
  if (!url || typeof url !== 'string') {
    return { isValid: false, sanitized: '', error: 'URL is verplicht' }
  }

  const trimmed = url.trim()

  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:']
  const lowerUrl = trimmed.toLowerCase()

  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return {
        isValid: false,
        sanitized: '',
        error: 'Onveilig URL protocol gedetecteerd'
      }
    }
  }

  // Allow http, https, mailto, tel
  const allowedProtocolRegex = /^(https?:\/\/|mailto:|tel:)/i

  if (!allowedProtocolRegex.test(trimmed) && !trimmed.startsWith('/')) {
    return {
      isValid: false,
      sanitized: trimmed,
      error: 'URL moet starten met http://, https://, mailto:, tel:, of /'
    }
  }

  return { isValid: true, sanitized: trimmed, error: '' }
}

/**
 * Sanitize pincode (4 digits only)
 * @param {string} pincode - Pincode to validate
 * @returns {object} { isValid: boolean, sanitized: string, error: string }
 */
export const validatePincode = (pincode) => {
  if (!pincode || typeof pincode !== 'string') {
    return { isValid: false, sanitized: '', error: 'Pincode is verplicht' }
  }

  // Only allow digits
  const sanitized = pincode.replace(/\D/g, '')

  if (sanitized.length !== 4) {
    return {
      isValid: false,
      sanitized,
      error: 'Pincode moet exact 4 cijfers zijn'
    }
  }

  // Check for weak patterns
  const weakPatterns = ['0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', '1234', '4321']
  if (weakPatterns.includes(sanitized)) {
    return {
      isValid: false,
      sanitized,
      error: 'Gebruik geen makkelijk te raden pincode'
    }
  }

  return { isValid: true, sanitized, error: '' }
}

/**
 * Generic input length validator
 * @param {string} input - Input to validate
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @param {string} fieldName - Name of the field for error messages
 * @returns {object} { isValid: boolean, error: string }
 */
export const validateLength = (input, minLength = 0, maxLength = 1000, fieldName = 'Input') => {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: `${fieldName} is verplicht` }
  }

  const trimmed = input.trim()

  if (trimmed.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} moet minimaal ${minLength} tekens zijn`
    }
  }

  if (trimmed.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} mag maximaal ${maxLength} tekens zijn`
    }
  }

  return { isValid: true, error: '' }
}
