<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(defineProps<{
  items: { label: string; value: number; accent?: boolean }[]
  max?: number
  unit?: string
  label?: string
}>(), { unit: '', label: '数据对比' })
const scale = computed(() => Math.max(1, props.max ?? Math.max(0, ...props.items.map(item => item.value))))
</script>
<template>
  <figure class="bit-bar-chart" :aria-label="label">
    <div v-for="(item, index) in items" :key="index" class="bit-bar-row">
      <span class="bit-bar-label">{{ item.label }}</span>
      <div class="bit-bar-track"><span class="bit-bar" :class="{ 'bit-bar-accent': item.accent }" :style="{ width: `${Math.max(0, Math.min(100, item.value / scale * 100))}%` }" /></div>
      <span class="bit-bar-value">{{ item.value }}{{ unit }}</span>
    </div>
    <figcaption><slot /></figcaption>
  </figure>
</template>
