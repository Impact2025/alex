/**
 * Rate Limiter for preventing brute force attacks
 * Implements exponential backoff and temporary lockouts
 */

const STORAGE_KEY = 'ajax_rate_limit'
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes in milliseconds
const ATTEMPT_WINDOW = 15 * 60 * 1000 // 15 minutes window to track attempts

/**
 * Get rate limit data from localStorage
 * @returns {object} Rate limit data
 */
const getRateLimitData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) {
      return {
        attempts: [],
        lockedUntil: null,
        lastAttempt: null
      }
    }
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading rate limit data:', error)
    return {
      attempts: [],
      lockedUntil: null,
      lastAttempt: null
    }
  }
}

/**
 * Save rate limit data to localStorage
 * @param {object} data - Rate limit data to save
 */
const saveRateLimitData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving rate limit data:', error)
  }
}

/**
 * Clean up old attempts outside the window
 * @param {number[]} attempts - Array of attempt timestamps
 * @returns {number[]} Filtered attempts
 */
const cleanupOldAttempts = (attempts) => {
  const now = Date.now()
  return attempts.filter(timestamp => now - timestamp < ATTEMPT_WINDOW)
}

/**
 * Check if user is currently locked out
 * @returns {object} { isLocked: boolean, remainingTime: number, message: string }
 */
export const checkRateLimit = () => {
  const data = getRateLimitData()
  const now = Date.now()

  // Check if locked out
  if (data.lockedUntil && now < data.lockedUntil) {
    const remainingTime = data.lockedUntil - now
    const minutes = Math.ceil(remainingTime / 60000)

    return {
      isLocked: true,
      remainingTime,
      remainingMinutes: minutes,
      message: `Te veel mislukte pogingen. Probeer over ${minutes} ${minutes === 1 ? 'minuut' : 'minuten'} opnieuw.`
    }
  }

  // Clean up old attempts
  const recentAttempts = cleanupOldAttempts(data.attempts)

  // Check if too many attempts
  if (recentAttempts.length >= MAX_ATTEMPTS) {
    const lockedUntil = now + LOCKOUT_DURATION

    // Save lockout
    saveRateLimitData({
      attempts: recentAttempts,
      lockedUntil,
      lastAttempt: now
    })

    return {
      isLocked: true,
      remainingTime: LOCKOUT_DURATION,
      remainingMinutes: 15,
      message: `Te veel mislukte pogingen. Account tijdelijk vergrendeld voor 15 minuten.`
    }
  }

  // Calculate remaining attempts
  const remainingAttempts = MAX_ATTEMPTS - recentAttempts.length

  return {
    isLocked: false,
    remainingTime: 0,
    remainingMinutes: 0,
    remainingAttempts,
    message: remainingAttempts <= 2 ? `Let op: nog ${remainingAttempts} ${remainingAttempts === 1 ? 'poging' : 'pogingen'} over` : ''
  }
}

/**
 * Record a failed login attempt
 * @returns {object} Updated rate limit status
 */
export const recordFailedAttempt = () => {
  const data = getRateLimitData()
  const now = Date.now()

  // Clean up old attempts
  const recentAttempts = cleanupOldAttempts(data.attempts)

  // Add new attempt
  recentAttempts.push(now)

  // Save updated data
  saveRateLimitData({
    attempts: recentAttempts,
    lockedUntil: data.lockedUntil,
    lastAttempt: now
  })

  // Return updated status
  return checkRateLimit()
}

/**
 * Record a successful login (clears rate limit)
 */
export const recordSuccessfulLogin = () => {
  saveRateLimitData({
    attempts: [],
    lockedUntil: null,
    lastAttempt: Date.now()
  })
}

/**
 * Reset rate limit data (for testing or admin override)
 */
export const resetRateLimit = () => {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Get exponential backoff delay based on attempt count
 * @param {number} attemptNumber - Current attempt number (0-indexed)
 * @returns {number} Delay in milliseconds
 */
export const getBackoffDelay = (attemptNumber) => {
  // Exponential backoff: 1s, 2s, 4s, 8s, 16s
  const baseDelay = 1000 // 1 second
  const maxDelay = 16000 // 16 seconds

  const delay = Math.min(baseDelay * Math.pow(2, attemptNumber), maxDelay)
  return delay
}

/**
 * Format time remaining for display
 * @param {number} milliseconds - Time in milliseconds
 * @returns {string} Formatted time string
 */
export const formatTimeRemaining = (milliseconds) => {
  const seconds = Math.ceil(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return `${remainingSeconds}s`
}

/**
 * Hook for React components to use rate limiting
 * @returns {object} Rate limit utilities
 */
export const useRateLimit = () => {
  const check = () => checkRateLimit()
  const recordFailed = () => recordFailedAttempt()
  const recordSuccess = () => recordSuccessfulLogin()
  const reset = () => resetRateLimit()

  return {
    checkRateLimit: check,
    recordFailedAttempt: recordFailed,
    recordSuccessfulLogin: recordSuccess,
    resetRateLimit: reset,
    formatTimeRemaining
  }
}
