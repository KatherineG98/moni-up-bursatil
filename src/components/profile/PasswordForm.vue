<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { auth } from '@/services/firebase'
import { showToast } from '@/utils/sweetalert'
import { IconLock } from '@tabler/icons-vue'

const authStore = useAuthStore()

const currentPassword = ref('')
const newPassword = ref('')
const confirmNewPassword = ref('')
const passwordLoading = ref(false)

const showSuccess = (title) => showToast('success', title)
const showError = (title) => showToast('error', title)

const changePassword = async () => {
  passwordLoading.value = true
  try {
    if (newPassword.value.length < 8) {
      throw new Error('La nueva contraseña debe tener al menos 8 caracteres.')
    }
    if (newPassword.value !== confirmNewPassword.value) {
      throw new Error('Las contraseñas nuevas no coinciden.')
    }

    const credential = EmailAuthProvider.credential(authStore.userEmail, currentPassword.value)
    await reauthenticateWithCredential(auth.currentUser, credential)
    await updatePassword(auth.currentUser, newPassword.value)

    showSuccess('¡Contraseña actualizada correctamente!')
    currentPassword.value = ''
    newPassword.value = ''
    confirmNewPassword.value = ''
  } catch (err) {
    if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
      showError('La contraseña actual es incorrecta.')
    } else {
      showError(err.message)
    }
  } finally {
    passwordLoading.value = false
  }
}
</script>

<template>
  <div class="card bg-base-100 shadow-sm border border-base-300">
    <div class="card-body gap-6">
      <h3 class="card-title text-lg">
        <IconLock class="w-5 h-5 text-warning" />
        Cambiar Contraseña
      </h3>

      <div class="form-control">
        <label class="label"><span class="label-text font-semibold">Contraseña Actual</span></label>
        <label class="input input-bordered flex items-center gap-3 focus-within:input-warning">
          <IconLock class="w-4 h-4 text-base-content/40 shrink-0" />
          <input
            v-model="currentPassword"
            type="password"
            placeholder="••••••••"
            class="grow"
            maxlength="128"
          />
        </label>
      </div>

      <div class="form-control">
        <label class="label"><span class="label-text font-semibold">Nueva Contraseña</span></label>
        <label class="input input-bordered flex items-center gap-3 focus-within:input-warning">
          <IconLock class="w-4 h-4 text-base-content/40 shrink-0" />
          <input
            v-model="newPassword"
            type="password"
            placeholder="Mínimo 8 caracteres"
            class="grow"
            minlength="8"
            maxlength="128"
          />
        </label>
      </div>

      <div class="form-control">
        <label class="label"
          ><span class="label-text font-semibold">Confirmar Nueva Contraseña</span></label
        >
        <label class="input input-bordered flex items-center gap-3 focus-within:input-warning">
          <IconLock class="w-4 h-4 text-base-content/40 shrink-0" />
          <input
            v-model="confirmNewPassword"
            type="password"
            placeholder="Repite la nueva contraseña"
            class="grow"
            maxlength="128"
          />
        </label>
        <label
          v-if="newPassword && confirmNewPassword && newPassword !== confirmNewPassword"
          class="label"
        >
          <span class="label-text-alt text-error font-medium">Las contraseñas no coinciden</span>
        </label>
      </div>

      <div class="card-actions justify-end">
        <button
          class="btn btn-warning"
          :disabled="
            passwordLoading ||
            !currentPassword ||
            !newPassword ||
            newPassword !== confirmNewPassword
          "
          @click="changePassword"
        >
          <span v-if="passwordLoading" class="loading loading-spinner loading-sm"></span>
          <IconLock v-else class="w-4 h-4" />
          Cambiar Contraseña
        </button>
      </div>
    </div>
  </div>
</template>
