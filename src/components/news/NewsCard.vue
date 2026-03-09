<script setup>
import { computed } from 'vue'
import { IconClock, IconNews } from '@tabler/icons-vue'

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

const hasImage = computed(() => !!props.news.image)
const badgeText = computed(() => props.isRead ? 'Leída' : 'Nueva')
const badgeClass = computed(() => props.isRead ? 'badge-neutral' : 'badge-primary')

// Gradiente personalizado por fuente para placeholders sin imagen
const placeholderGradient = computed(() => {
  const source = (props.news.source || '').toLowerCase()
  const gradients = {
    reuters: 'from-orange-600 to-orange-900',
    yahoo: 'from-purple-600 to-indigo-900',
    cnbc: 'from-blue-600 to-blue-900',
    bloomberg: 'from-slate-700 to-slate-900',
    default: 'from-primary/80 to-base-content/60',
  }
  return gradients[source] || gradients.default
})
</script>

<template>
  <div class="card bg-base-100 shadow-sm hover:shadow-md transition-shadow h-full border border-base-300 overflow-hidden cursor-pointer">
    <figure class="h-48 relative overflow-hidden">
      <!-- Imagen real del artículo -->
      <img v-if="hasImage" :src="news.image" :alt="news.headline" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />

      <!-- Placeholder estilizado cuando no hay imagen -->
      <div v-else :class="['w-full h-full flex flex-col items-center justify-center bg-linear-to-br text-white/90', placeholderGradient]">
        <IconNews class="w-10 h-10 mb-2 opacity-60" />
        <span class="text-xs font-bold uppercase tracking-widest opacity-80">{{ news.source }}</span>
      </div>

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
