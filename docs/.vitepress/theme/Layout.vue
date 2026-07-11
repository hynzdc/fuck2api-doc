<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import { provide } from 'vue'
import NavBrandTitle from './components/NavBrandTitle.vue'
import DocMeta from './components/DocMeta.vue'
import { createThemeToggle } from './themeTransition'

const { isDark } = useData()

// Circular reveal from the switch / click point
provide('toggle-appearance', createThemeToggle(isDark))
</script>

<template>
  <DefaultTheme.Layout>
    <template #nav-bar-title-text>
      <NavBrandTitle />
    </template>
    <template #doc-before>
      <DocMeta />
    </template>
  </DefaultTheme.Layout>
</template>
