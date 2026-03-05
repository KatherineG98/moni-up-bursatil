// Importaciones de Vue Router y estado de autenticación
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

/**
 * Configuración central del enrutador de la aplicación.
 * Define el árbol de rutas, el historial de navegación (WebHistory)
 * y los metadatos necesarios para el control de acceso en los Guards.
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Bloque de rutas públicas (requieren `guestOnly: true`)
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomePage.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginPage.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterPage.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/NotFound.vue'),
      meta: { guestOnly: true },
    },
    // Bloque de rutas protegidas bajo el layout común de Dashboard (requieren `requiresAuth: true`)
    {
      path: '/dashboard',
      component: () => import('../layouts/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: { name: 'overview' },
        },
        {
          path: 'overview',
          name: 'overview',
          component: () => import('../views/dashboard/Overview.vue'),
          meta: { title: 'Resumen' },
        },
        {
          path: 'portfolio',
          name: 'portfolio',
          component: () => import('../views/dashboard/PortfolioPage.vue'),
          meta: { title: 'Mi Portafolio' },
        },
        {
          path: 'crypto',
          name: 'crypto',
          component: () => import('../views/dashboard/CryptoMarketPage.vue'),
          meta: { title: 'Mercado Cripto' },
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('../views/dashboard/UserConfiguration.vue'),
          meta: { title: 'Configuración' },
        },
      ],
    },
    // Página 404 para rutas no encontradas
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue'),
    },
  ],
  /**
   * Control manual del comportamiento de desplazamiento (scroll).
   * Administra el anclaje a elementos específicos, la retención de
   * posición al navegar por el historial, y el desplazamiento a tope (`top: 0`)
   * para nuevas rutas.
   */
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

/**
 * Middleware de navegación global (Navigation Guard).
 * Intercepta de manera asíncrona todas las transiciones de ruta para
 * validar la autorización de acceso utilizando el Store de autenticación.
 */
router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // Esperar a que Firebase inicialice el estado del usuario
  if (!authStore.authReady) {
    await authStore.initAuthListener()
  }

  const isAuthenticated = authStore.isAuthenticated

  // Redirección a Login si no está autenticado
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'login' }
  }

  // Redirección al Dashboard si ya tiene sesión activa
  if (to.meta.guestOnly && isAuthenticated) {
    return { name: 'overview' }
  }
})

export default router
