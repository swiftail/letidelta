/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'
import vuetify from './plugins/vuetify'
import {createPinia} from "pinia";

const app = createApp(App)
const pinia = createPinia()

registerPlugins(app)

app
  .use(pinia)
  .use(vuetify)
  .mount('#app')
