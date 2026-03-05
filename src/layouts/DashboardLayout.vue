<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import {
  IconLayoutDashboard,
  IconWallet,
  IconCurrencyBitcoin,
  IconLogout,
  IconMenu2,
  IconX,
  IconSun,
  IconMoon,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconChartBarPopular,
  IconUserCircle,
} from '@tabler/icons-vue'
import { ref, onMounted } from 'vue'

const authStore = useAuthStore()
const router = useRouter()
const handleLogout = async () => {
  await authStore.logout()
  router.push({ name: 'home' })
}

const isMobileMenuOpen = ref(false)
const isCollapsed = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  const newTheme = isDark.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  isDark.value = savedTheme === 'dark'
  document.documentElement.setAttribute('data-theme', savedTheme)
})
</script>

<template>
  <div class="min-h-screen bg-base-200 flex">
    <!-- Superposición para versión móvil -->
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="toggleMobileMenu"
    ></div>

    <!-- Barra lateral -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 bg-base-100 border-r border-base-300 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static flex flex-col',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
        isCollapsed ? 'w-20' : 'w-72',
      ]"
    >
      <div
        class="flex items-center h-16 px-4 border-b border-base-300 shrink-0"
        :class="isCollapsed ? 'justify-center' : 'justify-between'"
      >
        <router-link
          :to="{ name: 'overview' }"
          class="flex items-center gap-3 text-xl font-black overflow-hidden whitespace-nowrap"
          :class="{ 'justify-center': isCollapsed }"
        >
          <div
            class="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-sm"
          >
            <IconChartBarPopular class="w-5 h-5 text-primary-content" />
          </div>
          <span
            v-if="!isCollapsed"
            class="bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary"
            >MoniUp</span
          >
        </router-link>
        <button
          class="lg:hidden btn btn-sm btn-ghost btn-square shrink-0"
          @click="toggleMobileMenu"
        >
          <IconX class="w-5 h-5" />
        </button>
      </div>

      <nav class="p-4 space-y-2 flex-1 overflow-y-auto overflow-x-hidden">
        <router-link
          :to="{ name: 'overview' }"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-base-content/80 hover:bg-base-200 hover:text-primary transition-colors font-medium whitespace-nowrap"
          active-class="bg-primary/10 text-primary font-bold shadow-sm"
          :class="{ 'justify-center px-0': isCollapsed }"
          :title="isCollapsed ? 'Resumen' : ''"
        >
          <IconLayoutDashboard class="w-5 h-5 shrink-0" />
          <span v-if="!isCollapsed">Resumen</span>
        </router-link>

        <router-link
          :to="{ name: 'portfolio' }"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-base-content/80 hover:bg-base-200 hover:text-primary transition-colors font-medium whitespace-nowrap"
          active-class="bg-primary/10 text-primary font-bold shadow-sm"
          :class="{ 'justify-center px-0': isCollapsed }"
          :title="isCollapsed ? 'Mi Portafolio' : ''"
        >
          <IconWallet class="w-5 h-5 shrink-0" />
          <span v-if="!isCollapsed">Mi Portafolio</span>
        </router-link>

        <router-link
          :to="{ name: 'crypto' }"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-base-content/80 hover:bg-base-200 hover:text-primary transition-colors font-medium whitespace-nowrap"
          active-class="bg-primary/10 text-primary font-bold shadow-sm"
          :class="{ 'justify-center px-0': isCollapsed }"
          :title="isCollapsed ? 'Mercado Cripto' : ''"
        >
          <IconCurrencyBitcoin class="w-5 h-5 shrink-0" />
          <span v-if="!isCollapsed">Mercado Cripto</span>
        </router-link>
      </nav>

      <!-- Interruptor de Tema en la parte inferior de la barra lateral -->
      <div
        class="mt-auto p-4 border-t border-base-300 bg-base-100 flex flex-col gap-4 shrink-0 transition-all"
      >
        <div class="flex items-center justify-between" :class="{ 'justify-center': isCollapsed }">
          <span
            v-if="!isCollapsed"
            class="text-sm font-semibold text-base-content/80 whitespace-nowrap"
          >
            Modo {{ isDark ? 'Oscuro' : 'Claro' }}
          </span>
          <label
            class="swap swap-rotate btn btn-sm btn-ghost btn-circle shrink-0"
            :title="isDark ? 'Modo Claro' : 'Modo Oscuro'"
          >
            <input type="checkbox" :checked="isDark" @change="toggleTheme" />
            <IconSun class="swap-off w-5 h-5 hover:text-warning transition-colors" />
            <IconMoon class="swap-on w-5 h-5 hover:text-primary transition-colors" />
          </label>
        </div>
      </div>
    </aside>

    <!-- Contenido Principal -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Barra de navegación superior -->
      <header
        class="h-16 bg-base-100 border-b border-base-300 flex items-center justify-between px-4 lg:px-8 z-30"
      >
        <div class="flex items-center gap-4">
          <!-- Botón de colapso para escritorio -->
          <button
            class="hidden lg:flex btn btn-ghost btn-square text-base-content/60 hover:text-primary"
            :title="isCollapsed ? 'Expandir Menú' : 'Colapsar Menú'"
            @click="toggleCollapse"
          >
            <IconLayoutSidebarLeftExpand v-if="isCollapsed" class="w-5 h-5" />
            <IconLayoutSidebarLeftCollapse v-else class="w-5 h-5" />
          </button>
          <!-- Botón de menú para móviles -->
          <button class="lg:hidden btn btn-ghost btn-square" @click="toggleMobileMenu">
            <IconMenu2 class="w-6 h-6" />
          </button>
        </div>

        <div class="flex items-center gap-4">
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar online">
              <div
                class="w-10 rounded-full bg-neutral text-neutral-content flex items-center justify-center overflow-hidden"
              >
                <img
                  v-if="authStore.userAvatar"
                  :src="authStore.userAvatar"
                  alt="Avatar"
                  class="w-full h-full object-cover"
                />
                <span v-else>{{ authStore.userEmail?.[0]?.toUpperCase() }}</span>
              </div>
            </div>
            <ul
              tabindex="0"
              class="mt-3 z-1 p-2 shadow-2xl menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-200"
            >
              <li>
                <router-link :to="{ name: 'settings' }" class="font-medium mb-3">
                  <IconUserCircle class="w-4 h-4" />
                  Configuración
                </router-link>
              </li>
              <li>
                <button class="text-error font-semibold" @click="handleLogout">
                  <IconLogout class="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <!-- Contenido de la Página -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-base-200 p-4 lg:p-8">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
