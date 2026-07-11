<script setup lang="ts">
withDefaults(
  defineProps<{
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    path: string
  }>(),
  { method: 'POST' },
)
</script>

<template>
  <div class="f2-endpoint">
    <span class="f2-method" :class="`f2-method--${method.toLowerCase()}`">{{ method }}</span>
    <code class="f2-endpoint__path">{{ path }}</code>
  </div>
</template>
