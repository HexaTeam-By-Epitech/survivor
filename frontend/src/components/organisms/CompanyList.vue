<script setup lang="ts">
import { computed } from 'vue';
import type { Startup } from '@/types/company';
import CompanyCard from './CompanyCard.vue';
import { useMediaQuery } from '@/composables/useMediaQuery';

interface Props {
  startups?: Startup[];
  showFeatured?: boolean;
  maxItems?: number;
}

const props = withDefaults(defineProps<Props>(), {
  showFeatured: false,
  startups: () => [],
});

const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
const isDesktop = useMediaQuery('(min-width: 1024px)');

// Filter and limit startups
const allItems = computed(() => {
  const items = props.startups;
  return props.maxItems ? items.slice(0, props.maxItems) : items;
});

const featuredItem = computed(() => 
  props.showFeatured && allItems.value.length > 0 ? allItems.value[0] : null
);

const regularItems = computed(() => 
  props.showFeatured ? allItems.value.slice(1) : allItems.value
);

const gridClasses = computed(() => {
  if (isDesktop.value) return 'grid-3-cols';
  if (isTablet.value) return 'grid-2-cols';
  return 'grid-1-col';
});

const hasItems = computed(() => allItems.value.length > 0);
</script>

<template>
  <div v-if="hasItems" class="company-list">
    <CompanyCard
      v-if="featuredItem"
      :startup="featuredItem"
      variant="featured"
      class="company-list__featured"
    />
    
    <div 
      class="company-list__grid"
      :class="gridClasses"
    >
      <CompanyCard
        v-for="startup in regularItems"
        :key="`startup-${startup.id}`"
        :startup="startup"
      />
    </div>
  </div>
  
  <div v-else class="company-list__empty">
    <p class="company-list__empty-text">No startups found.</p>
    <p class="company-list__empty-subtext">Try adjusting your search criteria or check back later.</p>
  </div>
</template>

<style scoped>
.company-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.company-list__featured {
  margin-bottom: var(--space-4);
}

.company-list__grid {
  display: grid;
  gap: var(--space-6);
}

.company-list__empty {
  text-align: center;
  padding: var(--space-12) var(--space-4);
}

.company-list__empty-text {
  font-size: var(--fs-lg);
  color: var(--color-text-medium);
  margin-bottom: var(--space-2);
}

.company-list__empty-subtext {
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
}

.grid-1-col {
  grid-template-columns: 1fr;
}

.grid-2-cols {
  grid-template-columns: repeat(2, 1fr);
}

.grid-3-cols {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
</style>