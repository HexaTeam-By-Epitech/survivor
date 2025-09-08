<script setup lang="ts">
import { onMounted } from 'vue';
import AppButton from '@/components/atoms/AppButton.vue';

onMounted(() => {
  document.title = 'Profile | JEB Incubator';
});
</script>

<template>
  <div class="profile-page">
    <div class="container">
      <div class="profile-page__card">
        <div class="profile-page__avatar">
          <div class="profile-page__avatar-circle">
            <span class="profile-page__avatar-initials">JD</span>
          </div>
        </div>
        
        <div class="profile-page__info">
          <h1 class="profile-page__name">John Doe</h1>
          <p class="profile-page__role">Entrepreneur</p>
          <p class="profile-page__bio">
            Passionate about building innovative solutions and creating positive impact through technology. 
            Currently working on a revolutionary fintech startup.
          </p>
          
          <div class="profile-page__stats">
            <div class="profile-page__stat">
              <span class="profile-page__stat-value">2</span>
              <span class="profile-page__stat-label">Companies</span>
            </div>
            <div class="profile-page__stat">
              <span class="profile-page__stat-value">18</span>
              <span class="profile-page__stat-label">Months in Program</span>
            </div>
            <div class="profile-page__stat">
              <span class="profile-page__stat-value">£75k</span>
              <span class="profile-page__stat-label">Funding Received</span>
            </div>
          </div>
          
          <div class="profile-page__actions">
            <AppButton variant="primary">
              Edit Profile
            </AppButton>
            <AppButton variant="outline">
              View Portfolio
            </AppButton>
          </div>
        </div>
      </div>
      
      <section class="profile-page__section">
        <h2 class="profile-page__section-title">My Companies</h2>
        <div class="profile-page__companies-placeholder">
          <p>Companies associated with this profile will appear here.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  padding: var(--space-4) 0;
}

.profile-page__card {
  background: var(--gradient-surface);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-2);
  margin-bottom: var(--space-8);
  text-align: center;
}

.profile-page__avatar {
  margin-bottom: var(--space-6);
}

.profile-page__avatar-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--gradient-hero);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: var(--shadow-1);
}

.profile-page__avatar-initials {
  font-size: var(--fs-2xl);
  font-weight: 600;
  color: var(--color-text-high);
}

.profile-page__name {
  font-size: var(--fs-2xl);
  font-weight: 600;
  margin-bottom: var(--space-2);
  color: var(--color-text-high);
}

.profile-page__role {
  font-size: var(--fs-lg);
  color: var(--color-primary-400);
  margin-bottom: var(--space-4);
}

.profile-page__bio {
  font-size: var(--fs-md);
  color: var(--color-text-medium);
  line-height: var(--lh-base);
  max-width: 600px;
  margin: 0 auto var(--space-6);
}

.profile-page__stats {
  display: flex;
  justify-content: center;
  gap: var(--space-8);
  margin-bottom: var(--space-8);
  flex-wrap: wrap;
}

.profile-page__stat {
  text-align: center;
}

.profile-page__stat-value {
  display: block;
  font-size: var(--fs-xl);
  font-weight: 600;
  color: var(--color-primary-400);
  margin-bottom: var(--space-1);
}

.profile-page__stat-label {
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
}

.profile-page__actions {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.profile-page__section {
  margin-bottom: var(--space-8);
}

.profile-page__section-title {
  font-size: var(--fs-xl);
  font-weight: 600;
  margin-bottom: var(--space-4);
  color: var(--color-text-high);
}

.profile-page__companies-placeholder {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  text-align: center;
  color: var(--color-text-muted);
  border: 2px dashed var(--color-border);
}

@media (min-width: 640px) {
  .profile-page {
    padding: var(--space-6) 0;
  }
  
  .profile-page__card {
    padding: var(--space-8);
  }
  
  .profile-page__stats {
    gap: var(--space-12);
  }
}

@media (min-width: 1024px) {
  .profile-page {
    padding: var(--space-8) 0;
  }
  
  .profile-page__card {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--space-8);
    text-align: left;
    align-items: start;
  }
  
  .profile-page__info {
    padding-top: var(--space-4);
  }
  
  .profile-page__name {
    font-size: var(--fs-3xl);
  }
  
  .profile-page__stats {
    justify-content: flex-start;
  }
  
  .profile-page__actions {
    justify-content: flex-start;
  }
}
</style>