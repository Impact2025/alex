/**
 * Screen Reader Announcer Utility
 * Provides accessible announcements for screen readers using ARIA live regions
 */

let announceElement = null

/**
 * Initialize the announcer by creating a live region element
 * This should be called once when the app loads
 */
export const initAnnouncer = () => {
  // Check if already initialized
  if (announceElement) {
    return announceElement
  }

  // Create the live region element
  announceElement = document.createElement('div')
  announceElement.setAttribute('role', 'status')
  announceElement.setAttribute('aria-live', 'polite')
  announceElement.setAttribute('aria-atomic', 'true')
  announceElement.className = 'sr-only' // Visually hidden but accessible to screen readers

  // Apply visually-hidden styles
  Object.assign(announceElement.style, {
    position: 'absolute',
    left: '-10000px',
    width: '1px',
    height: '1px',
    overflow: 'hidden'
  })

  // Add to document body
  document.body.appendChild(announceElement)

  return announceElement
}

/**
 * Announce a message to screen readers
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' (default) or 'assertive'
 * @param {number} delay - Delay in ms before announcing (default: 100)
 */
export const announce = (message, priority = 'polite', delay = 100) => {
  // Initialize if not already done
  if (!announceElement) {
    initAnnouncer()
  }

  // Clear existing content first (helps with repeated messages)
  announceElement.textContent = ''

  // Update priority if needed
  announceElement.setAttribute('aria-live', priority)

  // Announce after a small delay to ensure screen readers pick it up
  setTimeout(() => {
    if (announceElement) {
      announceElement.textContent = message
    }
  }, delay)
}

/**
 * Announce an assertive message (interrupts current reading)
 * Use sparingly - only for critical/urgent messages
 * @param {string} message - The message to announce
 */
export const announceAssertive = (message) => {
  announce(message, 'assertive', 100)
}

/**
 * Announce a polite message (waits for current reading to finish)
 * This is the default and should be used for most announcements
 * @param {string} message - The message to announce
 */
export const announcePolite = (message) => {
  announce(message, 'polite', 100)
}

/**
 * Clear the current announcement
 */
export const clearAnnouncement = () => {
  if (announceElement) {
    announceElement.textContent = ''
  }
}

/**
 * Remove the announcer element from DOM
 * Call this on app unmount if needed
 */
export const destroyAnnouncer = () => {
  if (announceElement && announceElement.parentNode) {
    announceElement.parentNode.removeChild(announceElement)
    announceElement = null
  }
}

/**
 * React hook for using the announcer
 * @returns {object} Announcer functions
 */
export const useAnnouncer = () => {
  return {
    announce: announcePolite,
    announceAssertive,
    announcePolite,
    clear: clearAnnouncement
  }
}

/**
 * Announce page navigation
 * @param {string} pageName - Name of the new page
 */
export const announceNavigation = (pageName) => {
  announcePolite(`Navigating to ${pageName}`)
}

/**
 * Announce form validation errors
 * @param {string[]} errors - Array of error messages
 */
export const announceFormErrors = (errors) => {
  if (errors.length === 0) {
    announcePolite('Form validated successfully')
  } else if (errors.length === 1) {
    announceAssertive(`Form error: ${errors[0]}`)
  } else {
    announceAssertive(`Form has ${errors.length} errors: ${errors.join(', ')}`)
  }
}

/**
 * Announce success message
 * @param {string} message - Success message
 */
export const announceSuccess = (message) => {
  announcePolite(`Success: ${message}`)
}

/**
 * Announce error message
 * @param {string} message - Error message
 */
export const announceError = (message) => {
  announceAssertive(`Error: ${message}`)
}

/**
 * Announce loading state
 * @param {boolean} isLoading - Whether content is loading
 * @param {string} message - Optional custom message
 */
export const announceLoading = (isLoading, message = '') => {
  if (isLoading) {
    announcePolite(message || 'Loading, please wait')
  } else {
    announcePolite(message || 'Content loaded')
  }
}

/**
 * Announce points/score update
 * @param {number} points - New points value
 * @param {number} change - Points change (positive or negative)
 */
export const announcePointsUpdate = (points, change) => {
  const verb = change > 0 ? 'earned' : 'lost'
  const absChange = Math.abs(change)
  announcePolite(`You ${verb} ${absChange} ${absChange === 1 ? 'point' : 'points'}. Total: ${points} points`)
}

/**
 * Announce achievement unlock
 * @param {string} achievementName - Name of the achievement
 */
export const announceAchievement = (achievementName) => {
  announceAssertive(`Achievement unlocked: ${achievementName}!`)
}

/**
 * Announce modal open/close
 * @param {boolean} isOpen - Whether modal is open
 * @param {string} modalName - Name of the modal
 */
export const announceModal = (isOpen, modalName) => {
  if (isOpen) {
    announcePolite(`${modalName} dialog opened`)
  } else {
    announcePolite(`${modalName} dialog closed`)
  }
}

// Initialize on module load
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnnouncer)
  } else {
    initAnnouncer()
  }
}
