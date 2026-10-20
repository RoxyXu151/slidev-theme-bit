<script setup lang="ts">
import BitFrame from '../components/BitFrame.vue'
</script>
<template>
  <BitFrame kind="grid" title-style="plain">
    <div class="bit-layout-heading"><slot /></div>
    <div class="bit-grid-panels">
      <div><slot name="first" /></div><div><slot name="second" /></div>
      <div><slot name="third" /></div><div><slot name="fourth" /></div>
    </div>
    <div v-if="$slots.note" class="bit-layout-note"><slot name="note" /></div>
  </BitFrame>
</template>
