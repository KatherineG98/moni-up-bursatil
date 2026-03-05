/**
 * Interfaz unificada de persistencia en el árbol del DOM (localStorage / sessionStorage).
 * Extiende la API Web nativa incorporando un módulo sintético de serialización/deserialización
 * que emplea cifrado débil Base64 para prevenir la edición accidental del estado por parte del usuario.
 */

class StorageService {
  constructor(storageType = 'localStorage') {
    this.storage = window[storageType]
  }

  /**
   * Codificador Base64 interno acoplado a la codificación uniforme por componentes de URI.
   * Resuelve el fallo nativo de `window.btoa` al manejar caracteres UTF-8 extendidos.
   */
  _encode(value) {
    if (!value) return value
    try {
      return window.btoa(encodeURIComponent(value))
    } catch {
      return value
    }
  }

  // De-ofuscación con fallback para datos antiguos no codificados
  _decode(value) {
    if (!value) return null
    try {
      // Intentar decodificar solo si parece base64
      return decodeURIComponent(window.atob(value))
    } catch {
      // Si falla, asumimos que es un dato antiguo en texto plano o JSON directo
      return value
    }
  }

  /**
   * Guarda un objeto o valor codificado
   */
  setItem(key, value) {
    try {
      const jsonValue = JSON.stringify(value)
      const encodedValue = this._encode(jsonValue)
      this.storage.setItem(key, encodedValue)
      return true
    } catch (error) {
      console.error(`Error al guardar ${key}:`, error)
      return false
    }
  }

  /**
   * Recupera y decodifica un valor
   */
  getItem(key, defaultValue = null) {
    try {
      const storedItem = this.storage.getItem(key)
      if (!storedItem) return defaultValue

      const decodedValue = this._decode(storedItem)
      try {
        return JSON.parse(decodedValue)
      } catch {
        return decodedValue || defaultValue
      }
    } catch (error) {
      console.error(`Error al recuperar ${key}:`, error)
      return defaultValue
    }
  }

  /**
   * Elimina una clave específica
   */
  removeItem(key) {
    try {
      this.storage.removeItem(key)
      return true
    } catch {
      return false
    }
  }

  /**
   * Limpia todo el storage
   */
  clear() {
    try {
      this.storage.clear()
      return true
    } catch {
      return false
    }
  }
}

export const localStore = new StorageService('localStorage')
export const sessionStore = new StorageService('sessionStorage')
