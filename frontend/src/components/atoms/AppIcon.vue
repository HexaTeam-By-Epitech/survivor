<script setup lang="ts">
import { computed } from 'vue';
import { 
  Home, 
  Search, 
  Compass, 
  User, 
  Menu, 
  X, 
  ExternalLink,
  ArrowRight
} from 'lucide-vue-next';

interface Props {
  name: string;
  size?: number;
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  className: ''
});

const iconComponent = computed(() => {
  const icons: Record<string, any> = {
    home: Home,
    search: Search,
    discover: Compass,
    profile: User,
    menu: Menu,
    close: X,
    external: ExternalLink,
    arrow: ArrowRight
  };
  return icons[props.name] || Home;
});
</script>

<template>
  <component 
    :is="iconComponent" 
    :size="size" 
    :class="className"
    aria-hidden="true"
  />
</template>