<script setup lang="ts">
import darkLogo from '../assets/bit-logo.png'
import lightLogo from '../assets/bit-logo-white.png'
defineProps<{ light?: boolean }>()
</script>

<template>
  <img class="bit-logo" :src="light ? lightLogo : darkLogo" alt="北京理工大学 Beijing Institute of Technology" />
</template>
