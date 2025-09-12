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
  ArrowRight,
  Calendar,
  List,
  Plus,
  MapPin,
  Users,
  Clock,
  CalendarX,
  Trash2
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
    calendar: Calendar,
    'calendar-x': CalendarX,
    profile: User,
    menu: Menu,
    close: X,
    x: X,
    external: ExternalLink,
    arrow: ArrowRight,
    list: List,
    plus: Plus,
    'map-pin': MapPin,
    users: Users,
    clock: Clock,
    'trash-2': Trash2
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