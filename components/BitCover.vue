<script setup lang="ts">
import { computed } from 'vue'
import { useBitTheme } from '../composables/useBitTheme'
import { resolveBitAsset } from '../composables/resolveBitAsset'
import BitLogo from './BitLogo.vue'
import tower from '../assets/tower-watermark.png'
import seal from '../assets/seal-watermark.png'
import campus from '../assets/campus.webp'
const props = defineProps<{ ending?: boolean }>()
const { options } = useBitTheme()
const variant = computed(() => options.value.variant || 'classic')
const style = computed(() => ({
  '--bit-green': options.value.primary || '#006c39',
  '--bit-accent': options.value.accent || '#a13f3d',
}))
</script>

<template>
  <div class="slidev-layout bit-cover" :class="[`bit-cover-${variant}`, { 'bit-ending': props.ending }]" :style="style">
    <img v-if="variant === 'classic'" class="bit-cover-tower" :src="tower" alt="" />
    <img v-if="variant === 'green' || variant === 'classic'" class="bit-cover-seal" :src="seal" alt="" />
    <img v-if="variant === 'photo' || variant === 'panorama'" class="bit-cover-photo" :src="options.image ? resolveBitAsset(options.image) : campus" :alt="options.imageAlt || '原模板中的校园景观'" />
    <div class="bit-cover-wash" aria-hidden="true" />
    <div class="bit-cover-panel" aria-hidden="true" />
    <BitLogo :light="variant === 'green' || variant === 'photo' || variant === 'panorama'" />
    <div class="bit-cover-content">
      <div v-if="options.school || options.reportType" class="bit-cover-kicker">{{ options.school || options.reportType }}</div>
      <div class="bit-cover-copy"><slot /></div>
      <div v-if="options.subtitle" class="bit-cover-subtitle">{{ options.subtitle }}</div>
      <dl v-if="options.presenter || options.advisor || options.date" class="bit-cover-meta">
        <div v-if="options.presenter"><dt>汇报人</dt><dd>{{ options.presenter }}</dd></div>
        <div v-if="options.advisor"><dt>指导教师</dt><dd>{{ options.advisor }}</dd></div>
        <div v-if="options.date"><dt>时间</dt><dd>{{ options.date }}</dd></div>
      </dl>
    </div>
    <div class="bit-cover-motto">{{ options.motto }}</div>
  </div>
</template>
