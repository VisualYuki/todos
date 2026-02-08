import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import App from './App.vue'
import router from './core/router'
import './core/styles/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.use(router)

app.mount('#app')
