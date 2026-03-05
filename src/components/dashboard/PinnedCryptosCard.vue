<script setup>
import { computed } from 'vue'
import { useCryptoStore } from '@/stores/crypto'
import AppCard from '@/components/common/AppCard.vue'
import { IconActivity } from '@tabler/icons-vue'
import { formatCurrency } from '@/utils/formatters'

const cryptoStore = useCryptoStore()

const pinnedCoins = computed(() => {
  if (!cryptoStore.cryptos) return []
  return cryptoStore.cryptos.filter((c) => cryptoStore.pinnedCryptos.includes(c.id))
})
</script>

<template>
  <AppCard title="Criptomonedas Destacadas" bordered shadow="shadow-sm" class="flex flex-col h-full">
    <!-- Estado de Carga -->
    <div
      v-if="cryptoStore.loading && cryptoStore.cryptos.length === 0"
      class="flex-1 flex flex-col items-center justify-center align-center min-h-48 gap-3"
    >
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <p class="text-xs opacity-50 font-medium">Sincronizando con el mercado...</p>
    </div>

    <!-- Estado de Error -->
    <div
      v-else-if="cryptoStore.error && cryptoStore.cryptos.length === 0"
      class="flex-1 flex flex-col items-center justify-center min-h-48 text-center p-4"
    >
      <div class="bg-error/10 p-3 rounded-full mb-3 text-error">
        <IconActivity class="w-8 h-8" />
      </div>
      <p class="text-sm font-bold text-error">No se pudieron cargar los datos</p>
      <button
        class="btn btn-xs btn-outline btn-error mt-4"
        @click="cryptoStore.fetchCryptoData(true)"
      >
        Reintentar
      </button>
    </div>

    <!-- Lista de Criptos o Mensaje Vacío -->
    <div v-else class="flex-1 flex flex-col">
      <div
        v-if="pinnedCoins.length === 0"
        class="flex flex-col items-center justify-center flex-1 min-h-48 text-center"
      >
        <IconActivity class="w-12 h-12 text-base-content/20 mb-3" />
        <p class="text-base-content/60">Aún no has destacado criptomonedas.</p>
        <router-link :to="{ name: 'crypto' }" class="btn btn-sm btn-outline mt-4"
          >Explorar Criptos</router-link
        >
      </div>
      <div v-else class="flex flex-col gap-3 mt-4">
        <div
          v-for="coin in pinnedCoins"
          :key="coin.id"
          class="flex items-center justify-between p-3 bg-base-200/50 rounded-xl hover:bg-base-200 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="avatar">
              <div class="w-8 h-8 rounded-full bg-white p-0.5">
                <img :src="coin.image" :alt="coin.name" />
              </div>
            </div>
            <div>
              <p class="font-bold text-sm">{{ coin.name }}</p>
              <p class="text-xs opacity-50 uppercase">{{ coin.symbol }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-bold text-sm">{{ formatCurrency(coin.current_price) }}</p>
            <p
              :class="coin.price_change_percentage_24h >= 0 ? 'text-success' : 'text-error'"
              class="text-xs font-medium"
            >
              {{ coin.price_change_percentage_24h > 0 ? '+' : ''
              }}{{ coin.price_change_percentage_24h?.toFixed(2) }}%
            </p>
          </div>
        </div>
      </div>
    </div>
  </AppCard>
</template>
