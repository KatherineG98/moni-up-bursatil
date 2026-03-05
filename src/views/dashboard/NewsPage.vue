<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNewsStore } from '@/stores/news'
import NewsCard from '@/components/news/NewsCard.vue'
import MarketSyncBadge from '@/components/common/MarketSyncBadge.vue'
import { IconNews, IconHistory } from '@tabler/icons-vue'
import { showToast } from '@/utils/sweetalert'

const newsStore = useNewsStore()
const router = useRouter()

// Configuración de paginación
const itemsPerPage = 8
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(newsStore.filteredNews.length / itemsPerPage) || 1)

const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return newsStore.filteredNews.slice(start, end)
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleFilterChange = (filter) => {
  newsStore.filterType = filter
  currentPage.value = 1 // Reinicio de paginación al filtrar
}

const refreshNews = async () => {
  currentPage.value = 1
  await newsStore.fetchNews(true)
  if (newsStore.error) {
    showToast('error', 'No se pudieron actualizar las noticias al momento.')
  } else {
    showToast('success', 'Mercado sincronizado correctamente.')
  }
}

const openNews = (news) => {
  // Registro en historial mediante operación en segundo plano (no bloqueante)
  newsStore.markAsRead(news.id, news)
  router.push({ name: 'news-detail', params: { id: String(news.id) }, query: { url: news.url } })
}

const openHistoryNews = (historyItem) => {
  // Resolución de ID de noticia desde el objeto de historial mapeado
  const newsId = historyItem.newsId || historyItem.id
  router.push({ name: 'news-detail', params: { id: String(newsId) }, query: { url: historyItem.url } })
}

onMounted(() => {
  // Inicialización de lista de noticias en caso de ausencia de caché válida
  newsStore.fetchNews()
})
</script>

<template>
  <div class="h-full flex flex-col lg:flex-row gap-6 items-start">

    <!-- Contenido Principal -->
    <div class="flex-1 flex flex-col min-w-0">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200 mb-6">
        <div>
          <h1 class="text-3xl font-black tracking-tight flex items-center gap-3">
            Noticias Financieras
          </h1>
          <p class="text-base-content/60 mt-1">Mantente al día con el mercado y las empresas.</p>
        </div>

        <MarketSyncBadge
          :last-updated="newsStore.lastFetched"
          :loading="newsStore.loading"
          @refresh="refreshNews"
        />
      </div>

      <!-- Filtros -->
      <div class="tabs tabs-boxed mb-6 overflow-x-auto whitespace-nowrap bg-base-100/50 p-2 shadow-sm rounded-xl">
        <a class="tab" :class="{ 'tab-active font-bold text-primary': newsStore.filterType === 'all' }" @click="handleFilterChange('all')">Todas</a>
        <a class="tab" :class="{ 'tab-active font-bold text-primary': newsStore.filterType === 'market' }" @click="handleFilterChange('market')">Mercado</a>
        <a class="tab" :class="{ 'tab-active font-bold text-primary': newsStore.filterType === 'company' }" @click="handleFilterChange('company')">Empresas</a>
        <a class="tab" :class="{ 'tab-active font-bold text-primary': newsStore.filterType === 'unread' }" @click="handleFilterChange('unread')">No Leídas</a>
        <a class="tab" :class="{ 'tab-active font-bold text-primary': newsStore.filterType === 'read' }" @click="handleFilterChange('read')">Leídas</a>
      </div>

      <!-- Estado de Carga -->
      <div v-if="newsStore.loading && newsStore.newsList.length === 0" class="flex flex-col items-center justify-center py-20">
        <span class="loading loading-ring loading-lg text-primary"></span>
        <p class="mt-4 text-base-content/60 font-medium">Buscando las últimas noticias...</p>
      </div>

      <!-- Estado Vacío -->
      <div v-else-if="newsStore.filteredNews.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
        <IconNews class="w-16 h-16 text-base-content/20 mb-4" />
        <h3 class="text-xl font-bold">No se encontraron noticias</h3>
        <p class="text-base-content/60 mt-2">Intenta cambiar los filtros o actualizar.</p>
      </div>

      <!-- Grid de Noticias -->
      <div v-else class="grid gap-6 grid-cols-1 md:grid-cols-2 mb-8">
        <div v-for="news in paginatedNews" :key="news.id" @click="openNews(news)">
          <NewsCard
            :news="news"
            :is-read="newsStore.readHistory.has(String(news.id))"
          />
        </div>
      </div>

      <!-- Paginación -->
      <div v-if="totalPages > 1" class="flex justify-center mt-auto pb-4">
        <div class="join shadow-sm">
          <button class="join-item btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">«</button>
          <button class="join-item btn">Página {{ currentPage }} de {{ totalPages }}</button>
          <button class="join-item btn" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">»</button>
        </div>
      </div>
    </div>

    <!-- Panel Lateral: Historial -->
    <div class="w-full lg:w-80 shrink-0">
      <div class="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden sticky top-6">
        <div class="p-6 border-b border-base-200 flex items-center gap-3">
          <IconHistory class="w-6 h-6 text-primary" />
          <h2 class="text-xl font-bold tracking-tight">Últimas Leídas</h2>
        </div>
        <div class="p-4 flex flex-col gap-4">
          <div v-if="newsStore.readHistory.size === 0" class="text-sm text-center text-base-content/50 py-4">
            Aún no has leído ninguna noticia.
          </div>

          <!-- Renderizado optimizado del historial mapeado -->
          <div
            v-for="item in newsStore.getHistoryList.slice(0, 6)"
            :key="item.id"
            class="flex gap-3 items-center group cursor-pointer hover:bg-base-200 p-2 rounded-lg transition-colors"
            @click="openHistoryNews({ newsId: item.id, url: item.url })"
          >
            <div class="w-12 h-12 rounded overflow-hidden shrink-0 bg-neutral">
              <img :src="item.image || 'https://placehold.co/60x60/1d232a/a6adbb?text=...'" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                {{ item.headline }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
