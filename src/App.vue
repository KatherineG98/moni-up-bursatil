<script setup>
// Importaciones de Vue Router y estado global
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCryptoStore } from '@/stores/crypto'
import { useMarketStore } from '@/stores/market'
import { usePortfolioStore } from '@/stores/portfolio'
import { IconChartBarPopular, IconSun, IconMoon } from '@tabler/icons-vue'
import { ref, onMounted } from 'vue'

// Inicialización de constantes y estado
const authStore = useAuthStore()
const route = useRoute()
const isDark = ref(false)

// Lógica de cambio de tema y persistencia
const toggleTheme = () => {
  isDark.value = !isDark.value
  const newTheme = isDark.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)
}

// Sincronización del tema al montar el componente
onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  isDark.value = savedTheme === 'dark'
  document.documentElement.setAttribute('data-theme', savedTheme)

  // Inicialización de stores con caché
  useCryptoStore().init()
  useMarketStore().init()
  usePortfolioStore().init()
})
</script>

<template>
  <div class="min-h-screen bg-base-100 font-sans">
    <!-- Navegación -->
    <!-- El Header es visible solo en páginas públicas y desaparece en el Dashboard -->
    <header
      v-if="!route.path.startsWith('/dashboard')"
      class="sticky top-0 z-50 bg-base-100/95 backdrop-blur-md border-b border-base-200"
    >
      <nav class="navbar max-w-[1200px] mx-auto px-4 min-h-16">
        <!-- Parte Izquierda: Logo y Nombre de Aplicación -->
        <div class="navbar-start">
          <router-link to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div
              class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20"
            >
              <IconChartBarPopular class="w-6 h-6 text-primary-content" />
            </div>
            <span
              class="text-xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary hidden sm:block"
              >MoniUp</span
            >
          </router-link>
        </div>

        <!-- Parte Central: Menú de navegación principal -->
        <div class="navbar-center hidden md:flex">
          <ul class="menu menu-horizontal px-1 gap-2 font-semibold">
            <li><router-link to="/">Inicio</router-link></li>
            <li><router-link to="/#billetera-virtual">Billetera Virtual</router-link></li>
          </ul>
        </div>

        <!-- Parte Derecha: Acciones de Usuario y Autenticación -->
        <div class="navbar-end gap-2">
          <div v-if="!authStore.isAuthenticated" class="flex gap-2">
            <router-link
              :to="{ name: 'login' }"
              class="btn btn-primary btn-sm px-6 rounded-lg font-bold"
            >
              Iniciar Sesión
            </router-link>
          </div>
          <div v-else class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-circle avatar online">
              <div
                class="w-10 rounded-full bg-neutral text-neutral-content flex items-center justify-center shadow-inner"
              >
                <span class="text-xs font-bold">{{
                  authStore.user?.email?.[0]?.toUpperCase()
                }}</span>
              </div>
            </label>
            <ul
              tabindex="0"
              class="mt-3 z-1 p-2 shadow-2xl menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-200"
            >
              <li class="px-4 py-2 opacity-60 text-xs font-medium">{{ authStore.user?.email }}</li>
              <div class="divider my-0"></div>
              <li>
                <router-link to="/dashboard" class="justify-between font-semibold"
                  >Dashboard</router-link
                >
              </li>
              <li>
                <button class="text-error font-bold" @click="authStore.logout()">
                  Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>

    <!-- Área de Contenido Principal -->
    <main>
      <RouterView v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <!-- Pie de Página simplificado -->
    <footer
      v-if="!route.path.startsWith('/dashboard')"
      class="footer footer-center p-10 bg-base-200 text-base-content rounded mt-auto"
    >
      <aside>
        <p class="font-bold">MoniUp <br />Simulador Bursátil</p>
        <p>Proyecto educativo realizado por Katherine González - 2026</p>
      </aside>
    </footer>

    <!-- Selector de Tema Flotante (Fijo en la esquina inferior izquierda) -->
    <div
      v-if="route.name === 'home' || route.name === 'login' || route.name === 'register'"
      class="fixed bottom-6 left-6 z-60"
    >
      <label
        class="swap swap-rotate btn btn-circle btn-lg shadow-2xl bg-base-100 border-base-300 hover:bg-base-200"
        :title="isDark ? 'Modo Claro' : 'Modo Oscuro'"
      >
        <input type="checkbox" :checked="isDark" @change="toggleTheme" />
        <IconSun class="swap-off w-8 h-8 text-primary" />
        <IconMoon class="swap-on w-8 h-8 text-primary" />
      </label>
    </div>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Global improvements for Tailwind v4 + DaisyUI */
:root {
  scroll-behavior: smooth;
}
</style>
