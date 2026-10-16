<script setup lang="ts">
withDefaults(defineProps<{ title?: string; tone?: 'green' | 'accent' }>(), { tone: 'green' })
</script>
<template>
  <aside class="bit-callout" :class="{ 'bit-callout-accent': tone === 'accent' }">
    <strong v-if="title" class="bit-callout-title">{{ title }}</strong>
    <slot />
  </aside>
</template>
