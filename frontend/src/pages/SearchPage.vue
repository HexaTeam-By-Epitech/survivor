<script setup lang="ts">
import { onMounted, computed } from 'vue';
import SearchInput from '@/components/molecules/SearchInput.vue';
import CompanyList from '@/components/organisms/CompanyList.vue';
import { useAppStore } from '@/app/store';

const store = useAppStore();

// Filtered startups for the component
const filteredStartups = computed(() => {
  return store.filteredStartups;
});

const totalResults = computed(() => {
  return filteredStartups.value.length;
});

const hasResults = computed(() => {
  return totalResults.value > 0;
});

onMounted(async () => {
  document.title = 'Search Startups | JEB Incubator';
  
  // Load data if not already loaded
  if (store.startups.length === 0) {
    await store.initializeApp();
  }
});
</script>

<template>
  <div class="search-page">
    <div class="container">
      <header class="search-page__header">
        <h1 class="search-page__title">Search Startups</h1>
        <p class="search-page__subtitle">
          Find startups by name, description, or other criteria
        </p>
        
        <div class="search-page__input">
          <SearchInput
            v-model="store.searchQuery"
            placeholder="Search startups, technologies, or keywords..."
          />
        </div>
      </header>
      
      <section class="search-page__results">
        <div v-if="store.loading.startups" class="search-page__loading">
          <p>Loading startups...</p>
        </div>
        
        <div v-else-if="store.errors.startups" class="search-page__error">
          <p>Error loading startups. Please try again later.</p>
        </div>
        
        <template v-else>
          <div v-if="store.searchQuery && !hasResults" class="search-page__no-results">
            <p>No startups found matching "{{ store.searchQuery }}"</p>
            <p class="search-page__no-results-hint">Try different keywords or check your spelling</p>
          </div>
          
          <div v-else-if="store.searchQuery" class="search-page__results-info">
            <p>{{ totalResults }} startups found</p>
          </div>
          
          <CompanyList 
            :startups="filteredStartups"
            class="search-page__companies"
          />
        </template>
      </section>
    </div>
  </div>
</template>

<style scoped>
.search-page {
  padding: var(--space-4) 0;
}

.search-page__header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.search-page__title {
  font-size: var(--fs-2xl);
  font-weight: 600;
  margin-bottom: var(--space-3);
  color: var(--color-text-high);
}

.search-page__subtitle {
  font-size: var(--fs-md);
  color: var(--color-text-medium);
  margin-bottom: var(--space-6);
}

.search-page__input {
  max-width: 600px;
  margin: 0 auto;
}

.search-page__results {
  margin-top: var(--space-8);
}

.search-page__results-info {
  margin-bottom: var(--space-4);
  text-align: center;
  color: var(--color-text-medium);
  font-size: var(--fs-sm);
}

.search-page__no-results {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-text-muted);
}

.search-page__no-results-hint {
  margin-top: var(--space-2);
  font-size: var(--fs-sm);
  opacity: 0.8;
}

.search-page__loading,
.search-page__error {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-text-medium);
}

.search-page__error {
  color: var(--color-danger);
}

@media (min-width: 640px) {
  .search-page {
    padding: var(--space-6) 0;
  }
}

@media (min-width: 1024px) {
  .search-page {
    padding: var(--space-8) 0;
  }
  
  .search-page__title {
    font-size: var(--fs-3xl);
  }
  
  .search-page__subtitle {
    font-size: var(--fs-lg);
  }
}
</style>