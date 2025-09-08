<script setup lang="ts">
import { onMounted } from 'vue';
import CompanyList from '@/components/organisms/CompanyList.vue';
import { useAppStore } from '@/app/store';

const store = useAppStore();

onMounted(async () => {
  document.title = 'Discover Startups | JEB Incubator';
  
  // Load more data for the discover page
  if (store.startups.length === 0) {
    await store.initializeApp();
  } else {
    // Refresh data with more items
    await store.fetchStartups({ limit: 50 });
  }
});
</script>

<template>
  <div class="discover-page">
    <div class="container">
      <header class="discover-page__header">
        <div class="discover-page__header-content">
          <h1 class="discover-page__title">Startups</h1>
          <p class="discover-page__subtitle">
            Explore the innovative startups that are part of our incubator ecosystem. 
            Each startup represents a unique vision for the future, backed by our mentorship and investment.
          </p>
        </div>
      </header>
      
      <div v-if="store.loading.startups" class="discover-page__loading">
        <p>Loading startups...</p>
      </div>
      
      <div v-else-if="store.errors.startups" class="discover-page__error">
        <p>Error loading startups. Please try again later.</p>
      </div>
      
      <CompanyList 
        v-else
        :startups="store.startups"
        :show-featured="true"
        class="discover-page__companies"
      />
    </div>
  </div>
</template>

<style scoped>
.discover-page {
  padding: var(--space-4) 0;
}

.discover-page__header {
  background: var(--gradient-surface);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  margin-bottom: var(--space-8);
  text-align: center;
}

.discover-page__header-content {
  max-width: 800px;
  margin: 0 auto;
}

.discover-page__title {
  font-size: var(--fs-2xl);
  font-weight: 600;
  margin-bottom: var(--space-4);
  background: var(--gradient-hero);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.discover-page__subtitle {
  font-size: var(--fs-md);
  color: var(--color-text-medium);
  line-height: var(--lh-base);
}

.discover-page__loading,
.discover-page__error {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-text-medium);
}

.discover-page__error {
  color: var(--color-danger);
}

@media (min-width: 640px) {
  .discover-page {
    padding: var(--space-6) 0;
  }
  
  .discover-page__header {
    padding: var(--space-8);
  }
}

@media (min-width: 1024px) {
  .discover-page {
    padding: var(--space-8) 0;
  }
  
  .discover-page__header {
    padding: var(--space-12);
  }
  
  .discover-page__title {
    font-size: var(--fs-3xl);
  }
  
  .discover-page__subtitle {
    font-size: var(--fs-lg);
  }
}
</style>