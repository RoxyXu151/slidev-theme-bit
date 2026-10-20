<script setup lang="ts">
import BitFrame from '../components/BitFrame.vue'
import { useBitTheme } from '../composables/useBitTheme'
const { options } = useBitTheme()
</script>
<template>
  <BitFrame kind="sidebar" title-style="plain">
    <div class="bit-sidebar-panel">
      <span v-if="options.eyebrow" class="bit-eyebrow">{{ options.eyebrow }}</span>
      <slot /><div v-if="$slots.summary" class="bit-sidebar-summary"><slot name="summary" /></div>
    </div>
    <div class="bit-sidebar-body"><slot name="body" /></div>
  </BitFrame>
</template>
