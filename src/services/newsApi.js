const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY
const BASE_URL = 'https://finnhub.io/api/v1'

export const newsApi = {
  /**
   * Obtiene las noticias generales del mercado.
   * Finnhub categories: general, forex, crypto, merger.
   */
  async getMarketNews(category = 'general') {
    try {
      const response = await fetch(`${BASE_URL}/news?category=${category}&token=${API_KEY}`)
      if (!response.ok) throw new Error('Error fetching market news')
      const data = await response.json()
      // Modelo de datos esperado (Finnhub): { category, datetime, headline, id, image, related, source, summary, url }
      return data
    } catch (error) {
      console.error('newsApi.getMarketNews error:', error)
      return []
    }
  },

  /**
   * Obtiene noticias de una empresa específica usando su símbolo (ticker).
   * Requiere fechas en formato YYYY-MM-DD.
   */
  async getCompanyNews(symbol, fromDate, toDate) {
    try {
      const response = await fetch(
        `${BASE_URL}/company-news?symbol=${symbol}&from=${fromDate}&to=${toDate}&token=${API_KEY}`
      )
      if (!response.ok) throw new Error(`Error fetching company news for ${symbol}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('newsApi.getCompanyNews error:', error)
      return []
    }
  },
}
