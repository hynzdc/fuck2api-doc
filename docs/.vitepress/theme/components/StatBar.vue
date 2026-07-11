<script setup lang="ts">
defineProps<{
  stats: Array<{ value: string; label: string }>
}>()
</script>

<template>
  <div class="f2-stats" style="margin: 24px 0">
    <div v-for="(s, i) in stats" :key="i" class="f2-stat">
      <div class="f2-stat__value">{{ s.value }}</div>
      <div class="f2-stat__label">{{ s.label }}</div>
    </div>
  </div>
</template>
