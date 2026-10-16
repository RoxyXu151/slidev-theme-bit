<script setup lang="ts">
import BitFrame from '../components/BitFrame.vue'
import { useBitTheme } from '../composables/useBitTheme'
const { options } = useBitTheme()
</script>
<template>
  <BitFrame kind="quote"><div class="bit-quote-content"><span class="bit-quote-mark" aria-hidden="true">“</span><blockquote><slot /></blockquote><p v-if="options.author" class="bit-quote-author">{{ options.author }}</p></div></BitFrame>
</template>
