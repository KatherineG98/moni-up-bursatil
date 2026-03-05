import { describe, it, expect } from 'vitest'
import { formatCurrency, formatCompact } from '@/utils/formatters'

describe('Formatters Utility', () => {
  describe('formatCurrency', () => {
    it('debe formatear a dólares con 2 decimales', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
      expect(formatCurrency(1000)).toBe('$1,000.00')
    })

    it('debe regresar formateado como cero si se pasa nulo o indefinido', () => {
      expect(formatCurrency(null)).toBe('$0.00')
      expect(formatCurrency(undefined)).toBe('$0.00')
    })
  })

  describe('formatCompact', () => {
    it('debe crear representaciones cortas para miles y millones', () => {
      expect(formatCompact(1500)).toBe('1.5K')
      expect(formatCompact(2500000)).toBe('2.5M')
    })

    it('debe manejar números muy pequeños', () => {
      expect(formatCompact(123)).toBe('123')
    })
  })
})
