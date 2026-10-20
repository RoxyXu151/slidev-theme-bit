<script setup lang="ts">
defineProps<{ items: { value: string | number; label: string; detail?: string; accent?: boolean }[] }>()
</script>
<template>
  <dl class="bit-metrics" :style="{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }">
    <div v-for="(item, index) in items" :key="index" :class="{ 'bit-metric-accent': item.accent }">
      <dt>{{ item.label }}</dt><dd>{{ item.value }}</dd><dd v-if="item.detail" class="bit-metric-detail">{{ item.detail }}</dd>
    </div>
  </dl>
</template>
