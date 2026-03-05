import { defineStore } from 'pinia'
import { ref, watch, shallowRef } from 'vue'
import { localStore } from '@/services/storage.service'

export const usePortfolioStore = defineStore('portfolio', () => {
  const balance = ref(10000)
  const portfolio = ref({})
  const history = shallowRef([])

  /**
   * Carga sincrónica del estado en memoria a partir de `localStorage`.
   * Si el portafolio contiene datos pero el historial está vacío (por migración),
   * inyecta sintéticamente objetos de transacción compensatorios.
   */
  const init = () => {
    balance.value = localStore.getItem('moniup_balance', 10000)
    portfolio.value = localStore.getItem('moniup_portfolio', {})
    history.value = localStore.getItem('moniup_history', [])

    // Regenerar historial si el usuario tenía acciones previas a la actualización del store
    if (history.value.length === 0 && Object.keys(portfolio.value).length > 0) {
      let dateOffset = 0
      const newHistory = []
      for (const [sym, qty] of Object.entries(portfolio.value)) {
        newHistory.push({
          id: (Date.now() + dateOffset++).toString(),
          type: 'BUY',
          symbol: sym,
          price: 0,
          quantity: qty,
          total: 0,
          date: new Date(Date.now() - 86400000).toISOString(),
        })
      }
      history.value = newHistory
    }
  }

  // Persistencia reactiva automatizada.
  // Cualquier mutación sobre `balance`, `portfolio` o `history` activa una escritura profunda en el servicio de almacenamiento.
  watch(balance, (newVal) => localStore.setItem('moniup_balance', newVal))
  watch(portfolio, (newVal) => localStore.setItem('moniup_portfolio', newVal), { deep: true })
  watch(history, (newVal) => localStore.setItem('moniup_history', newVal), { deep: true })

  /**
   * Añade una entrada inmutable al principio del bloque de transacciones (algoritmo LIFO).
   * Restringe la longitud de la matriz a un máximo de 20 elementos mediante pop().
   */
  const addTransaction = (type, symbol, price, quantity = 1) => {
    history.value.unshift({
      id: Date.now().toString(),
      type, // 'BUY' o 'SELL'
      symbol,
      price,
      quantity,
      total: price * quantity,
      date: new Date().toISOString(),
    })
    // Mantener solo las últimas 20 transacciones para no saturar
    if (history.value.length > 20) {
      history.value.pop()
    }
  }

  const buyShare = (symbol, price) => {
    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum <= 0) return false

    if (balance.value >= priceNum) {
      balance.value = parseFloat((balance.value - priceNum).toFixed(2))
      portfolio.value[symbol] = (portfolio.value[symbol] || 0) + 1
      addTransaction('BUY', symbol, priceNum, 1)
      return true
    }
    return false
  }

  const sellShare = (symbol, price) => {
    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum <= 0) return false

    if (portfolio.value[symbol] > 0) {
      balance.value = parseFloat((balance.value + priceNum).toFixed(2))
      portfolio.value[symbol] -= 1
      if (portfolio.value[symbol] === 0) delete portfolio.value[symbol]
      addTransaction('SELL', symbol, priceNum, 1)
      return true
    }
    return false
  }

  return {
    balance,
    portfolio,
    history,
    init,
    buyShare,
    sellShare,
  }
})
