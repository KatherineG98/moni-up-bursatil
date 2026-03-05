<script setup>
import { computed } from 'vue'
import { IconClock } from '@tabler/icons-vue'

const props = defineProps({
  news: {
    type: Object,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
})

// Conversión de Unix timestamp proveniente de Finnhub a cadena formateada
const formattedDate = computed(() => {
  if (!props.news.datetime) return ''
  const date = new Date(props.news.datetime * 1000)
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
})

const defaultImage = 'https://placehold.co/600x400/1d232a/a6adbb?text=Finanzas'
const imageUrl = computed(() => props.news.image || defaultImage)
const badgeText = computed(() => props.isRead ? 'Leída' : 'Nueva')
const badgeClass = computed(() => props.isRead ? 'badge-neutral' : 'badge-primary')
</script>

<template>
  <div class="card bg-base-100 shadow-sm hover:shadow-md transition-shadow h-full border border-base-300 overflow-hidden cursor-pointer">
    <figure class="h-48 relative overflow-hidden">
      <img :src="imageUrl" :alt="news.headline" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
      <div class="absolute top-2 right-2 flex gap-2">
        <span class="badge badge-sm" :class="badgeClass">{{ badgeText }}</span>
        <span v-if="news.customType === 'company'" class="badge badge-sm badge-info">Empresa</span>
        <span v-else class="badge badge-sm badge-secondary">Mercado</span>
      </div>
    </figure>
    <div class="card-body p-4 gap-2 flex flex-col justify-between">
      <div>
        <p class="text-xs text-base-content/60 font-semibold mb-1 uppercase tracking-wider">{{ news.source }}</p>
        <h3 class="card-title text-base leading-tight line-clamp-3 mb-2" :title="news.headline">
          {{ news.headline }}
        </h3>
        <p v-if="news.summary" class="text-sm text-base-content/70 line-clamp-2 mt-2 leading-snug">
          {{ news.summary }}
        </p>
      </div>
      <div class="flex items-center gap-1 mt-auto text-xs text-base-content/50">
        <IconClock class="w-3 h-3" />
        <span>{{ formattedDate }}</span>
      </div>
    </div>
  </div>
</template>
