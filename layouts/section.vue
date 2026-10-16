<script setup lang="ts">
import { useBitTheme } from '../composables/useBitTheme'
import BitLogo from '../components/BitLogo.vue'
import seal from '../assets/seal-watermark.png'
const { options } = useBitTheme()
</script>
<template>
  <div class="slidev-layout bit-section" :class="{ 'bit-section-light': options.variant === 'light' }" :style="{ '--bit-green': options.primary || '#006c39', '--bit-accent': options.accent || '#a13f3d' }">
    <img class="bit-section-watermark" :src="seal" alt="" />
    <BitLogo :light="options.variant !== 'light'" />
    <div class="bit-section-body">
      <div v-if="options.number" class="bit-section-number">{{ options.number }}</div>
      <div><slot /><p v-if="options.subtitle" class="bit-section-subtitle">{{ options.subtitle }}</p></div>
    </div>
    <div class="bit-section-motto">{{ options.motto }}</div>
  </div>
</template>
