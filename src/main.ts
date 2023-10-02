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

// Types
import { tmdbSymbol } from '@/types/symbols'

import { TMDB } from 'tmdb-ts'

const app = createApp(App)

registerPlugins(app)

// Initialisation de l'API TMDB
const tmdb = new TMDB(import.meta.env.VITE_TMDB_ACCESS_TOKEN);
app.provide(tmdbSymbol, tmdb)

app.mount('#app')
