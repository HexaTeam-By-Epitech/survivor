<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useAppStore } from '@/app/store';
import AppButton from '@/components/atoms/AppButton.vue';

const store = useAppStore();

const upcomingEvents = computed(() => {
  // Pour l'instant, on affiche tous les événements
  return store.events;
});

onMounted(async () => {
  document.title = 'Events | JEB Incubator';
  
  // Load events if not already loaded
  if (store.events.length === 0) {
    await store.fetchEvents({ limit: 50, upcoming: true });
  }
});
</script>

<template>
  <div class="events-page">
    <div class="container">
      <header class="events-page__header">
        <h1 class="events-page__title">Events & Calendar</h1>
        <p class="events-page__subtitle">
          Stay up to date with conferences, pitch sessions, workshops, and networking events
        </p>
      </header>
      
      <section class="events-page__content">
        <div v-if="store.loading.events" class="events-page__loading">
          <p>Loading events...</p>
        </div>
        
        <div v-else-if="store.errors.events" class="events-page__error">
          <p>Error loading events. Please try again later.</p>
        </div>
        
        <div v-else-if="upcomingEvents.length === 0" class="events-page__no-events">
          <div class="events-page__no-events-content">
            <h2>No Upcoming Events</h2>
            <p>Check back soon for exciting events, workshops, and conferences!</p>
          </div>
        </div>
        
        <div v-else class="events-page__events-grid">
          <div 
            v-for="event in upcomingEvents" 
            :key="event.id"
            class="events-page__event-card"
          >
            <div class="events-page__event-header">
              <div class="events-page__event-date">
                <span class="events-page__event-day">{{ new Date().getDate() }}</span>
                <span class="events-page__event-month">{{ new Date().toLocaleDateString('en', { month: 'short' }) }}</span>
              </div>
              <div class="events-page__event-category">
                {{ event.event_type?.name || 'General' }}
              </div>
            </div>
            
            <div class="events-page__event-content">
              <h3 class="events-page__event-title">{{ event.name || 'Event Title' }}</h3>
              <p class="events-page__event-description">
                {{ event.description || 'Event description will be available soon.' }}
              </p>
              
              <div class="events-page__event-details">
                <div class="events-page__event-detail">
                  <span class="events-page__event-detail-label">Time:</span>
                  <span>{{ event.event_dates?.[0]?.date || 'TBA' }}</span>
                </div>
                <div class="events-page__event-detail">
                  <span class="events-page__event-detail-label">Location:</span>
                  <span>{{ event.location || 'Online' }}</span>
                </div>
              </div>
              
              <div class="events-page__event-actions">
                <AppButton variant="primary" size="sm">
                  Register
                </AppButton>
                <AppButton variant="outline" size="sm">
                  Learn More
                </AppButton>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Placeholder for calendar view -->
      <section class="events-page__calendar-section">
        <h2 class="events-page__section-title">Calendar View</h2>
        <div class="events-page__calendar-placeholder">
          <p>Interactive calendar coming soon...</p>
          <p class="events-page__calendar-hint">
            For now, you can view events in the list above. Calendar integration will be available in a future update.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.events-page {
  padding: var(--space-4) 0;
}

.events-page__header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.events-page__title {
  font-size: var(--fs-2xl);
  font-weight: 600;
  margin-bottom: var(--space-3);
  color: var(--color-text-high);
}

.events-page__subtitle {
  font-size: var(--fs-md);
  color: var(--color-text-medium);
  max-width: 600px;
  margin: 0 auto;
  line-height: var(--lh-base);
}

.events-page__loading,
.events-page__error {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-text-medium);
}

.events-page__error {
  color: var(--color-danger);
}

.events-page__no-events {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.events-page__no-events-content {
  text-align: center;
  color: var(--color-text-muted);
}

.events-page__no-events-content h2 {
  font-size: var(--fs-xl);
  margin-bottom: var(--space-3);
  color: var(--color-text-medium);
}

.events-page__events-grid {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  margin-bottom: var(--space-12);
}

.events-page__event-card {
  background: var(--gradient-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.events-page__event-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-2);
}

.events-page__event-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-4);
}

.events-page__event-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--gradient-hero);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  min-width: 60px;
}

.events-page__event-day {
  font-size: var(--fs-xl);
  font-weight: 600;
  color: var(--color-text-high);
  line-height: 1;
}

.events-page__event-month {
  font-size: var(--fs-xs);
  color: var(--color-text-high);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.events-page__event-category {
  background: var(--color-primary-500/10);
  color: var(--color-primary-400);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--fs-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.events-page__event-content {
  flex: 1;
}

.events-page__event-title {
  font-size: var(--fs-lg);
  font-weight: 600;
  margin-bottom: var(--space-3);
  color: var(--color-text-high);
  line-height: var(--lh-tight);
}

.events-page__event-description {
  font-size: var(--fs-sm);
  color: var(--color-text-medium);
  line-height: var(--lh-base);
  margin-bottom: var(--space-4);
}

.events-page__event-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}

.events-page__event-detail {
  display: flex;
  gap: var(--space-2);
  font-size: var(--fs-sm);
}

.events-page__event-detail-label {
  font-weight: 500;
  color: var(--color-text-high);
  min-width: 70px;
}

.events-page__event-detail span:last-child {
  color: var(--color-text-medium);
}

.events-page__event-actions {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.events-page__calendar-section {
  margin-top: var(--space-12);
}

.events-page__section-title {
  font-size: var(--fs-xl);
  font-weight: 600;
  margin-bottom: var(--space-6);
  color: var(--color-text-high);
  text-align: center;
}

.events-page__calendar-placeholder {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  text-align: center;
  color: var(--color-text-muted);
  border: 2px dashed var(--color-border);
}

.events-page__calendar-hint {
  margin-top: var(--space-3);
  font-size: var(--fs-sm);
  opacity: 0.8;
}

@media (min-width: 640px) {
  .events-page {
    padding: var(--space-6) 0;
  }
  
  .events-page__events-grid {
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  }
}

@media (min-width: 1024px) {
  .events-page {
    padding: var(--space-8) 0;
  }
  
  .events-page__title {
    font-size: var(--fs-3xl);
  }
  
  .events-page__subtitle {
    font-size: var(--fs-lg);
  }
  
  .events-page__events-grid {
    grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  }
}
</style>
