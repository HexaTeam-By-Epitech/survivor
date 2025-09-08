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
    class="navbar" 
    role="navigation" 
    aria-label="Main navigation"
  >
    <div class="navbar__container">
      <div class="navbar__brand">
        <h1 class="navbar__title">JEB Incubator</h1>
      </div>
      
      <div class="navbar__nav">
        <NavItem 
          v-for="item in navItems"
          :key="item.path"
          :name="item.name"
          :path="item.path"
          :icon="item.icon"
        />
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  background: var(--gradient-surface);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border);
  z-index: var(--z-nav);
}

.navbar__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
  height: 64px;
}

.navbar__brand {
  display: flex;
  align-items: center;
}

.navbar__title {
  font-size: var(--fs-xl);
  font-weight: 600;
  background: var(--gradient-hero);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.navbar__nav {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

@media (max-width: 1023px) {
  .navbar {
    display: none;
  }
}
</style>