<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import SearchInput from '@/components/molecules/SearchInput.vue';
import CompanyList from '@/components/organisms/CompanyList.vue';
import { useAppStore } from '@/app/store';

const store = useAppStore();

// Active filter type (startups or projects)
const activeFilter = ref<'startups' | 'projects'>('startups');

// Computed properties for filtered data
const filteredStartups = computed(() => {
  return store.filteredStartups;
});

const filteredProjects = computed(() => {
  if (!store.searchQuery) return store.projects;
  
  const query = store.searchQuery.toLowerCase();
  return store.projects.filter(project =>
    project.name?.toLowerCase().includes(query) ||
    project.needs?.toLowerCase().includes(query) ||
    project.maturity?.toLowerCase().includes(query)
  );
});

const totalResults = computed(() => {
  return activeFilter.value === 'startups' 
    ? filteredStartups.value.length 
    : filteredProjects.value.length;
});

const hasResults = computed(() => {
  return totalResults.value > 0;
});

const isLoading = computed(() => {
  return activeFilter.value === 'startups' 
    ? store.loading.startups 
    : store.loading.projects;
});

const currentError = computed(() => {
  return activeFilter.value === 'startups' 
    ? store.errors.startups 
    : store.errors.projects;
});

// Change filter type
const setActiveFilter = (type: 'startups' | 'projects') => {
  activeFilter.value = type;
  
  // Load data if not already loaded
  if (type === 'projects' && store.projects.length === 0) {
    store.fetchProjects({ limit: 50 });
  }
};

onMounted(async () => {
  document.title = 'Discover | JEB Incubator';
  
  // Load data if not already loaded
  if (store.startups.length === 0) {
    await store.initializeApp();
  }
});
</script>

<template>
  <div class="discover-page">
    <div class="container">
      <header class="discover-page__header">
        <h1 class="discover-page__title">Discover</h1>
        <p class="discover-page__subtitle">
          Find startups and projects by name, description, or other criteria
        </p>
        
        <!-- Filter Selection -->
        <div class="discover-page__filters">
          <div class="discover-page__filter-tabs">
            <button
              :class="['discover-page__filter-tab', { 'discover-page__filter-tab--active': activeFilter === 'startups' }]"
              @click="setActiveFilter('startups')"
            >
              Startups
            </button>
            <button
              :class="['discover-page__filter-tab', { 'discover-page__filter-tab--active': activeFilter === 'projects' }]"
              @click="setActiveFilter('projects')"
            >
              Projects
            </button>
          </div>
        </div>
        
        <div class="discover-page__input">
          <SearchInput
            v-model="store.searchQuery"
            :placeholder="`Search ${activeFilter}...`"
          />
        </div>
      </header>
      
      <section class="discover-page__results">
        <div v-if="isLoading" class="discover-page__loading">
          <p>Loading {{ activeFilter }}...</p>
        </div>
        
        <div v-else-if="currentError" class="discover-page__error">
          <p>Error loading {{ activeFilter }}. Please try again later.</p>
        </div>
        
        <template v-else>
          <div v-if="store.searchQuery && !hasResults" class="discover-page__no-results">
            <p>No {{ activeFilter }} found matching "{{ store.searchQuery }}"</p>
            <p class="discover-page__no-results-hint">Try different keywords or check your spelling</p>
          </div>
          
          <div v-else-if="store.searchQuery" class="discover-page__results-info">
            <p>{{ totalResults }} {{ activeFilter }} found</p>
          </div>
          
          <!-- Startups display -->
          <CompanyList 
            v-if="activeFilter === 'startups'"
            :startups="filteredStartups"
            class="discover-page__companies"
          />
          
          <!-- Projects display (placeholder for now) -->
          <div v-else-if="activeFilter === 'projects'" class="discover-page__projects">
            <div v-if="filteredProjects.length === 0 && !store.searchQuery" class="discover-page__projects-placeholder">
              <p>Projects will be displayed here once available.</p>
            </div>
            <div v-else class="discover-page__projects-grid">
              <div 
                v-for="project in filteredProjects" 
                :key="project.id"
                class="discover-page__project-card"
              >
                <h3 class="discover-page__project-title">{{ project.name }}</h3>
                <p class="discover-page__project-description">{{ project.needs || 'No description available' }}</p>
                <div class="discover-page__project-status">
                  Status: {{ project.project_status?.name || project.maturity || 'Unknown' }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </section>
    </div>
  </div>
</template>

<style scoped>
.discover-page {
  padding: var(--space-4) 0;
}

.discover-page__header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.discover-page__title {
  font-size: var(--fs-2xl);
  font-weight: 600;
  margin-bottom: var(--space-3);
  color: var(--color-text-high);
}

.discover-page__subtitle {
  font-size: var(--fs-md);
  color: var(--color-text-medium);
  margin-bottom: var(--space-6);
}

.discover-page__filters {
  margin-bottom: var(--space-6);
}

.discover-page__filter-tabs {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-1);
  max-width: 300px;
  margin: 0 auto;
}

.discover-page__filter-tab {
  flex: 1;
  padding: var(--space-3) var(--space-4);
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text-medium);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: var(--fs-sm);
}

.discover-page__filter-tab:hover {
  color: var(--color-text-high);
  background: var(--color-bg);
}

.discover-page__filter-tab--active {
  background: var(--gradient-hero);
  color: var(--color-text-high);
  box-shadow: var(--shadow-1);
}

.discover-page__input {
  max-width: 600px;
  margin: 0 auto;
}

.discover-page__results {
  margin-top: var(--space-8);
}

.discover-page__results-info {
  margin-bottom: var(--space-4);
  text-align: center;
  color: var(--color-text-medium);
  font-size: var(--fs-sm);
}

.discover-page__no-results {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-text-muted);
}

.discover-page__no-results-hint {
  margin-top: var(--space-2);
  font-size: var(--fs-sm);
  opacity: 0.8;
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

/* Projects specific styles */
.discover-page__projects-placeholder {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-text-muted);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 2px dashed var(--color-border);
}

.discover-page__projects-grid {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.discover-page__project-card {
  background: var(--gradient-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.discover-page__project-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-2);
}

.discover-page__project-title {
  font-size: var(--fs-lg);
  font-weight: 600;
  margin-bottom: var(--space-3);
  color: var(--color-text-high);
}

.discover-page__project-description {
  font-size: var(--fs-sm);
  color: var(--color-text-medium);
  line-height: var(--lh-base);
  margin-bottom: var(--space-4);
}

.discover-page__project-status {
  font-size: var(--fs-xs);
  color: var(--color-primary-400);
  font-weight: 500;
  padding: var(--space-2) var(--space-3);
  background: var(--color-primary-500/10);
  border-radius: var(--radius-md);
  display: inline-block;
}

@media (min-width: 640px) {
  .discover-page {
    padding: var(--space-6) 0;
  }
  
  .discover-page__filter-tabs {
    max-width: 400px;
  }
  
  .discover-page__filter-tab {
    font-size: var(--fs-md);
  }
}

@media (min-width: 1024px) {
  .discover-page {
    padding: var(--space-8) 0;
  }
  
  .discover-page__title {
    font-size: var(--fs-3xl);
  }
  
  .discover-page__subtitle {
    font-size: var(--fs-lg);
  }
  
  .discover-page__projects-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
}
</style>