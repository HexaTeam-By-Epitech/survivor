<script setup lang="ts">
import { ref } from 'vue';
import AppIcon from '@/components/atoms/AppIcon.vue';

interface Props {
  modelValue: string;
  placeholder?: string;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search...'
});

const emit = defineEmits<Emits>();

const inputRef = ref<HTMLInputElement>();

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const focusInput = () => {
  inputRef.value?.focus();
};
</script>

<template>
  <div class="search-input" @click="focusInput">
    <AppIcon 
      name="search" 
      :size="20" 
      class-name="search-input__icon"
    />
    <input
      ref="inputRef"
      :value="modelValue"
      @input="updateValue"
      :placeholder="props.placeholder"
      class="search-input__field"
      type="search"
      autocomplete="off"
    />
  </div>
</template>

<style scoped>
.search-input {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: border-color 0.15s ease;
  cursor: text;
}

.search-input:focus-within {
  border-color: var(--color-primary-500);
  box-shadow: var(--focus-ring);
}

.search-input__icon {
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.search-input__field {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--color-text-high);
  font-size: var(--fs-md);
  outline: none;
}

.search-input__field::placeholder {
  color: var(--color-text-muted);
}
</style>