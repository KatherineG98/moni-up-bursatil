/**
 * Punto de entrada principal de la aplicación.
 * Inicializa Vue, Pinia, Vue Router y aplica configuraciones globales
 * como la directiva de sanitización DOMPurify.
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import './assets/css/style.css'

// Importar DOMPurify para sanitización
import DOMPurify from 'dompurify'

// Importar la configuración de Firebase
import './services/firebase'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Directiva personalizada 'v-sanitize' para mitigar vulnerabilidades XSS (Cross-Site Scripting).
// Utiliza DOMPurify para limpiar el contenido HTML inyectado en el DOM tanto en el montaje como en la actualización.
app.directive('sanitize', {
  mounted(el, binding) {
    if (binding.value !== undefined && binding.value !== null) {
      el.innerHTML = DOMPurify.sanitize(String(binding.value))
    }
  },
  updated(el, binding) {
    if (binding.value !== undefined && binding.value !== null) {
      el.innerHTML = DOMPurify.sanitize(String(binding.value))
    }
  },
})

// Exposición global del método sanitizador para su uso programático en componentes o stores.
app.config.globalProperties.$sanitize = (text) => {
  return DOMPurify.sanitize(text)
}

/**
 * Sincronización de montaje con el estado de autenticación.
 * La aplicación pospone el montaje inicial (`app.mount`) hasta que la promesa
 * `initAuthListener` de Firebase resuelva el estado de la sesión, previniendo
 * parpadeos de interfaz (FOUC) o enrutamientos prematuros.
 */
const authStore = useAuthStore(pinia)
authStore.initAuthListener().then(() => {
  app.mount('#app')
})
