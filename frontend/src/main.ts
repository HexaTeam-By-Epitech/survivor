import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from '@/app/router';
import App from './App.vue';

// Import global styles
import '@/styles/tokens.css';
import '@/styles/globals.css';
import '@/styles/mixins.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');