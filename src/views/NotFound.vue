<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
import { IconError404, IconLockQuestion, IconArrowLeft } from '@tabler/icons-vue'

const authStore = useAuthStore()
const route = useRoute()

const isForgotPassword = computed(() => route.path.includes('forgot-password'))

const title = computed(() =>
  isForgotPassword.value ? '¿Olvidaste tu contraseña?' : 'Página no encontrada'
)
const description = computed(() =>
  isForgotPassword.value
    ? 'No es posible implementar esta funcionalidad por ahora. Vuelve a intentar iniciar sesión o regístrate con otro correo.'
    : 'Lo sentimos, la página que estás buscando no existe o ha sido movida.'
)

const targetRoute = computed(() =>
  authStore.isAuthenticated ? { name: 'overview' } : { name: 'home' }
)
const buttonText = computed(() =>
  authStore.isAuthenticated ? 'Ir al Dashboard' : 'Volver al Inicio'
)
</script>

<template>
  <div class="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
    <div class="bg-base-100 p-12 rounded-3xl shadow-xl border border-base-300 max-w-md w-full">
      <div class="flex justify-center mb-6">
        <div class="p-4 bg-primary/10 text-primary rounded-2xl">
          <IconLockQuestion v-if="isForgotPassword" class="w-16 h-16" />
          <IconError404 v-else class="w-16 h-16" />
        </div>
      </div>

      <h1 class="text-3xl font-black mb-4">{{ title }}</h1>
      <p class="text-base-content/60 mb-8 leading-relaxed">
        {{ description }}
      </p>

      <router-link :to="targetRoute" class="btn btn-primary btn-block gap-2">
        <IconArrowLeft class="w-4 h-4" />
        {{ buttonText }}
      </router-link>
    </div>
  </div>
</template>
