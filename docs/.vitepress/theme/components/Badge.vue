<script setup lang="ts">
withDefaults(
  defineProps<{
    text: string
    tone?: 'violet' | 'cyan' | 'green' | 'amber' | 'pink'
  }>(),
  { tone: 'violet' },
)
</script>

<template>
  <span class="f2-inline-badge" :class="`f2-inline-badge--${tone}`">{{ text }}</span>
</template>
