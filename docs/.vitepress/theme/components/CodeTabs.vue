<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  tabs: string[]
}>()

const active = ref(0)
</script>

<template>
  <div class="f2-code-tabs">
    <div class="f2-code-tabs__nav" role="tablist">
      <button
        v-for="(tab, i) in tabs"
        :key="tab"
        type="button"
        role="tab"
        class="f2-code-tabs__btn"
        :class="{ 'is-active': active === i }"
        :aria-selected="active === i"
        @click="active = i"
      >
        {{ tab }}
      </button>
    </div>
    <div class="f2-code-tabs__panels">
      <div
        v-for="(tab, i) in tabs"
        :key="tab + '-panel'"
        v-show="active === i"
        role="tabpanel"
        class="f2-code-tabs__panel"
      >
        <slot :name="`tab-${i}`" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.f2-code-tabs {
  margin: 16px 0 24px;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.f2-code-tabs__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
}

.f2-code-tabs__btn {
  appearance: none;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  font-weight: 600;
  font-size: 13px;
  padding: 7px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.f2-code-tabs__btn:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}

.f2-code-tabs__btn.is-active {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.f2-code-tabs__panel :deep(div[class*='language-']) {
  margin: 0 !important;
  border-radius: 0 !important;
  border: none !important;
  box-shadow: none !important;
}
</style>
