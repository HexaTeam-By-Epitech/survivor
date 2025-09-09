<script setup lang="ts">
import AppButton from '@/components/atoms/AppButton.vue';

interface Props {
  title?: string;
  subtitle?: string;
  showCta?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: 'Our mission',
  subtitle: 'To cultivate a vibrant ecosystem where entrepreneurs thrive. Through hands-on mentorship, strategic partnerships and seed investment up to £200k, we turn bold visions into scalable businesses.',
  showCta: true
});
</script>

<template>
  <section class="hero" role="banner">
    <div class="hero__media gradient-overlay">
      <picture>
        <img 
          src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Entrepreneurs collaborating in modern workspace"
          class="hero__image"
          loading="eager"
          decoding="sync"
        />
      </picture>
    </div>
    
    <div class="hero__content">
      <div class="hero__text">
        <h2 class="hero__title">{{ title }}</h2>
        <p class="hero__subtitle">{{ subtitle }}</p>
        <AppButton 
          v-if="showCta" 
          variant="primary" 
          size="lg"
          class="hero__cta"
        >
          Learn More
        </AppButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  height: 400px;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--color-surface);
  box-shadow: var(--shadow-2);
}

.hero__media {
  position: absolute;
  inset: 0;
}

.hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero__content {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  z-index: 1;
}

.hero__text {
  padding: var(--space-6);
  color: var(--color-text-high);
  max-width: 600px;
}

.hero__title {
  font-size: var(--fs-2xl);
  font-weight: 600;
  margin-bottom: var(--space-3);
  line-height: var(--lh-tight);
}

.hero__subtitle {
  font-size: var(--fs-md);
  line-height: var(--lh-base);
  color: var(--color-text-medium);
  margin-bottom: var(--space-6);
  max-width: 500px;
}

.hero__cta {
  margin-top: var(--space-4);
}

@media (min-width: 640px) {
  .hero {
    height: 500px;
  }
  
  .hero__text {
    padding: var(--space-8);
  }
  
  .hero__title {
    font-size: var(--fs-3xl);
  }
  
  .hero__subtitle {
    font-size: var(--fs-lg);
  }
}

@media (min-width: 1024px) {
  .hero {
    height: 600px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: stretch;
  }
  
  .hero__media {
    position: static;
  }
  
  .hero__content {
    position: static;
    background: var(--gradient-surface);
    display: flex;
    align-items: center;
  }
  
  .hero__text {
    padding: var(--space-12);
    max-width: none;
  }
}
</style>