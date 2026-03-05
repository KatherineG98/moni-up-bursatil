import { defineStore } from 'pinia'
import { ref, computed, shallowRef } from 'vue'
import { localStore } from '@/services/storage.service'

/**
 * Store de gestión de Criptomonedas interactuando con CoinGecko API.
 * Administra la carga asíncrona de activos, caché local, y el listado de favoritos (pinned).
 */

export const useCryptoStore = defineStore('crypto', () => {
  const cryptos = shallowRef([])
  const pinnedCryptos = ref([])
  const lastUpdated = ref(null)
  const loading = ref(false)
  const error = ref(null)

  /**
   * Carga sincrónica del estado en memoria a partir de `localStorage`.
   * Recupera tanto los datos crudos del listado de monedas como los identificadores guardados como favoritos.
   */
  const init = () => {
    try {
      const cachedData = localStore.getItem('crypto_data')
      if (cachedData) {
        cryptos.value = cachedData.cryptos || []
        lastUpdated.value = cachedData.lastUpdated || null
      }
      const cachedPinned = localStore.getItem('pinned_cryptos')
      if (cachedPinned && Array.isArray(cachedPinned)) {
        pinnedCryptos.value = cachedPinned
      }
    } catch (e) {
      console.error('Error init crypto store', e)
    }
  }

  /**
   * Obtiene la lista de criptomonedas ordenadas por capitalización.
   * Por defecto emplea memoización básica devolviendo el caché en memoria
   * a menos que se fuerce la recarga pasando `force = true`.
   */
  const fetchCryptoData = async (force = false) => {
    if (!force && cryptos.value.length > 0) {
      console.log('📦 Solicitud interceptada: Empleando caché en memoria (cryptos)')
      return
    }

    loading.value = true
    error.value = null

    try {
      console.log('🌐 Fetching datos de criptomonedas de la API...')
      const res = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'
      )

      if (!res.ok) throw new Error('Network error')

      const newCryptos = await res.json()

      if (newCryptos && newCryptos.length > 0) {
        cryptos.value = newCryptos
        lastUpdated.value = new Date().getTime()

        // Persistencia local del payload para resiliencia offline/recargas rápidas
        localStore.setItem('crypto_data', {
          cryptos: cryptos.value,
          lastUpdated: lastUpdated.value,
        })
      } else {
        throw new Error('Sin datos recibidos')
      }
    } catch (err) {
      console.error('Error fetching crypto data:', err)
      error.value = 'No se pudo conectar con CoinGecko API. Intenta más tarde.'
    } finally {
      loading.value = false
    }
  }

  const togglePin = (id) => {
    const index = pinnedCryptos.value.indexOf(id)
    if (index >= 0) {
      pinnedCryptos.value.splice(index, 1)
    } else {
      if (pinnedCryptos.value.length >= 5) {
        return { success: false, message: 'Solo puedes destacar un máximo de 5 criptomonedas.' }
      }
      pinnedCryptos.value.push(id)
    }
    localStore.setItem('pinned_cryptos', pinnedCryptos.value)
    return { success: true }
  }

  const pinnedFirstCryptos = computed(() => {
    if (!cryptos.value) return []
    return [...cryptos.value].sort((a, b) => {
      const aPinned = pinnedCryptos.value.includes(a.id) ? 1 : 0
      const bPinned = pinnedCryptos.value.includes(b.id) ? 1 : 0
      if (aPinned !== bPinned) {
        return bPinned - aPinned // pinned items go first
      }
      return 0
    })
  })

  return {
    cryptos,
    pinnedCryptos,
    pinnedFirstCryptos,
    lastUpdated,
    loading,
    error,
    init,
    fetchCryptoData,
    togglePin,
  }
})
