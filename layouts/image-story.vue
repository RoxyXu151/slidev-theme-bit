<script setup lang="ts">
import BitFrame from '../components/BitFrame.vue'
import { useBitTheme } from '../composables/useBitTheme'
import { resolveBitAsset } from '../composables/resolveBitAsset'
const { options } = useBitTheme()
</script>
<template>
  <BitFrame kind="image-story" title-style="plain">
    <figure class="bit-story-image">
      <img v-if="options.image" :src="resolveBitAsset(options.image)" :alt="options.imageAlt || options.caption || ''" :style="{ objectFit: options.fit || 'contain' }" />
      <slot v-else name="image" />
      <figcaption v-if="options.caption">{{ options.caption }}</figcaption>
    </figure>
    <div class="bit-story-copy"><div class="bit-layout-heading"><slot name="title" /></div><slot /></div>
  </BitFrame>
</template>
