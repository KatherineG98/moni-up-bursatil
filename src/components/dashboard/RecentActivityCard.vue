<script setup>
import { usePortfolioStore } from '@/stores/portfolio'
import AppCard from '@/components/common/AppCard.vue'
import { IconWallet, IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-vue'
import { formatCurrency, formatDate } from '@/utils/formatters'

const portfolioStore = usePortfolioStore()
</script>

<template>
  <AppCard title="Actividad Reciente" bordered shadow="shadow-sm" class="flex flex-col h-full">
    <div
      v-if="portfolioStore.history.length === 0"
      class="flex flex-col items-center justify-center flex-1 min-h-48 text-center"
    >
      <IconWallet class="w-12 h-12 text-base-content/20 mb-3" />
      <p class="text-base-content/60">Aún no has realizado transacciones.</p>
      <router-link :to="{ name: 'portfolio' }" class="btn btn-sm btn-outline mt-4"
        >Invertir Ahora</router-link
      >
    </div>
    <div v-else class="flex flex-col gap-3 mt-4">
      <div
        v-for="tx in portfolioStore.history.slice(0, 5)"
        :key="tx.id"
        class="flex items-center justify-between p-3 bg-base-200/50 rounded-xl border border-transparent hover:border-base-300 transition-colors"
      >
        <div class="flex items-center gap-3">
          <div
            class="p-2 rounded-lg"
            :class="tx.type === 'BUY' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'"
          >
            <IconArrowUpRight v-if="tx.type === 'BUY'" class="w-5 h-5" />
            <IconArrowDownRight v-else class="w-5 h-5" />
          </div>
          <div>
            <p class="font-bold text-sm">
              {{ tx.type === 'BUY' ? 'Compra' : 'Venta' }} {{ tx.symbol }}
            </p>
            <p class="text-xs opacity-50">{{ formatDate(tx.date) }}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="font-bold text-sm" :class="tx.type === 'BUY' ? 'text-success' : 'text-error'">
            {{ tx.type === 'BUY' ? '-' : '+' }}{{ formatCurrency(tx.total) }}
          </p>
          <p class="text-xs opacity-50 font-medium">
            {{ tx.quantity }} acc @ {{ formatCurrency(tx.price) }}
          </p>
        </div>
      </div>
    </div>
  </AppCard>
</template>
