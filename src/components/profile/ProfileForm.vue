<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { updateProfile } from 'firebase/auth'
import { auth } from '@/services/firebase'
import { showToast } from '@/utils/sweetalert'
import { IconUser, IconCamera, IconCheck } from '@tabler/icons-vue'
import { localStore } from '@/services/storage.service'

const authStore = useAuthStore()

// Estado del formulario de perfil
const displayName = ref(authStore.user?.displayName || '')
const photoPreview = ref(localStore.getItem('moniup_avatar', ''))

const profileLoading = ref(false)

const showSuccess = (title) => showToast('success', title)
const showError = (title) => showToast('error', title)

const userInitials = computed(() => {
  if (authStore.user?.displayName) {
    return authStore.user.displayName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  return authStore.userEmail?.[0]?.toUpperCase() || '?'
})

const hasProfileChanges = computed(() => {
  return displayName.value !== (authStore.user?.displayName || '')
})

const handleImageInput = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Basic type validation: must be an image, and absolutely reject SVG to prevent XSS
    if (!file.type.startsWith('image/') || file.type.includes('svg')) {
      showError('Formato no válido. Sube solo imágenes (JPG, PNG).')
      return
    }

    // Size validation
    if (file.size > 500 * 1024) {
      showError('La imagen es muy grande. Máximo 500KB.')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target.result
      localStore.setItem('moniup_avatar', e.target.result)
      authStore.userAvatar = e.target.result
      showSuccess('¡Foto de perfil actualizada!')
    }
    reader.readAsDataURL(file)
  }
}

const saveProfile = async () => {
  profileLoading.value = true
  try {
    await updateProfile(auth.currentUser, { displayName: displayName.value })
    authStore.user = { ...auth.currentUser }
    showSuccess('¡Perfil actualizado correctamente!')
  } catch (err) {
    showError(err.message)
  } finally {
    profileLoading.value = false
  }
}
</script>

<template>
  <div class="card bg-base-100 shadow-sm border border-base-300">
    <div class="card-body gap-6">
      <h3 class="card-title text-lg">
        <IconUser class="w-5 h-5 text-primary" />
        Información Personal
      </h3>

      <!-- Avatar -->
      <div class="flex items-center gap-6">
        <div class="relative group">
          <div class="avatar">
            <div
              class="w-20 h-20 rounded-full bg-neutral text-neutral-content flex items-center justify-center text-2xl font-bold ring ring-base-300 ring-offset-base-100 ring-offset-2 overflow-hidden"
            >
              <img
                v-if="photoPreview"
                :src="photoPreview"
                :alt="displayName"
                class="w-full h-full object-cover"
              />
              <span v-else>{{ userInitials }}</span>
            </div>
          </div>
          <label
            class="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <IconCamera class="w-6 h-6 text-white" />
            <input type="file" accept="image/*" class="hidden" @change="handleImageInput" />
          </label>
        </div>
        <div>
          <p class="font-semibold">{{ authStore.userName || 'Sin nombre' }}</p>
          <p class="text-sm text-base-content/50">{{ authStore.userEmail }}</p>
          <p class="text-xs text-base-content/40 mt-1">
            Haz click en tu avatar para cambiar la foto
          </p>
        </div>
      </div>

      <!-- Nombre -->
      <div class="form-control">
        <label class="label"><span class="label-text font-semibold">Nombre</span></label>
        <label class="input input-bordered flex items-center gap-3 focus-within:input-primary">
          <IconUser class="w-4 h-4 text-base-content/40 shrink-0" />
          <input
            v-model="displayName"
            type="text"
            placeholder="Tu nombre"
            class="grow"
            maxlength="50"
          />
        </label>
      </div>

      <!-- Email (solo lectura) -->
      <div class="form-control">
        <label class="label"
          ><span class="label-text font-semibold">Correo Electrónico</span></label
        >
        <input
          type="email"
          :value="authStore.userEmail"
          class="input input-bordered flex items-center gap-3 opacity-60"
          disabled
        />
        <label class="label"
          ><span class="label-text-alt text-base-content/40"
            >El correo no se puede cambiar</span
          ></label
        >
      </div>

      <!-- Guardar Perfil -->
      <div class="card-actions justify-end">
        <button
          class="btn btn-primary"
          :disabled="profileLoading || !hasProfileChanges"
          @click="saveProfile"
        >
          <span v-if="profileLoading" class="loading loading-spinner loading-sm"></span>
          <IconCheck v-else class="w-4 h-4" />
          Guardar Cambios
        </button>
      </div>
    </div>
  </div>
</template>
