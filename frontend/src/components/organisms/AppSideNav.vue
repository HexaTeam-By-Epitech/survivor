<script setup lang="ts">
import NavItem from '@/components/molecules/NavItem.vue';

const navItems = [
  { name: 'Home', path: '/', icon: 'home' },
  { name: 'Discover', path: '/discover', icon: 'search' },
  { name: 'Events', path: '/events', icon: 'calendar' },
  { name: 'Profile', path: '/profile', icon: 'profile' }
];
</script>

<template>
  <nav 
    class="sidenav" 
    role="navigation" 
    aria-label="Main navigation"
  >
    <div class="sidenav__header">
      <h1 class="sidenav__title">JEB</h1>
    </div>
    
    <div class="sidenav__nav">
      <NavItem 
        v-for="item in navItems"
        :key="item.path"
        :name="item.name"
        :path="item.path"
        :icon="item.icon"
        :show-label="false"
      />
    </div>
  </nav>
</template>

<style scoped>
.sidenav {
  position: fixed;
  top: 0;
  left: 0;
  width: 80px;
  height: 100vh;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-6) 0;
  z-index: var(--z-nav);
}

.sidenav__header {
  margin-bottom: var(--space-8);
}

.sidenav__title {
  font-size: var(--fs-lg);
  font-weight: 700;
  background: var(--gradient-hero);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
}

.sidenav__nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;
  padding: 0 var(--space-3);
}

@media (max-width: 639px), (min-width: 1024px) {
  .sidenav {
    display: none;
  }
}
</style>