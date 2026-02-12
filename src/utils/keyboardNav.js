/**
 * Keyboard Navigation Utilities
 * Provides keyboard accessibility features for better UX
 */

/**
 * Trap focus within a modal/dialog
 * @param {HTMLElement} element - The element to trap focus within
 * @returns {Function} Cleanup function to remove event listener
 */
export const trapFocus = (element) => {
  if (!element) return () => {}

  // Get all focusable elements
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )

  const firstFocusable = focusableElements[0]
  const lastFocusable = focusableElements[focusableElements.length - 1]

  const handleTabKey = (e) => {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault()
        lastFocusable.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault()
        firstFocusable.focus()
      }
    }
  }

  element.addEventListener('keydown', handleTabKey)

  // Focus first element
  if (firstFocusable) {
    firstFocusable.focus()
  }

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleTabKey)
  }
}

/**
 * Handle Escape key to close modals/dialogs
 * @param {Function} onClose - Callback to execute when Escape is pressed
 * @returns {Function} Cleanup function to remove event listener
 */
export const handleEscapeKey = (onClose) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  document.addEventListener('keydown', handleKeyDown)

  return () => {
    document.removeEventListener('keydown', handleKeyDown)
  }
}

/**
 * Handle Enter key for form submission or action execution
 * @param {Function} onEnter - Callback to execute when Enter is pressed
 * @returns {Function} Event handler function
 */
export const handleEnterKey = (onEnter) => {
  return (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onEnter()
    }
  }
}

/**
 * Handle arrow keys for navigation
 * @param {Object} handlers - Object with up, down, left, right handlers
 * @returns {Function} Event handler function
 */
export const handleArrowKeys = ({ up, down, left, right }) => {
  return (e) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        if (up) up()
        break
      case 'ArrowDown':
        e.preventDefault()
        if (down) down()
        break
      case 'ArrowLeft':
        e.preventDefault()
        if (left) left()
        break
      case 'ArrowRight':
        e.preventDefault()
        if (right) right()
        break
      default:
        break
    }
  }
}

/**
 * React hook for modal keyboard navigation
 * @param {boolean} isOpen - Whether modal is open
 * @param {Function} onClose - Function to close modal
 * @param {React.RefObject} modalRef - Ref to modal element
 */
export const useModalKeyboard = (isOpen, onClose, modalRef) => {
  if (typeof window === 'undefined') return

  // Use useEffect pattern
  const setupKeyboard = () => {
    if (!isOpen) return

    // Setup focus trap
    let cleanupFocusTrap = () => {}
    if (modalRef?.current) {
      cleanupFocusTrap = trapFocus(modalRef.current)
    }

    // Setup escape key
    const cleanupEscape = handleEscapeKey(onClose)

    // Cleanup function
    return () => {
      cleanupFocusTrap()
      cleanupEscape()
    }
  }

  return setupKeyboard
}

/**
 * Get next focusable element
 * @param {HTMLElement} currentElement - Current focused element
 * @param {boolean} reverse - Whether to go backwards
 * @returns {HTMLElement|null} Next focusable element
 */
export const getNextFocusableElement = (currentElement, reverse = false) => {
  const focusableElements = Array.from(
    document.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  )

  const currentIndex = focusableElements.indexOf(currentElement)
  if (currentIndex === -1) return null

  const nextIndex = reverse ? currentIndex - 1 : currentIndex + 1

  if (nextIndex < 0) {
    return focusableElements[focusableElements.length - 1]
  } else if (nextIndex >= focusableElements.length) {
    return focusableElements[0]
  } else {
    return focusableElements[nextIndex]
  }
}

/**
 * Skip to main content (accessibility feature)
 * @param {string} mainContentId - ID of main content element
 */
export const skipToMainContent = (mainContentId = 'main-content') => {
  const mainContent = document.getElementById(mainContentId)
  if (mainContent) {
    mainContent.focus()
    mainContent.scrollIntoView()
  }
}

/**
 * Create a roving tabindex for lists
 * Allows arrow key navigation in lists
 * @param {HTMLElement[]} items - Array of list items
 * @param {number} initialIndex - Initially focused index
 * @returns {Object} Control object with focus methods
 */
export const createRovingTabindex = (items, initialIndex = 0) => {
  let currentIndex = initialIndex

  const updateTabindexes = () => {
    items.forEach((item, index) => {
      item.setAttribute('tabindex', index === currentIndex ? '0' : '-1')
    })
  }

  const focusCurrent = () => {
    if (items[currentIndex]) {
      items[currentIndex].focus()
    }
  }

  const next = () => {
    currentIndex = (currentIndex + 1) % items.length
    updateTabindexes()
    focusCurrent()
  }

  const previous = () => {
    currentIndex = (currentIndex - 1 + items.length) % items.length
    updateTabindexes()
    focusCurrent()
  }

  const first = () => {
    currentIndex = 0
    updateTabindexes()
    focusCurrent()
  }

  const last = () => {
    currentIndex = items.length - 1
    updateTabindexes()
    focusCurrent()
  }

  // Initialize
  updateTabindexes()

  return {
    next,
    previous,
    first,
    last,
    focusCurrent,
    getCurrentIndex: () => currentIndex,
    setIndex: (index) => {
      if (index >= 0 && index < items.length) {
        currentIndex = index
        updateTabindexes()
        focusCurrent()
      }
    }
  }
}

/**
 * Keyboard shortcuts manager
 */
export class KeyboardShortcuts {
  constructor() {
    this.shortcuts = new Map()
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  /**
   * Register a keyboard shortcut
   * @param {string} key - Key combination (e.g., 'ctrl+s', 'alt+n')
   * @param {Function} handler - Handler function
   * @param {string} description - Description for help text
   */
  register(key, handler, description = '') {
    this.shortcuts.set(key.toLowerCase(), { handler, description })
  }

  /**
   * Unregister a keyboard shortcut
   * @param {string} key - Key combination
   */
  unregister(key) {
    this.shortcuts.delete(key.toLowerCase())
  }

  /**
   * Handle keydown event
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleKeyDown(e) {
    const key = []
    if (e.ctrlKey) key.push('ctrl')
    if (e.altKey) key.push('alt')
    if (e.shiftKey) key.push('shift')
    if (e.metaKey) key.push('meta')
    key.push(e.key.toLowerCase())

    const keyString = key.join('+')
    const shortcut = this.shortcuts.get(keyString)

    if (shortcut) {
      e.preventDefault()
      shortcut.handler(e)
    }
  }

  /**
   * Enable keyboard shortcuts
   */
  enable() {
    document.addEventListener('keydown', this.handleKeyDown)
  }

  /**
   * Disable keyboard shortcuts
   */
  disable() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  /**
   * Get all registered shortcuts
   * @returns {Array} Array of shortcuts with keys and descriptions
   */
  getShortcuts() {
    return Array.from(this.shortcuts.entries()).map(([key, { description }]) => ({
      key,
      description
    }))
  }
}

/**
 * Default keyboard shortcuts for the app
 */
export const createDefaultShortcuts = () => {
  const shortcuts = new KeyboardShortcuts()

  // Add default shortcuts here
  // Example:
  // shortcuts.register('ctrl+/', () => {}, 'Show keyboard shortcuts help')

  return shortcuts
}
