<script setup lang="ts">
defineProps<{
  href: string
  title: string
  desc: string
  icon?: string
}>()
</script>

<template>
  <a class="f2-card-link" :href="href">
    <div class="f2-card-link__title">
      <span v-if="icon">{{ icon }}</span>
      <span>{{ title }}</span>
    </div>
    <p class="f2-card-link__desc">{{ desc }}</p>
  </a>
</template>
