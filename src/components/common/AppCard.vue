<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  bodyClass: {
    type: String,
    default: '',
  },
  bordered: {
    type: Boolean,
    default: true,
  },
  shadow: {
    type: String,
    default: 'shadow-xl',
  },
})

const cardClasses = computed(() => [
  'card',
  'bg-base-100',
  props.shadow,
  { 'border border-base-200': props.bordered },
])
</script>

<template>
  <div :class="cardClasses">
    <div class="card-body" :class="bodyClass">
      <h2 v-if="title || $slots.title" class="card-title font-bold tracking-tight">
        <slot name="title">{{ title }}</slot>
      </h2>

      <slot></slot>

      <div v-if="$slots.actions" class="card-actions justify-end mt-4">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>
