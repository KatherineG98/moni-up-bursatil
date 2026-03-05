<script setup>
// Gestión de registro y estado de autenticación
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { IconChartBarPopular, IconUser, IconMail, IconLock, IconLockCheck } from '@tabler/icons-vue'

const authStore = useAuthStore()
const router = useRouter()

// Referencias reactivas para el formulario
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const successMessage = ref('')

// Lógica de validación, registro y redirección diferida
const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    authStore.error = 'Las contraseñas no coinciden'
    return
  }

  // Validación de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    authStore.error = 'Por favor, ingresa un correo electrónico válido'
    return
  }

  const result = await authStore.register(email.value, password.value, name.value)

  if (result && result.success) {
    successMessage.value = '¡Registro exitoso! Preparando tu billetera...'
    window.setTimeout(() => {
      router.push({ name: 'overview' })
    }, 2000)
  }
}
</script>

<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
    <div class="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300">
      <div class="card-body gap-6">
        <!-- Encabezado del formulario de registro -->
        <div class="text-center space-y-3">
          <div
            class="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto shadow-lg shadow-secondary/30"
          >
            <IconChartBarPopular class="w-7 h-7 text-secondary-content" />
          </div>
          <div>
            <h1 class="text-2xl font-bold">Crea tu Cuenta</h1>
            <p class="text-base-content/60 text-sm">Únete a la nueva era del trading digital</p>
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

        <!-- Alerta de Éxito -->
        <div v-if="successMessage" class="alert alert-success text-sm">
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span v-sanitize="successMessage"></span>
        </div>

        <!-- Formulario Principal -->
        <form class="space-y-4" @submit.prevent="handleRegister">
          <!-- Nombre -->
          <div class="form-control w-full">
            <label class="label pt-0">
              <span class="label-text font-semibold">Nombre</span>
            </label>
            <label class="input input-bordered flex items-center gap-3 w-full">
              <IconUser class="w-4 h-4 opacity-50 shrink-0" />
              <input
                v-model="name"
                type="text"
                placeholder="Tu nombre"
                class="grow"
                required
                maxlength="50"
              />
            </label>
          </div>

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
                placeholder="tu@email.com"
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
                placeholder="Mínimo 8 caracteres"
                class="grow"
                required
                minlength="8"
                maxlength="128"
              />
            </label>
          </div>

          <!-- Confirmar Contraseña -->
          <div class="form-control w-full">
            <label class="label pt-0">
              <span class="label-text font-semibold">Confirmar Contraseña</span>
            </label>
            <label class="input input-bordered flex items-center gap-3 w-full">
              <IconLockCheck class="w-4 h-4 opacity-50 shrink-0" />
              <input
                v-model="confirmPassword"
                type="password"
                placeholder="Repite tu contraseña"
                class="grow"
                required
                maxlength="128"
              />
            </label>
            <p
              v-if="password !== confirmPassword && confirmPassword"
              class="text-error text-xs mt-1.5 ml-1 font-medium"
            >
              Las contraseñas no coinciden
            </p>
          </div>

          <!-- Botón de Envío -->
          <button
            type="submit"
            class="btn btn-secondary btn-block text-base mt-2"
            :disabled="authStore.loading || password !== confirmPassword"
          >
            <span v-if="authStore.loading" class="loading loading-spinner loading-sm"></span>
            {{ authStore.loading ? 'Registrando...' : 'Empezar ahora' }}
          </button>
        </form>

        <!-- Enlace a Inicio de Sesión -->
        <p class="text-center text-base-content/60 text-sm">
          ¿Ya eres miembro?
          <router-link :to="{ name: 'login' }" class="link link-secondary font-bold"
            >Inicia sesión</router-link
          >
        </p>
      </div>
    </div>
  </div>
</template>
