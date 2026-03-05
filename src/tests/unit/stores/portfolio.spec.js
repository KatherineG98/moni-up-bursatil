import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { usePortfolioStore } from '@/stores/portfolio'

import { localStore } from '@/services/storage.service'

// Usamos el hoisting de Vitest para el mock
vi.mock('@/services/storage.service', () => {
  let store = {}
  return {
    localStore: {
      getItem: vi.fn((key, defaultValue) => {
        return store[key] !== undefined ? store[key] : defaultValue
      }),
      setItem: vi.fn((key, value) => {
        store[key] = value
      }),
      _reset: () => {
        store = {}
      },
    },
  }
})

describe('Portfolio Store (Pinia)', () => {
  beforeEach(() => {
    localStore._reset()
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('1. Inicializa con el balance por defecto (10,000 USD)', () => {
    const portfolio = usePortfolioStore()
    portfolio.init()
    expect(portfolio.balance).toBe(10000)
    expect(portfolio.portfolio).toEqual({})
  })

  it('2. Compra de acciones resta saldo correctamente', () => {
    const portfolioStore = usePortfolioStore()
    portfolioStore.init() // Balance: 10000

    // Comprar 1 accion de AAPL a $150.50
    const success = portfolioStore.buyShare('AAPL', 150.5)

    expect(success).toBe(true)
    expect(portfolioStore.balance).toBe(9849.5) // 10000 - 150.50 = 9849.5
    expect(portfolioStore.portfolio['AAPL']).toBe(1)

    // El historial debe registrar la transaccion
    expect(portfolioStore.history[0].type).toBe('BUY')
    expect(portfolioStore.history[0].symbol).toBe('AAPL')
  })

  it('3. Rechaza compras si el saldo es insuficiente', () => {
    const portfolioStore = usePortfolioStore()
    portfolioStore.init() // Balance: 10000

    // Intentar comprar BERKSHIRE HATHAWAY (Clase A) a > 600K USD
    const success = portfolioStore.buyShare('BRK.A', 600000)

    expect(success).toBe(false)
    expect(portfolioStore.balance).toBe(10000) // Saldo no cambia
    expect(portfolioStore.portfolio['BRK.A']).toBeUndefined()
  })

  it('4. Maneja fallos de Venta con sobrecarga de strings y asegura floats', () => {
    const portfolioStore = usePortfolioStore()
    portfolioStore.init() // Balance: 10000

    // Pre-cargamos una acción
    portfolioStore.portfolio['TSLA'] = 1

    // Vendemos inyectando un STRING "200.25" en lugar del Float esperado
    // Esto prueba nuestro reciente "bugfix" de parseInt/parseFloat
    const success = portfolioStore.sellShare('TSLA', '200.25')

    expect(success).toBe(true)
    // El balance debería ser numérico 10200.25 (10000+200.25), NO una concatenación "10000200.25"
    expect(portfolioStore.balance).toBe(10200.25)
    // Y ya no deberia figurar en el portafolio
    expect(portfolioStore.portfolio['TSLA']).toBeUndefined()
  })
})
