<script setup>
import { onMounted } from 'vue'
import MarketSyncBadge from '@/components/common/MarketSyncBadge.vue'
import { useCryptoStore } from '@/stores/crypto'
import { IconPin, IconPinFilled } from '@tabler/icons-vue'
import { formatCurrency, formatCompact } from '@/utils/formatters'
import { showAlert } from '@/utils/sweetalert'

const cryptoStore = useCryptoStore()

const handlePin = (id) => {
  const res = cryptoStore.togglePin(id)
  if (!res.success) {
    showAlert({
      icon: 'warning',
      title: 'Límite alcanzado',
      text: res.message,
    })
  }
}

onMounted(() => {
  cryptoStore.fetchCryptoData(false)
})
</script>

<template>
  <div class="space-y-6">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200"
    >
      <div>
        <h2 class="text-3xl font-black tracking-tight">Mercado Cripto</h2>
        <p class="text-base-content/60">Monitoreo en tiempo real del Top 10 de Criptomonedas</p>
      </div>
      <MarketSyncBadge
        :last-updated="cryptoStore.lastUpdated"
        :loading="cryptoStore.loading"
        @refresh="cryptoStore.fetchCryptoData(true)"
      />
    </div>

    <div v-if="cryptoStore.error" class="alert alert-error shadow-lg">
      <span>{{ cryptoStore.error }}</span>
    </div>

    <div class="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="table table-zebra w-full">
          <!-- head -->
          <thead class="bg-base-200 text-base-content/70 uppercase text-xs tracking-wider">
            <tr>
              <th class="w-12 px-2"></th>
              <th class="py-4">Activo</th>
              <th class="py-4 text-right">Precio Actual</th>
              <th class="py-4 text-right">Mkt Cap</th>
              <th class="py-4 text-right">Cambio 24h</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="cryptoStore.loading && cryptoStore.cryptos.length === 0">
              <td colspan="5" class="text-center py-12">
                <span class="loading loading-spinner loading-lg text-primary"></span>
              </td>
            </tr>
            <tr
              v-for="coin in cryptoStore.pinnedFirstCryptos"
              v-else
              :key="coin.id"
              class="hover group"
            >
              <td class="w-12 px-2 text-center align-middle">
                <button
                  class="btn btn-ghost btn-xs btn-circle text-base-content/30 group-hover:text-base-content/70 transition-colors"
                  :class="{
                    'text-primary opacity-100 group-hover:text-primary':
                      cryptoStore.pinnedCryptos.includes(coin.id),
                  }"
                  :title="
                    cryptoStore.pinnedCryptos.includes(coin.id) ? 'Quitar destacado' : 'Destacar'
                  "
                  @click="handlePin(coin.id)"
                >
                  <IconPinFilled
                    v-if="cryptoStore.pinnedCryptos.includes(coin.id)"
                    class="w-4 h-4"
                  />
                  <IconPin v-else class="w-4 h-4" />
                </button>
              </td>
              <td>
                <div class="flex items-center gap-3">
                  <div class="avatar">
                    <div class="mask mask-squircle w-10 h-10 bg-white p-1">
                      <img :src="coin.image" :alt="coin.name" />
                    </div>
                  </div>
                  <div>
                    <div class="font-bold">{{ coin.name }}</div>
                    <div class="text-xs opacity-50 uppercase font-semibold tracking-wider">
                      {{ coin.symbol }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="text-right font-medium">
                {{ formatCurrency(coin.current_price) }}
              </td>
              <td class="text-right text-base-content/70">${{ formatCompact(coin.market_cap) }}</td>
              <td class="text-right">
                <div
                  class="badge badge-sm"
                  :class="
                    coin.price_change_percentage_24h >= 0
                      ? 'badge-success badge-outline'
                      : 'badge-error badge-outline'
                  "
                >
                  {{ coin.price_change_percentage_24h > 0 ? '+' : ''
                  }}{{ coin.price_change_percentage_24h?.toFixed(2) }}%
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
