<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'accent';
}

withDefaults(defineProps<Props>(), {
  variant: 'primary'
});
</script>

<template>
  <span 
    class="badge" 
    :class="`badge--${variant}`"
  >
    <slot />
  </span>
</template>

<style scoped>
.badge {
  display: inline-block;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-size: var(--fs-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge--primary {
  background: var(--color-surface-2);
  color: var(--color-text-medium);
}

.badge--secondary {
  background: var(--color-primary-700);
  color: var(--color-text-high);
}

.badge--accent {
  background: var(--color-accent-700);
  color: var(--color-text-high);
}
</style>