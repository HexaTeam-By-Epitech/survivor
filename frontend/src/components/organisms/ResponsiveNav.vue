<script setup lang="ts">
import { useMediaQuery } from '@/composables/useMediaQuery';
import AppNavbar from './AppNavbar.vue';
import AppSideNav from './AppSideNav.vue';
import AppBottomNav from './AppBottomNav.vue';

const isMobile = useMediaQuery('(max-width: 639px)');
const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
const isDesktop = useMediaQuery('(min-width: 1024px)');
</script>

<template>
  <AppBottomNav v-if="isMobile" />
  <AppSideNav v-else-if="isTablet" />
  <AppNavbar v-else-if="isDesktop" />
</template>