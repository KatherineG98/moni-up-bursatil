<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { IconChartBarPopular, IconMail, IconLock } from '@tabler/icons-vue'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')

// Manejo del inicio de sesión y redirección al éxito
const handleLogin = async () => {
  const result = await authStore.login(email.value, password.value)
  if (result.success) {
    router.push({ name: 'overview' })
  }
}
</script>

<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
    <div class="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300">
      <div class="card-body gap-6">
        <!-- Encabezado -->
        <div class="text-center space-y-3">
          <div
            class="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto shadow-lg shadow-primary/30"
          >
            <IconChartBarPopular class="w-7 h-7 text-primary-content" />
          </div>
          <div>
            <h1 class="text-2xl font-bold">Bienvenido de nuevo</h1>
            <p class="text-base-content/60 text-sm">Ingresa a tu cuenta bursátil</p>
          </div>
        </div>

        <!-- Alerta de Error -->
        <div v-if="authStore.error" class="alert alert-error text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span v-sanitize="authStore.error"></span>
        </div>

        <!-- Formulario Principal -->
        <form class="space-y-4" @submit.prevent="handleLogin">
          <!-- Email -->
          <div class="form-control w-full">
            <label class="label pt-0">
              <span class="label-text font-semibold">Correo Electrónico</span>
            </label>
            <label class="input input-bordered flex items-center gap-3 w-full">
              <IconMail class="w-4 h-4 opacity-50 shrink-0" />
              <input
                v-model="email"
                type="email"
                placeholder="email@ejemplo.com"
                class="grow"
                required
                maxlength="100"
              />
            </label>
          </div>

          <!-- Contraseña -->
          <div class="form-control w-full">
            <label class="label pt-0">
              <span class="label-text font-semibold">Contraseña</span>
            </label>
            <label class="input input-bordered flex items-center gap-3 w-full">
              <IconLock class="w-4 h-4 opacity-50 shrink-0" />
              <input
                v-model="password"
                type="password"
                placeholder="••••••••"
                class="grow"
                required
                maxlength="128"
              />
            </label>
            <div class="text-right mt-1.5">
              <router-link
                :to="{ name: 'forgot-password' }"
                class="text-xs link link-hover text-base-content/50"
                >¿Olvidaste tu contraseña?</router-link
              >
            </div>
          </div>

          <!-- Botón de Envío -->
          <button
            type="submit"
            class="btn btn-primary btn-block text-base mt-2"
            :disabled="authStore.loading"
          >
            <span v-if="authStore.loading" class="loading loading-spinner loading-sm"></span>
            {{ authStore.loading ? 'Accediendo...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <div class="divider text-base-content/30 text-xs">O continúa con</div>

        <!-- Enlace a Registro -->
        <p class="text-center text-base-content/60 text-sm">
          ¿Aún no tienes cuenta?
          <router-link :to="{ name: 'register' }" class="link link-primary font-bold"
            >Regístrate</router-link
          >
        </p>
      </div>
    </div>
  </div>
</template>
