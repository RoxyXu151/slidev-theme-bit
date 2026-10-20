<script setup lang="ts">
import { computed } from 'vue'
import { useBitTheme } from '../composables/useBitTheme'
import BitLogo from './BitLogo.vue'
import building from '../assets/building.png'
const props = defineProps<{ kind?: string; titleStyle?: string }>()
const { options, context } = useBitTheme()
const frameStyle = computed(() => ({
  '--bit-green': options.value.primary || '#006c39',
  '--bit-accent': options.value.accent || '#a13f3d',
}))
</script>

<template>
  <div class="slidev-layout bit-frame" :class="[`bit-${props.kind || 'default'}`, `bit-header-${options.headerStyle}`, `bit-title-${options.titleStyle || props.titleStyle || 'classic'}`]" :style="frameStyle">
    <header class="bit-header" aria-hidden="true">
      <span class="bit-section-marker">{{ options.sectionNumber || '' }}</span>
      <span class="bit-section-label">{{ options.section || '' }}</span>
      <img v-if="options.headerStyle === 'building'" class="bit-header-building" :src="building" alt="" />
      <BitLogo v-else />
    </header>
    <main class="bit-main"><slot /></main>
    <footer v-if="options.footer !== false" class="bit-footer">
      <span>{{ options.footer }}</span>
      <span class="bit-motto">{{ options.motto }}</span>
      <span v-if="options.showPageNumber" class="bit-page">{{ context.$page }}<span class="bit-page-total"> / {{ context.$nav.total }}</span></span>
    </footer>
  </div>
</template>
