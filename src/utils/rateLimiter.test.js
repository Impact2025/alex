import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  checkRateLimit,
  recordFailedAttempt,
  recordSuccessfulLogin,
  resetRateLimit
} from './rateLimiter'

describe('rateLimiter', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('checkRateLimit', () => {
    it('should allow login when no attempts recorded', () => {
      const result = checkRateLimit()
      expect(result.isLocked).toBe(false)
      expect(result.remainingAttempts).toBe(5)
    })

    it('should show remaining attempts', () => {
      // Record 2 failed attempts
      recordFailedAttempt()
      recordFailedAttempt()

      const result = checkRateLimit()
      expect(result.isLocked).toBe(false)
      expect(result.remainingAttempts).toBe(3)
    })

    it('should show warning when few attempts remain', () => {
      // Record 4 failed attempts
      for (let i = 0; i < 4; i++) {
        recordFailedAttempt()
      }

      const result = checkRateLimit()
      expect(result.message).toContain('1 poging over')
    })

    it('should lock after 5 failed attempts', () => {
      // Record 5 failed attempts
      for (let i = 0; i < 5; i++) {
        recordFailedAttempt()
      }

      const result = checkRateLimit()
      expect(result.isLocked).toBe(true)
      expect(result.message).toContain('15 minuten')
    })
  })

  describe('recordFailedAttempt', () => {
    it('should increment attempt count', () => {
      recordFailedAttempt()
      const result = checkRateLimit()
      expect(result.remainingAttempts).toBe(4)
    })

    it('should return lock status after recording', () => {
      for (let i = 0; i < 4; i++) {
        recordFailedAttempt()
      }

      const result = recordFailedAttempt()
      expect(result.isLocked).toBe(true)
    })
  })

  describe('recordSuccessfulLogin', () => {
    it('should clear failed attempts', () => {
      // Record failed attempts
      recordFailedAttempt()
      recordFailedAttempt()

      // Successful login
      recordSuccessfulLogin()

      // Check should show no attempts
      const result = checkRateLimit()
      expect(result.remainingAttempts).toBe(5)
    })

    it('should clear lockout', () => {
      // Lock the account
      for (let i = 0; i < 5; i++) {
        recordFailedAttempt()
      }

      // Successful login (e.g., after lockout expires)
      recordSuccessfulLogin()

      const result = checkRateLimit()
      expect(result.isLocked).toBe(false)
    })
  })

  describe('resetRateLimit', () => {
    it('should clear all rate limit data', () => {
      // Record attempts
      recordFailedAttempt()
      recordFailedAttempt()

      // Reset
      resetRateLimit()

      // Should be clean slate
      const result = checkRateLimit()
      expect(result.remainingAttempts).toBe(5)
      expect(result.isLocked).toBe(false)
    })
  })

  describe('time window', () => {
    it('should clean up old attempts outside 15 minute window', () => {
      // This test would need to mock Date.now() to properly test
      // For now, we verify the function handles the cleanup
      const now = Date.now()
      const oldAttempt = now - (16 * 60 * 1000) // 16 minutes ago

      // Manually set old attempt
      localStorage.setItem('ajax_rate_limit', JSON.stringify({
        attempts: [oldAttempt],
        lockedUntil: null,
        lastAttempt: oldAttempt
      }))

      // Check should clean up old attempts
      const result = checkRateLimit()
      expect(result.remainingAttempts).toBe(5)
    })
  })
})
