<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { auth } from '@/services/firebase'
import { showAlert, showToast } from '@/utils/sweetalert'
import { IconTrash } from '@tabler/icons-vue'
import { localStore } from '@/services/storage.service'

const authStore = useAuthStore()
const router = useRouter()

const showError = (title) => showToast('error', title)

const handleDeleteAccount = async () => {
  const { value: password } = await showAlert({
    title: '¿Eliminar tu cuenta?',
    html: `
      <p class="text-sm mb-4" style="opacity:0.7">Esta acción es <strong>permanente</strong> y no se puede deshacer. Se eliminarán todos tus datos de autenticación.</p>
      <p class="text-sm mb-2 font-semibold">Confirma tu contraseña para continuar:</p>
    `,
    input: 'password',
    inputPlaceholder: 'Tu contraseña actual',
    inputAttributes: { autocapitalize: 'off' },
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar mi cuenta',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#ef4444',
    inputValidator: (value) => {
      if (!value) return '¡Debes ingresar tu contraseña!'
    },
  })

  if (password) {
    try {
      // Re-autenticar
      const credential = EmailAuthProvider.credential(authStore.userEmail, password)
      await reauthenticateWithCredential(auth.currentUser, credential)

      // Eliminar cuenta
      await deleteUser(auth.currentUser)

      // Limpiar datos locales mediante el servicio
      localStore.removeItem('moniup_avatar')
      localStore.removeItem('moniup_balance')
      localStore.removeItem('moniup_portfolio')
      localStore.removeItem('moniup_history')

      await showAlert({
        title: 'Cuenta eliminada',
        text: 'Tu cuenta ha sido eliminada correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      })

      authStore.user = null
      router.push({ name: 'home' })
    } catch (err) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        showError('Contraseña incorrecta. No se eliminó la cuenta.')
      } else {
        showError(err.message)
      }
    }
  }
}
</script>

<template>
  <div class="card bg-base-100 shadow-sm border border-error/30">
    <div class="card-body gap-4">
      <h3 class="card-title text-lg text-error">
        <IconTrash class="w-5 h-5" />
        Eliminar Cuenta
      </h3>
      <p class="text-sm text-base-content/60">
        Esta acción es permanente. Se eliminarán tus datos de autenticación y no podrás recuperar tu
        cuenta.
      </p>
      <div class="card-actions justify-end">
        <button class="btn btn-error btn-outline" @click="handleDeleteAccount">
          <IconTrash class="w-4 h-4" />
          Eliminar mi cuenta
        </button>
      </div>
    </div>
  </div>
</template>
