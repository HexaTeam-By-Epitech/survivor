<script setup lang="ts">
import { useMediaQuery } from '@/composables/useMediaQuery';
import ResponsiveNav from '@/components/organisms/ResponsiveNav.vue';
import SkipLink from '@/components/atoms/SkipLink.vue';

const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
const isMobile = useMediaQuery('(max-width: 639px)');
</script>

<template>
  <div class="layout">
    <SkipLink />
    <ResponsiveNav />
    
    <main 
      id="main-content"
      class="layout__main"
      :class="{
        'layout__main--tablet': isTablet,
        'layout__main--mobile': isMobile
      }"
    >
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  background: var(--gradient-custom);
}

.layout__main {
  padding: var(--space-4);
}

.layout__main--mobile {
  padding-bottom: 100px; /* Account for bottom nav */
}

.layout__main--tablet {
  margin-left: 80px; /* Account for side nav */
  padding: var(--space-6);
}

@media (min-width: 1024px) {
  .layout__main {
    padding: var(--space-8);
    padding-top: 80px; /* Account for top nav */
  }
}
</style>