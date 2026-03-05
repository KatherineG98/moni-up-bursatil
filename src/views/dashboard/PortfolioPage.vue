<script setup>
import { onMounted, computed } from 'vue'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'
import MarketSyncBadge from '@/components/common/MarketSyncBadge.vue'
import { useMarketStore } from '@/stores/market'
import { usePortfolioStore } from '@/stores/portfolio'
import { formatCurrency } from '@/utils/formatters'
import { showToast } from '@/utils/sweetalert'

const marketStore = useMarketStore()
const portfolioStore = usePortfolioStore()

const portfolioValue = computed(() => {
  return Object.entries(portfolioStore.portfolio).reduce((total, [sym, qty]) => {
    const stock = marketStore.stocks.find((s) => s.simbolo === sym)
    return total + (stock ? stock.precio * qty : 0)
  }, 0)
})

onMounted(() => {
  marketStore.fetchMarketData(false)
})

const handleBuy = (stock) => {
  const success = portfolioStore.buyShare(stock.simbolo, stock.precio)
  if (success) {
    showToast('success', `Has comprado 1 acción de ${stock.simbolo}`)
  } else {
    showToast('error', 'Saldo insuficiente para comprar')
  }
}

const handleSell = (stock) => {
  const success = portfolioStore.sellShare(stock.simbolo, stock.precio)
  if (success) {
    showToast('success', `Has vendido 1 acción de ${stock.simbolo}`)
  }
}
</script>

<template>
  <div class="space-y-6">
    <div
      class="flex justify-between items-center bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200"
    >
      <div>
        <h2 class="text-3xl font-black tracking-tight">Resumen de Portafolio</h2>
        <p class="text-base-content/60">Equilibrio entre liquidez y activos de renta variable</p>
      </div>
      <div class="text-right">
        <p class="text-sm font-semibold text-base-content/60 uppercase tracking-widest">
          Poder de Compra Virtual
        </p>
        <p class="text-4xl font-black text-primary">{{ formatCurrency(portfolioStore.balance) }}</p>
      </div>
    </div>

    <div
      v-if="Object.keys(portfolioStore.portfolio).length > 0"
      class="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-200"
    >
      <h3 class="text-xl font-bold mb-4">
        Mis Acciones Valorizadas:
        <span
          class="bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary font-black"
          >{{ formatCurrency(portfolioValue) }}</span
        >
      </h3>
      <div class="flex flex-wrap gap-4">
        <div
          v-for="(qty, sym) in portfolioStore.portfolio"
          :key="sym"
          class="badge badge-lg badge-outline gap-2 p-4"
        >
          <span class="font-bold">{{ sym }}</span>
          <span class="opacity-70">{{ qty }} acc</span>
        </div>
      </div>
    </div>

    <!-- Mercado Real -->
    <div>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h3 class="text-xl font-bold">Mercado en Tiempo Real</h3>
        <MarketSyncBadge
          :last-updated="marketStore.lastUpdated"
          :loading="marketStore.loading"
          @refresh="marketStore.fetchMarketData(true)"
        />
      </div>

      <div v-if="marketStore.error" class="alert alert-warning shadow-lg mb-6">
        <span>{{ marketStore.error }}</span>
      </div>

      <div
        v-if="marketStore.loading && marketStore.stocks.length === 0"
        class="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div v-for="i in 6" :key="i" class="skeleton h-48 w-full rounded-2xl"></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AppCard
          v-for="stock in marketStore.stocks"
          :key="stock.simbolo"
          class="hover:border-primary transition-colors"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <h4 class="text-2xl font-black">{{ stock.simbolo }}</h4>
              <p class="text-xs text-base-content/50 uppercase tracking-wider font-semibold">
                {{ stock.sector }}
              </p>
            </div>
            <div
              class="badge badge-sm uppercase font-bold"
              :class="
                stock.variacion >= 0 ? 'badge-success badge-outline' : 'badge-error badge-outline'
              "
            >
              {{ stock.variacion > 0 ? '+' : '' }}{{ stock.variacion }}%
            </div>
          </div>

          <div class="mb-6">
            <p class="text-3xl font-bold">{{ formatCurrency(stock.precio) }}</p>
          </div>

          <template #actions>
            <div class="flex gap-2 w-full">
              <AppButton
                variant="primary"
                size="sm"
                block
                class="flex-1"
                :disabled="portfolioStore.balance < stock.precio"
                @click="handleBuy(stock)"
              >
                Comprar
              </AppButton>
              <AppButton
                variant="outline"
                size="sm"
                block
                class="flex-1"
                :disabled="!portfolioStore.portfolio[stock.simbolo]"
                @click="handleSell(stock)"
              >
                Vender
              </AppButton>
            </div>
          </template>
        </AppCard>
      </div>
    </div>
  </div>
</template>
