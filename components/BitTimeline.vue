<script setup lang="ts">
defineProps<{ items: { date: string; title: string; description?: string }[] }>()
</script>
<template>
  <ol class="bit-timeline">
    <li v-for="(item, index) in items" :key="index">
      <span class="bit-timeline-date">{{ item.date }}</span>
      <span class="bit-timeline-dot">{{ String(index + 1).padStart(2, '0') }}</span>
      <h3>{{ item.title }}</h3>
      <p v-if="item.description">{{ item.description }}</p>
    </li>
  </ol>
</template>
