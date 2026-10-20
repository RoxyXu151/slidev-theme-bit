<script setup lang="ts">
import BitFrame from '../components/BitFrame.vue'
</script>
<template>
  <BitFrame kind="compare" title-style="plain">
    <div class="bit-layout-heading"><slot /></div>
    <div class="bit-compare-panels">
      <div class="bit-compare-primary"><slot name="left" /></div>
      <div class="bit-compare-secondary"><slot name="right" /></div>
    </div>
    <div v-if="$slots.note" class="bit-layout-note"><slot name="note" /></div>
  </BitFrame>
</template>
