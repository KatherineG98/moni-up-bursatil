<script setup>
import { useAuthStore } from '@/stores/auth'
import { useMarketStore } from '@/stores/market'
import { useCryptoStore } from '@/stores/crypto'
import { usePortfolioStore } from '@/stores/portfolio'
import { onMounted, computed } from 'vue'
import AppCard from '@/components/common/AppCard.vue'
import { IconWallet, IconTrendingUp, IconActivity } from '@tabler/icons-vue'
import { formatCurrency } from '@/utils/formatters'
import PinnedCryptosCard from '@/components/dashboard/PinnedCryptosCard.vue'
import RecentActivityCard from '@/components/dashboard/RecentActivityCard.vue'

const authStore = useAuthStore()
const cryptoStore = useCryptoStore()
const marketStore = useMarketStore()
const portfolioStore = usePortfolioStore()

onMounted(() => {
  cryptoStore.fetchCryptoData(false)
  marketStore.fetchMarketData(false)
})

const portfolioValue = computed(() => {
  return Object.entries(portfolioStore.portfolio).reduce((total, [sym, qty]) => {
    const stock = marketStore.stocks.find((s) => s.simbolo === sym)
    return total + (stock ? stock.precio * qty : 0)
  }, 0)
})

const totalPerformance = computed(() => {
  const initialCapital = 10000
  const currentTotal = portfolioStore.balance + portfolioValue.value
  return ((currentTotal - initialCapital) / initialCapital) * 100
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-black tracking-tight mb-2">¡Hola, {{ authStore.userName }}!</h2>
        <p class="text-base-content/70">Aquí tienes un resumen de tu actividad financiera.</p>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <AppCard class="bg-primary text-primary-content shadow-primary/30">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-white/20 rounded-xl">
            <IconWallet class="w-8 h-8" />
          </div>
          <div>
            <p class="text-primary-content/80 font-medium">Balance Disponible</p>
            <h3 class="text-3xl font-bold">{{ formatCurrency(portfolioStore.balance) }}</h3>
          </div>
        </div>
      </AppCard>

      <AppCard>
        <div class="flex items-center gap-4">
          <div class="p-3 bg-secondary/10 text-secondary rounded-xl">
            <IconTrendingUp class="w-8 h-8" />
          </div>
          <div>
            <p class="text-base-content/60 font-medium">Valor del Portafolio</p>
            <h3 class="text-3xl font-bold">{{ formatCurrency(portfolioValue) }}</h3>
          </div>
        </div>
      </AppCard>

      <AppCard>
        <div class="flex items-center gap-4">
          <div class="p-3 bg-accent/10 text-accent rounded-xl">
            <IconActivity class="w-8 h-8" />
          </div>
          <div>
            <p class="text-base-content/60 font-medium">Rendimiento</p>
            <h3
              class="text-3xl font-bold"
              :class="totalPerformance >= 0 ? 'text-success' : 'text-error'"
            >
              {{ totalPerformance > 0 ? '+' : '' }}{{ totalPerformance.toFixed(2) }}%
            </h3>
          </div>
        </div>
      </AppCard>
    </div>

    <!-- Content Sections -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Criptomonedas Destacadas -->
      <PinnedCryptosCard />

      <!-- Actividad Reciente -->
      <RecentActivityCard />
    </div>
  </div>
</template>
