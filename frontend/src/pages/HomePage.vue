<script setup lang="ts">
import { onMounted } from 'vue';
import HeroMission from '@/components/organisms/HeroMission.vue';
import CompanyList from '@/components/organisms/CompanyList.vue';
import { useAppStore } from '@/app/store';

const store = useAppStore();

onMounted(async () => {
  document.title = 'Home | JEB Incubator';
  
  // Initialize the app data if not already loaded
  if (store.startups.length === 0) {
    await store.initializeApp();
  }
});
</script>

<template>
  <div class="home-page">
    <div class="container">
      <HeroMission class="home-page__hero" />
      
      <section class="home-page__section">
        <header class="home-page__header">
          <h2 class="home-page__title">Featured Startups</h2>
          <p class="home-page__subtitle">
            Discover the innovative startups in our incubator ecosystem
          </p>
        </header>
        
        <div v-if="store.loading.startups" class="home-page__loading">
          <p>Loading startups...</p>
        </div>
        
        <div v-else-if="store.errors.startups" class="home-page__error">
          <p>Error loading startups. Please try again later.</p>
        </div>
        
        <CompanyList 
          v-else
          :startups="store.startups.slice(0, 3)"
          show-featured
          class="home-page__companies"
        />
      </section>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  padding: var(--space-4) 0;
}

.home-page__hero {
  margin-bottom: var(--space-12);
}

.home-page__section {
  padding: var(--space-8) 0;
}

.home-page__header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.home-page__title {
  font-size: var(--fs-2xl);
  font-weight: 600;
  margin-bottom: var(--space-3);
  color: var(--color-text-high);
}

.home-page__subtitle {
  font-size: var(--fs-lg);
  color: var(--color-text-medium);
  max-width: 600px;
  margin: 0 auto;
}

.home-page__loading,
.home-page__error {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-text-medium);
}

.home-page__error {
  color: var(--color-danger);
}

@media (min-width: 640px) {
  .home-page {
    padding: var(--space-6) 0;
  }
}

@media (min-width: 1024px) {
  .home-page {
    padding: var(--space-8) 0;
  }
  
  .home-page__title {
    font-size: var(--fs-3xl);
  }
}
</style>