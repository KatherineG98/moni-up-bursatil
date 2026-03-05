/**
 * Centralized formatting utilities for MoniUp
 */

/**
 * Formats a number as USD currency
 * @param {number} val
 * @returns {string}
 */
export const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(val || 0)
}

/**
 * Formats a date for display
 * @param {string|Date} dateVal
 * @returns {string}
 */
export const formatDate = (dateVal) => {
  if (!dateVal) return ''
  const date = new Date(dateVal)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Formats large numbers into a compact representation (e.g. 1.2M)
 * @param {number} val
 * @returns {string}
 */
export const formatCompact = (val) => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(val || 0)
}
