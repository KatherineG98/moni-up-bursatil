import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { newsApi } from '@/services/newsApi'
import { db, auth } from '@/services/firebase'
import { onAuthStateChanged } from 'firebase/auth'

// Fixed imports
import { collection as fsCollection, doc as fsDoc, setDoc as fsSetDoc, getDocs as fsGetDocs, onSnapshot as fsOnSnapshot, query as fsQuery, orderBy as fsOrderBy, addDoc as fsAddDoc, deleteDoc as fsDeleteDoc, serverTimestamp as fsServerTimestamp } from 'firebase/firestore'

const safeJSONParse = (key, defaultVal) => {
  try {
    const val = localStorage.getItem(key)
    return val ? JSON.parse(val) : defaultVal
  } catch (e) {
    console.error('Error parsing localStorage key:', key, e)
    return defaultVal
  }
}

export const useNewsStore = defineStore('news', () => {
  // Inicialización de estado desde localStorage de forma segura
  // Inicialización de estado desde localStorage de forma segura
  const savedNews = safeJSONParse('moni_news_list_v3', [])
  const savedHistory = safeJSONParse('moni_news_history', [])
  const savedLastFetched = parseInt(localStorage.getItem('moni_news_last_fetched_v3')) || null

  const newsList = ref(savedNews)
  const loading = ref(false)
  const error = ref(null)
  const readHistory = ref(new Set(savedHistory))
  const lastFetched = ref(savedLastFetched)

  watch(newsList, (newVal) => {
    localStorage.setItem('moni_news_list_v3', JSON.stringify(newVal))
  }, { deep: true })

  watch(readHistory, (newVal) => {
    localStorage.setItem('moni_news_history', JSON.stringify(Array.from(newVal)))
  }, { deep: true })

  watch(lastFetched, (newVal) => {
    localStorage.setItem('moni_news_last_fetched_v3', String(newVal))
  })

  // Opciones de filtro
  const filterType = ref('all') // 'all', 'market', 'company', 'read', 'unread'

  // Cache de comentarios para optimizar lecturas
  // Mapa de newsId -> función de desuscripción (unsubscribe)
  const commentListeners = ref(new Map())
  const newsComments = ref({}) // { newsId: [comentarios] }

  // Cargar historial del usuario desde Firestore
  const loadHistory = async () => {
    if (!auth.currentUser) return
    try {
      const q = fsQuery(fsCollection(db, `users/${auth.currentUser.uid}/newsHistory`), fsOrderBy('viewedAt', 'desc'))
      const snapshot = await fsGetDocs(q)
      const historyIds = new Set(readHistory.value) // Mezclamos las locales con las remotas
      snapshot.forEach(doc => {
        historyIds.add(doc.id)
      })
      readHistory.value = historyIds
    } catch (err) {
      console.error('Error cargando historial de noticias:', err)
    }
  }

  // Sincronización del historial tras la autenticación de Firebase
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loadHistory()
    }
  })

  // Registro de vista de noticia
  const markAsRead = async (newsId, noticiaData = {}) => {
    // Actualización local temporal para usuarios no autenticados
    // Escritura forzada en Firebase para usuarios autenticados
    const idStr = String(newsId)

    const newHistory = new Set(readHistory.value)
    if (newHistory.has(idStr)) {
      newHistory.delete(idStr)
    }
    newHistory.add(idStr)
    readHistory.value = newHistory

    if (!auth.currentUser) return

    try {
      const docRef = fsDoc(db, `users/${auth.currentUser.uid}/newsHistory`, String(newsId))
      await fsSetDoc(docRef, {
        newsId: String(newsId),
        headline: noticiaData.headline || '',
        url: noticiaData.url || '',
        image: noticiaData.image || '',
        viewedAt: fsServerTimestamp()
      })
    } catch (err) {
      console.error('Error guardando historial:', err)
    }
  }

  // Obtención de noticias (API externa)
  const fetchNews = async (force = false) => {
    // Límite de tasa de llamadas: 5 minutos, a menos que se fuerce la actualización
    if (!force && lastFetched.value && (Date.now() - lastFetched.value < 5 * 60 * 1000) && newsList.value.length > 0) {
      return
    }

    loading.value = true
    error.value = null
    try {
      // Petición de noticias de mercado general
      const marketNews = await newsApi.getMarketNews('general')

      // Integración de noticias empresariales (ej. AAPL) para complementar el flujo general
      const companyNews = await newsApi.getCompanyNews('AAPL', new Date(Date.now() - 7*24*60*60*1000).toISOString().split('T')[0], new Date().toISOString().split('T')[0])

      // Sanitización de HTML (decodificación de entidades y eliminación de etiquetas)
      const stripHtml = (html) => {
        if (!html) return ''
        const temp = document.createElement('div')
        // Paso 1: Decodificación de entidades (&lt;a&gt; -> <a>)
        temp.innerHTML = html
        const decoded = temp.textContent || temp.innerText || ''

        // Paso 2: Extracción de texto puro si el resultado contiene etiquetas
        temp.innerHTML = decoded
        return (temp.textContent || temp.innerText || '').trim()
      }

      // Etiquetado de categoría base e inyección de resúmenes sanitizados
      const formattedMarket = marketNews.map(n => ({...n, customType: 'market', summary: stripHtml(n.summary)}))
      const formattedCompany = companyNews.map(n => ({...n, customType: 'company', summary: stripHtml(n.summary)}))

      // Fusión de colecciones, eliminación de duplicados por ID, y ordenamiento cronológico descendente
      const combined = [...formattedMarket, ...formattedCompany]
      const uniqueNews = Array.from(new Map(combined.map(item => [item.id, item])).values())
      uniqueNews.sort((a, b) => b.datetime - a.datetime)

      // Paginación en memoria: límite configurado a 50 elementos
      newsList.value = uniqueNews.slice(0, 50)
      lastFetched.value = Date.now()

      // Sincronización de historial post-carga para sesiones activas
      if (auth.currentUser) {
        await loadHistory()
      }
    } catch (err) {
      error.value = err.message
      console.error('Error fetching news:', err)
    } finally {
      loading.value = false
    }
  }

  // Suscripción a colección de comentarios (Tiempo real)
  const subscribeToComments = (newsId) => {
    if (commentListeners.value.has(String(newsId))) return // Evitar duplicidad de listeners

    const q = fsQuery(fsCollection(db, `news/${newsId}/comments`), fsOrderBy('createdAt', 'desc'))
    const unsubscribe = fsOnSnapshot(q, (snapshot) => {
      const comments = []
      snapshot.forEach(doc => {
        comments.push({ id: doc.id, ...doc.data() })
      })
      newsComments.value = { ...newsComments.value, [String(newsId)]: comments }
    }, (error) => {
      console.error("Error validando comentarios (Firebase Rules):", error)
    })

    commentListeners.value.set(String(newsId), unsubscribe)
  }

  const unsubscribeFromComments = (newsId) => {
    const unsubscribe = commentListeners.value.get(String(newsId))
    if (unsubscribe) {
      unsubscribe()
      commentListeners.value.delete(String(newsId))
    }
  }

  const addComment = async (newsId, text, userName) => {
    if (!auth.currentUser || !text.trim()) return

    try {
      await fsAddDoc(fsCollection(db, `news/${newsId}/comments`), {
        userId: auth.currentUser.uid,
        userName: userName,
        text: text.trim(),
        createdAt: fsServerTimestamp()
      })
    } catch (err) {
      console.error('Error añadiendo comentario:', err)
      throw err
    }
  }

  const deleteComment = async (newsId, commentId) => {
    try {
      await fsDeleteDoc(fsDoc(db, `news/${newsId}/comments`, commentId))
    } catch (err) {
      console.error('Error eliminando comentario:', err)
      throw err
    }
  }

  // Propiedades Computadas
  const filteredNews = computed(() => {
    let result = newsList.value

    if (filterType.value === 'read') {
      result = result.filter(n => readHistory.value.has(String(n.id)))
    } else if (filterType.value === 'unread') {
      result = result.filter(n => !readHistory.value.has(String(n.id)))
    } else if (filterType.value === 'market') {
      result = result.filter(n => n.customType === 'market')
    } else if (filterType.value === 'company') {
      result = result.filter(n => n.customType === 'company')
    }

    return result
  })

  // Derivación de historial de visualización
  const getHistoryList = computed(() => {
    // Mapeo e inversión de array temporal (últimos elementos primero)
    return Array.from(readHistory.value).reverse().map(id => newsList.value.find(n => String(n.id) === id)).filter(Boolean)
  })

  return {
    newsList,
    filteredNews,
    loading,
    error,
    filterType,
    readHistory,
    newsComments,
    getHistoryList,
    lastFetched,
    fetchNews,
    markAsRead,
    subscribeToComments,
    unsubscribeFromComments,
    addComment,
    deleteComment
  }
})
