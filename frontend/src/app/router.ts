import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import DiscoverPage from '@/pages/DiscoverPage.vue';
import SearchPage from '@/pages/SearchPage.vue';
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
        title: 'Discover Companies | JEB Incubator'
      }
    },
    {
      path: '/search',
      name: 'search',
      component: SearchPage,
      meta: {
        title: 'Search | JEB Incubator'
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