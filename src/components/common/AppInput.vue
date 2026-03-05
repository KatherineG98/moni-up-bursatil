<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  bordered: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const inputClasses = computed(() => [
  'input',
  'w-full',
  { 'input-bordered': props.bordered },
  { 'input-error': !!props.error },
  { 'bg-base-200 text-base-content/50': props.disabled },
])
</script>

<template>
  <div class="form-control w-full">
    <label v-if="label" class="label">
      <span class="label-text font-medium">{{ label }}</span>
    </label>

    <input
      :type="type"
      :placeholder="placeholder"
      :class="inputClasses"
      :value="modelValue"
      :disabled="disabled"
      v-bind="$attrs"
      @input="emit('update:modelValue', $event.target.value)"
    />

    <label v-if="error" class="label pt-1 pb-0">
      <span class="label-text-alt text-error font-medium">{{ error }}</span>
    </label>
  </div>
</template>
