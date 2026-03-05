<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useNewsStore } from '@/stores/news'
import { useAuthStore } from '@/stores/auth'
import { IconSend, IconTrash } from '@tabler/icons-vue'
import { showToast, showConfirm } from '@/utils/sweetalert'

const props = defineProps({
  newsId: {
    type: [String, Number],
    required: true
  }
})

const newsStore = useNewsStore()
const authStore = useAuthStore()

const newComment = ref('')
const isSubmitting = ref(false)

onMounted(() => {
  newsStore.subscribeToComments(props.newsId)
})

onUnmounted(() => {
  newsStore.unsubscribeFromComments(props.newsId)
})

const lastCommentTimeKey = 'moniup_last_comment_time'
const lastCommentTime = ref(parseInt(localStorage.getItem(lastCommentTimeKey) || '0'))

const submitComment = async () => {
  if (!newComment.value.trim() || !authStore.isAuthenticated) return
  if (newComment.value.length > 300) {
    showToast('error', 'El comentario excede los 300 caracteres permitidos.')
    return
  }

  const now = Date.now()
  if (now - lastCommentTime.value < 5 * 60 * 1000) {
    const minutesLeft = Math.ceil((5 * 60 * 1000 - (now - lastCommentTime.value)) / 60000)
    showToast('warning', `Debes esperar ${minutesLeft} minuto(s) para comentar de nuevo.`)
    return
  }

  isSubmitting.value = true
  try {
    const name = authStore.user?.displayName || authStore.userEmail.split('@')[0] || 'Usuario'
    await newsStore.addComment(props.newsId, newComment.value, name)
    newComment.value = ''

    // Registro de timestamp para validación de límite de tasa en envíos futuros
    lastCommentTime.value = Date.now()
    localStorage.setItem(lastCommentTimeKey, lastCommentTime.value.toString())

    showToast('success', 'Comentario publicado')
  } catch (err) {
    console.error(err)
    showToast('error', 'Error publicando comentario. (Asegúrate de no usar malas palabras o un texto muy largo)')
  } finally {
    isSubmitting.value = false
  }
}

const deleteComment = async (commentId) => {
  const result = await showConfirm(
    '¿Eliminar comentario?',
    'Esta acción eliminará tu comentario permanentemente.',
    'Sí, eliminar',
    'warning'
  )

  if (result.isConfirmed) {
    try {
      await newsStore.deleteComment(props.newsId, commentId)
      showToast('success', 'Comentario eliminado')
    } catch (err) {
      console.error(err)
      showToast('error', 'Error eliminando comentario')
    }
  }
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'Justo ahora'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
  }).format(date)
}
</script>

<template>
  <div>
    <h3 class="text-xl font-bold mb-6">Comentarios</h3>

    <!-- Formulario de Entrada de Comentarios -->
    <div v-if="authStore.isAuthenticated" class="mb-8 flex gap-4 items-start">
      <div v-if="authStore.userAvatar" class="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-neutral text-neutral-content flex items-center justify-center">
        <img :src="authStore.userAvatar" alt="Avatar" class="w-full h-full object-cover" />
      </div>
      <div v-else class="w-10 h-10 rounded-full bg-neutral text-neutral-content flex items-center justify-center shrink-0 uppercase font-bold">
        {{ authStore.userName.charAt(0) }}
      </div>
      <div class="flex-1 flex flex-col gap-2">
        <textarea
          v-model="newComment"
          class="textarea textarea-bordered w-full h-24 focus:textarea-primary"
          placeholder="Escribe tu opinión sobre esta noticia..."
          maxlength="300"
        ></textarea>
        <div class="flex justify-between items-center text-xs text-base-content/50">
          <span>{{ newComment.length }}/300</span>
          <button
            class="btn btn-primary btn-sm"
            :disabled="!newComment.trim() || isSubmitting"
            @click="submitComment"
          >
            <span v-if="isSubmitting" class="loading loading-spinner loading-xs"></span>
            <IconSend v-else class="w-4 h-4" />
            Comentar
          </button>
        </div>
      </div>
    </div>
    <div v-else class="alert alert-info mb-8">
      <span>Debes iniciar sesión para comentar.</span>
    </div>

    <!-- Colección de Comentarios Renderizados -->
    <div class="space-y-6">
      <div v-if="!newsStore.newsComments[newsId] || newsStore.newsComments[newsId].length === 0" class="text-center text-base-content/50 py-8">
        No hay comentarios aún. ¡Sé el primero en opinar!
      </div>

      <div
        v-for="comment in newsStore.newsComments[newsId]"
        :key="comment.id"
        class="flex gap-4"
      >
        <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 uppercase font-bold text-sm">
          {{ comment.userName.charAt(0) }}
        </div>
        <div class="flex-1 bg-base-100 p-4 rounded-xl shadow-sm border border-base-200">
          <div class="flex justify-between items-start mb-2">
            <div>
              <span class="font-bold text-sm">{{ comment.userName }}</span>
              <span class="text-xs text-base-content/50 ml-2">{{ formatDate(comment.createdAt) }}</span>
            </div>

            <button
              v-if="authStore.user?.uid === comment.userId"
              class="btn btn-ghost btn-xs btn-square text-error"
              title="Eliminar"
              @click="deleteComment(comment.id)"
            >
              <IconTrash class="w-4 h-4" />
            </button>
          </div>
          <p class="text-sm whitespace-pre-wrap">{{ comment.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
