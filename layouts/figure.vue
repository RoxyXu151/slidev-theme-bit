<script setup lang="ts">
import BitFrame from '../components/BitFrame.vue'
import { useBitTheme } from '../composables/useBitTheme'
import { resolveBitAsset } from '../composables/resolveBitAsset'
const { options } = useBitTheme()
</script>
<template>
  <BitFrame kind="figure">
    <slot />
    <figure class="bit-full-figure"><img v-if="options.image" :src="resolveBitAsset(options.image)" :alt="options.imageAlt || options.caption || ''" :style="{ objectFit: options.fit || 'contain' }" /><slot name="figure" /><figcaption v-if="options.caption">{{ options.caption }}</figcaption></figure>
  </BitFrame>
</template>
