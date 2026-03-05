<script setup>
import { computed } from 'vue'
import { IconRefresh } from '@tabler/icons-vue'

const props = defineProps({
  lastUpdated: {
    type: [Number, String, Date],
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['refresh'])

const formattedTime = computed(() => {
  if (!props.lastUpdated) return '--:--'
  const date = new Date(props.lastUpdated)
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
})
</script>

<template>
  <div
    class="badge badge-neutral shadow-sm p-4 gap-3 bg-base-100 border border-base-200 text-base-content inline-flex items-center"
  >
    <div class="flex items-center gap-2">
      <span class="text-xs font-medium opacity-80">
        Última actualización: <strong>{{ formattedTime }}</strong>
      </span>
      <div class="divider divider-horizontal mx-0 w-1"></div>
      <button
        class="btn btn-ghost btn-xs text-primary gap-1"
        :class="{ 'opacity-50 pointer-events-none': loading }"
        aria-label="Refrescar datos"
        @click="emit('refresh')"
      >
        <IconRefresh class="w-4 h-4" :class="{ 'animate-spin': loading }" />
        Refrescar
      </button>
    </div>
  </div>
</template>
