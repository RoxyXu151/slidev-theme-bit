<script setup lang="ts">
import BitFrame from '../components/BitFrame.vue'
import { useBitTheme } from '../composables/useBitTheme'
import { resolveBitAsset } from '../composables/resolveBitAsset'
const { options } = useBitTheme()
</script>
<template>
  <BitFrame kind="image">
    <div class="bit-image-heading"><slot name="title" /></div>
    <div class="bit-image-columns bit-image-reversed">
      <figure><img v-if="options.image" :src="resolveBitAsset(options.image)" :alt="options.imageAlt || options.caption || ''" :style="{ objectFit: options.fit || 'contain' }" /><slot v-else name="image" /><figcaption v-if="options.caption">{{ options.caption }}</figcaption></figure>
      <div class="bit-image-copy"><slot /></div>
    </div>
  </BitFrame>
</template>
