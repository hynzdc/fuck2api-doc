<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'tip' | 'info' | 'warning' | 'danger'
    title?: string
  }>(),
  { type: 'tip', title: '' },
)
</script>

<template>
  <div class="custom-block" :class="type" style="margin: 16px 0">
    <p v-if="title" class="custom-block-title">{{ title }}</p>
    <slot />
  </div>
</template>
