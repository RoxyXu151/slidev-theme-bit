<script setup lang="ts">
import BitFrame from '../components/BitFrame.vue'
</script>
<template>
  <BitFrame kind="two-cols">
    <div class="bit-columns-heading"><slot /></div>
    <div class="bit-columns"><div><slot name="left" /></div><div><slot name="right" /></div></div>
  </BitFrame>
</template>
