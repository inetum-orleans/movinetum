/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import '@/styles/style.scss'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      dark: {
        colors: {
          primary: '#FFC700',
          secondary: '#CD0B46',
        },
      },
    },
  },
  // Définit de propriétés par défaut sur certains composants
  defaults: {
    VBtn: {
      class: ['text-none']
    },
    VAppBar: {
      VBtn: {
        size: 'x-small',
        stacked: true,
        class: ['text-none', 'font-weight-regular']
      }
    }
  }
})
