/**
 * Servicio básico para traducción de textos usando la API pública de MyMemory.
 * (Plan gratuito: 500 peticiones / día)
 */
export const translationApi = {
  async translateText(text, fromLang = 'en', toLang = 'es') {
    if (!text || text.trim() === '') return ''

    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Error en la API de traducción')
      }

      const data = await response.json()

      // MyMemory devuelve un status 200 en data.responseStatus si todo fue bien
      if (data.responseStatus === 200) {
        return data.responseData.translatedText
      } else {
        console.warn('Advertencia de traducción:', data.responseDetails)
        return text // Devolver el texto original si falla o excede cuota
      }
    } catch (error) {
      console.error('Error al traducir:', error)
      return text // Fallback elegante al inglés
    }
  }
}
