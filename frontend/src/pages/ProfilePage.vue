<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAppStore } from '@/app/store';
import AppButton from '@/components/atoms/AppButton.vue';

const store = useAppStore();

// Form data for login/signup
const isLoginMode = ref(true);
const formData = ref({
  email: '',
  password: '',
  name: '',
});

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
  formData.value = { email: '', password: '', name: '' };
  store.errors.auth = null;
};

const handleLogin = async () => {
  const result = await store.login(formData.value.email, formData.value.password);
  if (result.success) {
    formData.value = { email: '', password: '', name: '' };
  }
};

const handleSignup = () => {
  // Pour l'instant, on simule un signup qui fait un login
  handleLogin();
};

const handleLogout = () => {
  store.logout();
};

onMounted(() => {
  document.title = 'Profile | JEB Incubator';
  // Vérifier le statut d'authentification au chargement
  store.checkAuthStatus();
});
</script>

<template>
  <div class="profile-page">
    <div class="container">
      <!-- Authenticated User Profile -->
      <div v-if="store.isAuthenticated && store.user" class="profile-page__authenticated">
        <div class="profile-page__card">
          <div class="profile-page__avatar">
            <div class="profile-page__avatar-circle">
              <span class="profile-page__avatar-initials">
                {{ store.user.account.name.split(' ').map(n => n[0]).join('').toUpperCase() }}
              </span>
            </div>
          </div>
          
          <div class="profile-page__info">
            <h1 class="profile-page__name">{{ store.user.account.name }}</h1>
            <p class="profile-page__email">{{ store.user.account.email }}</p>
            <p class="profile-page__role">
              {{ store.isAdmin ? 'Administrator' : 'Member' }}
            </p>
            
            <div class="profile-page__actions">
              <!-- Admin Dashboard Link -->
              <AppButton 
                v-if="store.isAdmin" 
                variant="primary"
                @click="$router.push('#')"
              >
                <a href="#" class="profile-page__admin-link">
                  Admin Dashboard
                </a>
              </AppButton>
              
              <AppButton variant="outline" @click="handleLogout">
                Logout
              </AppButton>
            </div>
          </div>
        </div>
        
        <!-- User Sections -->
        <section class="profile-page__section">
          <h2 class="profile-page__section-title">My Activity</h2>
          <div class="profile-page__activity">
            <div class="profile-page__activity-item">
              <h3>Companies Following</h3>
              <p class="profile-page__activity-count">0</p>
            </div>
            <div class="profile-page__activity-item">
              <h3>Events Registered</h3>
              <p class="profile-page__activity-count">0</p>
            </div>
            <div class="profile-page__activity-item">
              <h3>Projects Viewed</h3>
              <p class="profile-page__activity-count">0</p>
            </div>
          </div>
        </section>

        <section v-if="store.isFounder" class="profile-page__section">
          <h2 class="profile-page__section-title">My Companies</h2>
          <div class="profile-page__companies-placeholder">
            <p>Your companies will appear here.</p>
            <AppButton variant="primary" class="profile-page__add-company">
              Add Company
            </AppButton>
          </div>
        </section>
      </div>
      
      <!-- Login/Signup Form -->
      <div v-else class="profile-page__auth">
        <div class="profile-page__auth-card">
          <div class="profile-page__auth-header">
            <h1 class="profile-page__auth-title">
              {{ isLoginMode ? 'Welcome Back' : 'Join JEB Incubator' }}
            </h1>
            <p class="profile-page__auth-subtitle">
              {{ isLoginMode 
                ? 'Sign in to access your profile and dashboard' 
                : 'Create an account to get started' }}
            </p>
          </div>
          
          <form @submit.prevent="isLoginMode ? handleLogin() : handleSignup()" class="profile-page__form">
            <div v-if="!isLoginMode" class="profile-page__field">
              <label for="name" class="profile-page__label">Full Name</label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                class="profile-page__input"
                required
                :disabled="store.loading.auth"
              >
            </div>
            
            <div class="profile-page__field">
              <label for="email" class="profile-page__label">Email</label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                class="profile-page__input"
                required
                :disabled="store.loading.auth"
              >
            </div>
            
            <div class="profile-page__field">
              <label for="password" class="profile-page__label">Password</label>
              <input
                id="password"
                v-model="formData.password"
                type="password"
                class="profile-page__input"
                required
                :disabled="store.loading.auth"
              >
            </div>
            
            <div v-if="store.errors.auth" class="profile-page__error">
              {{ store.errors.auth }}
            </div>
            
            <AppButton 
              type="submit" 
              variant="primary" 
              :disabled="store.loading.auth"
              class="profile-page__submit"
            >
              {{ store.loading.auth 
                ? 'Please wait...' 
                : (isLoginMode ? 'Sign In' : 'Create Account') }}
            </AppButton>
          </form>
          
          <div class="profile-page__auth-footer">
            <p class="profile-page__auth-switch">
              {{ isLoginMode ? "Don't have an account?" : "Already have an account?" }}
              <button 
                type="button" 
                @click="toggleMode" 
                class="profile-page__auth-link"
                :disabled="store.loading.auth"
              >
                {{ isLoginMode ? 'Sign up' : 'Sign in' }}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  padding: var(--space-4) 0;
}

