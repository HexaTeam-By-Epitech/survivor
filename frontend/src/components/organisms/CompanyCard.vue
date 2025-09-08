<script setup lang="ts">
import { computed } from 'vue';
import type { Startup, Partner } from '@/types/company';
import AppButton from '@/components/atoms/AppButton.vue';
import AppBadge from '@/components/atoms/AppBadge.vue';

interface Props {
  startup?: Startup;
  partner?: Partner;
  variant?: 'default' | 'featured';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
});

const company = computed(() => {
  return props.startup?.Companies || props.partner?.Companies;
});

const companyType = computed(() => {
  return props.startup ? 'startup' : 'partner';
});

const websiteUrl = computed(() => {
  return props.startup?.website_url || company.value?.account?.email;
});

const tags = computed(() => {
  const tagList: string[] = [];
  
  if (props.startup) {
    tagList.push('Startup');
    if (props.startup.projects?.length) {
      tagList.push(`${props.startup.projects.length} Projects`);
    }
  }
  
  if (props.partner) {
    tagList.push('Partner');
    if (props.partner.partnership_type?.name) {
      tagList.push(props.partner.partnership_type.name);
    }
  }
  
  return tagList;
});

const heroImage = computed(() => {
  // Default placeholder image if no image_path
  return company.value?.account?.image_path || 
    'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800';
});

const isFeatureed = computed(() => props.variant === 'featured');
</script>

<template>
  <article 
    v-if="company"
    class="company-card card-base" 
    :class="{ 'company-card--featured': isFeatureed }"
    role="article"
  >
    <div class="company-card__media gradient-overlay">
      <picture>
        <img 
          :src="heroImage" 
          :alt="`${company.name} workspace`" 
          class="company-card__image"
          loading="lazy" 
          decoding="async" 
        />
      </picture>
    </div>
    
    <div class="company-card__content">
      <div class="company-card__text">
        <h3 class="company-card__title">{{ company.name }}</h3>
        <p v-if="company.description" class="company-card__excerpt">
          {{ company.description }}
        </p>
        <p v-else class="company-card__excerpt company-card__excerpt--placeholder">
          {{ companyType === 'startup' ? 'Innovative startup' : 'Strategic partner' }} in our ecosystem
        </p>
        
        <div v-if="tags.length" class="company-card__tags">
          <AppBadge 
            v-for="tag in tags" 
            :key="tag"
            variant="primary"
          >
            {{ tag }}
          </AppBadge>
        </div>
        
        <div class="company-card__actions">
          <AppButton 
            variant="primary" 
            size="sm"
          >
            View Details
          </AppButton>
          <AppButton 
            v-if="websiteUrl"
            as="a"
            :href="websiteUrl"
            variant="ghost" 
            size="sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ companyType === 'startup' ? 'Visit Website' : 'Contact' }}
          </AppButton>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.company-card {
  position: relative;
  height: 300px;
  display: flex;
  flex-direction: column;
}

.company-card--featured {
  height: 400px;
}

.company-card__media {
  position: absolute;
  inset: 0;
}

.company-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.company-card__content {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  z-index: 1;
}

.company-card__text {
  padding: var(--space-4);
  color: var(--color-text-high);
  width: 100%;
}

.company-card__title {
  font-size: var(--fs-xl);
  font-weight: 600;
  margin-bottom: var(--space-2);
  line-height: var(--lh-tight);
}

.company-card__excerpt {
  font-size: var(--fs-sm);
  line-height: var(--lh-base);
  color: var(--color-text-medium);
  margin-bottom: var(--space-3);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.company-card__excerpt--placeholder {
  font-style: italic;
  opacity: 0.8;
}

.company-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.company-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

@media (min-width: 640px) {
  .company-card__text {
    padding: var(--space-6);
  }
}

@media (min-width: 1024px) {
  .company-card--featured {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 300px;
  }
  
  .company-card--featured .company-card__media {
    position: static;
  }
  
  .company-card--featured .company-card__content {
    position: static;
    background: var(--gradient-surface);
    align-items: center;
  }
  
  .company-card--featured .company-card__text {
    padding: var(--space-8);
  }
}
</style>