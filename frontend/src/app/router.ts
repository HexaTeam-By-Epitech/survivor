import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import DiscoverPage from '@/pages/DiscoverPage.vue';
import EventsPage from '@/pages/EventsPage.vue';
import ProfilePage from '@/pages/ProfilePage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: {
        title: 'Home | JEB Incubator'
      }
    },
    {
      path: '/discover',
      name: 'discover',
      component: DiscoverPage,
      meta: {
        title: 'Discover | JEB Incubator'
      }
    },
    {
      path: '/events',
      name: 'events',
      component: EventsPage,
      meta: {
        title: 'Events | JEB Incubator'
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage,
      meta: {
        title: 'Profile | JEB Incubator'
      }
    }
  ]
});

router.beforeEach((to) => {
  document.title = to.meta?.title as string || 'JEB Incubator';
});

export default router;