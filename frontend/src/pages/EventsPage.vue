<template>
  <div class="events-page">
    <!-- Header -->
    <div class="events-header">
      <h1 class="page-title">Events</h1>
      <div class="header-actions">
        <!-- View Toggle -->
        <div class="view-toggle">
          <AppButton 
            :variant="viewMode === 'calendar' ? 'primary' : 'outline'"
            size="sm"
            @click="viewMode = 'calendar'"
          >
            <AppIcon name="calendar" :size="16" />
            Calendar
          </AppButton>
          <AppButton 
            :variant="viewMode === 'list' ? 'primary' : 'outline'"
            size="sm"
            @click="viewMode = 'list'"
          >
            <AppIcon name="list" :size="16" />
            List
          </AppButton>
        </div>
        
        <!-- Create Event Button -->
        <AppButton 
          variant="primary"
          @click="openCreateModal"
        >
          <AppIcon name="plus" :size="16" />
          Create Event
        </AppButton>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="search-filter">
        <AppInput
          v-model="searchQuery"
          placeholder="Search events..."
          type="text"
        />
      </div>
      
      <div class="category-filter">
        <select 
          v-model="selectedCategory" 
          class="filter-select"
        >
          <option :value="null">All Categories</option>
          <option 
            v-for="category in store.eventCategories" 
            :key="category.id" 
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="store.loading.events" class="loading-state">
      <div class="spinner"></div>
      <p>Loading events...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="store.errors.events" class="error-state">
      <AppIcon name="x" :size="24" />
      <p>{{ store.errors.events }}</p>
      <AppButton @click="loadEvents" variant="outline">
        Try Again
      </AppButton>
    </div>

    <!-- Events Content -->
    <div v-else class="events-content">
      <!-- Calendar View -->
      <div v-if="viewMode === 'calendar'" class="calendar-view">
        <VueCal 
          :events="calendarEvents"
          :disable-views="['years', 'year']"
          :default-view="'month'"
          editable-events="false"
          class="vue-cal-custom"
        />
      </div>

      <!-- List View -->
      <div v-else class="list-view">
        <div v-if="filteredEvents.length === 0" class="empty-state">
          <AppIcon name="calendar" :size="48" />
          <h3>No events found</h3>
          <p>Try adjusting your search or create a new event.</p>
        </div>
        
        <div v-else class="events-grid">
          <div 
            v-for="event in filteredEvents" 
            :key="event.id"
            class="event-card"
            @click="selectEvent(event)"
          >
            <div class="event-header">
              <h3 class="event-title">{{ event.name }}</h3>
              <div class="event-actions">
                <AppButton 
                  variant="ghost" 
                  size="sm"
                  @click.stop="editEvent(event)"
                >
                  <AppIcon name="user" :size="16" />
                </AppButton>
                <AppButton 
                  variant="ghost" 
                  size="sm"
                  @click.stop="deleteEvent(event.id)"
                >
                  <AppIcon name="trash-2" :size="16" />
                </AppButton>
              </div>
            </div>
            
            <div class="event-details">
              <div v-if="(event.EventDates?.[0] || event.event_dates?.[0])" class="event-date">
                <AppIcon name="clock" :size="16" />
                <span>{{ formatDate((event.EventDates?.[0]?.date || event.event_dates?.[0]?.date) || '') }}</span>
              </div>
              
              <div v-if="event.location" class="event-location">
                <AppIcon name="map-pin" :size="16" />
                <span>{{ event.location }}</span>
              </div>
              
              <div v-if="(event.EventsCategories || event.event_type)" class="event-category">
                <AppIcon name="user" :size="16" />
                <span>{{ (event.EventsCategories?.name || event.event_type?.name) }}</span>
              </div>
            </div>
            
            <p v-if="event.description" class="event-description">
              {{ event.description }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Simple Create Modal Placeholder -->
    <div v-if="showCreateModal" class="modal-backdrop" @click="closeCreateModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Create Event</h2>
          <button @click="closeCreateModal" class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createEvent">
            <div class="form-group">
              <label>Event Name</label>
              <input v-model="createForm.name" required />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea v-model="createForm.description"></textarea>
            </div>
            <div class="form-group">
              <label>Location</label>
              <input v-model="createForm.location" />
            </div>
            <div class="form-group">
              <label>Event Date</label>
              <input 
                v-model="createForm.eventDate" 
                type="datetime-local" 
                required
              />
            </div>
            <div class="form-actions">
              <button type="button" @click="closeCreateModal">Cancel</button>
              <button type="submit" :disabled="loading">Create</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAppStore } from '@/app/store'