/* Authenticated User Styles */
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

.profile-page__email {
  font-size: var(--fs-md);
  color: var(--color-text-medium);
  margin-bottom: var(--space-2);
}

.profile-page__role {
  font-size: var(--fs-lg);
  color: var(--color-primary-400);
  margin-bottom: var(--space-6);
}

.profile-page__actions {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.profile-page__admin-link {
  color: inherit;
  text-decoration: none;
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

.profile-page__activity {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.profile-page__activity-item {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  text-align: center;
  box-shadow: var(--shadow-1);
}

.profile-page__activity-item h3 {
  font-size: var(--fs-sm);
  color: var(--color-text-medium);
  margin-bottom: var(--space-2);
  font-weight: 500;
}

.profile-page__activity-count {
  font-size: var(--fs-2xl);
  font-weight: 600;
  color: var(--color-primary-400);
}

.profile-page__companies-placeholder {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  text-align: center;
  color: var(--color-text-muted);
  border: 2px dashed var(--color-border);
}

.profile-page__add-company {
  margin-top: var(--space-4);
}

/* Authentication Form Styles */
.profile-page__auth {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.profile-page__auth-card {
  background: var(--gradient-surface);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-2);
  width: 100%;
  max-width: 400px;
}

.profile-page__auth-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.profile-page__auth-title {
  font-size: var(--fs-2xl);
  font-weight: 600;
  margin-bottom: var(--space-3);
  color: var(--color-text-high);
}

.profile-page__auth-subtitle {
  font-size: var(--fs-md);
  color: var(--color-text-medium);
  line-height: var(--lh-base);
}

.profile-page__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.profile-page__field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.profile-page__label {
  font-size: var(--fs-sm);
  font-weight: 500;
  color: var(--color-text-high);
}

.profile-page__input {
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg);
  color: var(--color-text-high);
  font-size: var(--fs-md);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.profile-page__input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: var(--focus-ring);
}

.profile-page__input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.profile-page__error {
  background: var(--color-danger-500/10);
  color: var(--color-danger);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--fs-sm);
  text-align: center;
}

.profile-page__submit {
  width: 100%;
  padding: var(--space-4);
}

.profile-page__auth-footer {
  margin-top: var(--space-6);
  text-align: center;
}

.profile-page__auth-switch {
  color: var(--color-text-medium);
  font-size: var(--fs-sm);
}

.profile-page__auth-link {
  background: none;
  border: none;
  color: var(--color-primary-400);
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  font-size: inherit;
  padding: 0;
  margin-left: var(--space-1);
}

.profile-page__auth-link:hover:not(:disabled) {
  color: var(--color-primary-300);
}

.profile-page__auth-link:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (min-width: 640px) {
  .profile-page {
    padding: var(--space-6) 0;
  }
  
  .profile-page__card {
    padding: var(--space-8);
  }
  
  .profile-page__auth-card {
    max-width: 450px;
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
  
  .profile-page__actions {
    justify-content: flex-start;
  }
}
</style>