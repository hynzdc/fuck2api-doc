<script setup lang="ts">
defineProps<{
  title?: string
  desc?: string
  items: Array<{ icon: string; title: string; desc: string }>
}>()
</script>

<template>
  <section class="f2-section">
    <h2 v-if="title" class="f2-section__title">{{ title }}</h2>
    <p v-if="desc" class="f2-section__desc">{{ desc }}</p>
    <div class="f2-grid">
      <article v-for="(item, i) in items" :key="i" class="f2-card">
        <div class="f2-card__icon">{{ item.icon }}</div>
        <h3 class="f2-card__title">{{ item.title }}</h3>
        <p class="f2-card__desc">{{ item.desc }}</p>
      </article>
    </div>
  </section>
</template>
