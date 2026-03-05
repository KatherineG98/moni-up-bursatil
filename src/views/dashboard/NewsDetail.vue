<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNewsStore } from '@/stores/news'
import CommentSection from '@/components/news/CommentSection.vue'
import { IconArrowLeft, IconExternalLink, IconCalendar, IconBuildingStore, IconArticle, IconLanguage, IconLanguageHiragana } from '@tabler/icons-vue'
import { translationApi } from '@/services/translationApi'
import { showToast } from '@/utils/sweetalert'

const route = useRoute()
const router = useRouter()
const newsStore = useNewsStore()

const newsId = computed(() => route.params.id)

// Resolución de noticia desde estado local
const newsItem = computed(() => {
  return newsStore.newsList.find(n => String(n.id) === String(newsId.value)) || null
})

const goBack = () => {
  router.push({ name: 'news' })
}

const formattedDate = computed(() => {
  if (!newsItem.value?.datetime) return ''
  const date = new Date(newsItem.value.datetime * 1000)
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
})

onMounted(() => {
  // Condición de hidratación de estado en montado de componente
  if (newsStore.newsList.length === 0) {
    newsStore.fetchNews()
  }
})

// Lógica de traducción de contenido
const isTranslating = ref(false)
const translatedHeadline = ref('')
const translatedSummary = ref('')
const hasTranslation = computed(() => translatedHeadline.value !== '')

const translateArticle = async () => {
  if (hasTranslation.value || !newsItem.value) return

  isTranslating.value = true
  try {
    // Traducción de titular (propiedad requerida)
    translatedHeadline.value = await translationApi.translateText(newsItem.value.headline)

    // Traducción de resumen (propiedad opcional)
    if (newsItem.value.summary) {
      translatedSummary.value = await translationApi.translateText(newsItem.value.summary)
    }
  } catch (error) {
    console.error("Fallo al traducir el artículo", error)
    showToast('error', 'No se pudo traducir el artículo. Por favor, intenta más tarde.')
  } finally {
    isTranslating.value = false
  }
}

const toggleTranslation = () => {
  if (hasTranslation.value) {
    // Limpieza de estado de traducción para retorno al idioma original
    translatedHeadline.value = ''
    translatedSummary.value = ''
  } else {
    translateArticle()
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto pb-12 h-full flex flex-col">
    <button class="btn btn-ghost btn-sm self-start mb-6 gap-2" @click="goBack">
      <IconArrowLeft class="w-4 h-4" />
      Volver a Noticias
    </button>

    <div v-if="newsStore.loading && !newsItem" class="flex-1 flex justify-center items-center">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <!-- Manejo de estado: Noticia inexistente o expirada de caché -->
    <div v-else-if="!newsItem" class="flex flex-col items-center justify-center py-20 text-center bg-base-100 rounded-2xl shadow-sm border border-base-300">
      <h2 class="text-2xl font-bold mb-2">Noticia no encontrada</h2>
      <p class="text-base-content/60 mb-6 max-w-md">Es posible que la noticia haya expirado del feed principal o el enlace sea incorrecto.</p>
      <div v-if="route.query.url" class="mb-6">
        <a :href="route.query.url" target="_blank" rel="noopener noreferrer" class="btn btn-primary gap-2">
          Ver artículo original
          <IconExternalLink class="w-4 h-4" />
        </a>
      </div>
      <button class="btn btn-outline" @click="goBack">Regresar al listado</button>
    </div>

    <div v-else class="flex-1 flex flex-col">
      <!-- Encabezado -->
      <div class="mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div class="flex flex-wrap gap-2">
            <span v-if="newsItem.customType === 'company'" class="badge badge-info gap-1"><IconBuildingStore class="w-3 h-3"/> Empresa</span>
            <span v-else class="badge badge-secondary">Mercado</span>
            <span class="badge badge-outline text-base-content/60 uppercase">{{ newsItem.source }}</span>
          </div>

          <button
            class="btn btn-sm"
            :class="hasTranslation ? 'btn-neutral' : 'btn-outline'"
            :disabled="isTranslating"
            @click="toggleTranslation"
          >
            <span v-if="isTranslating" class="loading loading-spinner loading-xs"></span>
            <IconLanguage v-else-if="!hasTranslation" class="w-4 h-4" />
            <IconLanguageHiragana v-else class="w-4 h-4" />
            {{ hasTranslation ? 'Ver original (Inglés)' : 'Traducir al Español' }}
          </button>
        </div>

        <h1 class="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4 transition-all duration-300">
          {{ hasTranslation ? translatedHeadline : newsItem.headline }}
        </h1>

        <div class="flex items-center text-sm text-base-content/50 gap-2 mb-6">
          <IconCalendar class="w-4 h-4" />
          <span class="capitalize">{{ formattedDate }}</span>
        </div>
      </div>

      <!-- Imagen -->
      <figure class="w-full aspect-video rounded-2xl overflow-hidden shadow-md mb-8 bg-neutral">
        <img :src="newsItem.image || 'https://placehold.co/1200x600/1d232a/a6adbb?text=Noticias+Financieras'" :alt="newsItem.headline" class="w-full h-full object-cover" />
      </figure>

      <!-- Contenido de Resumen -->
      <div class="prose prose-base text-base-content md:prose-lg max-w-none mb-8 bg-base-100 p-6 md:p-8 rounded-2xl shadow-sm border border-base-300 transition-all duration-300">
        <p v-if="newsItem.summary" class="text-xl font-medium leading-relaxed">
          {{ hasTranslation ? translatedSummary : newsItem.summary }}
        </p>

        <div v-else class="py-8 text-center text-base-content/60">
          <IconArticle class="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p class="text-xl font-medium mb-1">El proveedor no incluyó un resumen para esta noticia.</p>
          <p class="text-base">Puedes leer la cobertura original completa en la página de <span class="uppercase font-bold">{{ newsItem.source }}</span>.</p>
        </div>

        <div class="mt-8 pt-8 border-t border-base-200 flex justify-center">
          <a :href="newsItem.url" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-primary gap-2 w-full sm:w-auto">
            Leer artículo completo original
            <IconExternalLink class="w-4 h-4" />
          </a>
        </div>
      </div>

      <!-- Instancia de Sección de Comentarios (Conexión Firestore) -->
      <div class="bg-base-100 p-6 md:p-8 rounded-2xl shadow-sm border border-base-300">
        <CommentSection :news-id="String(newsItem.id)" />
      </div>

    </div>
  </div>
</template>
