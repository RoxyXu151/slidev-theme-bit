<script setup lang="ts">
import { useBitTheme } from '../composables/useBitTheme'
import BitLogo from '../components/BitLogo.vue'
import seal from '../assets/seal-watermark.png'
const { options } = useBitTheme()
</script>
<template>
  <div class="slidev-layout bit-toc" :style="{ '--bit-green': options.primary || '#006c39', '--bit-accent': options.accent || '#a13f3d' }">
    <div class="bit-toc-side"><BitLogo light /><img :src="seal" class="bit-toc-watermark" alt="" /><h1>{{ options.heading || '目录' }}</h1><p>CONTENTS</p></div>
    <main class="bit-toc-main"><slot /></main>
  </div>
</template>
