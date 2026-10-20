<script setup lang="ts">
import BitFrame from '../components/BitFrame.vue'
</script>
<template>
  <BitFrame kind="focus" title-style="plain">
    <div class="bit-layout-heading"><slot /></div>
    <div class="bit-focus-stage"><slot name="focus" /></div>
    <div class="bit-focus-explanation"><slot name="explanation" /></div>
    <div v-if="$slots.note" class="bit-layout-note"><slot name="note" /></div>
  </BitFrame>
</template>
