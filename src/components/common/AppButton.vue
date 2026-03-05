<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) =>
      [
        'primary',
        'secondary',
        'accent',
        'ghost',
        'link',
        'info',
        'success',
        'warning',
        'error',
        'outline',
        'glass',
      ].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg'].includes(value),
  },
  block: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'button',
  },
})

const buttonClasses = computed(() => {
  return [
    'btn',
    `btn-${props.variant}`,
    `btn-${props.size}`,
    { 'btn-block': props.block },
    { 'btn-disabled': props.disabled || props.loading },
  ].filter(Boolean)
})
</script>

<template>
  <button :type="type" :class="buttonClasses" :disabled="disabled || loading" v-bind="$attrs">
    <span v-if="loading" class="loading loading-spinner"></span>
    <slot></slot>
  </button>
</template>
