<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppIcon from '@/components/atoms/AppIcon.vue';

interface Props {
  name: string;
  path: string;
  icon: string;
  showLabel?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showLabel: true
});

const route = useRoute();
const isActive = computed(() => route.path === props.path);
</script>

<template>
  <RouterLink 
    :to="path"
    class="nav-item"
    :class="{ 'nav-item--active': isActive }"
    :aria-current="isActive ? 'page' : undefined"
  >
    <AppIcon 
      :name="icon" 
      :size="24"
      class-name="nav-item__icon"
    />
    <span 
      v-if="showLabel" 
      class="nav-item__label"
    >
      {{ name }}
    </span>
  </RouterLink>
</template>

<style scoped>
.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  color: var(--color-text-muted);
  text-decoration: none;
  border-radius: var(--radius-lg);
  transition: all 0.15s ease;
  position: relative;
}

.nav-item:hover {
  color: var(--color-primary-400);
  background: var(--color-surface-2);
}

.nav-item:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}

.nav-item--active {
  color: var(--color-primary-400);
  background: var(--color-surface-2);
}

.nav-item--active .nav-item__icon {
  color: var(--color-primary-500);
}

.nav-item__label {
  font-size: var(--fs-sm);
  font-weight: 500;
}

/* Bottom nav variant */
@media (max-width: 639px) {
  .nav-item {
    flex-direction: column;
    gap: var(--space-1);
    padding: var(--space-2);
    text-align: center;
    min-width: 60px;
  }
  
  .nav-item__label {
    font-size: var(--fs-xs);
  }
}
</style>