import { api } from '@/services/api'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import AppButton from '@/components/atoms/AppButton.vue'
import AppIcon from '@/components/atoms/AppIcon.vue'
import AppInput from '@/components/atoms/AppInput.vue'
import type { Event } from '@/types/company'
import type { CalendarEvent } from 'vue-cal'

const store = useAppStore();

// State
const viewMode = ref<'calendar' | 'list'>('calendar');
const showCreateModal = ref(false);
const selectedEvent = ref<Event | null>(null);
const searchQuery = ref('');
const selectedCategory = ref<number | null>(null);
const loading = ref(false);

// Create form state
interface CreateEventData {
  name: string
  description: string
  location: string
  event_type_id: number | null
  target_audience_id: number | null
  event_dates: Date[]
  eventDate: string // For datetime-local input
}

const createForm = ref<CreateEventData>({
  name: '',
  description: '',
  location: '',
  event_type_id: null,
  target_audience_id: null,
  event_dates: [],
  eventDate: ''
});

// Computed properties
const calendarEvents = computed((): CalendarEvent[] => {
  const events = store.events.map((event: Event) => {
    // Get the event date from either field name
    const eventDate = (event.EventDates?.[0]?.date || event.event_dates?.[0]?.date);
    
    console.log('Raw event:', event);
    console.log('Processing event:', event.name, 'with date:', eventDate);
    
    if (!eventDate) {
      // If no date, show as today
      const today = new Date();
      const todayEvent = {
        id: event.id,
        title: event.name,
        content: event.description || '',
        start: today,
        end: today,
        class: `event-${(event.EventsCategories?.id || event.event_type?.id) || 'default'}`,
        allDay: true
      };
      console.log('No date event:', todayEvent);
      return todayEvent;
    }

    // Parse the date string to ensure proper formatting
    const startDate = new Date(eventDate);
    console.log('Parsed start date:', startDate, 'isValid:', !isNaN(startDate.getTime()));
    
    if (isNaN(startDate.getTime())) {
      // If date is invalid, use today
      const today = new Date();
      const fallbackEvent = {
        id: event.id,
        title: event.name + ' (Invalid date)',
        content: event.description || '',
        start: today,
        end: today,
        class: `event-${(event.EventsCategories?.id || event.event_type?.id) || 'default'}`,
        allDay: true
      };
      console.log('Invalid date event:', fallbackEvent);
      return fallbackEvent;
    }
    
    // Check if the original date string includes time information
    const hasTime = eventDate.includes('T') && eventDate.includes(':');
    console.log('Has time:', hasTime, 'for date:', eventDate);
    
    if (hasTime) {
      // If it has time, create end time 2 hours later
      const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)); // 2 hours later
      
      const timedEvent = {
        id: event.id,
        title: event.name,
        content: event.description || '',
        start: startDate,
        end: endDate,
        class: `event-${(event.EventsCategories?.id || event.event_type?.id) || 'default'}`,
        allDay: false
      };
      console.log('Timed event:', timedEvent);
      return timedEvent;
    } else {
      // If no time info, treat as all-day event
      const allDayEvent = {
        id: event.id,
        title: event.name,
        content: event.description || '',
        start: startDate,
        end: startDate,
        class: `event-${(event.EventsCategories?.id || event.event_type?.id) || 'default'}`,
        allDay: true
      };
      console.log('All day event:', allDayEvent);
      return allDayEvent;
    }
  });
  
  console.log('Final calendar events count:', events.length);
  console.log('Final calendar events:', events);
  return events;
});

// Filtered events for list view
const filteredEvents = computed(() => {
  return store.events.filter((event: Event) => {
    const matchesSearch = !searchQuery.value || 
      event.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    const matchesCategory = !selectedCategory.value || 
      event.event_type_id === selectedCategory.value;
    
    return matchesSearch && matchesCategory;
  }).sort((a: Event, b: Event) => {
    const dateA = (a.EventDates?.[0]?.date || a.event_dates?.[0]?.date) || '';
    const dateB = (b.EventDates?.[0]?.date || b.event_dates?.[0]?.date) || '';
    return new Date(dateA).getTime() - new Date(dateB).getTime();
  });
});

