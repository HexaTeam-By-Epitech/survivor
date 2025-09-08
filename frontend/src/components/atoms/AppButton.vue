<script setup lang="ts">
interface Props {
  as?: 'button' | 'a';
  variant?: 'primary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  variant: 'primary',
  size: 'md',
  type: 'button'
});
</script>

<template>
  <component
    :is="props.as"
    class="btn"
    :class="[`btn--${props.variant}`, `btn--${props.size}`]"
    :href="props.href"
    :type="props.as === 'button' ? props.type : undefined"
    :aria-disabled="props.disabled || undefined"
    :disabled="props.as === 'button' ? props.disabled : undefined"
  >
    <slot />
  </component>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border: none;
  border-radius: var(--radius-lg);
  font-family: var(--font-sans);
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.18s ease;
  position: relative;
  overflow: hidden;
}

.btn:focus-visible {
  box-shadow: var(--focus-ring);
  outline: none;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Variants */
.btn--primary {
  background: var(--gradient-hero);
  color: var(--color-text-high);
  box-shadow: var(--shadow-1);
}

.btn--primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-2);
}

.btn--ghost {
  background: transparent;
  color: var(--color-text-medium);
}

.btn--ghost:hover:not(:disabled) {
  color: var(--color-text-high);
  background: var(--color-surface-2);
}

.btn--outline {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-medium);
}

.btn--outline:hover:not(:disabled) {
  border-color: var(--color-primary-500);
  color: var(--color-primary-400);
}

/* Sizes */
.btn--sm {
  padding: var(--space-2) var(--space-3);
  font-size: var(--fs-sm);
}

.btn--md {
  padding: var(--space-3) var(--space-4);
  font-size: var(--fs-md);
}

.btn--lg {
  padding: var(--space-4) var(--space-6);
  font-size: var(--fs-lg);
}
</style>