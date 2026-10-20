<script setup lang="ts">
import BitFrame from '../components/BitFrame.vue'
</script>
<template>
  <BitFrame kind="steps" title-style="rail">
    <div class="bit-layout-heading"><slot /></div>
    <div class="bit-step-columns">
      <div><span class="bit-step-number" aria-hidden="true">01</span><slot name="first" /></div>
      <div><span class="bit-step-number" aria-hidden="true">02</span><slot name="second" /></div>
      <div><span class="bit-step-number" aria-hidden="true">03</span><slot name="third" /></div>
    </div>
    <div v-if="$slots.note" class="bit-layout-note"><slot name="note" /></div>
  </BitFrame>
</template>
