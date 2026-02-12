import { describe, it, expect, vi } from 'vitest'
import {
  sanitizeTextInput,
  validateEmail,
  validatePassword,
  validatePincode,
  sanitizeNumberInput,
  sanitizeURL
} from './validation'

describe('validation utils', () => {
  describe('sanitizeTextInput', () => {
    it('should remove HTML tags', () => {
      const input = '<script>alert("xss")</script>Hello'
      const result = sanitizeTextInput(input)
      expect(result).toBe('Hello')
    })

    it('should handle empty input', () => {
      expect(sanitizeTextInput('')).toBe('')
      expect(sanitizeTextInput(null)).toBe('')
      expect(sanitizeTextInput(undefined)).toBe('')
    })

    it('should trim whitespace', () => {
      const result = sanitizeTextInput('  hello  ')
      expect(result).toBe('hello')
    })

    it('should remove dangerous attributes', () => {
      const input = '<img src=x onerror="alert(1)">'
      const result = sanitizeTextInput(input)
      expect(result).not.toContain('onerror')
    })
  })

  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      const result = validateEmail('test@example.com')
      expect(result.isValid).toBe(true)
      expect(result.sanitized).toBe('test@example.com')
      expect(result.error).toBe('')
    })

    it('should reject invalid emails', () => {
      const invalid = ['notanemail', '@example.com', 'test@', 'test @example.com']

      invalid.forEach(email => {
        const result = validateEmail(email)
        expect(result.isValid).toBe(false)
      })
    })

    it('should detect common domain typos', () => {
      const result = validateEmail('test@gmail.con')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('gmail.com')
    })

    it('should lowercase emails', () => {
      const result = validateEmail('TEST@EXAMPLE.COM')
      expect(result.sanitized).toBe('test@example.com')
    })

    it('should reject emails that are too long', () => {
      const longEmail = 'a'.repeat(250) + '@example.com'
      const result = validateEmail(longEmail)
      expect(result.isValid).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('should accept strong passwords', () => {
      const result = validatePassword('MyP@ssw0rd!')
      expect(result.isValid).toBe(true)
      expect(result.strength).toBe('strong')
    })

    it('should reject passwords under 6 characters', () => {
      const result = validatePassword('12345')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Minimaal 6 tekens')
    })

    it('should detect weak passwords', () => {
      const weak = ['password', '123456', 'qwerty']

      weak.forEach(pwd => {
        const result = validatePassword(pwd)
        expect(result.strength).toBe('weak')
      })
    })

    it('should calculate strength correctly', () => {
      const medium = validatePassword('password123')
      expect(medium.strength).toBe('medium')

      const strong = validatePassword('P@ssw0rd123!')
      expect(strong.strength).toBe('strong')
    })
  })

  describe('validatePincode', () => {
    it('should accept valid 4-digit pincodes', () => {
      const result = validatePincode('1234')
      expect(result.isValid).toBe(true)
      expect(result.sanitized).toBe('1234')
    })

    it('should reject non-numeric pincodes', () => {
      const result = validatePincode('12ab')
      expect(result.isValid).toBe(false)
    })

    it('should reject pincodes not exactly 4 digits', () => {
      expect(validatePincode('123').isValid).toBe(false)
      expect(validatePincode('12345').isValid).toBe(false)
    })

    it('should detect weak patterns', () => {
      const weak = ['0000', '1111', '1234', '4321']

      weak.forEach(pin => {
        const result = validatePincode(pin)
        expect(result.isValid).toBe(false)
        expect(result.error).toContain('makkelijk te raden')
      })
    })
  })

  describe('sanitizeNumberInput', () => {
    it('should accept valid numbers within range', () => {
      const result = sanitizeNumberInput(50, 0, 100)
      expect(result.isValid).toBe(true)
      expect(result.value).toBe(50)
    })

    it('should clamp values outside range', () => {
      const tooHigh = sanitizeNumberInput(150, 0, 100)
      expect(tooHigh.isValid).toBe(false)
      expect(tooHigh.value).toBe(100)

      const tooLow = sanitizeNumberInput(-10, 0, 100)
      expect(tooLow.isValid).toBe(false)
      expect(tooLow.value).toBe(0)
    })

    it('should handle string numbers', () => {
      const result = sanitizeNumberInput('50', 0, 100)
      expect(result.isValid).toBe(true)
      expect(result.value).toBe(50)
    })

    it('should reject non-numeric values', () => {
      const result = sanitizeNumberInput('abc', 0, 100)
      expect(result.isValid).toBe(false)
    })
  })

  describe('sanitizeURL', () => {
    it('should accept valid HTTP URLs', () => {
      const result = sanitizeURL('https://example.com')
      expect(result.isValid).toBe(true)
    })

    it('should reject dangerous protocols', () => {
      const dangerous = [
        'javascript:alert(1)',
        'data:text/html,<script>alert(1)</script>',
        'vbscript:msgbox(1)'
      ]

      dangerous.forEach(url => {
        const result = sanitizeURL(url)
        expect(result.isValid).toBe(false)
        expect(result.error).toContain('Onveilig')
      })
    })

    it('should accept relative URLs', () => {
      const result = sanitizeURL('/path/to/page')
      expect(result.isValid).toBe(true)
    })

    it('should accept mailto and tel links', () => {
      expect(sanitizeURL('mailto:test@example.com').isValid).toBe(true)
      expect(sanitizeURL('tel:+31612345678').isValid).toBe(true)
    })
  })
})
