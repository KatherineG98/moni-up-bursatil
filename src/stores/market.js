import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import { obtenerAccionesReales } from '@/services/stockApi'
import { localStore } from '@/services/storage.service'
/**
 * Store para la gestión del mercado de valores tradicional.
 * Encapsula el estado para las acciones bursátiles (`stocks`) obtenidas a través
 * del servicio externo `stockApi` y administra su ciclo de caché local.
 */
export const useMarketStore = defineStore('market', () => {
  const stocks = shallowRef([])
  const lastUpdated = ref(null)
  const loading = ref(false)
  const error = ref(null)

  /**
   * Deshidratación del estado base desde almacenamiento local.
   */
  const init = () => {
    const cachedData = localStore.getItem('market_data')
    if (cachedData) {
      stocks.value = cachedData.stocks || []
      lastUpdated.value = cachedData.lastUpdated || null
    }
  }

  /**
   * Invoca al servicio `stockApi` para la resolución del precio de la matriz de activos.
   * @param {boolean} force - Si es `true`, ignora el estado actual e invoca a la red incondicionalmente.
   */
  const fetchMarketData = async (force = false) => {
    if (!force && stocks.value.length > 0) {
      return
    }

    loading.value = true
    error.value = null

    try {
      const newStocks = await obtenerAccionesReales()

      if (newStocks && newStocks.length > 0) {
        stocks.value = newStocks
        lastUpdated.value = new Date().getTime()

        // Guardar cache ofuscado
        localStore.setItem('market_data', {
          stocks: stocks.value,
          lastUpdated: lastUpdated.value,
        })
      } else {
        throw new Error('Sin datos recibidos')
      }
    } catch (err) {
      console.error('Error fetching market data:', err)
      error.value = 'No se pudo actualizar el mercado'
    } finally {
      loading.value = false
    }
  }

  return {
    stocks,
    lastUpdated,
    loading,
    error,
    init,
    fetchMarketData,
  }
})
