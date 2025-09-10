import { ref, computed } from 'vue';

const isDark = ref(true); // JEB Incubator uses dark theme by default

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };

  const theme = computed(() => isDark.value ? 'dark' : 'light');

  return {
    isDark,
    theme,
    toggleTheme
  };
}