// Methods
const loadEvents = async () => {
  await store.fetchEvents();
  await store.fetchReferenceData();
};

const openCreateModal = () => {
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  createForm.value = {
    name: '',
    description: '',
    location: '',
    event_type_id: null,
    target_audience_id: null,
    event_dates: [],
    eventDate: ''
  };
};

const createEvent = async () => {
  if (!createForm.value.name || !createForm.value.eventDate) return;
  
  loading.value = true;
  try {
    // Create event data in the format expected by the backend
    const eventData: Partial<Event> = {
      name: createForm.value.name,
      description: createForm.value.description || undefined,
      location: createForm.value.location || undefined,
      event_type_id: createForm.value.event_type_id || undefined,
      target_audience_id: createForm.value.target_audience_id || undefined
    };

    // Convert the datetime-local value to ISO string for backend
    const eventDate = new Date(createForm.value.eventDate).toISOString();

    // Include the event date to be handled by backend
    const eventDataWithDate = {
      ...eventData,
      eventDate: eventDate
    };

    console.log('Sending event data:', eventDataWithDate);

    const response = await api.events.create(eventDataWithDate as any);
    
    if (response.success) {
      console.log('Event created successfully:', response.data);
      closeCreateModal();
      await loadEvents(); // Reload events to show the new one
    } else {
      throw new Error('Failed to create event');
    }
  } catch (error) {
    console.error('Error creating event:', error);
    alert('Failed to create event. Please try again.');
  } finally {
    loading.value = false;
  }
};

const editEvent = (event: Event) => {
  selectedEvent.value = event;
  console.log('Edit event:', event);
};

const deleteEvent = async (eventId: number) => {
  if (!confirm('Are you sure you want to delete this event?')) return;
  
  loading.value = true;
  try {
    // TODO: Implement event deletion API call
    console.log('Deleting event:', eventId);
    await loadEvents();
  } catch (error) {
    console.error('Error deleting event:', error);
  } finally {
    loading.value = false;
  }
};

const selectEvent = (event: Event) => {
  selectedEvent.value = event;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  
  // Check if the original date string includes time information
  const hasTime = dateString.includes('T') || dateString.includes(':');
  
  if (hasTime) {
    // Format with date and time
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } else {
    // Format date only
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};

// Initialize data
onMounted(() => {
  loadEvents();
});
</script>

<style scoped>
.events-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.events-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
}

.filters-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-filter {
  flex: 1;
  min-width: 200px;
}

.category-filter {
  min-width: 200px;
}

.filter-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
}

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.events-content {
  min-height: 400px;
}

.calendar-view {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.vue-cal-custom {
  height: 600px;
}

/* Custom event styling for different categories */
.vue-cal-custom :deep(.vuecal__event.event-1) {
  background-color: #3b82f6;
  color: white;
}

.vue-cal-custom :deep(.vuecal__event.event-2) {
  background-color: #10b981;
  color: white;
}

.vue-cal-custom :deep(.vuecal__event.event-3) {
  background-color: #f59e0b;
  color: white;
}

.vue-cal-custom :deep(.vuecal__event.event-default) {
  background-color: #6b7280;
  color: white;
}

.vue-cal-custom :deep(.vuecal__event) {
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
}

.list-view {
  background: white;
  border-radius: 8px;
  padding: 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.empty-state h3 {
  margin: 1rem 0 0.5rem;
  color: #374151;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.event-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.event-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.event-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
}

.event-actions {
  display: flex;
  gap: 0.5rem;
}

.event-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.event-date,
.event-location,
.event-category {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.event-description {
  color: #374151;
  line-height: 1.5;
  margin: 0;
}

/* Modal styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #1f2937;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.form-actions button {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.form-actions button[type="button"] {
  background: #f9fafb;
  border: 1px solid #d1d5db;
  color: #374151;
}

.form-actions button[type="submit"] {
  background: #3b82f6;
  border: 1px solid #3b82f6;
  color: white;
}

.form-actions button:hover {
  opacity: 0.9;
}

.form-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive design */
@media (max-width: 768px) {
  .events-page {
    padding: 1rem;
  }
  
  .events-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: space-between;
  }
  
  .events-grid {
    grid-template-columns: 1fr;
  }
  
  .filters-section {
    flex-direction: column;
  }
}
</style>
