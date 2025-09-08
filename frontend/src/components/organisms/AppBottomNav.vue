<script setup lang="ts">
import NavItem from '@/components/molecules/NavItem.vue';

const navItems = [
  { name: 'Home', path: '/', icon: 'home' },
  { name: 'Search', path: '/search', icon: 'search' },
  { name: 'Discover', path: '/discover', icon: 'discover' },
  { name: 'Profile', path: '/profile', icon: 'profile' }
];
</script>

<template>
  <nav 
    class="bottomnav" 
    role="navigation" 
    aria-label="Main navigation"
  >
    <div class="bottomnav__nav">
      <NavItem 
        v-for="item in navItems"
        :key="item.path"
        :name="item.name"
        :path="item.path"
        :icon="item.icon"
      />
    </div>
  </nav>
</template>

<style scoped>
.bottomnav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-surface);
  backdrop-filter: blur(20px);
  border-top: 1px solid var(--color-border);
  padding: var(--space-2) var(--space-4);
  z-index: var(--z-nav);
}

.bottomnav__nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  max-width: 400px;
  margin: 0 auto;
}

@media (min-width: 640px) {
  .bottomnav {
    display: none;
  }
}
</style>